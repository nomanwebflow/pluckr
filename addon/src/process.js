import { unzlibSync } from 'fflate';
import AvifWorker from './avif.worker.js?worker&inline';

export const ASPECTS = [
  { id: 'original', label: 'Original' },
  ...['1:1', '4:3', '3:4', '3:2', '2:3', '16:9', '9:16'].map((ratio) => ({ id: ratio, label: ratio })),
];

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
export const AVIF_OPTIONS = {
  qualityAlpha: -1, denoiseLevel: 0, tileColsLog2: 0, tileRowsLog2: 0, speed: 8, subsample: 1,
  chromaDeltaQ: false, sharpness: 0, tune: 0, enableSharpYUV: false, bitDepth: 8, lossless: false,
};

export const AVIF_MAX_PIXELS = 24_000_000;

export function decodeBase64(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

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

let wasmBytes = null;
let wasmModulePromise = null;

function codecBytes() {
  if (!wasmBytes) {
    wasmBytes = loadWasmBytes().catch((failure) => {
      wasmBytes = null; // let the next attempt try again
      throw failure;
    });
  }
  return wasmBytes;
}

/** Pre-compile the WebAssembly module once so all worker instances can instantiate it instantly. */
export function getWasmModule() {
  if (!wasmModulePromise) {
    wasmModulePromise = (async () => {
      const bytes = await codecBytes();
      return WebAssembly.compile(bytes);
    })().catch((err) => {
      wasmModulePromise = null;
      throw err;
    });
  }
  return wasmModulePromise;
}

/** Start downloading and compiling the AVIF codec early so converting does not wait for it. */
export function prefetchAvifCodec() {
  getWasmModule().catch(() => {});
}

// Concurrency pool for parallel image encoding across available CPU cores.
const POOL_SIZE = Math.min(
  Math.max((typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency - 1 : 3), 2),
  4
);

const pool = [];
const queue = [];
let nextJobId = 0;

function createWorkerSlot() {
  const worker = new AvifWorker();
  const slot = {
    worker,
    busy: false,
    wasmInitialized: false,
    wasmInitPromise: null,
    currentJob: null,
  };

  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') {
      slot.wasmInitialized = true;
      return;
    }
    const job = slot.currentJob;
    if (!job || job.id !== data.id) return;
    slot.currentJob = null;
    slot.busy = false;

    if (data.error) {
      terminateSlot(slot);
      job.reject(new Error(data.error));
    } else {
      job.resolve(data);
    }
    drainQueue();
  };

  worker.onerror = () => {
    const job = slot.currentJob;
    slot.currentJob = null;
    slot.busy = false;
    terminateSlot(slot);
    if (job) job.reject(new Error('Image processing worker crashed.'));
    drainQueue();
  };

  return slot;
}

function terminateSlot(slot) {
  try { slot.worker.terminate(); } catch (_) {}
  const index = pool.indexOf(slot);
  if (index !== -1) pool.splice(index, 1);
}

async function ensureWasm(slot) {
  if (slot.wasmInitialized) return;
  if (!slot.wasmInitPromise) {
    slot.wasmInitPromise = (async () => {
      const module = await getWasmModule();
      slot.worker.postMessage({ type: 'init', module });
      slot.wasmInitialized = true;
    })().catch((err) => {
      slot.wasmInitPromise = null;
      throw err;
    });
  }
  await slot.wasmInitPromise;
}

function drainQueue() {
  if (queue.length === 0) return;

  let slot = pool.find((s) => !s.busy);
  if (!slot && pool.length < POOL_SIZE) {
    slot = createWorkerSlot();
    pool.push(slot);
  }
  if (!slot) return;

  const job = queue.shift();
  if (!job) return;

  slot.busy = true;
  slot.currentJob = job;

  (async () => {
    try {
      if (job.format === 'avif') {
        await ensureWasm(slot);
      }
      if (slot.currentJob !== job) return;

      const transfer = [];
      if (job.bitmap) transfer.push(job.bitmap);
      slot.worker.postMessage(job.message, transfer);
    } catch (err) {
      if (slot.currentJob === job) {
        slot.currentJob = null;
        slot.busy = false;
        job.reject(err);
        drainQueue();
      }
    }
  })();
}

