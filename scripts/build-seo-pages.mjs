// Builds the three P1 landing pages from the privacy page template (same nav, footer and styles).
//   node scripts/build-seo-pages.mjs
// Output goes to pluckr.webflow/ (and pluckr.webflow/guides/). Edit the copy below, rerun, commit.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = resolve('pluckr.webflow');
const ORIGIN = 'https://docpluckr.com';
const TEMPLATE = readFileSync(`${SITE}/privacy.html`, 'utf8');
const TODAY = '2026-10-26';

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const esc = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Screenshots of the real add-on in a Google Doc (brand/marketplace/screenshots-live, converted to WebP).
const shot = (file, alt, caption, eager = false) => `
<figure class="w-richtext-align-fullwidth shot">
  <img src="/images/guides/${file}.webp" alt="${esc(alt)}" width="1280" height="800"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>
  <figcaption>${caption}</figcaption>
</figure>`;

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
<p>Google Docs has no “save all images” command. You can right-click one image at a time, or download the whole Doc as a web page and dig through a folder of files called image1, image2 and so on. Pluckr puts the images in a sidebar next to the Doc instead, so you can see what you have before you take it.</p>
${shot('pluckr-image-list', 'The Pluckr sidebar open next to a Google Doc, showing an extracted image with its name, dimensions and file size', 'The Pluckr sidebar next to a Google Doc. Each image gets a preview, a name, its dimensions and its file size.', true)}
<h2>What you see for each image</h2>
<ul role="list">
  <li><strong>A preview</strong> large enough to tell the images apart, in the order they appear in the Doc.</li>
  <li><strong>A file name</strong> such as image-01.png. Click the pencil to rename it.</li>
  <li><strong>The dimensions and file size</strong>, for example 2046 × 1364 and 213.3 KB, so you can spot the heavy ones.</li>
  <li><strong>Copy and Download buttons</strong>. Copy puts the image on your clipboard as a PNG. Download saves that one file.</li>
</ul>
<h2>How to extract the images</h2>
<ol role="list">
  <li>Open the Google Doc.</li>
  <li>Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>. The sidebar opens on the right.</li>
  <li>The first time, Google asks you to allow the add-on. Pluckr asks for access to the current document only, plus your Google account identity so it can check your licence. The <a href="/privacy">privacy policy</a> lists every permission and why.</li>
  <li>Unlock Pluckr if you have not already. It is a one-time $5 purchase, and the unlock screen explains the terms before you pay.</li>
  <li>Scroll through the list. Rename, copy or download single images, or press <strong>Download originals</strong> to get all of them in one ZIP named after the Doc.</li>
