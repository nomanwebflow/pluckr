// Draws and encodes images off the main thread. AVIF additionally initializes the bundled WASM codec.
import avifEncoderFactory from './vendor/avif_enc.js';

let encoder;
let ready;

self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    ready = (async () => {
      const compiled = await WebAssembly.compile(data.wasm);
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

  try {
    const canvas = new OffscreenCanvas(data.width, data.height);
    const context = canvas.getContext('2d', data.format === 'avif' ? { willReadFrequently: true } : undefined);
    if (data.format === 'jpeg') {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, data.width, data.height);
    }
    context.imageSmoothingQuality = 'high'; // big downscales alias badly at the default 'low'
    context.drawImage(data.bitmap, 0, 0, data.width, data.height);
    data.bitmap.close();

    if (data.format === 'avif') {
      await ready;
      const pixels = context.getImageData(0, 0, data.width, data.height);
      const output = encoder.encode(new Uint8Array(pixels.data.buffer), data.width, data.height, data.options);
      if (!output) throw new Error('AVIF encoding failed.');
      const bytes = output.slice(); // own copy, safe to transfer
      self.postMessage({ id: data.id, bytes }, [bytes.buffer]);
    } else {
      const blob = await canvas.convertToBlob({ type: data.mime, quality: data.quality / 100 });
      self.postMessage({ id: data.id, blob });
    }
  } catch (failure) {
    data.bitmap?.close();
    self.postMessage({ id: data.id, error: (failure && failure.message) || 'AVIF encoding failed.' });
  }
};
