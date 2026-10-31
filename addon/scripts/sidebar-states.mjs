// Photographs every screen and state of the sidebar, then builds one self-contained page: docs/sidebar-states.html.
//   npm run dev                              (in another terminal: the sidebar on http://localhost:5173)
//   node scripts/sidebar-states.mjs          (capture, then build)
//   node scripts/sidebar-states.mjs build    (only rebuild the page from the last capture)
// The states are reached through the dev-only URL flags in src/main.jsx (#licence=unpaid, #state=empty, #host=slides ...)
// plus real clicks, so the pictures are the real sidebar. Needs Chrome and cwebp.
import { chromium } from 'playwright-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BASE = process.env.SIDEBAR_URL || 'http://localhost:5173/';
const RAW = join(process.env.SIDEBAR_RAW || tmpdir(), 'pluckr-sidebar-states');
const OUT = resolve('docs/sidebar-states.html');
const THEMES = ['dark', 'light'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- the states -------------------------------------------------------------------------------------------------
const section = (page, title) => page.locator(`section[aria-label="${title}"]`);
const openSection = async (page, title) => {
  await section(page, title).locator('.export-toggle').click();
  await sleep(750);
};
const pickFormat = async (page, label) => {
  await section(page, 'Output settings').locator('.select-button').first().click();
  await page.getByRole('option', { name: label }).click();
  await sleep(250);
};
const row = (page, index) => page.locator('.image-row').nth(index);
const addAlt = async (page, index, text) => {
  await row(page, index).getByRole('button', { name: /^add alt$/i }).click();
  await row(page, index).locator('.alt-input').fill(text);
  await row(page, index).getByRole('button', { name: /save to/i }).click();
  await sleep(500);
};

const GROUPS = [
  ['unlock', 'Unlock', 'Shown until the licence check passes. A one-time $5 purchase unlocks Docs and Slides.'],
  ['scan', 'Scanning', 'What the list shows before it has images.'],
  ['list', 'Image list', 'One card per image. The tick on the thumbnail decides what downloads, converts, renames and optimizes.'],
  ['selection', 'Selection', 'The bar above the list. Its buttons act on the images currently listed.'],
  ['rename', 'Bulk rename', 'One pattern for every ticked image, with a live preview. Renames the list, not the file.'],
  ['output', 'Output settings', 'Convert, crop and bundle. Closing this section turns conversion off.'],
  ['optimize', 'Optimize images', 'Replaces the file’s own pictures with smaller copies, after a confirmation.'],
  ['menu', 'Menu', 'The three dots at the top right.'],
  ['slides', 'In Google Slides', 'The same sidebar. The wording says deck, and the Markdown option is hidden.'],
];

const STATES = [
  // unlock
  { id: 'unlock-checking', group: 'unlock', title: 'Checking your licence', note: 'Shown on open when no valid licence is remembered. The message appears after a short delay so it does not flash.', hash: 'licence=checking', wait: 1300 },
  { id: 'unlock-unpaid', group: 'unlock', title: 'Unlock Pluckr', note: 'No licence found. Buy is disabled until the privacy and terms box is ticked.', hash: 'licence=unpaid' },
  { id: 'unlock-agreed', group: 'unlock', title: 'Ready to buy', note: 'After ticking the box. The checkout opens in a new tab.', hash: 'licence=unpaid', steps: async (p) => { await p.locator('.notice-agree input').check(); } },
  { id: 'unlock-waiting', group: 'unlock', title: 'Waiting for payment', note: 'While the checkout is open elsewhere. The sidebar checks again by itself.', hash: 'licence=waiting' },
  { id: 'unlock-error', group: 'unlock', title: 'Licence check failed', note: 'The licence service could not be reached.', hash: 'licence=error&licenceError=Could%20not%20reach%20the%20licence%20service.%20Check%20your%20connection%20and%20try%20again.' },
  // scan
  { id: 'scan-loading', group: 'scan', title: 'Scanning', note: 'Apps Script is reading the images.', hash: 'state=loading', wait: 1300 },
  { id: 'scan-empty', group: 'scan', title: 'No images', note: 'The file has no images Pluckr can read.', hash: 'state=empty' },
  { id: 'scan-error', group: 'scan', title: 'Scan failed', note: 'The read failed. The refresh button at the top tries again.', hash: 'state=error' },
  // list
  { id: 'list-default', group: 'list', title: 'Image list', note: 'Preview, name, size, alt text, and the Copy and Download buttons.', hash: '' },
  { id: 'list-unticked', group: 'list', title: 'Image left out', note: 'An unticked image is dimmed and skipped by every action.', hash: '', steps: async (p) => { await p.locator('.row-check').nth(1).uncheck(); } },
  { id: 'list-rename-one', group: 'list', title: 'Renaming one image', note: 'The pencil edits the file name. Enter saves, Escape cancels.', hash: '', steps: async (p) => { await p.locator('.edit-button').first().click(); } },
  { id: 'list-alt-edit', group: 'list', title: 'Editing alt text', note: 'Save to Doc writes the text into the file. Cmd or Ctrl plus Enter saves, Escape cancels.', hash: '', steps: async (p) => { await row(p, 0).getByRole('button', { name: /^edit$/i }).click(); } },
  { id: 'list-no-alt', group: 'list', title: 'Image without alt text', note: 'Add alt opens the same editor.', hash: '', steps: async (p) => { await row(p, 1).scrollIntoViewIfNeeded(); await p.locator('.panel').evaluate((el) => { el.scrollTop = el.scrollHeight; }); } },
  { id: 'list-copied', group: 'list', title: 'Image copied', note: 'Copy puts the image on the clipboard as a PNG. The label returns to Copy after a moment.', hash: '', steps: async (p) => { await row(p, 0).getByRole('button', { name: /^copy$/i }).click(); await sleep(250); } },
  // selection
  { id: 'selection-partial', group: 'selection', title: 'Some images ticked', note: 'The count shows how many are ticked. The first button becomes Select all.', hash: '', steps: async (p) => { await p.locator('.row-check').nth(1).uncheck(); } },
  { id: 'selection-none', group: 'selection', title: 'Nothing ticked', note: 'Downloads are disabled until at least one image is ticked.', hash: '', steps: async (p) => { await p.getByRole('button', { name: /^clear$/i }).click(); } },
  { id: 'selection-filter', group: 'selection', title: 'No alt text filter', note: 'Shows only the images that have no alt text. Select all then acts on those only.', hash: '', steps: async (p) => { await p.getByRole('button', { name: /no alt text/i }).click(); } },
  { id: 'selection-filter-done', group: 'selection', title: 'Every image has alt text', note: 'After the last gap is filled while the filter is on.', hash: '', steps: async (p) => { await p.getByRole('button', { name: /no alt text/i }).click(); await addAlt(p, 0, 'A bright abstract illustration'); } },
  // rename
  { id: 'rename-open', group: 'rename', title: 'Bulk rename', note: 'The default pattern is {doc}-{n}. The preview shows old and new names.', hash: '', steps: async (p) => { await openSection(p, 'Bulk rename'); } },
  { id: 'rename-pattern', group: 'rename', title: 'Custom pattern', note: 'Numbering can start anywhere. Lowercase with hyphens can be turned off.', hash: '', steps: async (p) => { await openSection(p, 'Bulk rename'); await p.locator('#rename-pattern').fill('Trip Photo {n}'); await p.locator('#rename-start').fill('5'); await sleep(250); } },
  { id: 'rename-tooltip', group: 'rename', title: 'Pattern help', note: 'The (i) lists the tokens: {n}, {name}, {doc}, {alt}.', hash: '', steps: async (p) => { await openSection(p, 'Bulk rename'); await p.locator('[aria-label="About name patterns"]').hover(); await sleep(300); } },
  { id: 'rename-applied', group: 'rename', title: 'Renamed', note: 'The new names show in the list and are used for downloads.', hash: '', steps: async (p) => { await openSection(p, 'Bulk rename'); await p.getByRole('button', { name: /^rename \d+ images?$/i }).click(); await sleep(350); } },
  // output
  { id: 'output-open', group: 'output', title: 'Output settings', note: 'Format starts on Original, which means no conversion. The other fields wait for a format.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); } },
  { id: 'output-webp', group: 'output', title: 'WebP chosen', note: 'Quality, aspect ratio and maximum width are now active. The main button becomes Convert.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await pickFormat(p, 'WebP'); } },
  { id: 'output-png', group: 'output', title: 'PNG chosen', note: 'PNG is lossless, so the quality slider stays off.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await pickFormat(p, 'PNG'); } },
  { id: 'output-dropdown', group: 'output', title: 'Format list', note: 'AVIF, WebP, PNG and JPEG. A format the browser cannot encode is greyed out.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await section(p, 'Output settings').locator('.select-button').first().click(); await sleep(250); } },
  { id: 'output-tooltip', group: 'output', title: 'Aspect ratio help', note: 'Fixed ratios crop each image from the centre.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await pickFormat(p, 'WebP'); await p.locator('[aria-label="About aspect ratio"]').hover(); await sleep(300); } },
  { id: 'output-bundle', group: 'output', title: 'Bundle with extra files', note: 'Alt text files add a CSV and a JSON. The Markdown option adds content.md and an images folder (Docs only).', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await p.locator('label.notice-agree', { hasText: /alt text files/i }).locator('input').check(); await p.locator('label.notice-agree', { hasText: /markdown/i }).locator('input').check(); await sleep(250); } },
  { id: 'output-converting', group: 'output', title: 'Converting', note: 'Images are converted in the browser, in a background worker. Changing a setting cancels the run.', hash: '', steps: async (p) => { /* hold the encoder download (it starts when AVIF is picked) so the run is still going when the picture is taken */ await p.route('**/avif_enc.wasm', async (route) => { await sleep(5000); await route.continue(); }); await openSection(p, 'Output settings'); await pickFormat(p, 'AVIF'); await p.locator('.primary-button').click(); await sleep(400); } },
  { id: 'output-converted', group: 'output', title: 'Ready to download', note: 'The button shows how many files will download. Each card shows the new size.', hash: '', steps: async (p) => { await openSection(p, 'Output settings'); await pickFormat(p, 'WebP'); await p.locator('.primary-button').click(); await p.locator('.primary-button', { hasText: /download \d+ as webp/i }).waitFor({ timeout: 60000 }); await sleep(300); } },
  // optimize
  { id: 'optimize-start', group: 'optimize', title: 'Optimize images', note: 'Two presets. The button stays off until the box is ticked. Make a copy of the file first.', hash: 'view=optimize' },
  { id: 'optimize-ready', group: 'optimize', title: 'Confirmed', note: 'The count is the images that can be optimized: JPEG, PNG and BMP.', hash: 'view=optimize', steps: async (p) => { await p.locator('.notice-agree input').check(); } },
  { id: 'optimize-running', group: 'optimize', title: 'Optimizing', note: 'One image at a time, in order, so each stays where it was.', hash: 'view=optimize', steps: async (p) => { await p.locator('.notice-agree input').check(); await p.getByRole('button', { name: /^optimize \d+ images?$/i }).click(); await p.getByText(/optimizing image/i).waitFor({ timeout: 30000 }); } },
  { id: 'optimize-done', group: 'optimize', title: 'Done', note: 'Shows the space saved. The list rescans afterwards.', hash: 'view=optimize', steps: async (p) => { await p.locator('.notice-agree input').check(); await p.getByRole('button', { name: /^optimize \d+ images?$/i }).click(); await p.getByText(/replaced \d+ image|nothing needed/i).waitFor({ timeout: 30000 }); } },
  // menu
  { id: 'menu-open', group: 'menu', title: 'Menu', note: 'Theme, optimize, close, log out, and the privacy policy and terms.', hash: '', steps: async (p) => { await p.getByRole('button', { name: 'More options' }).click(); await sleep(200); } },
  // slides
  { id: 'slides-list', group: 'slides', title: 'Slides image list', note: 'In a deck the images are the pictures on each slide, named slide-03-image-01.', hash: 'host=slides' },
  { id: 'slides-alt', group: 'slides', title: 'Alt text in Slides', note: 'The save button says deck.', hash: 'host=slides', steps: async (p) => { await row(p, 0).getByRole('button', { name: /^edit$/i }).click(); } },
  { id: 'slides-output', group: 'slides', title: 'Output settings in Slides', note: 'No Markdown option: that export is for Docs.', hash: 'host=slides', steps: async (p) => { await openSection(p, 'Output settings'); } },
  { id: 'slides-optimize', group: 'slides', title: 'Optimize in Slides', note: 'Each picture is swapped inside its own box.', hash: 'host=slides&view=optimize' },
];

// ---- capture ----------------------------------------------------------------------------------------------------
async function capture() {
  await mkdir(RAW, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const theme of THEMES) {
    const context = await browser.newContext({ viewport: { width: 300, height: 680 }, deviceScaleFactor: 2, colorScheme: theme });
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(BASE).origin });
    const page = await context.newPage();
    let n = 0;
    for (const state of STATES) {
      n += 1;
      await page.goto(`${BASE}?s=${theme}${n}#${state.hash}`);
      await page.waitForSelector('.app-shell');
      await sleep(state.wait || 700);
      if (state.steps) await state.steps(page);
      await sleep(450);
      await page.screenshot({ path: join(RAW, `${state.id}-${theme}.png`) });
      console.log(`${theme} ${state.id}`);
    }
    await context.close();
  }
  await browser.close();
}

// ---- build ------------------------------------------------------------------------------------------------------
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const b64 = (buffer) => buffer.toString('base64');

async function build() {
  const font = b64(await readFile(resolve('marketing/webflow/fonts/PPNeueMontreal-Medium.ttf')));
  const image = async (id, theme) => {
    const png = join(RAW, `${id}-${theme}.png`);
    const webp = png.replace(/\.png$/, '.webp');
    execFileSync('cwebp', ['-quiet', '-q', '84', png, '-o', webp]);
    return b64(await readFile(webp));
  };

  const figures = [];
  const byGroup = Object.fromEntries(GROUPS.map(([id]) => [id, []]));
  for (const state of STATES) {
    const [dark, light] = await Promise.all(THEMES.map((theme) => image(state.id, theme)));
    byGroup[state.group].push(`
      <figure id="${state.id}">
        <div class="frame"><img class="shot-dark" alt="${esc(state.title)}, dark theme" width="300" height="680" loading="lazy" src="data:image/webp;base64,${dark}"><img class="shot-light" alt="${esc(state.title)}, light theme" width="300" height="680" loading="lazy" src="data:image/webp;base64,${light}"></div>
        <figcaption><strong>${esc(state.title)}</strong><span>${esc(state.note)}</span></figcaption>
      </figure>`);
    figures.push(state.id);
  }

  const nav = GROUPS.map(([id, title]) => `<a href="#${id}">${esc(title)}</a>`).join('');
  const sections = GROUPS.map(([id, title, intro]) => `
    <section id="${id}">
      <h2>${esc(title)}</h2>
      <p class="intro">${esc(intro)}</p>
      <div class="grid">${byGroup[id].join('')}</div>
    </section>`).join('');

  const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pluckr sidebar states</title>
<style>
@font-face { font-family: "PP Neue Montreal"; src: url(data:font/ttf;base64,${font}) format("truetype"); font-weight: 500; font-display: swap; }
:root { --bg: #000; --panel: #0d0d0d; --text: #fff; --muted: rgba(255,255,255,0.6); --line: rgba(255,255,255,0.12); --blue: #0062fb; }
:root[data-theme="light"] { --bg: #fff; --panel: #fafafa; --text: #0a0a0a; --muted: rgba(10,10,10,0.6); --line: rgba(10,10,10,0.12); }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 88px; }
body { margin: 0; background: var(--bg); color: var(--text); font: 500 15px/1.5 "PP Neue Montreal", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
header { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 24px; padding: 14px 32px; background: var(--bg); border-bottom: 1px solid var(--line); }
header h1 { margin: 0; font-size: 16px; font-weight: 500; white-space: nowrap; }
nav { display: flex; flex: 1; gap: 18px; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
nav a { color: var(--muted); font-size: 13px; text-decoration: none; }
nav a:hover { color: var(--text); }
.theme { display: flex; gap: 6px; }
.theme button { padding: 7px 12px; border: 1px solid var(--line); border-radius: 8px; background: transparent; color: var(--muted); font: inherit; font-size: 12px; cursor: pointer; }
.theme button[aria-pressed="true"] { border-color: var(--text); color: var(--text); }
main { max-width: 1480px; margin: 0 auto; padding: 56px 32px 96px; }
.lede { max-width: 640px; margin: 0 0 72px; color: var(--muted); font-size: 17px; }
.lede strong { color: var(--text); font-weight: 500; }
section { margin-bottom: 88px; }
h2 { margin: 0 0 6px; font-size: 28px; font-weight: 500; letter-spacing: -0.01em; }
.intro { max-width: 620px; margin: 0 0 32px; color: var(--muted); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, 300px); gap: 40px 32px; }
figure { margin: 0; width: 300px; }
.frame { overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); }
.frame img { display: block; width: 300px; height: auto; }
.shot-light { display: none; }
:root[data-theme="light"] .shot-dark { display: none; }
:root[data-theme="light"] .shot-light { display: block; }
figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 14px; }
figcaption strong { font-weight: 500; }
figcaption span { color: var(--muted); font-size: 13px; }
@media (max-width: 700px) { header { padding: 12px 16px; gap: 12px; } main { padding: 32px 16px 64px; } .grid { grid-template-columns: 1fr; justify-items: center; } }
</style>
</head>
<body>
<header>
  <h1>Pluckr sidebar</h1>
  <nav>${nav}</nav>
  <div class="theme" role="group" aria-label="Theme"><button type="button" data-theme-button="dark" aria-pressed="true">Dark</button><button type="button" data-theme-button="light" aria-pressed="false">Light</button></div>
</header>
<main>
  <p class="lede"><strong>Every screen and state of the sidebar, ${STATES.length} in all, in both themes.</strong> They are screenshots of the real sidebar at the width Docs and Slides give it, 300 px. Regenerate them with <code>node scripts/sidebar-states.mjs</code>.</p>
  ${sections}
</main>
<script>
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-theme-button]')];
  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeButton === theme)));
    try { localStorage.setItem('pluckr-states-theme', theme); } catch (error) { /* private window */ }
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.themeButton)));
  try { apply(localStorage.getItem('pluckr-states-theme') || 'dark'); } catch (error) { /* keep dark */ }
</script>
</body>
</html>
`;
  await writeFile(OUT, html);
  console.log(`wrote ${OUT} (${(html.length / 1024 / 1024).toFixed(1)} MB, ${STATES.length} states)`);
}

if (process.argv[2] !== 'build') await capture();
await build();
