// Takes the Marketplace screenshots (1280x800, real Docs and Slides files) with Playwright and the installed Chrome.
//   node scripts/marketplace-screenshots.mjs docs   [doc-url]   (the new sidebar: alt text, bulk rename, Markdown)
//   node scripts/marketplace-screenshots.mjs live   <doc-url>    (the published script version 2: list, settings, converted, light)
//   node scripts/marketplace-screenshots.mjs slides [deck-url]
// Runs hidden. If it asks you to sign in to Google, rerun with SHOW_BROWSER=1 and sign in yourself in the window; the script waits.
// The sign-in is kept in .secrets/playwright-profile (git-ignored) so later runs do not ask again.
// Output: brand/marketplace/shots/<name>.png. `scripts/marketplace-shots.py` then picks, numbers and blurs them.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODE = ['slides', 'live'].includes(process.argv[2]) ? process.argv[2] : 'docs';
const URLS = {
  docs: 'https://docs.google.com/document/d/1yntVX-3Y_S3z2WQSKecH7vav1n04_HtDD0Y5Fg3-UpY/edit',
  live: 'https://docs.google.com/document/d/1yntVX-3Y_S3z2WQSKecH7vav1n04_HtDD0Y5Fg3-UpY/edit',
  slides: 'https://docs.google.com/presentation/d/1GO2PMFy3-fSUK-_ufhNdm4bNmDVAk12rp2NDqe0kums/edit',
};
const TARGET = process.argv[3] || URLS[MODE];
const OUT = resolve(__dirname, '../brand/marketplace/shots');
await mkdir(OUT, { recursive: true });

const context = await chromium.launchPersistentContext(resolve(__dirname, '../../.secrets/playwright-profile'), {
  channel: 'chrome',
  headless: !process.env.SHOW_BROWSER, // set SHOW_BROWSER=1 to watch, or to sign in to Google
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2, // 2560x1600 files; marketplace-shots.py scales them to 1280x800 for the upload
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled'],
});
const page = context.pages()[0] ?? (await context.newPage());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (name) => {
  await sleep(900);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`saved ${name}.png`);
};

try {
  await page.goto(TARGET);
  const editor = MODE !== 'slides' ? /docs\.google\.com\/document\/d\// : /docs\.google\.com\/presentation\/d\//;
  if (!editor.test(page.url())) console.log('Sign in to Google in the Chrome window. Waiting...');
  await page.waitForURL(editor, { timeout: 10 * 60_000 });
  await page.waitForSelector('#docs-menubar', { timeout: 120_000 });
  await sleep(3000);
  // A neutral title for the screenshots.
  const title = page.locator('input.docs-title-input');
  if (/^sample-blog-draft/.test(await title.inputValue())) {
    await title.click();
    await title.fill('Blog draft: image SEO');
    await title.press('Enter');
    await sleep(1500);
  }

  // Open the add-on from Extensions > Pluckr (both editors).
  // A test deployment puts the menu on the top bar; the published add-on puts it under Extensions.
  const topMenu = page.locator('#docs-menubar .menu-button', { hasText: /^Pluckr$/ });
  if (await topMenu.count()) {
    // At 1280 wide the title bar buttons overlap the last menu, so send the mouse events to the menu itself.
    await topMenu.evaluate((el) => ['mousedown', 'mouseup', 'click'].forEach((type) => el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))));
  } else {
    await page.locator('#docs-menubar .menu-button', { hasText: /^Extensions$/ }).click();
    await page.getByRole('menuitem', { name: /^Pluckr/ }).first().click();
  }
  await page.getByRole('menuitem', { name: /Extract images/ }).first().click();

  // The sidebar is a frame inside a frame; find the one that has the app.
  const findApp = async () => {
    for (const frame of page.frames()) {
      if (await frame.locator('.app-shell').count().catch(() => 0)) return frame;
    }
    return null;
  };
  let app = null;
  for (let i = 0; i < 240 && !app; i += 1) {
    app = await findApp();
    if (!app) await sleep(500);
  }
  if (!app) throw new Error('The Pluckr sidebar did not open.');
  await app.locator('.image-row').first().waitFor({ timeout: 240_000 });
  await sleep(2000);

  // The sidebar remembers the theme, so read it, and put it back at the end.
  const themeOf = () => app.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const setTheme = async (wanted) => {
    if ((await themeOf()) === wanted) return;
    await app.getByRole('button', { name: 'More options' }).click();
    await app.getByRole('menuitem', { name: wanted === 'light' ? /Light mode/i : /Dark mode/i }).click();
    await sleep(800);
  };
  const original = await themeOf();
  const section = (title) => app.locator(`section[aria-label="${title}"]`);
  const openSection = async (title) => {
    const toggle = section(title).locator('.export-toggle');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await sleep(700);
  };

  await setTheme('dark');

  // The first image gets alt text (written to the file) so the list shows it; the others stay without.
  const firstRow = app.locator('.image-row').first();
  if (await firstRow.getByRole('button', { name: /^add alt$/i }).count()) {
    await firstRow.getByRole('button', { name: /^add alt$/i }).click();
    await firstRow.locator('.alt-input').fill(
      MODE === 'slides' ? 'Photo album cover picture' : 'Dashboard showing load time and bounce rate charts',
    );
    await firstRow.getByRole('button', { name: /save to (doc|deck)/i }).click();
    await firstRow.getByText(/^Alt: /).waitFor({ timeout: 30_000 });
  }
  await app.locator('.panel').evaluate((el) => { el.scrollTop = 0; });
  await shot(`${MODE}-list`);

  if (MODE !== 'slides') {
    if (MODE === 'docs') {
      // Bulk rename with the preview showing.
      await openSection('Bulk rename');
      await app.locator('#rename-pattern').fill('{doc}-{n}');
      await shot('docs-rename');
    }

    // Output settings: WebP, 16:9, plus the two extra files.
    await openSection('Output settings');
    await section('Output settings').locator('.select-button').nth(0).click();
    await app.getByRole('option', { name: 'WebP' }).click();
    await section('Output settings').locator('.select-button').nth(1).click();
    await app.getByRole('option', { name: '16:9' }).click();
    for (const label of MODE === 'docs' ? [/alt text files/i, /as Markdown/i] : []) {
      const box = app.locator('label.notice-agree', { hasText: label }).locator('input');
      if (!(await box.isChecked())) await box.check();
    }
    await shot('docs-settings');

    // The light theme on the plain list: close the open sections first so the list has room.
    for (const title of ['Output settings', 'Bulk rename']) {
      const toggle = section(title).locator('.export-toggle');
      if (await toggle.count() && (await toggle.getAttribute('aria-expanded')) === 'true') await toggle.click();
    }
    await sleep(700);
    await app.locator('.panel').evaluate((el) => { el.scrollTop = 0; });
    await setTheme('light');
    await shot('docs-light');
  }

  await setTheme(original);
} finally {
  await context.close();
}
