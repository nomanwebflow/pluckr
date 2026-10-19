import { unzlibSync, zipSync } from 'fflate';
import avifEncoderFactory from './vendor/avif_enc.js';

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

/** In Docs the codec is embedded (deflated, base64) in the page; in dev it is served from /assets. */
async function loadWasmBytes() {
  if (window.PLUCKR_AVIF_WASM) {
    const binary = window.atob(window.PLUCKR_AVIF_WASM);
    const packed = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) packed[index] = binary.charCodeAt(index);
    return unzlibSync(packed);
  }
  const response = await fetch('/assets/avif_enc.wasm');
  return new Uint8Array(await response.arrayBuffer());
}

let avifModule;
function loadAvifEncoder() {
  if (!avifModule) {
    avifModule = loadWasmBytes()
      .then((bytes) => WebAssembly.compile(bytes))
      .then((compiled) => avifEncoderFactory({
        noInitialRun: true,
        instantiateWasm: (imports, done) => {
          WebAssembly.instantiate(compiled, imports).then(done);
          return {};
        },
      }));
    avifModule.catch(() => { avifModule = null; });
  }
  return avifModule;
}

async function encodeAvif(canvas, quality) {
  const encoder = await loadAvifEncoder();
  const { width, height } = canvas;
  const { data } = canvas.getContext('2d').getImageData(0, 0, width, height);
  const output = encoder.encode(new Uint8Array(data.buffer), width, height, { ...AVIF_OPTIONS, quality });
  if (!output) throw new Error('AVIF encoding failed.');
  return new Blob([output], { type: 'image/avif' });
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
export async function processImage(url, fallbackSize, { format, quality, maxWidth }) {
  const target = FORMATS.find((item) => item.id === format);
  const source = await loadImage(url);
  const sourceWidth = source.naturalWidth || fallbackSize.width || 1;
  const sourceHeight = source.naturalHeight || fallbackSize.height || 1;
  const limit = Number(maxWidth) > 0 ? Number(maxWidth) : sourceWidth;
  const scale = Math.min(1, limit / sourceWidth);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (target.id === 'jpeg') {
    context.fillStyle = '#fff'; // JPEG has no alpha
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(source, 0, 0, width, height);

  const blob = target.id === 'avif'
    ? await encodeAvif(canvas, quality)
    : await new Promise((resolve) => canvas.toBlob(resolve, target.mime, quality / 100));
  if (!blob || blob.type !== target.mime) throw new Error(`${target.label} is not supported in this browser.`);
  return { blob, width, height, ext: target.ext };
}

export function baseName(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
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
