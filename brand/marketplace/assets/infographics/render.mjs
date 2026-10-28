import { chromium } from 'playwright-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
for (const n of ['weight', 'checklist']) {
  await p.goto('file://' + resolve(here, n + '.html'));
  await p.screenshot({ path: resolve(here, n + '.png') });
}
await b.close();