</ol>
<h2>Google Slides too</h2>
<p>Open the same sidebar in a Slides deck and Pluckr lists the pictures on every slide, including ones inside groups, named by slide: slide-01-image-01, slide-01-image-02 and so on. Select, rename, convert and download work the same way, and one purchase covers Docs and Slides. Images used as shape fills or slide backgrounds are not listed.</p>
<h2>Alt text</h2>
<p>Pluckr shows each image’s alt text and tells you how many images have none. Filter to the ones with no alt text, write a description in the sidebar and save it back to the file, or add alt text files (CSV and JSON) to your download so it travels with the images.</p>
<h2>Images in tables and other tabs</h2>
<p>Images placed inside table cells are listed with the rest, and so are images on other document tabs. You do not have to open each tab and scan it separately.</p>
<h2>After you edit the Doc</h2>
<p>The list shows the Doc as it was when Pluckr last scanned it. Add, remove or replace images, then press the refresh icon at the top of the sidebar to scan again.</p>
<h2>The originals, untouched</h2>
<p>Download originals gives you the images as they are stored in the Doc, with no recompression. If you want smaller files, open <strong>Output settings</strong> and convert them. That is covered on the page about <a href="/convert-google-docs-images-to-webp">converting Google Docs images to WebP or AVIF</a>.</p>
${shot('pluckr-light-theme', 'The Pluckr sidebar in its light theme next to a Google Doc', 'Light and dark themes. Pluckr follows your system setting until you pick one from the menu.')}
<h2>What it does not cover yet</h2>
<p>Pluckr reads inline images. Images set to float in front of or behind text are not listed yet, and neither are drawings. If an image you expect is missing, check its wrap setting in Docs.</p>
<h2>Price and privacy</h2>
<p>Pluckr costs $5 once. There is no subscription, and the <a href="/terms">terms</a> include a 14-day refund. Your images are read by Google Apps Script inside your Google account and handled in your browser. They are not sent to Pluckr’s servers. What Pluckr does store is a licence record: your Google account ID, your email and the purchase details.</p>
<h2>Keep going</h2>
<p>Want smaller files? <a href="/convert-google-docs-images-to-webp">Convert the images to WebP or AVIF</a> while you extract them. Want to compare this with the manual routes first? Read <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a>. Or start from the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Does Pluckr change my Google Doc?', 'No. It reads the images and shows them in the sidebar. Your document stays as it is.'],
      ['Does it find images inside tables?', 'Yes. Images in tables and in other document tabs are listed with the rest.'],
      ['Do I have to publish the Doc?', 'No. Pluckr works on the Doc you have open. There is nothing to publish or share.'],
      ['Are the downloaded images the same quality as in the Doc?', 'Yes. Download originals gives you the stored images without recompressing them. Quality only changes if you choose to convert.'],
      ['Can I extract images from a Doc someone shared with me?', 'You need to be able to open the Doc and use add-ons in it. Pluckr reads the Doc you have open, so access follows your permissions in Google Docs.'],
      ['Does it work in Google Slides?', 'Yes. Open Pluckr from a Slides deck to list, rename, convert and download its pictures. Markdown export is only for Docs.'],
      ['What file names do I get?', 'image-01, image-02 and so on, in document order. You can rename any of them before you download.'],
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
<p>Images pasted into a Google Doc are often PNGs straight from a screenshot tool or a design file, and they are big. Before they go onto a website or into a CMS, most of them need to be smaller, a sensible shape and in a modern format. Pluckr does that in the same sidebar you use to extract them, so there is no export, convert, re-export loop.</p>
<h2>Why WebP and AVIF</h2>
<p>Both formats make much smaller files than the PNG or JPEG you started with, so pages load faster and uploads fit within limits. In our demo document, a 213.3 KB JPEG came out at 105.8 KB as a WebP at 80% quality, cropped to 16:9. The crop removed some pixels as well, so treat that as one real example, not a promise. Your results depend on the image and the settings.</p>
${shot('pluckr-converted-sizes', 'The Pluckr sidebar after converting, showing an image going from 213.3 KB to 105.8 KB as WebP', 'After converting, each image shows its old and new size. Here, 213.3 KB became 105.8 KB. The button now reads Download 4 as WebP.', true)}
<h2>The output settings</h2>
${shot('pluckr-output-settings', 'The Pluckr output settings panel with WebP selected, quality at 80 percent and a 16:9 aspect ratio', 'Output settings: format, quality, aspect ratio and maximum width.')}
<ul role="list">
  <li><strong>Format.</strong> AVIF, WebP, JPEG or PNG.</li>
  <li><strong>Quality.</strong> A slider for the lossy formats, starting at 80%. Lower it for smaller files, raise it if you can see artefacts. PNG is lossless, so the slider does not apply to it.</li>
  <li><strong>Aspect ratio.</strong> Keep the original, or crop from the centre to 1:1, 4:3, 3:4, 3:2, 2:3, 16:9 or 9:16. The thumbnails in the list update to show the crop.</li>
  <li><strong>Max width.</strong> A width in pixels. Leave it empty to keep each image’s own size. Images are never enlarged, so a small image stays small.</li>
</ul>
<p>The settings apply to every image in the list. Pluckr crops first, then scales, then encodes.</p>
<h2>How to convert the images</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.</li>
  <li>Open <strong>Output settings</strong> at the bottom of the sidebar and pick a format. The button changes from Download originals to Convert.</li>
  <li>Set the quality, aspect ratio and maximum width.</li>
  <li>Press <strong>Convert</strong>. Each image shows its original size and its new size.</li>
  <li>Check the numbers, then press the download button. You get one ZIP, for example images-webp.zip.</li>
