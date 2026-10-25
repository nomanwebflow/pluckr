// Takes the Marketplace screenshots (1280x800, real Docs and Slides files) with Playwright and the installed Chrome.
//   node scripts/marketplace-screenshots.mjs docs   [doc-url]
//   node scripts/marketplace-screenshots.mjs slides [deck-url]
// A Chrome window opens. If it asks you to sign in to Google, do it yourself in that window; the script waits.
// The sign-in is kept in .secrets/playwright-profile (git-ignored) so later runs do not ask again.
// Output: brand/marketplace/shots/<name>.png. `scripts/marketplace-shots.py` then picks, numbers and blurs them.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const MODE = process.argv[2] === 'slides' ? 'slides' : 'docs';
const URLS = {
  docs: 'https://docs.google.com/document/d/1hVJjoBh2O_wLD5wSjhVIaJNdC7ERmdxTRBsYBbdks68/edit',
  slides: 'https://docs.google.com/presentation/d/1GO2PMFy3-fSUK-_ufhNdm4bNmDVAk12rp2NDqe0kums/edit',
};
const TARGET = process.argv[3] || URLS[MODE];
const OUT = resolve('brand/marketplace/shots');
await mkdir(OUT, { recursive: true });

const context = await chromium.launchPersistentContext(resolve('.secrets/playwright-profile'), {
  channel: 'chrome',
  headless: false,
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
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
  const editor = MODE === 'docs' ? /docs\.google\.com\/document\/d\// : /docs\.google\.com\/presentation\/d\//;
  if (!editor.test(page.url())) console.log('Sign in to Google in the Chrome window. Waiting...');
  await page.waitForURL(editor, { timeout: 10 * 60_000 });
  await page.waitForSelector('#docs-menubar', { timeout: 120_000 });
  await sleep(3000);

  // Open the add-on: Docs has its own Pluckr menu, Slides puts it under Extensions.
  if (MODE === 'docs') {
    await page.locator('#docs-menubar .menu-button', { hasText: /^Pluckr$/ }).click();
  } else {
    await page.locator('#docs-menubar .menu-button', { hasText: /^Extensions$/ }).click();
    await page.getByText(/^Pluckr$/).first().click();
  }
  await page.getByText(/Extract images/).first().click();

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
      MODE === 'docs' ? 'Side-by-side X-rays of a healthy neck and forward head posture' : 'Photo album cover picture',
    );
    await firstRow.getByRole('button', { name: /save to (doc|deck)/i }).click();
    await firstRow.getByText(/^Alt: /).waitFor({ timeout: 30_000 });
  }
  await app.locator('.panel').evaluate((el) => { el.scrollTop = 0; });
  await shot(`${MODE}-list`);

  if (MODE === 'docs') {
    // Bulk rename with the preview showing.
    await openSection('Bulk rename');
    await app.locator('#rename-pattern').fill('{doc}-{n}');
    await shot('docs-rename');

    // Output settings: WebP, 16:9, plus the two extra files.
    await openSection('Output settings');
    await section('Output settings').locator('.select-button').nth(0).click();
    await app.getByRole('option', { name: 'WebP' }).click();
    await section('Output settings').locator('.select-button').nth(1).click();
    await app.getByRole('option', { name: '16:9' }).click();
    for (const label of [/alt text files/i, /as Markdown/i]) {
      const box = app.locator('label.notice-agree', { hasText: label }).locator('input');
      if (!(await box.isChecked())) await box.check();
    }
    await shot('docs-settings');

    // Convert and show the new file sizes.
    await app.locator('.primary-button').click();
    await app.locator('.primary-button', { hasText: /download \d+/i }).waitFor({ timeout: 240_000 });
    await app.locator('.image-info').first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await shot('docs-converted');

    // Light theme at the full list.
    await section('Output settings').locator('.export-toggle').click();
    await sleep(700);
    await app.locator('.panel').evaluate((el) => { el.scrollTop = 0; });
    await setTheme('light');
    await shot('docs-light');
  }

  await setTheme(original);
} finally {
  await context.close();
}