/** Stop any in-flight encode immediately (settings changed or cancelled). */
export function cancelEncoding() {
  while (queue.length > 0) {
    const job = queue.shift();
    job.reject(new Error('cancelled'));
  }
  for (let i = pool.length - 1; i >= 0; i--) {
    const slot = pool[i];
    if (slot.busy) {
      const job = slot.currentJob;
      slot.currentJob = null;
      slot.busy = false;
      terminateSlot(slot);
      if (job) job.reject(new Error('cancelled'));
    }
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load image.'));
    image.src = url;
  });
}

function isSvg(source, mimeType) {
  if (mimeType === 'image/svg+xml') return true;
  const src = typeof source === 'string' ? source : source?.src;
  return typeof src === 'string' && (src.startsWith('data:image/svg+xml') || src.split('?')[0].endsWith('.svg'));
}

async function toBlobOrBitmap(source) {
  if (source instanceof Blob) return { blob: source };
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) return { bitmap: source };

  if (typeof source === 'object' && source !== null) {
    if (source.blob instanceof Blob) return { blob: source.blob };
    if (source.data) {
      const blob = new Blob([decodeBase64(source.data)], { type: source.mimeType || 'image/png' });
      source.blob = blob;
      return { blob };
    }
    if (source.src) {
      if (isSvg(source.src, source.mimeType)) {
        const img = await loadImage(source.src);
        return { bitmap: await createImageBitmap(img) };
      }
      const res = await fetch(source.src);
      const blob = await res.blob();
      source.blob = blob;
      return { blob };
    }
  }

  if (typeof source === 'string') {
    if (isSvg(source)) {
      const img = await loadImage(source);
      return { bitmap: await createImageBitmap(img) };
    }
    const res = await fetch(source);
    return { blob: await res.blob() };
  }

  throw new Error('Unsupported image source');
}

/** Re-encode one image. Scaled/cropped in the background worker pool. */
export async function processImage(source, fallbackSize, options) {
  let targetOptions = options;
  if (!targetOptions && fallbackSize && fallbackSize.format) {
    targetOptions = fallbackSize;
  }
  const { format, quality, maxWidth, aspect } = targetOptions || {};
  const target = FORMATS.find((item) => item.id === format);
  if (!target) throw new Error(`Unknown format: ${format}`);

  const input = await toBlobOrBitmap(source);
  const id = nextJobId++;
  const message = {
    id,
    format: target.id,
    mime: target.mime,
    quality,
    maxWidth,
    aspect,
    options: target.id === 'avif' ? { ...AVIF_OPTIONS, quality } : undefined,
    ...(input.bitmap ? { bitmap: input.bitmap } : { blob: input.blob }),
  };

  const result = await new Promise((resolve, reject) => {
    queue.push({
      id,
      format: target.id,
      bitmap: input.bitmap,
      message,
      resolve,
      reject,
    });
    drainQueue();
  });

  const blob = target.id === 'avif' ? new Blob([result.bytes], { type: 'image/avif' }) : result.blob;
  if (!blob || blob.type !== target.mime) throw new Error(`${target.label} is not supported in this browser.`);
  return { blob, width: result.width, height: result.height, ext: target.ext, note: result.note || '' };
}

export function baseName(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

/** File name for an exported image: new extension, no path separators or reserved characters. */
export function exportName(name, ext) {
  return `${baseName(name).replace(/[\\/:*?"<>|]+/g, '-').trim() || 'image'}.${ext}`;
}

/** True when the image has any see-through pixel. Checked on a small copy, which keeps the edges that matter. */
async function hasTransparency(source) {
  const { blob, bitmap } = await toBlobOrBitmap(source);
  const image = bitmap || await createImageBitmap(blob);
  const scale = Math.min(1, 512 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  if (!bitmap) image.close();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let index = 3; index < pixels.length; index += 4) if (pixels[index] < 250) return true;
  return false;
}

/**
 * A smaller copy of an image for putting back into the Doc, or null when it is not worth replacing.
 * Docs takes only JPEG and PNG from Apps Script, so opaque images become JPEG and see-through ones stay PNG.
 */
export async function compressForDoc(image, { maxWidth, quality }) {
  if (!['image/jpeg', 'image/png', 'image/bmp'].includes(image.mimeType)) return null;
  const png = image.mimeType === 'image/png' && await hasTransparency(image);
  const result = await processImage(image, image, { format: png ? 'png' : 'jpeg', quality, maxWidth, aspect: 'original' });
  // Under a tenth saved is not worth touching the Doc for.
  return result.blob.size < image.size * 0.9 ? { blob: result.blob, mimeType: result.blob.type } : null;
}
