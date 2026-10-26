#!/usr/bin/env python3
"""A new-layout homepage preview: pluckr.webflow/home-v4.html (not linked, noindex).

    python3 scripts/build-home-v4.py

Keeps the site's head, nav, FAQ and footer from index.html and replaces the body with new sections:
a hero whose artifact is the Docs window with the flying images (an iframe of hero-flip.html, cut off at the fold),
a then-and-now file listing, a measured format chart, a strip of real sidebar screens, a Doc-to-Markdown spread,
and a one-number price block. The sizes in the page are measured here (cwebp, libjpeg), not typed in.
"""
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "pluckr.webflow"
src = (SITE / "index.html").read_text()
RAW = Path(
    "/private/tmp/claude-501/-Users-noman-Projects-WIP-pluckr/1fc8a230-d629-48c4-93c7-21c570896bfd/scratchpad/pluckr-sidebar-states"
)


# ---- measured numbers ---------------------------------------------------------------------------------------------
def measure(photo):
    """16:9 centre crop of a sample photo; sizes in KB for PNG, JPEG q80 and WebP q80."""
    im = Image.open(SITE / "images" / "v2" / f"{photo}.jpg").convert("RGB")
    w, h = im.size
    ch = round(w * 9 / 16)
    top = (h - ch) // 2
    crop = im.crop((0, top, w, top + ch))
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        crop.save(tmp / "a.png", optimize=True)
        crop.save(tmp / "a.jpg", quality=80, optimize=True)
        subprocess.run(["cwebp", "-quiet", "-q", "80", str(tmp / "a.png"), "-o", str(tmp / "a.webp")], check=True)
        return {k: round((tmp / f"a.{k}").stat().st_size / 1024) for k in ("png", "jpg", "webp")}


sizes = {p: measure(p) for p in ("lake", "library", "building")}
lake = sizes["lake"]
pct = lambda v: f"{v / lake['png'] * 100:.1f}"

# ---- sidebar screens for the strip ---------------------------------------------------------------------------------
STRIP = [
    ("list-alt-edit", "Alt text", "See which images have no alt text and write it in the sidebar."),
    ("selection-filter", "Pick", "Tick only the images you need, or filter to the ones missing alt text."),
    ("rename-pattern", "Rename", "One pattern for every file name, with a preview before you apply it."),
    ("output-webp", "Convert", "WebP, AVIF, JPEG or PNG, with quality, aspect ratio and maximum width."),
    ("optimize-done", "Shrink", "Replace the heavy pictures inside the Doc itself with smaller copies."),
    ("slides-list", "Slides", "The same sidebar in a deck: every picture on every slide."),
]
out_img = SITE / "images" / "v4"
out_img.mkdir(parents=True, exist_ok=True)
strip_html = []
for key, title, text in STRIP:
    png = RAW / f"{key}-dark.png"
    webp = out_img / f"sidebar-{key}.webp"
    subprocess.run(["cwebp", "-quiet", "-q", "84", str(png), "-o", str(webp)], check=True)
    strip_html.append(
        f"""<figure class="v4-shot"><img src="images/v4/{webp.name}" width="300" height="680" loading="lazy" alt="The Pluckr sidebar: {title.lower()}"><figcaption><strong>{title}</strong><span>{text}</span></figcaption></figure>"""
    )

# The hero artifact is the standalone animation, served beside the page.
shutil.copy(ROOT / "brand" / "hero-flip.html", SITE / "hero-flip.html")


# ---- pieces taken from the current homepage -------------------------------------------------------------------------
def between(text, start, end, include_end=True):
    a = text.index(start)
    b = text.index(end, a)
    return text[a : b + (len(end) if include_end else 0)]


head_and_nav = src[: src.index('<main id="main"')]
faq = between(src, '<section class="u-section" id="faqs">', "</section>")
after_main = src[src.index("</main>") :]
button = between(src, '<div class="u-button-wrapper">', "Add to Google Docs</div>\n                    </div>\n                  </div>\n                </div>\n              </div>")
button = button.replace('href="#how-it-works"', 'href="#how-it-works"')

# ---- head tweaks: a preview, not the page search should index ----------------------------------------------------------
head_and_nav = re.sub(r"<title>.*?</title>", "<title>Pluckr (layout preview)</title>", head_and_nav, count=1)
head_and_nav = head_and_nav.replace("</head>", '  <meta name="robots" content="noindex">\n  <style>\n@@CSS@@\n  </style>\n</head>', 1)

