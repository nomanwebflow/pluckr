// Builds the new site from site/ into site/out/. Head tags, nav and footer live here once.
//   node scripts/build-site.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../site');
const OUT = resolve(__dirname, '../site/out');
const ORIGIN = 'https://docpluckr.com';
const INSTALL = 'https://workspace.google.com/marketplace/app/pluckr/315157378382';

const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const nav = (current) => `
<nav class="nav" aria-label="Primary">
  <a class="brand" href="/"><img src="/assets/mark.svg" alt="" width="22" height="22">Pluckr</a>
  <div class="nav-links" id="nav-links">
    <a href="/extract-images-from-google-docs"${current === 'docs' ? ' aria-current="page"' : ''}>Docs</a>
    <a href="/extract-images-from-google-slides">Slides</a>
    <a href="/pricing">Pricing</a>
    <a href="/guides/download-all-images-from-google-docs">Guides</a>
  </div>
  <div class="nav-end">
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <a class="btn" href="${INSTALL}" target="_blank" rel="noopener">Add to Google Docs ${arrow}</a>
  </div>
</nav>`;

const footer = `
<footer>
  <div class="foot">
    <div class="foot-brand">
      <a class="brand" href="/"><img src="/assets/mark.svg" alt="" width="22" height="22">Pluckr</a>
      <p>Get every image out of a Google Doc or Slides deck. One price, nothing leaves your browser.</p>
    </div>
    <div><h3>Product</h3><ul>
      <li><a href="/extract-images-from-google-docs">Extract images from Docs</a></li>
      <li><a href="/extract-images-from-google-slides">Extract images from Slides</a></li>
      <li><a href="/convert-google-docs-images-to-webp">Convert to WebP or AVIF</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul></div>
    <div><h3>Guides</h3><ul>
      <li><a href="/guides/download-all-images-from-google-docs">Download all images from a Doc</a></li>
      <li><a href="/export-google-docs-to-markdown-with-images">Google Docs to Markdown</a></li>
      <li><a href="/export-google-docs-alt-text">Export alt text</a></li>
      <li><a href="/faq">FAQ</a></li>
    </ul></div>
    <div><h3>Company</h3><ul>
      <li><a href="/privacy">Privacy</a></li>
      <li><a href="/terms">Terms</a></li>
      <li><a href="mailto:support@docpluckr.com">support@docpluckr.com</a></li>
    </ul></div>
  </div>
  <div class="legal">
    <p>Google Docs, Google Slides and Google Account are trademarks of Google LLC. Pluckr is not affiliated with or endorsed by Google.</p>
    <div class="theme" role="group" aria-label="Theme">
      <button type="button" data-theme="light" aria-pressed="true">Light</button>
      <button type="button" data-theme="dark" aria-pressed="false">Dark</button>
    </div>
  </div>
</footer>`;

const page = ({ path, title, description, body, current, jsonld = [] }) => `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pluckr">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:image" content="${ORIGIN}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.png" media="(prefers-color-scheme: light)">
<link rel="icon" href="/assets/favicon-dark.png" media="(prefers-color-scheme: dark)">
<link rel="preload" href="/assets/PPNeueMontreal-Medium.ttf" as="font" type="font/ttf" crossorigin>
<script>try{var t=localStorage.getItem('pluckr-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="stylesheet" href="/site.css">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<div class="frame">
${nav(current)}
${body}
${footer}
</div>
<script src="/site.js" defer></script>
</body>
</html>
`;

const row = (i, name, src) => `
        <div class="p-row" role="presentation">
          <img src="${src}" alt="" width="56" height="56">
          <div class="p-text"><span class="p-name">image${i}.jpg</span><span class="p-meta"></span></div>
        </div>`;

const photos = [
  ['/assets/lake.jpg', 'Loch shore with a snow-capped mountain behind it'],
  ['/assets/building.jpg', 'Sunlit sandstone building at dusk'],
  ['/assets/library.jpg', 'Timber reading room with arched windows'],
];