</ol>
<p>Change a setting afterwards and Pluckr converts again, so you can try a lower quality and compare the sizes before you save anything.</p>
<h2>Which format to pick</h2>
<ul role="list">
  <li><strong>AVIF</strong> usually gives the smallest files and takes the longest to encode. The first AVIF conversion in a session also has to load the encoder.</li>
  <li><strong>WebP</strong> is the safe all-rounder: small files, fast to encode and supported by current browsers and most CMSs.</li>
  <li><strong>JPEG</strong> suits places that still insist on the oldest photo format.</li>
  <li><strong>PNG</strong> is lossless. Use it for screenshots with sharp text and for images that need transparency.</li>
</ul>
<h2>Shapes for common uses</h2>
<ul role="list">
  <li><strong>1:1</strong> for avatars and square social posts.</li>
  <li><strong>16:9</strong> for blog headers, video thumbnails and slides.</li>
  <li><strong>4:3 and 3:2</strong> for ordinary photos.</li>
  <li><strong>3:4, 2:3 and 9:16</strong> for portrait images and stories.</li>
</ul>
<h2>Where the conversion runs</h2>
<p>In your browser, in the sidebar. The converted files are not uploaded to Pluckr. Google Apps Script reads the original images from your Doc, and your browser converts them. The images in the Doc are not touched. See the <a href="/privacy">privacy policy</a> for the full picture.</p>
<h2>Keep going</h2>
<p>Just need the originals? <a href="/extract-images-from-google-docs">Extract images from Google Docs</a>. Comparing manual methods? Read <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a>. Pluckr is $5 once. See the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Which formats can Pluckr convert to?', 'AVIF, WebP, JPEG and PNG.'],
      ['Are my images uploaded to convert them?', 'No. Conversion runs in your browser. Google Apps Script reads the images from your Doc, and Pluckr’s servers never receive them.'],
      ['Can it make every image the same shape?', 'Yes. Pick an aspect ratio and Pluckr crops each image from the centre.'],
      ['Will it make small images bigger?', 'No. Max width only shrinks images. An image narrower than the limit keeps its size.'],
      ['Can I use the results in WordPress?', 'Recent WordPress versions accept WebP and AVIF uploads. Check your own site’s version and plugins if uploads are refused.'],
      ['Does converting change the images in my Doc?', 'No. Pluckr only reads them. You get new files and the Doc stays as it was.'],
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
<p>You need the pictures from a Google Doc: a blog draft, a client brief, a report with screenshots. Docs lets you download the document as a file, but it does not offer a folder of the images. These are the four routes people use, in order of effort, with the honest downside of each. Nobody needs to publish the Doc for any of them.</p>
<h2>Method 1: download the Doc as a zipped web page</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.</li>
  <li>Open the downloaded ZIP so it unpacks.</li>
  <li>Open the <strong>images</strong> folder. Your pictures are inside.</li>
</ol>
<p>Good: nothing to install, and it is free. Not so good: the files have generic names like image1.png, you cannot see which is which until you open them, and the folder sits next to an HTML file you did not want.</p>
<h2>Method 2: download as Word and open the ZIP inside</h2>
<ol role="list">
  <li>Choose <strong>File &gt; Download &gt; Microsoft Word (.docx)</strong>.</li>
  <li>Rename the file so it ends in .zip instead of .docx, then unzip it. On Windows you may need to turn on file extensions first.</li>
  <li>Open <strong>word &gt; media</strong>.</li>
