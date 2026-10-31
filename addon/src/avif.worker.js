// Draws and encodes images off the main thread. AVIF additionally initializes the bundled WASM codec.
import avifEncoderFactory from './vendor/avif_enc.js';

let encoder;
let ready;

function aspectRatio(id) {
  if (!id || id === 'original') return null;
  const [w, h] = id.split(':').map(Number);
  return w / h;
}

const AVIF_MAX_PIXELS = 24_000_000;

self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    ready = (async () => {
      const compiled = data.module || (await WebAssembly.compile(data.wasm));
      encoder = await avifEncoderFactory({
        noInitialRun: true,
        instantiateWasm: (imports, done) => {
          WebAssembly.instantiate(compiled, imports).then(done);
          return {};
        },
      });
    })();
    ready.then(() => self.postMessage({ type: 'ready' }), () => {});
    return;
  }

  let sourceBitmap = data.bitmap;
  try {
    if (!sourceBitmap && data.blob) {
      sourceBitmap = await createImageBitmap(data.blob);
    }
    if (!sourceBitmap) {
      throw new Error('No image bitmap or blob provided.');
    }

    const sourceWidth = sourceBitmap.width;
    const sourceHeight = sourceBitmap.height;

    // A fixed aspect ratio crops from the centre; "original" keeps the whole image.
    const ratio = aspectRatio(data.aspect);
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;
    if (ratio) {
      if (sourceWidth / sourceHeight > ratio) cropWidth = Math.max(1, Math.round(sourceHeight * ratio));
      else cropHeight = Math.max(1, Math.round(sourceWidth / ratio));
    }
    const cropX = Math.floor((sourceWidth - cropWidth) / 2);
    const cropY = Math.floor((sourceHeight - cropHeight) / 2);

    const limit = Number(data.maxWidth) > 0 ? Number(data.maxWidth) : cropWidth;
    const scale = Math.min(1, limit / cropWidth);
    let width = Math.max(1, Math.round(cropWidth * scale));
    let height = ratio ? Math.max(1, Math.round(width / ratio)) : Math.max(1, Math.round(cropHeight * scale));
    let note = '';
    if (data.format === 'avif' && width * height > AVIF_MAX_PIXELS) {
      const fit = Math.sqrt(AVIF_MAX_PIXELS / (width * height));
      width = Math.max(1, Math.floor(width * fit));
      height = Math.max(1, Math.floor(height * fit));
      note = `Scaled to ${width} × ${height} to fit AVIF memory limits`;
    }

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d', data.format === 'avif' ? { willReadFrequently: true } : undefined);
    if (data.format === 'jpeg') {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingQuality = 'high'; // big downscales alias badly at the default 'low'
    context.drawImage(sourceBitmap, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
    sourceBitmap.close();
    sourceBitmap = null;

    if (data.format === 'avif') {
      await ready;
      const pixels = context.getImageData(0, 0, width, height);
      const output = encoder.encode(new Uint8Array(pixels.data.buffer), width, height, data.options);
      if (!output) throw new Error('AVIF encoding failed.');
      const bytes = output.slice(); // own copy, safe to transfer
      self.postMessage({ id: data.id, bytes, width, height, note }, [bytes.buffer]);
    } else {
      const blob = await canvas.convertToBlob({ type: data.mime, quality: data.quality / 100 });
      self.postMessage({ id: data.id, blob, width, height, note });
    }
  } catch (failure) {
    try { sourceBitmap?.close(); } catch (_) {}
    try { data.bitmap?.close(); } catch (_) {}
    self.postMessage({ id: data.id, error: (failure && failure.message) || 'Image encoding failed.' });
  }
};
