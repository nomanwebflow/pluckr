import { unzlibSync, zipSync } from 'fflate';
import AvifWorker from './avif.worker.js?worker&inline';

export const ASPECTS = [
  { id: 'original', label: 'Original' },
  ...['1:1', '4:3', '3:4', '3:2', '2:3', '16:9', '9:16'].map((ratio) => ({ id: ratio, label: ratio })),
];

function aspectRatio(id) {
  if (!id || id === 'original') return null;
  const [w, h] = id.split(':').map(Number);
  return w / h;
}

export const FORMATS = [
  { id: 'avif', label: 'AVIF', mime: 'image/avif', ext: 'avif', lossy: true },
  { id: 'webp', label: 'WebP', mime: 'image/webp', ext: 'webp', lossy: true },
  { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png', lossy: false },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', ext: 'jpg', lossy: true },
];

/**
 * Canvas silently falls back to PNG for types it cannot encode, so probe each one.
 * AVIF never goes through the canvas; it is encoded by the bundled WebAssembly codec.
 */
export function detectSupportedFormats() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  return Promise.all(FORMATS.map((format) => new Promise((resolve) => {
    if (format.id === 'avif') return resolve([format.id, typeof WebAssembly === 'object']);
    return canvas.toBlob((blob) => resolve([format.id, Boolean(blob) && blob.type === format.mime]), format.mime, 0.8);
  }))).then(Object.fromEntries);
}

// Same defaults as @jsquash/avif, except speed 8: much faster for a small quality cost.
const AVIF_OPTIONS = {
  qualityAlpha: -1, denoiseLevel: 0, tileColsLog2: 0, tileRowsLog2: 0, speed: 8, subsample: 1,
  chromaDeltaQ: false, sharpness: 0, tune: 0, enableSharpYUV: false, bitDepth: 8, lossless: false,
};

/** In Docs the codec (deflated, base64) is fetched from the add-on's server the first time AVIF is needed; in dev it is served from /assets. */
async function loadWasmBytes() {
  const run = window.google?.script?.run;
  if (run) {
    const encoded = await new Promise((resolve, reject) => run.withSuccessHandler(resolve).withFailureHandler(reject).getAvifCodec());
    const binary = window.atob(encoded);
    const packed = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) packed[index] = binary.charCodeAt(index);
    return unzlibSync(packed);
  }
  const response = await fetch('/assets/avif_enc.wasm');
  return new Uint8Array(await response.arrayBuffer());
}

function codecBytes() {
  if (!wasmBytes) {
    wasmBytes = loadWasmBytes().catch((failure) => {
      wasmBytes = null; // let the next attempt try again
      throw failure;
    });
  }
  return wasmBytes;
}

/** Start downloading the AVIF codec early, e.g. when the user picks AVIF, so converting does not wait for it. */
export function prefetchAvifCodec() {
  codecBytes().catch(() => {});
}

/** Above this many pixels the encoder risks running out of memory, so AVIF input is scaled down to fit. */
export const AVIF_MAX_PIXELS = 24_000_000;

let worker = null;
let wasmBytes = null;
let wasmInitialized = false;
let wasmInitPromise = null;
let nextJobId = 0;
const pending = new Map();

function failAll(message) {
  pending.forEach(({ reject }) => reject(new Error(message)));
  pending.clear();
}

function dropWorker(message) {
  if (worker) worker.terminate();
  worker = null;
  wasmInitialized = false;
  wasmInitPromise = null;
  failAll(message);
}

async function getWorker(needsAvif = false) {
  if (!worker) {
    worker = new AvifWorker();
    worker.onmessage = ({ data }) => {
      const job = pending.get(data.id);
      if (!job) return;
      pending.delete(data.id);
      if (data.error) {
        // An aborted wasm instance cannot be trusted again; the next job gets a fresh worker.
        dropWorker('AVIF encoder restarted.');
        job.reject(new Error(data.error));
      } else {
        job.resolve(data.bytes ?? data.blob);
      }
    };
    worker.onerror = () => dropWorker('Image processing worker crashed.');
  }
  const current = worker;
  if (needsAvif && !wasmInitialized) {
    if (!wasmInitPromise) {
      wasmInitPromise = (async () => {
        const bytes = await codecBytes();
        if (worker !== current) return;
        const wasm = bytes.slice(); // the worker gets its own copy; ours is reused on respawn
        current.postMessage({ type: 'init', wasm }, [wasm.buffer]);
        wasmInitialized = true;
      })().catch((error) => {
        wasmInitPromise = null;
        throw error;
      });
    }
    await wasmInitPromise;
    if (worker !== current) return getWorker(needsAvif);
  }
  return current;
}

