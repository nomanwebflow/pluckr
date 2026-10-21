import { readdir, readFile, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distRoot = join(projectRoot, 'dist');
const outputRoot = join(projectRoot, 'apps-script');
const html = await readFile(join(distRoot, 'index.html'), 'utf8');
const scriptName = html.match(/src="\.\/assets\/([^"]+\.js)"/)?.[1];
const styleName = html.match(/href="\.\/assets\/([^"]+\.css)"/)?.[1];

if (!scriptName || !styleName) {
  throw new Error('Could not find the built JavaScript and CSS bundles in dist/index.html.');
}

const [script, styles, assetFiles] = await Promise.all([
  readFile(join(distRoot, 'assets', scriptName), 'utf8'),
  readFile(join(distRoot, 'assets', styleName), 'utf8'),
  readdir(join(projectRoot, 'public', 'assets')),
]);

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
const usedAssets = new Set(['mark', 'refresh', 'more', 'edit', 'chevron-down']);
const assetEntries = await Promise.all(assetFiles.filter((fileName) => usedAssets.has(basename(fileName, extname(fileName)))).map(async (fileName) => {
  const bytes = await readFile(join(projectRoot, 'public', 'assets', fileName));
  const mimeType = mimeTypes[extname(fileName).toLowerCase()] || 'application/octet-stream';
  const key = basename(fileName, extname(fileName));
  return [key, `data:${mimeType};base64,${bytes.toString('base64')}`];
}));

// The AVIF codec is ~3.5 MB; deflated it is ~1.1 MB. Decoded with fflate at runtime.
const avifWasm = deflateSync(await readFile(join(projectRoot, 'public', 'assets', 'avif_enc.wasm')), { level: 9 }).toString('base64');

const inlineAssets = JSON.stringify(Object.fromEntries(assetEntries)).replace(/</g, '\\u003c');
// Docs rewrites inline script text (it choked on multi-line template literals), so ship the bundle as base64 and inject it at runtime.
const encodedScript = Buffer.from(script, 'utf8').toString('base64');
const sidebarHtml = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${styles}</style>
  </head>
  <body>
    <div id="root"></div>
    <!--PLUCKR_BOOT-->
    <script>window.PLUCKR_ASSETS = ${inlineAssets};window.PLUCKR_AVIF_WASM = '${avifWasm}';</script>
    <script>(function(){var b=atob('${encodedScript}'),u=new Uint8Array(b.length),i;for(i=0;i<b.length;i++)u[i]=b.charCodeAt(i);var s=document.createElement('script');s.text=new TextDecoder('utf-8').decode(u);document.body.appendChild(s);})();</script>
  </body>
</html>`;

await writeFile(join(outputRoot, 'Sidebar.html'), sidebarHtml);
console.log('Built apps-script/Sidebar.html from the React app.');