</ol>
<p>Good: also free, and the images are plain files. Not so good: the same generic names, and a rename step that confuses some people.</p>
<h2>Method 3: run an Apps Script</h2>
<p>A short script can loop over the document and save each image to Google Drive. <a href="https://labnol.org/extract-images-google-docs-slides-230913" target="_blank" rel="noopener">Amit Agarwal’s guide on Digital Inspiration</a> walks through a fuller version. The core idea looks like this:</p>
<pre><code>function saveImages() {
  const images = DocumentApp.getActiveDocument().getBody().getImages();
  const folder = DriveApp.createFolder('Doc images');
  images.forEach((img, i) =&gt; folder.createFile(img.getBlob().setName('image-' + (i + 1))));
}</code></pre>
<p>Good: free and repeatable once set up. Not so good: you paste code, authorize it yourself, and then download the files from Drive. It has no preview and no resizing.</p>
<h2>Method 4: use Pluckr</h2>
<ol role="list">
  <li>Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.</li>
  <li>See every image with a preview, a size and its dimensions, including images in tables and other tabs.</li>
  <li>Rename what you need, then download one image, or press <strong>Download originals</strong> for a ZIP of all of them.</li>
  <li>Optional: open <strong>Output settings</strong>, pick WebP, AVIF, JPEG or PNG, set a quality, a max width or a crop, and download the converted set instead.</li>
</ol>
${shot('pluckr-image-list', 'The Pluckr sidebar next to a Google Doc listing each image with a preview, name and file size', 'Pluckr in a Doc: every image listed with a preview, its name and its size.', true)}
<p>Good: you see the images first, you choose the names, and you can shrink or reshape them in the same step. Not so good: it costs $5, once. You can read how it handles <a href="/extract-images-from-google-docs">extracting images from Google Docs</a> or <a href="/convert-google-docs-images-to-webp">converting them to WebP or AVIF</a> on their own pages.</p>
${shot('pluckr-converted-sizes', 'The Pluckr sidebar showing an image reduced from 213.3 KB to 105.8 KB after conversion to WebP', 'The optional step: convert while you download. This image went from 213.3 KB to 105.8 KB.')}
<h2>Which one should you use</h2>
<ul role="list">
  <li><strong>One Doc, once, no rush:</strong> Method 1.</li>
  <li><strong>You like scripts and do this often:</strong> Method 3.</li>
  <li><strong>Many Docs, or images that need good names, a smaller format or a fixed shape:</strong> Pluckr.</li>
</ul>
<h2>After you have the files</h2>
<p>Give the files descriptive names before they go on a website, because image names are one of the things search engines read. Keep the originals somewhere, since converting to a lossy format cannot be undone. And write alt text where the image is published. The file name is not a substitute for it.</p>
<p>Back to the <a href="/">homepage</a>.</p>`,
    faq: [
      ['Do I need to publish the Doc to download its images?', 'No. None of these methods needs you to publish the Doc.'],
      ['Which method is fastest?', 'For a single Doc, the zipped web page download. For many Docs, or when you also want to rename or convert the images, Pluckr.'],
      ['Does Pluckr find images inside tables?', 'Yes. It lists images in tables and in other document tabs.'],
      ['Why are my downloaded images called image1, image2?', 'Docs uses generic names when it exports a document. Pluckr lets you rename each image before you download it.'],
      ['Can I get the images in a smaller format?', 'With the manual methods you need a separate converter. Pluckr converts to WebP, AVIF, JPEG or PNG in the same sidebar.'],
      ['Are floating images included?', 'Not in Pluckr yet. It reads inline images. Images set to float in front of or behind text are not listed.'],
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
    `<style>
    .u-rich-text figure.shot { max-width: 100%; margin: 40px 0; }
    .u-rich-text figure.shot img { display: block; width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.10); }
    .u-rich-text figure.shot figcaption { margin-top: 12px; font-size: 14px; color: rgba(255, 255, 255, 0.62); }
    .u-rich-text pre { margin: 24px 0; padding: 16px 20px; overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.10); background: rgba(255, 255, 255, 0.04); font-size: 14px; line-height: 1.6; }
  </style>`,
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
  ['/privacy', '2026-10-25'],
  ['/terms', '2026-10-25'],
];
writeFileSync(`${SITE}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, date]) => `  <url><loc>${ORIGIN}${path}</loc><lastmod>${date}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log('wrote sitemap.xml');
