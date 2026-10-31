// Uploads brand/marketplace/assets/sample-blog-draft.docx to Google Drive and converts it to a Google Doc.
//   node scripts/upload-sample-doc.mjs
// Uses the same signed-in Chrome profile as marketplace-screenshots.mjs (.secrets/playwright-profile).
// If Google asks you to sign in, do it yourself in the window; the script waits. Prints the new Doc's URL.
import { chromium } from 'playwright-core';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, '../brand/marketplace/assets/sample-blog-draft.docx');
const context = await chromium.launchPersistentContext(resolve(__dirname, '../../.secrets/playwright-profile'), {
  channel: 'chrome',
  headless: false,
  viewport: { width: 1280, height: 800 },
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled'],
});
const page = context.pages()[0] ?? (await context.newPage());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  await page.goto('https://drive.google.com/drive/my-drive');
  if (!/drive\.google\.com\/drive/.test(page.url())) console.log('Sign in to Google in the Chrome window. Waiting...');
  await page.waitForURL(/drive\.google\.com\/drive/, { timeout: 10 * 60_000 });
  await sleep(4000);
  console.log('signed in at', page.url());
  // New > File upload
  await page.getByRole('button', { name: /^New$/ }).click();
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('menuitem', { name: /File upload/ }).click(),
  ]);
  await chooser.setFiles(FILE);
  await page.getByText(/1 upload complete|Upload complete/i).first().waitFor({ timeout: 120_000 });
  await sleep(1500);
  // Open the uploaded .docx with Google Docs, then convert it with File > Save as Google Docs.
  await page.goto('https://drive.google.com/drive/recent');
  const row = page.locator('[data-id]', { hasText: 'sample-blog-draft.docx' }).first();
  await row.waitFor({ timeout: 60_000 });
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: /Open with/ }).hover();
  await page.getByRole('menuitem', { name: /Google Docs/ }).first().click();
  let docPage = page;
  for (let i = 0; i < 60 && !/docs\.google\.com\/document/.test(docPage.url()); i += 1) {
    docPage = context.pages().find((p) => /docs\.google\.com\/document/.test(p.url())) ?? page;
    await sleep(500);
  }
  await docPage.waitForSelector('#docs-menubar', { timeout: 120_000 });
  await docPage.locator('#docs-file-menu').click();
  await docPage.getByRole('menuitem', { name: /Save as Google Docs/ }).click();
  await docPage.waitForURL((u) => !/\/edit/.test(u.href) || true, { timeout: 5000 }).catch(() => {});
  await sleep(8000);
  const converted = context.pages().map((p) => p.url()).filter((u) => /docs\.google\.com\/document\/d\//.test(u));
  console.log('Doc URLs:', converted.join('\n'));
} finally {
  await context.close();
}