/** Stop any in-flight AVIF encode immediately (settings changed, so its result is not wanted). */
export function cancelEncoding() {
  if (pending.size) dropWorker('cancelled');
}

async function encodeInWorker(bitmap, { width, height, format, quality }) {
  const target = await getWorker(format === 'avif');
  const id = nextJobId++;
  const bytes = await new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    target.postMessage({
      id, bitmap, width, height, format, mime: FORMATS.find((item) => item.id === format).mime,
      quality, options: { ...AVIF_OPTIONS, quality },
    }, [bitmap]);
  });
  return format === 'avif' ? new Blob([bytes], { type: 'image/avif' }) : bytes;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load image.'));
    image.src = url;
  });
}

/** Re-encode one image. Only ever shrinks: maxWidth never upscales. */
export async function processImage(url, fallbackSize, { format, quality, maxWidth, aspect }) {
  const target = FORMATS.find((item) => item.id === format);
  const source = await loadImage(url);
  const sourceWidth = source.naturalWidth || fallbackSize.width || 1;
  const sourceHeight = source.naturalHeight || fallbackSize.height || 1;

  // A fixed aspect ratio crops from the centre; "original" keeps the whole image.
  const ratio = aspectRatio(aspect);
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  if (ratio) {
    if (sourceWidth / sourceHeight > ratio) cropWidth = Math.max(1, Math.round(sourceHeight * ratio));
    else cropHeight = Math.max(1, Math.round(sourceWidth / ratio));
  }
  const cropX = Math.floor((sourceWidth - cropWidth) / 2);
  const cropY = Math.floor((sourceHeight - cropHeight) / 2);

  const limit = Number(maxWidth) > 0 ? Number(maxWidth) : cropWidth;
  const scale = Math.min(1, limit / cropWidth);
  let width = Math.max(1, Math.round(cropWidth * scale));
  let height = ratio ? Math.max(1, Math.round(width / ratio)) : Math.max(1, Math.round(cropHeight * scale));
  let note = '';
  if (target.id === 'avif' && width * height > AVIF_MAX_PIXELS) {
    const fit = Math.sqrt(AVIF_MAX_PIXELS / (width * height));
    width = Math.max(1, Math.floor(width * fit));
    height = Math.max(1, Math.floor(height * fit));
    note = `Scaled to ${width} × ${height} to fit AVIF memory limits`;
  }

  // Cropping here (not in the worker) also keeps the transferred bitmap small.
  const bitmap = ratio
    ? await createImageBitmap(source, cropX, cropY, cropWidth, cropHeight)
    : await createImageBitmap(source);
  const blob = await encodeInWorker(bitmap, { width, height, format: target.id, quality });
  if (!blob || blob.type !== target.mime) throw new Error(`${target.label} is not supported in this browser.`);
  return { blob, width, height, ext: target.ext, note };
}

export function baseName(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

/** File name for an exported image: new extension, no path separators or reserved characters. */
export function exportName(name, ext) {
  return `${baseName(name).replace(/[\\/:*?"<>|]+/g, '-').trim() || 'image'}.${ext}`;
}

export async function zipBlobs(entries) {
  const files = {};
  const used = {};
  for (const { name, blob } of entries) {
    let unique = name;
    while (used[unique]) unique = `(${used[name]++}) ${name}`;
    used[unique] = 1;
    files[unique] = new Uint8Array(await blob.arrayBuffer());
  }
  // Images are already compressed, so store without deflating.
  return new Blob([zipSync(files, { level: 0 })], { type: 'application/zip' });
}