css = """
.v4 { background: #000; color: #fff; font-family: "PP Neue Montreal", "Helvetica Neue", Arial, sans-serif; font-weight: 500; -webkit-font-smoothing: antialiased; }
.v4 * { box-sizing: border-box; }
.v4 a { color: inherit; }
.v4 p, .v4 h1, .v4 h2, .v4 h3, .v4 figure { margin: 0; }
.v4-wrap { width: min(1280px, 100% - 48px); margin-inline: auto; }
.v4 h2, .v4 h3, .v4 h4 { text-transform: none; }
.v4 h2 + .lede { margin-top: 28px !important; }
.v4 h2 { max-width: 21ch; font-size: clamp(34px, 5vw, 76px); font-weight: 500; line-height: 1; letter-spacing: -0.025em; }
.v4 .lede { max-width: 560px; margin-top: 20px; color: rgba(255, 255, 255, 0.62); font-size: clamp(16px, 1.4vw, 19px); line-height: 1.45; }
.v4 section { padding-block: clamp(72px, 10vw, 150px) 0; }

/* Hero: the headline across the top, the Docs window under it, cut off by the fold. */
.v4-hero { padding-top: clamp(56px, 8vw, 120px) !important; overflow: hidden; }
.v4-hero h1 { max-width: 15ch; font-size: clamp(46px, 7.4vw, 116px); font-weight: 500; line-height: 0.95; letter-spacing: -0.035em; text-wrap: balance; }
.v4-hero-row { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 32px; margin-top: clamp(28px, 4vw, 56px); }
.v4-hero .lede { margin-top: 0; max-width: 520px; }
.v4-hero-cta { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.v4-note { color: rgba(255, 255, 255, 0.55); font-size: 13px; }
.v4-window { position: relative; width: min(1100px, 100%); margin: clamp(40px, 6vw, 80px) auto 0; aspect-ratio: 1000 / 700; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); border-bottom: 0; border-radius: 18px 18px 0 0; background: #0a0a0a; }
.v4-window iframe { display: block; width: 100%; height: 138%; border: 0; }

/* Then and now: two real file listings. */
.v4-split { display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-top: clamp(36px, 5vw, 72px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; overflow: hidden; }
.v4-then, .v4-now { padding: clamp(20px, 3vw, 40px); }
.v4-now { background: #0d0d0d; border-left: 1px solid rgba(255, 255, 255, 0.1); }
.v4-split h3 { font-size: 15px; font-weight: 500; color: rgba(255, 255, 255, 0.6); }
.v4-now h3 { color: #fff; }
.v4-files { margin: 22px 0 0; padding: 0; list-style: none; font: 400 15px/1.9 ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
.v4-files li { display: flex; justify-content: space-between; gap: 16px; }
.v4-then .v4-files { color: rgba(255, 255, 255, 0.5); }
.v4-files span:last-child { color: rgba(255, 255, 255, 0.55); white-space: nowrap; }
.v4-now .v4-files span:last-child { color: #5aa2ff; }
.v4-split p.v4-cap { margin-top: 22px; font-size: 14px; line-height: 1.5; color: rgba(255, 255, 255, 0.55); }

/* The format chart: bars drawn to scale from measured files. */
.v4-chart { margin-top: clamp(36px, 5vw, 64px); display: grid; gap: 14px; }
.v4-bar { display: grid; grid-template-columns: 90px 1fr 90px; align-items: center; gap: 18px; font-size: 16px; }
.v4-bar > span:first-child { color: rgba(255, 255, 255, 0.7); }
.v4-bar > span:last-child { text-align: right; font-variant-numeric: tabular-nums; }
.v4-bar i { display: block; width: var(--w); min-width: 6px; height: 34px; border-radius: 6px; background: rgba(255, 255, 255, 0.18); }
.v4-bar.is-best i { background: #0062fb; }
.v4 p.v4-source { margin-top: 26px; max-width: 640px; color: rgba(255, 255, 255, 0.5); font-size: 13px; line-height: 1.5; }
.v4 a.v4-link { display: inline-block; margin-top: 22px; font-size: 15px; }

/* The strip: real sidebar screens, scrolling sideways. */
.v4-stripwrap { margin-top: clamp(36px, 5vw, 64px); }
.v4-strip { display: flex; gap: 28px; padding: 0 max(24px, calc((100% - 1280px) / 2)) 28px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) transparent; }
.v4-shot { flex: none; width: 300px; scroll-snap-align: start; }
.v4-shot img { display: block; width: 300px; height: auto; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; }
.v4-shot figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 14px; }
.v4-shot figcaption span { color: rgba(255, 255, 255, 0.58); font-size: 14px; line-height: 1.4; }

/* Doc to Markdown: three artifacts in a row. */
.v4-md { display: grid; grid-template-columns: 1.1fr 1.2fr 0.8fr; gap: 20px; margin-top: clamp(36px, 5vw, 64px); align-items: start; }
.v4-paper { padding: 28px 30px; border-radius: 6px; background: #fff; color: #202124; font: 400 14px/1.55 Arial, "Helvetica Neue", sans-serif; }
.v4-paper h4 { margin: 0 0 10px; font-size: 24px; font-weight: 400; line-height: 1.2; }
.v4-paper p { margin: 0 0 12px; }
.v4-paper img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 2px; }
.v4-code { margin: 0; padding: 26px 28px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; background: #0d0d0d; font: 400 14px/1.7 ui-monospace, "SF Mono", Menlo, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; color: rgba(255, 255, 255, 0.85); }
.v4-code b { font-weight: 400; color: #5aa2ff; }
.v4-tree { margin: 0; padding: 26px 24px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; font: 400 14px/1.8 ui-monospace, "SF Mono", Menlo, Consolas, monospace; color: rgba(255, 255, 255, 0.85); white-space: pre; overflow-x: auto; }
.v4-label { margin-bottom: 12px; color: rgba(255, 255, 255, 0.5); font-size: 13px; }

/* Price: one number. */
.v4-price { display: grid; grid-template-columns: auto 1fr; align-items: end; gap: clamp(28px, 6vw, 96px); margin-top: clamp(24px, 4vw, 48px); }
.v4-big { font-size: clamp(120px, 22vw, 320px); line-height: 0.8; letter-spacing: -0.05em; }
.v4-price ul { margin: 0 0 0 0; padding: 0; list-style: none; display: grid; gap: 14px; font-size: clamp(18px, 2vw, 26px); line-height: 1.25; }
.v4-price li { padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.14); }
.v4-price .u-button-wrapper { margin-top: 28px; }

.v4 #faqs { padding-top: clamp(72px, 10vw, 150px); padding-bottom: clamp(72px, 10vw, 140px); }
.v4 #faqs .u-container { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 96px); align-items: start; width: min(1280px, 100% - 48px); max-width: none; margin-inline: auto; padding-inline: 0; }
.v4 #faqs .u-content-wrapper { position: sticky; top: 40px; }
.v4 #faqs h2 { margin-bottom: 24px; line-height: 1.02; }
.v4 #faqs h2 + p { color: rgba(255, 255, 255, 0.62); }
@media (max-width: 900px) {
  .v4-split, .v4-md { grid-template-columns: 1fr; }
  .v4-now { border-left: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .v4-bar { grid-template-columns: 64px 1fr 72px; gap: 12px; font-size: 14px; }
  .v4-price { grid-template-columns: 1fr; }
  .v4 #faqs .u-container { grid-template-columns: 1fr; }
  .v4 #faqs .u-content-wrapper { position: static; }
  .v4 h2 { max-width: 20ch; }
}
"""