const home = page({
  path: '/',
  current: 'home',
  title: 'Extract and Convert Images from Google Docs | Pluckr',
  description: 'Pull every image out of a Google Doc or Slides deck. Rename, convert to WebP or AVIF, keep alt text. $5 once. Images stay in your browser.',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Pluckr',
      url: `${ORIGIN}/`,
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Web',
      description: 'A Google Docs and Google Slides add-on that lists every image in a file so you can rename, convert and download them.',
      offers: { '@type': 'Offer', price: '5', priceCurrency: 'USD' },
      featureList: ['Extract every image from Google Docs and Google Slides', 'Bulk rename', 'Convert to WebP, AVIF, JPEG or PNG', 'Edit and export alt text', 'Export Google Docs as Markdown with images'],
    },
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'Pluckr', url: `${ORIGIN}/`, logo: `${ORIGIN}/assets/favicon.png` },
  ],
  body: `
<header class="hero">
  <div class="hero-head">
    <h1>Get every image out of a Google&nbsp;Doc.</h1>
    <div class="hero-aside">
      <p>Pluckr lists the images in your Doc or Slides deck. Pick, rename, convert and download them in one go.</p>
      <a class="btn btn--lg" href="${INSTALL}" target="_blank" rel="noopener">Add to Google Docs ${arrow}</a>
      <span class="trust">$5 once. Your images never leave your browser.</span>
    </div>
  </div>
  <div class="hero-tool">
    <section class="wb" id="wb" aria-label="Live demo of the Pluckr sidebar">
      <div class="doc">
        <div class="doc-bar">
          <span class="doc-title">West Coast Road Trip</span>
          <span class="doc-menus" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Tools</span><span class="is-ext">Extensions</span><span>Help</span></span>
        </div>
        <div class="doc-canvas">
          <article class="paper">
            <h2>West Coast Road Trip</h2>
            <p class="lede">Seventy-two hours, four people and one car. We left before sunrise and followed the coast north.</p>
            <div class="shots">${photos.map(([src, alt], i) => `
              <button class="shot" type="button" aria-pressed="true" data-src="${src}">
                <img src="${src}" alt="${alt}" width="1000" height="1000"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>
                <span class="tick">${tick}</span>
                <span class="shot-name"></span>
              </button>`).join('')}
            </div>
            <p class="doc-note">Click a photo, or a row in the sidebar, to leave it out.</p>
          </article>
        </div>
      </div>
      <aside class="pluckr" aria-label="Pluckr sidebar">
        <div class="p-top"><img src="/assets/mark.svg" alt="" width="18" height="18"><b>Pluckr</b></div>
        <div class="p-panel">
          <div class="p-bar"><span id="p-count">3 of 3 selected</span><span><button class="p-mini" id="p-all" type="button">All</button> <button class="p-mini" id="p-none" type="button">Clear</button></span></div>
          <div id="p-rows">${photos.map(([src], i) => row(i + 1, '', src)).join('')}
          </div>
          <p class="p-bar" id="p-sum" aria-live="polite">Converting in your browser</p>
        </div>
        <div class="p-settings">
          <label class="p-field"><span class="p-label">Rename pattern</span><input class="p-input" id="p-pattern" type="text" value="{doc}-{n}" spellcheck="false" autocomplete="off"></label>
          <div class="p-field"><span class="p-label">Format</span>
            <div class="p-seg" id="p-fmt" role="group" aria-label="Format">
              <button type="button" data-fmt="webp" aria-pressed="true">WebP</button>
              <button type="button" data-fmt="jpeg" aria-pressed="false">JPEG</button>
              <button type="button" data-fmt="png" aria-pressed="false">PNG</button>
            </div>
          </div>
          <div class="p-field"><span class="p-label"><label for="p-quality">Quality</label><output id="p-qval">80</output></span>
            <input class="p-slider" id="p-quality" type="range" min="10" max="100" value="80" style="--pct:77.7%"></div>
        </div>
        <button class="p-go" id="p-go" type="button" disabled>Download 3 as WEBP</button>
        <p class="p-hint">Runs in this tab. Nothing is uploaded.</p>
      </aside>
    </section>
  </div>
</header>`,
});

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(`${SRC}/assets`, `${OUT}/assets`, { recursive: true });
writeFileSync(`${OUT}/site.css`, readFileSync(`${SRC}/src/site.css`));
writeFileSync(`${OUT}/site.js`, readFileSync(`${SRC}/src/site.js`));
writeFileSync(`${OUT}/index.html`, home);
console.log('built site/out');
