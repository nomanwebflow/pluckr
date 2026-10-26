// Records one seamless loop of the white Docs window in brand/hero-flip.html as an mp4: brand/hero-flip.mp4.
//   node scripts/record-hero-flip.mjs          (needs Chrome, ffmpeg)
// The window is drawn at SCALE (default 2) times its 900 x 860 size, so the video is 1800 x 1720. Frames come from the
// browser's screencast with their timestamps, are cut between two loop starts, and ffmpeg makes them a 30 fps video.
import { chromium } from 'playwright-core';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PAGE = resolve('brand/hero-flip.html');
const OUT = resolve('brand/hero-flip.mp4');
const TMP = join(process.env.RECORD_TMP || tmpdir(), 'pluckr-hero-flip-frames');
await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

const SCALE = Number(process.env.SCALE || 2); // the window is drawn at this many times its 900 x 860
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 900 * SCALE, height: 860 * SCALE }, deviceScaleFactor: 1 });
const page = await context.newPage();

// Show only the white window, at its natural size, and note each time a loop starts (the scan message resets).
await page.addInitScript((scale) => {
  window.__marks = [];
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.credit { display: none !important; } .hero3 .stage { padding: 0 !important; } #stage { --s: ' + scale + ' !important; } .hero3 .cursor { width: calc(26px * var(--s)) !important; height: calc(26px * var(--s)) !important; }';
    document.head.appendChild(style);
    const scan = document.getElementById('scan');
    new MutationObserver(() => { if (scan.style.opacity === '1') window.__marks.push(Date.now() / 1000); }).observe(scan, { attributes: true, attributeFilter: ['style'] });
  });
}, SCALE);

const client = await context.newCDPSession(page);
const frames = [];
client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  frames.push({ t: metadata.timestamp, data });
  await client.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await page.goto(pathToFileURL(PAGE).href);
await client.send('Page.startScreencast', { format: 'jpeg', quality: 100, everyNthFrame: 1 });

// Record until the second loop has started (the first start is the page load itself).
const t0 = Date.now();
let marks = [];
while (Date.now() - t0 < 240000) {
  await new Promise((r) => setTimeout(r, 500));
  marks = await page.evaluate(() => window.__marks);
  // Marks come once per reset; one reset at load, then one per loop. Wait for the third to be sure the second is complete.
  if (marks.length >= 3) break;
}
await client.send('Page.stopScreencast');
await browser.close();
console.log('marks', marks.map((m) => (m - marks[0]).toFixed(1)).join(' '), 'frames', frames.length, 'elapsed', ((Date.now() - t0) / 1000).toFixed(0), 's');
if (marks.length < 3) throw new Error(`Only saw ${marks.length} loop starts; the loop did not repeat in time.`);
console.log('loop starts at', marks.map((m) => m.toFixed(2)).join(', '));

// The loop is from the second start to the third: the same state the video begins and ends in.
// (The first reset is the load and may be followed by a second one straight away, so take the last two marks.)
const start = marks[marks.length - 2];
const end = marks[marks.length - 1];
const loop = frames.filter((f) => f.t >= start - 0.05 && f.t < end);
if (loop.length < 100) throw new Error(`Too few frames (${loop.length}).`);

const lines = [];
for (let i = 0; i < loop.length; i += 1) {
  const name = `f${String(i).padStart(6, '0')}.jpg`;
  await writeFile(join(TMP, name), Buffer.from(loop[i].data, 'base64'));
  const next = i + 1 < loop.length ? loop[i + 1].t : end;
  lines.push(`file '${name}'`, `duration ${Math.max(0.001, next - loop[i].t).toFixed(4)}`);
}
lines.push(`file 'f${String(loop.length - 1).padStart(6, '0')}.jpg'`); // concat needs the last file repeated
await writeFile(join(TMP, 'list.txt'), lines.join('\n'));

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(TMP, 'list.txt'),
  '-vf', 'fps=30,scale=in_range=full:out_range=limited,format=yuv420p', '-color_range', 'tv', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', OUT,
], { stdio: 'inherit' });
console.log(`wrote ${OUT}: ${loop.length} captured frames over ${(end - start).toFixed(1)} s`);