# ---- the new body -------------------------------------------------------------------------------------------------------
files_then = "".join(f"<li><span>image{i}.png</span><span></span></li>" for i in range(1, 8))
files_then += "<li><span>…</span><span></span></li>"
now_rows = [("lake", "01"), ("library", "02"), ("building", "03")]
files_now = "".join(
    f"<li><span>west-coast-road-trip-{n}.webp</span><span>{sizes[p]['webp']} KB</span></li>" for p, n in now_rows
)
files_now += "<li><span>images-metadata.csv</span><span>alt text</span></li><li><span>content.md</span><span>Markdown</span></li>"

body = f"""
<main id="main" class="page_main v4">
  <section class="v4-hero">
    <div class="v4-wrap">
      <h1>Pluck every image out of a Google Doc</h1>
      <div class="v4-hero-row">
        <p class="lede">Extract every image from a Google Doc or Slides deck. Rename them in bulk, convert to WebP or AVIF, and keep the alt text.</p>
        <div class="v4-hero-cta">
          {button}
          <span class="v4-note">One-time $5. Your images never leave your browser.</span>
        </div>
      </div>
    </div>
    <div class="v4-wrap">
      <div class="v4-window"><iframe src="hero-flip.html" title="The images of a Google Doc fly into the Pluckr sidebar, where they are listed and converted" loading="eager"></iframe></div>
    </div>
  </section>

  <section id="then-and-now">
    <div class="v4-wrap">
      <h2>Stop opening image7.png to find out what it is</h2>
      <p class="lede">Google Docs has no button to save all the images. The built-in download gives you a folder of generic names. Pluckr gives you files you can use.</p>
      <div class="v4-split">
        <div class="v4-then">
          <h3>File, Download, Web page (.html, zipped)</h3>
          <ul class="v4-files">{files_then}</ul>
          <p class="v4-cap">An HTML file you did not want, a folder of numbered images, no previews, no alt text.</p>
        </div>
        <div class="v4-now">
          <h3>Extensions, Pluckr, Extract images</h3>
          <ul class="v4-files">{files_now}</ul>
          <p class="v4-cap">Named by one pattern, converted to WebP and cropped to 16:9. Sizes measured on our three sample photos.</p>
        </div>
      </div>
      <a class="v4-link" href="/guides/download-all-images-from-google-docs">How to download all images from a Google Doc, four ways</a>
    </div>
  </section>

  <section id="formats">
    <div class="v4-wrap">
      <h2>Convert Google Docs images to WebP: {lake['png']} KB becomes {lake['webp']} KB</h2>
      <p class="lede">Docs images are often PNGs. WebP and AVIF keep the look at a fraction of the size, so pages load faster and uploads fit.</p>
      <div class="v4-chart" role="img" aria-label="File sizes of the same photo: PNG {lake['png']} KB, JPEG {lake['jpg']} KB, WebP {lake['webp']} KB">
        <div class="v4-bar"><span>PNG</span><i style="--w: 100%"></i><span>{lake['png']} KB</span></div>
        <div class="v4-bar"><span>JPEG</span><i style="--w: {pct(lake['jpg'])}%"></i><span>{lake['jpg']} KB</span></div>
        <div class="v4-bar is-best"><span>WebP</span><i style="--w: {pct(lake['webp'])}%"></i><span>{lake['webp']} KB</span></div>
      </div>
      <p class="v4-source">One of our sample photos, cropped to 16:9 (1000 × 562 px), quality 80, measured with cwebp and libjpeg. Your results depend on the image and the settings. AVIF is usually smaller still; try it on your own images.</p>
      <a class="v4-link" href="/convert-google-docs-images-to-webp">How to convert Google Docs images to WebP or AVIF</a>
    </div>
  </section>

  <section id="how-it-works">
    <div class="v4-wrap">
      <h2>Pick, rename, crop and convert from one sidebar</h2>
      <p class="lede">Open Extensions, Pluckr, Extract images in a Doc or Slides deck. This is the whole sidebar, state by state, at the width Google gives it.</p>
    </div>
    <div class="v4-stripwrap"><div class="v4-strip">{''.join(strip_html)}</div></div>
  </section>

  <section id="markdown">
    <div class="v4-wrap">
      <h2>Export a Google Doc as Markdown, with its images</h2>
      <p class="lede">Tick one box and the download holds a content.md, an images folder and the alt text, ready for a blog, a static site or Obsidian.</p>
      <div class="v4-md">
        <div><div class="v4-label">In the Google Doc</div>
          <div class="v4-paper"><h4>West Coast Road Trip</h4><p>Seventy-two hours, four people and one car.</p><img src="images/v2/lake.jpg" alt="Loch shore with snow-capped mountain"></div></div>
        <div><div class="v4-label">content.md</div>
          <pre class="v4-code"><b>#</b> West Coast Road Trip

Seventy-two hours, four people and one car.

<b>![</b>Loch shore with snow-capped mountain<b>](</b>./images/west-coast-road-trip-01.webp<b>)</b></pre></div>
        <div><div class="v4-label">In your download</div>
          <pre class="v4-tree">content.md
images-metadata.csv
images-metadata.json
images/
  west-coast-road-trip-01.webp
  west-coast-road-trip-02.webp
  west-coast-road-trip-03.webp</pre></div>
      </div>
    </div>
  </section>

  <section id="pricing">
    <div class="v4-wrap">
      <h2 class="u-sr-only">Pluckr pricing: $5 once, no subscription</h2>
      <div class="v4-price">
        <div class="v4-big">$5</div>
        <div>
          <ul>
            <li>Once. No subscription.</li>
            <li>Google Docs and Google Slides, one purchase.</li>
            <li>Refunds within 14 days.</li>
            <li>Your images stay in your browser.</li>
          </ul>
          {button}
        </div>
      </div>
    </div>
  </section>

  {faq}
</main>
"""

html = head_and_nav.replace("@@CSS@@", css) + body + after_main
out = SITE / "home-v4.html"
out.write_text(html)
print(f"wrote {out} ({len(html) / 1024:.0f} KB); sizes: {sizes}")
