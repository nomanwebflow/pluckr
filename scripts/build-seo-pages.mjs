// Builds the three P1 landing pages from the privacy page template (same nav, footer and styles).
//   node scripts/build-seo-pages.mjs
// Output goes to pluckr.webflow/ (and pluckr.webflow/guides/). Edit the copy below, rerun, commit.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = resolve('pluckr.webflow');
const ORIGIN = 'https://docpluckr.com';
const TEMPLATE = readFileSync(`${SITE}/privacy.html`, 'utf8');
const TODAY = '2026-10-25';

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const esc = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const pages = [
  {
    file: 'extract-images-from-google-docs.html',
    path: '/extract-images-from-google-docs',
    title: 'Extract Images from Google Docs (All at Once) | Pluckr',
    description: 'Pull every inline image out of a Google Doc in one go. Preview, rename, copy or download them, or save a ZIP of the originals. One-time $5.',
    h1: 'Extract Images from Google Docs',
    lede: 'Open the sidebar, see every image in the document, then take one or take them all.',
    short: '<strong>The short version:</strong> Pluckr is a Google Docs add-on. It lists every inline image in your Doc, including images inside tables and other tabs, and lets you copy, rename or download them, or save a ZIP of the originals.',
    body: `
<h2>What you get</h2>
<ul role="list">
  <li><strong>Every image, listed.</strong> A preview, the file name, the dimensions and the file size for each one, in document order.</li>
  <li><strong>Tables and tabs included.</strong> Images nested in tables and spread across document tabs show up in the same list.</li>
  <li><strong>Copy, download or rename.</strong> Copy an image as PNG, download one, or rename it before it is saved.</li>
  <li><strong>A ZIP of the originals.</strong> Download everything in one file, named after the document.</li>
</ul>
<h2>How to extract the images</h2>
<ol role="list">
  <li>Open the Google Doc.</li>
  <li>Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>. The sidebar opens.</li>
  <li>The first time, allow the permissions Google asks for and unlock Pluckr.</li>
  <li>Look through the list. Rename, copy or download single images, or download them all.</li>
</ol>
<h2>What it does not cover yet</h2>
<p>Pluckr reads inline images. Images set to float in front of or behind text are not listed yet.</p>
<h2>Price and privacy</h2>
<p>Pluckr costs $5 once. No subscription. Your images are read by Google Apps Script and handled in your browser. They are never sent to Pluckr’s servers. The details are in the <a href="/privacy">privacy policy</a>.</p>
<h2>Keep going</h2>
<p>Want smaller files? <a href="/convert-google-docs-images-to-webp">Convert the images to WebP or AVIF</a> while you extract them. Prefer to compare options first? Read <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a> the manual way. Or start from the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Does Pluckr change my Google Doc?', 'No. It reads the images and shows them in the sidebar. Your document stays as it is.'],
      ['Does it find images inside tables?', 'Yes. Images in tables and in other document tabs are listed with the rest.'],
      ['Do I have to publish the Doc?', 'No. Pluckr works on the Doc you have open. There is nothing to publish or share.'],
    ],
  },
  {
    file: 'convert-google-docs-images-to-webp.html',
    path: '/convert-google-docs-images-to-webp',
    title: 'Convert Google Docs Images to WebP or AVIF | Pluckr',
    description: 'Convert the images in a Google Doc to WebP, AVIF, JPEG or PNG. Set quality, max width and crop. Runs in your browser. One-time $5.',
    h1: 'Convert Google Docs Images to WebP or AVIF',
    lede: 'Pick a format, set the quality, and check the new file sizes before you download anything.',
    short: '<strong>The short version:</strong> Pluckr converts the images in your Google Doc to AVIF, WebP, JPEG or PNG inside the sidebar. You choose quality, a maximum width and an aspect ratio, and the conversion runs in your browser.',
    body: `
<h2>Why WebP and AVIF</h2>
<p>Both formats make much smaller files than the PNG or JPEG you pasted into the Doc, so pages load faster and uploads go through. In our demo document a 2.5 MB photo came out at about 98 KB as WebP. Your results depend on the image and the quality you pick.</p>
<h2>The output settings</h2>
<ul role="list">
  <li><strong>Format.</strong> AVIF, WebP, JPEG or PNG.</li>
  <li><strong>Quality.</strong> A slider for the lossy formats. It starts at 80%.</li>
  <li><strong>Max width.</strong> Set a width in pixels. Images are never enlarged.</li>
  <li><strong>Aspect ratio.</strong> Keep the original, or crop from the centre to 1:1, 4:3, 3:4, 3:2, 2:3, 16:9 or 9:16.</li>
</ul>
<h2>How to convert the images</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.</li>
  <li>Open <strong>Output settings</strong> and pick a format, quality, width and aspect ratio.</li>
  <li>Convert. Each image shows its new size next to the original.</li>
  <li>Download the results.</li>
</ol>
<h2>Which format to pick</h2>
<ul role="list">
  <li><strong>AVIF</strong> gives the smallest files and takes the longest to encode.</li>
  <li><strong>WebP</strong> is the safe all-rounder: small files and wide support.</li>
  <li><strong>JPEG</strong> suits places that still want the oldest format.</li>
  <li><strong>PNG</strong> is lossless. Use it for screenshots and images that need transparency.</li>
</ul>
<h2>Where the conversion runs</h2>
<p>In your browser, in the sidebar. The converted files are not uploaded to Pluckr. Your original images in the Doc are not touched. See the <a href="/privacy">privacy policy</a> for the full picture.</p>
<h2>Keep going</h2>
<p>Just need the originals? <a href="/extract-images-from-google-docs">Extract images from Google Docs</a>. Comparing manual methods? Read <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a>. Pluckr is $5 once. See the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Which formats can Pluckr convert to?', 'AVIF, WebP, JPEG and PNG.'],
      ['Are my images uploaded to convert them?', 'No. Conversion runs in your browser. Google Apps Script reads the images from your Doc, and Pluckr’s servers never receive them.'],
      ['Can it make every image the same shape?', 'Yes. Pick an aspect ratio and Pluckr crops each image from the centre.'],
    ],
  },
  {
    file: 'guides/download-all-images-from-google-docs.html',
    path: '/guides/download-all-images-from-google-docs',
    title: 'How to Download All Images from a Google Doc | Pluckr',
    description: 'Four ways to save every image from a Google Doc: a zipped web page, the Word file trick, Apps Script, and Pluckr. Steps and trade-offs.',
    h1: 'How to Download All Images from a Google Doc',
    lede: 'Google Docs has no “save all images” button. Here are four ways around it, with what each one costs you.',
    short: '<strong>The short version:</strong> the free methods work but give you generic file names and a bit of cleanup. Pluckr lists the images, lets you rename and convert them, and saves everything in one go for a one-time $5.',
    body: `
<h2>Method 1: download the Doc as a zipped web page</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.</li>
  <li>Unzip the file you get.</li>
  <li>Open the <strong>images</strong> folder.</li>
</ol>
<p>Trade-off: nothing to install, but the files have generic names like image1.png and you get no preview before you download.</p>
<h2>Method 2: download as Word and open the zip inside</h2>
<ol role="list">
  <li>Choose <strong>File &gt; Download &gt; Microsoft Word (.docx)</strong>.</li>
  <li>Rename the file so it ends in .zip, then unzip it.</li>
  <li>Open <strong>word &gt; media</strong>.</li>
</ol>
<p>Trade-off: the same generic names, plus a fiddly rename step on some systems.</p>
<h2>Method 3: run an Apps Script</h2>
<p>A short script can loop over the document and save each image to Google Drive. <a href="https://labnol.org/extract-images-google-docs-slides-230913" target="_blank" rel="noopener">Amit Agarwal’s guide on Digital Inspiration</a> walks through one. Trade-off: you copy code, authorize it yourself and pull the files out of Drive afterwards.</p>
<h2>Method 4: use Pluckr</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.</li>
  <li>See every image with a preview, size and dimensions, including images in tables and tabs.</li>
  <li>Rename what you need, then download one image or a ZIP of all of them.</li>
</ol>
<p>Trade-off: it costs $5, once. In return you can <a href="/convert-google-docs-images-to-webp">convert the images to WebP or AVIF</a>, resize and crop them in the same step. More on <a href="/extract-images-from-google-docs">extracting images from Google Docs</a>.</p>
<h2>Which one should you use</h2>
<p>One Doc, once, no rush: Method 1. Many Docs, or images that need good names or a smaller format: Pluckr. If you like writing scripts, Method 3 is yours.</p>
<p>Back to the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Do I need to publish the Doc to download its images?', 'No. None of these methods needs you to publish the Doc.'],
      ['Which method is fastest?', 'For a single Doc, the zipped web page download. For many Docs, or when you also want to rename or convert the images, Pluckr.'],
      ['Does Pluckr find images inside tables?', 'Yes. It lists images in tables and in other document tabs.'],
    ],
  },
];

// Root-absolute asset and page links so a page in /guides/ resolves the same way as one at the root.
const rootify = (html) => html
  .replace(/href="index\.html/g, 'href="/')
  .replace(/href="privacy\.html"/g, 'href="/privacy"')
  .replace(/href="terms\.html"/g, 'href="/terms"')
  .replace(/(="|, )(images|css|js|fonts)\//g, '$1/$2/')
  .replace(/url\((["']?)(images|fonts)\//g, 'url($1/$2/');

const start = '<div class="u-rich-text w-richtext">';
const end = '\n          </div>\n        </div>\n      </section>\n    </main>';

for (const page of pages) {
  const url = ORIGIN + page.path;
  const faqHtml = `<h2>Questions</h2>\n${page.faq.map(([q, a]) => `<p><strong>${q}</strong><br>${a}</p>`).join('\n')}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  };

  let html = TEMPLATE;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = html.replace(/(<meta content=")[^"]*(" name="description">)/, `$1${esc(page.description)}$2`);
  html = html.replace(/(<meta content=")[^"]*(" property="og:title">)/, `$1${esc(page.title)}$2`);
  html = html.replace(/(<meta content=")[^"]*(" property="og:description">)/, `$1${esc(page.description)}$2`);
  html = html.replace(/(<meta content=")[^"]*(" name="twitter:title">)/, `$1${esc(page.title)}$2`);
  html = html.replace(/(<meta content=")[^"]*(" name="twitter:description">)/, `$1${esc(page.description)}$2`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${ORIGIN}/images/og-image.png">`,
    `<meta name="twitter:image" content="${ORIGIN}/images/og-image.png">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join('\n  '));

  html = html.replace(/(<h1[^>]*><span>)Privacy Policy(<br><\/span><\/h1>)/, `$1${page.h1}$2`);
  html = html.replace(/<span>Last updated: [^<]*<\/span>/, `<span>${page.lede}</span>`);
  html = html.replace(/<p><strong>The short version:<\/strong>[^\n]*<\/p>/, `<p>${page.short}</p>`);

  const from = html.indexOf(start);
  const to = html.indexOf(end);
  if (from < 0 || to < 0) throw new Error('Template markers not found in privacy.html');
  html = html.slice(0, from) + start + page.body + '\n' + faqHtml + html.slice(to);

  html = rootify(html);
  const out = `${SITE}/${page.file}`;
  mkdirSync(resolve(out, '..'), { recursive: true });
  writeFileSync(out, html);
  console.log(`wrote ${page.file} (${html.length} bytes)`);
}

// Sitemap: the homepage and legal pages stay, the new pages are added.
const urls = [
  ['/', TODAY],
  ...pages.map((page) => [page.path, TODAY]),
  ['/privacy', '2026-10-21'],
  ['/terms', '2026-10-21'],
];
writeFileSync(`${SITE}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, date]) => `  <url><loc>${ORIGIN}${path}</loc><lastmod>${date}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log('wrote sitemap.xml');
