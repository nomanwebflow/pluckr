// Takes the four Marketplace screenshots (1280x800, real Google Docs) with Playwright and the installed Chrome.
//   node scripts/marketplace-screenshots.mjs [doc-url]
// A Chrome window opens. If it asks you to sign in to Google, do it yourself in that window; the script waits.
// The sign-in is kept in .secrets/playwright-profile (git-ignored) so later runs do not ask again.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const DOC = process.argv[2] || 'https://docs.google.com/document/d/1hVJjoBh2O_wLD5wSjhVIaJNdC7ERmdxTRBsYBbdks68/edit';
const OUT = resolve('brand/marketplace/screenshots');
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
const shot = async (n) => {
  await sleep(700);
  await page.screenshot({ path: `${OUT}/screenshot-${n}.png` });
  console.log(`saved screenshot-${n}.png`);
};

try {
  await page.goto(DOC);
  if (!/docs\.google\.com\/document\/d\//.test(page.url())) console.log('Sign in to Google in the Chrome window. Waiting...');
  await page.waitForURL(/docs\.google\.com\/document\/d\//, { timeout: 10 * 60_000 });
  await page.waitForSelector('#docs-menubar', { timeout: 120_000 });
  await sleep(2500);

  // Open the add-on from its menu.
  await page.locator('#docs-menubar .menu-button', { hasText: /^Pluckr$/ }).click();
  await page.getByText(/Extract images/).first().click();

  // The sidebar is a frame inside a frame; find the one that has the app.
  const findApp = async () => {
    for (const frame of page.frames()) {
      if (await frame.locator('.app-shell').count().catch(() => 0)) return frame;
    }
    return null;
  };
  let app = null;
  for (let i = 0; i < 120 && !app; i += 1) {
    app = await findApp();
    if (!app) await sleep(500);
  }
  if (!app) throw new Error('The Pluckr sidebar did not open.');
  await app.locator('.image-row').first().waitFor({ timeout: 120_000 });
  await sleep(1500);

  // The sidebar remembers the theme, so read it, and put it back at the end.
  const themeOf = () => app.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const setTheme = async (wanted) => {
    if ((await themeOf()) === wanted) return;
    await app.getByRole('button', { name: 'More options' }).click();
    await app.getByRole('menuitem', { name: wanted === 'light' ? /Light mode/i : /Dark mode/i }).click();
    await sleep(800);
  };
  const original = await themeOf();

  await setTheme('dark');
  await shot(1); // dark, image list

  // Output settings: WebP, 16:9.
  await app.getByText('Output settings', { exact: false }).first().click();
  await app.locator('.select-button').first().click();
  await app.getByRole('option', { name: 'WebP' }).click();
  await app.locator('.select-button').nth(1).click();
  await app.getByRole('option', { name: '16:9' }).click();
  await shot(2);

  // Convert and show the new file sizes. Collapsing Output settings would switch the settings off, so scroll the list instead.
  await app.locator('.primary-button').click();
  await app.locator('.primary-button', { hasText: /download \d+/i }).waitFor({ timeout: 180_000 });
  await app.locator('.image-info').first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await shot(3);

  // Light theme, back at the full image list (collapsing the settings switches them off, which is what we want here).
  await app.locator('.export-toggle').click();
  await app.locator('.panel').evaluate((el) => { el.scrollTop = 0; });
  await setTheme('light');
  await shot(4);

  await setTheme(original);
} finally {
  await context.close();
}
