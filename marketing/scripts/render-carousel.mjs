// Renders one carousel slide (an HTML file with a #slide element, 1080 x 1350) to a PNG next to it.
// Usage: node marketing/scripts/render-carousel.mjs marketing/brand/social/carousel-drive/cover.html
// Needs Google Chrome and playwright-core (already in node_modules).
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import path from "node:path";

const file = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("Pass the slide HTML file.");

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(file).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const out = file.replace(/\.html$/, ".png");
await page.locator("#slide").screenshot({ path: out });
await browser.close();
console.log(out);
