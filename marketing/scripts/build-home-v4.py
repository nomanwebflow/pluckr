#!/usr/bin/env python3
"""The new-layout homepage, built from pluckr.webflow/index-v3.html (the previous homepage, kept as the source).

    python3 scripts/build-home-v4.py          writes home-v4.html (a noindex preview)
    python3 scripts/build-home-v4.py --live   also writes index.html, the real homepage (real title, indexable)

Keeps the site's head, nav, FAQ and footer from index-v3.html and replaces the body with new sections:
a hero whose artifact is the Docs window with the flying images (an iframe of hero-flip.html, cut off at the fold),
a then-and-now file listing, a measured format chart, a strip of real sidebar screens, a Doc-to-Markdown spread,
and a one-number price block. The sizes in the page are measured here (cwebp, libjpeg), not typed in.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "webflow"
src = (SITE / "index-v3.html").read_text()
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
    ("list-alt-edit", "Alt text audit", "Spot images missing alt text instantly. Write and save descriptions directly back to your file or export them."),
    ("selection-filter", "Selective export", "Select only the images you need, grab the whole document, or filter down to images missing alt text."),
    ("rename-pattern", "Bulk renaming", "Apply clean naming patterns like slug-(n) in one click, with instant live previews before you export."),
    ("output-webp", "Format conversion", "Convert to WebP, AVIF, JPEG, or PNG. Set target quality, crop to aspect ratio, and constrain maximum width."),
    ("optimize-done", "In-place optimization", "Reduce massive file sizes inside Google Docs by replacing bloated images with compressed versions in place."),
    ("slides-list", "Google Slides support", "Works seamlessly in Slides: pluck every photo across all your slides, even images nested in groups."),
]
out_img = SITE / "images" / "v4"
out_img.mkdir(parents=True, exist_ok=True)
strip_html = []
for key, title, text in STRIP:
    png = RAW / f"{key}-dark.png"
    webp = out_img / f"sidebar-{key}.webp"
    if png.exists():  # without the raw screenshots, keep the WebP already in images/v4
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

# Strip out the obsolete hero3 style block from head_and_nav if present
head_and_nav = re.sub(r"\.hero3\s*\{[^}]*\}[\s\S]*?(?=<link rel=\"canonical\")", "", head_and_nav)

# Enhanced FAQs with polished copy and links
FAQS = [
    (
        "How do I download all images from a Google Doc?",
        'Open your document, choose Extensions → Pluckr → Extract images, then click Download originals to get every image in one clean ZIP. Google Docs has no native button for this. The manual workarounds—downloading as a zipped web page or renaming a .docx file—leave you with unorganized, generic filenames. Our <a href="/guides/download-all-images-from-google-docs">step-by-step guide</a> compares all four methods.',
        "Open your document, choose Extensions → Pluckr → Extract images, then click Download originals to get every image in one clean ZIP. Google Docs has no native button for this. The manual workarounds—downloading as a zipped web page or renaming a .docx file—leave you with unorganized, generic filenames. Our step-by-step guide compares all four methods.",
    ),
    (
        "Does Pluckr work with Google Slides?",
        "Yes. Open Pluckr in any Google Slides presentation to detect every picture across every slide, including grouped images. You can select, bulk rename, convert, and download them just like in Docs. (Markdown export is available in Docs).",
        "Yes. Open Pluckr in any Google Slides presentation to detect every picture across every slide, including grouped images. You can select, bulk rename, convert, and download them just like in Docs. (Markdown export is available in Docs).",
    ),
    (
        "Can I convert Google Docs images to WebP or AVIF?",
        'Yes. Under Output settings, select WebP, AVIF, JPEG, or PNG, adjust the quality slider, and optionally set a fixed aspect ratio (like 16:9) or maximum width. Each image displays its exact new file size before you export. All conversion runs client-side in your browser for maximum speed and privacy. See <a href="/convert-google-docs-images-to-webp">how to convert Google Docs images to WebP or AVIF</a>.',
        "Yes. Under Output settings, select WebP, AVIF, JPEG, or PNG, adjust the quality slider, and optionally set a fixed aspect ratio (like 16:9) or maximum width. Each image displays its exact new file size before you export. All conversion runs client-side in your browser for maximum speed and privacy. See how to convert Google Docs images to WebP or AVIF.",
    ),
    (
        "Can I export a Google Doc as Markdown with images?",
        "Yes, in Docs. Check 'Add the Doc as Markdown' in export settings. Your download ZIP will contain a formatted content.md file and an images/ folder, with relative image links and alt text already wired up. It is ideal for Obsidian, Hugo, Astro, Ghost, and static-site workflows.",
        "Yes, in Docs. Check 'Add the Doc as Markdown' in export settings. Your download ZIP will contain a formatted content.md file and an images/ folder, with relative image links and alt text already wired up. It is ideal for Obsidian, Hugo, Astro, Ghost, and static-site workflows.",
    ),
    (
        "Can Pluckr edit or export image alt text?",
        "Yes. Pluckr audits alt text across your entire document and highlights images missing descriptions. You can filter to missing items, write new alt text directly in the sidebar, and save it back to the Doc. You can also export alt text metadata as CSV and JSON files alongside your images.",
        "Yes. Pluckr audits alt text across your entire document and highlights images missing descriptions. You can filter to missing items, write new alt text directly in the sidebar, and save it back to the Doc. You can also export alt text metadata as CSV and JSON files alongside your images.",
    ),
    (
        "How much does Pluckr cost? Is there a subscription?",
        'Pluckr is a one-time purchase of $5 tied to your Google account. It unlocks full features for both Google Docs and Google Slides forever. There are zero subscriptions, recurring charges, or hidden limits. We offer a full refund within 14 days if you aren\'t satisfied. See our <a href="/terms">terms</a>.',
        "Pluckr is a one-time purchase of $5 tied to your Google account. It unlocks full features for both Google Docs and Google Slides forever. There are zero subscriptions, recurring charges, or hidden limits. We offer a full refund within 14 days if you aren't satisfied. See our terms.",
    ),
    (
        "Are my images uploaded anywhere?",
        "No. Pluckr never uploads your images to an external server. Google Apps Script reads the images inside your active document session, and all format conversions (WebP, AVIF, resizing, cropping) run locally in your web browser. Your images and documents stay completely private.",
        "No. Pluckr never uploads your images to an external server. Google Apps Script reads the images inside your active document session, and all format conversions (WebP, AVIF, resizing, cropping) run locally in your web browser. Your images and documents stay completely private.",
    ),
    (
        "Do I need a Google account?",
        "Yes. Because Pluckr runs as an official Google Workspace add-on, you need a Google account. It only requests permission to access the active document you open it in, so it can read and export its images.",
        "Yes. Because Pluckr runs as an official Google Workspace add-on, you need a Google account. It only requests permission to access the active document you open it in, so it can read and export its images.",
    ),
    (
        "What image formats are supported?",
        "Pluckr converts to WebP, AVIF, JPEG, and PNG. You can download original embedded formats as-is, or convert the entire batch to your chosen format with custom compression quality, aspect ratio cropping, and maximum width limits.",
        "Pluckr converts to WebP, AVIF, JPEG, and PNG. You can download original embedded formats as-is, or convert the entire batch to your chosen format with custom compression quality, aspect ratio cropping, and maximum width limits.",
    ),
    (
        "Why are some images missing when I scan?",
        "Pluckr extracts all inline images in the document body, including images inside tables and document tabs. In Slides, it extracts all pictures on slides, including grouped images. Currently, floating images (images set to 'wrap text' or 'break text' in Docs), images in headers/footers/footnotes, and slide background fills are not supported by the Google Apps Script API.",
        "Pluckr extracts all inline images in the document body, including images inside tables and document tabs. In Slides, it extracts all pictures on slides, including grouped images. Currently, floating images (images set to 'wrap text' or 'break text' in Docs), images in headers/footers/footnotes, and slide background fills are not supported by the Google Apps Script API.",
    ),
    (
        "Does it support GIFs or BMPs?",
        "Yes. Pluckr extracts embedded inline GIFs and BMPs in their original format. Converting them to modern formats like WebP or AVIF depends on your browser's decoding engine.",
        "Yes. Pluckr extracts embedded inline GIFs and BMPs in their original format. Converting them to modern formats like WebP or AVIF depends on your browser's decoding engine.",
    ),
    (
        "Does Pluckr change my file?",
        "Only when you explicitly tell it to. Scanning, converting, and downloading never modify your original document. Writing new alt text or confirming 'Optimize' replaces images in place, which modifies the file (you can always revert via Google Docs Version History, but making a backup copy first is recommended).",
        "Only when you explicitly tell it to. Scanning, converting, and downloading never modify your original document. Writing new alt text or confirming 'Optimize' replaces images in place, which modifies the file (you can always revert via Google Docs Version History, but making a backup copy first is recommended).",
    ),
]

# Build JSON-LD Schema
schema_data = [
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Pluckr",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "Web (Google Docs and Google Slides add-on)",
        "description": "Extract every image from Google Docs and Slides. Bulk rename, convert to WebP or AVIF, crop, edit alt text, and export clean Markdown. One-time $5, runs in your browser.",
        "url": "https://docpluckr.com/",
        "image": "https://docpluckr.com/images/og-image.png",
        "offers": {"@type": "Offer", "price": "5.00", "priceCurrency": "USD"},
        "featureList": [
            "Extract every image from a Google Doc or Google Slides deck",
            "Select specific images or export all at once",
            "Rename images in bulk with customizable patterns",
            "Convert images to WebP, AVIF, JPEG, or PNG",
            "Crop to fixed aspect ratios and constrain maximum widths",
            "Audit, write, and export image alt text as CSV and JSON",
            "Export a Google Doc as clean Markdown with an organized images folder",
            "Optimize and shrink bloated images directly inside Docs and Slides",
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": plain_ans},
            }
            for q, _, plain_ans in FAQS
        ],
    },
]

# Update JSON-LD in head
json_ld_str = json.dumps(schema_data)
head_and_nav = re.sub(
    r'<script type="application/ld\+json">.*?</script>',
    lambda m: f'<script type="application/ld+json">{json_ld_str}</script>',
    head_and_nav,
    count=1,
)

# Build FAQ HTML accordion
faq_items_html = []
for q, ans_html, _ in FAQS:
    faq_items_html.append(
        f"""              <div role="listitem" data-state=" " class="accordion_item">
                <div class="accordion_component">
                  <h3 class="accordion_toggle_heading"><button aria-expanded="false" class="accordion_toggle_button"><span class="accordion_toggle_text u-text-style-h5">{q}</span><span class="accordion_toggle_icon">
                        <div class="accordion_toggle_icon_line is-v"></div>
                        <div class="accordion_toggle_icon_line"></div>
                      </span></button></h3>
                  <div class="accordion_content_wrap">
                    <div class="accordion_content_padding">
                      <div class="accordion_content_text u-rich-text w-richtext">
                        <p>{ans_html}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>"""
    )

faq_accordion_script = """(function() {
  const component = document.currentScript.parentElement.parentElement;
  const uid = window.__accordionUid = (window.__accordionUid || 0) + 1;
  document.addEventListener("DOMContentLoaded", function () {
    const list = component.querySelector(".accordion_list");
    let previousIndex = null,
      closeFunctions = [];
    function flattenDisplayContents(slot) {
      if (!slot) return;
      let child = slot.firstElementChild;
      while (child && child.classList.contains("u-display-contents")) {
        while (child.firstChild) {
          slot.insertBefore(child.firstChild, child);
        }
        slot.removeChild(child);
        child = slot.firstElementChild;
      }
    }
    flattenDisplayContents(list);
    function removeCMSList(slot) {
      const dynList = Array.from(slot.children).find((child) => child.classList.contains("w-dyn-list"));
      if (!dynList) return;
      const nestedItems = dynList?.querySelector(".w-dyn-items")?.children;
      if (!nestedItems) return;
      const staticWrapper = [...slot.children];
      [...nestedItems].forEach(el => { const c = [...el.children].find(c => !c.classList.contains('w-condition-invisible')); c && slot.appendChild(c); });
      staticWrapper.forEach((el) => el.remove());
    }
    removeCMSList(list);
    component.querySelectorAll(".accordion_component").forEach((card, cardIndex) => {
      const button = card.querySelector(".accordion_toggle_button");
      const content = card.querySelector(".accordion_content_wrap");
      if (!button || !content) return console.warn("Missing elements:", card);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("id", "accordion_button_" + uid + "_" + cardIndex);
      content.setAttribute("id", "accordion_content_" + uid + "_" + cardIndex);
      button.setAttribute("aria-controls", content.id);
      content.setAttribute("aria-labelledby", button.id);
      content.style.display = "none";
      let running = null;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const slide = (to, done, startAt) => {
        const from = startAt === undefined ? content.offsetHeight : startAt;
        if (running) running.cancel();
        content.style.overflow = "hidden";
        if (reduceMotion.matches || from === to) { content.style.height = ""; content.style.overflow = ""; done(); return; }
        running = content.animate([{ height: from + "px" }, { height: to + "px" }], { duration: 320, easing: "cubic-bezier(.4, 0, .2, 1)" });
        const finish = () => { running = null; content.style.height = ""; content.style.overflow = ""; done(); };
        running.onfinish = finish;
        running.oncancel = () => {};
      };
      const tl = {
        play: () => { const closed = content.style.display === "none"; content.style.display = "block"; slide(content.scrollHeight, () => {}, closed ? 0 : undefined); },
        reverse: () => { slide(0, () => { content.style.display = "none"; }); },
        progress: () => { if (running) running.cancel(); content.style.display = "block"; content.style.height = ""; content.style.overflow = ""; },
      };
      const closeAccordion = () => card.classList.contains("is-active") && (card.classList.remove("is-active"), tl.reverse(), button.setAttribute("aria-expanded", "false"));
      closeFunctions[cardIndex] = closeAccordion;
      const openAccordion = (instant = false) => {
        if (true && previousIndex !== null && previousIndex !== cardIndex) closeFunctions[previousIndex]?.();
        previousIndex = cardIndex;
        button.setAttribute("aria-expanded", "true");
        card.classList.add("is-active");
        instant ? tl.progress(1) : tl.play();
      };
      if (0 === cardIndex + 1) openAccordion(true);
      button.addEventListener("click", () => (card.classList.contains("is-active") && true ? (closeAccordion(), (previousIndex = null)) : openAccordion()));
      if (false) button.addEventListener("mouseenter", () => openAccordion());
    });
  });
})();"""

faq = f"""  <section class="u-section" id="faqs">
        <div class="u-container  ">
          <div data-wf--content-wrapper--variant="left" style="" class="u-content-wrapper w-variant-e85a4315-14bc-e5ef-0d3e-2c8c9ed7d2f1">
            <div class="u-display-contents">
              <h2 data-wf--typography-plain--variant="h2" data-number="12" class="u-text w-variant-9af60b09-c3a1-8c2a-eb78-8e29460ca7a9"><span>Frequently asked questions<br></span></h2>
              <p data-wf--typography-plain--variant="inherit" data-number="30" class="u-text"><span>Common questions about Pluckr and how it handles your document images.</span></p>
            </div>
          </div>
          <div data-preview="true" data-open-by-default="0" class="accordion_wrap">
            <div class="u-embed-css w-embed">
              <style>
.wf-design-mode .accordion_wrap[data-preview="true"] .accordion_content_wrap {{
	display: block;
}}
.accordion_wrap[data-open-by-default="0"] .accordion_item:nth-child(0) .accordion_content_wrap {{
	display: block;
}}
</style>
            </div>
            <div data-slot="" role="list" class="accordion_list">
{chr(10).join(faq_items_html)}
            </div>
            <div class="u-embed-js w-embed w-script">
              <script>
{faq_accordion_script}
</script>
            </div>
          </div>
        </div>
      </section>"""

# Take after_main and cleanly strip leading </main>
after_main = src[src.index("</main>") + len("</main>") :]

# Drop obsolete hero3 animation script that crashes on v4
if "<script>\n  (function () {\n    var root = document.querySelector('.hero3')" in after_main:
    script_start = after_main.index("<script>\n  (function () {\n    var root = document.querySelector('.hero3')")
    after_main = after_main[:script_start] + "</body>\n</html>\n"

# Update footer CTA and footer links in after_main
footer_old_cta_p1 = "<span>Images out of your Doc, in a few clicks<br></span>"
footer_new_cta_p1 = "<span>Extract every image from your Docs &amp; Slides today<br></span>"
footer_old_cta_p2 = "<span>Preview, convert, and download them together.<br></span>"
footer_new_cta_p2 = "<span>$5 one-time purchase · No subscription · 100% private in your browser.<br></span>"

after_main = after_main.replace(footer_old_cta_p1, footer_new_cta_p1)
after_main = after_main.replace(footer_old_cta_p2, footer_new_cta_p2)

# Change footer button to Marketplace direct conversion link
after_main = re.sub(
    r'<a href="#how-it-works" aria-label="See how Pluckr works in Google Docs" class="clickable_btn"></a></div>\s*<div data-button="" class="button_main_element">\s*<div aria-hidden="true" class="button_main_text u-text-style-main u-text-transform-uppercase">See how it works</div>',
    '<a href="https://workspace.google.com/marketplace/app/pluckr/315157378382" target="_blank" rel="noopener" aria-label="Add Pluckr to Google Docs" class="clickable_btn"></a></div>\n                    <div data-button="" class="button_main_element">\n                      <div aria-hidden="true" class="button_main_text u-text-style-main u-text-transform-uppercase">Add to Google Docs</div>',
    after_main,
)

# Add guide links to footer bottom list
old_footer_bottom = '<div data-trigger="group" role="list" class="footer_bottom_list">'
new_footer_bottom = """<div data-trigger="group" role="list" class="footer_bottom_list">
              <div data-trigger="hover-other focus-other" role="listitem" class="footer_bottom_item">
                <a href="/guides/download-all-images-from-google-docs" class="footer_bottom_link_wrap w-inline-block">
                  <div class="footer_bottom_link_text u-text-style-small">Download Images Guide</div>
                </a>
              </div>
              <div data-trigger="hover-other focus-other" role="listitem" class="footer_bottom_item">
                <a href="/convert-google-docs-images-to-webp" class="footer_bottom_link_wrap w-inline-block">
                  <div class="footer_bottom_link_text u-text-style-small">Convert to WebP Guide</div>
                </a>
              </div>
              <div data-trigger="hover-other focus-other" role="listitem" class="footer_bottom_item">
                <a href="/extract-images-from-google-docs" class="footer_bottom_link_wrap w-inline-block">
                  <div class="footer_bottom_link_text u-text-style-small">Extract Docs Images</div>
                </a>
              </div>"""
after_main = after_main.replace(old_footer_bottom, new_footer_bottom)

button = between(src, '<div class="u-button-wrapper">', "Add to Google Docs</div>\n                    </div>\n                  </div>\n                </div>\n              </div>")

# ---- head tweaks: SEO title & description -------------------------------------------------------------
improved_title = "Extract &amp; Convert Images in Google Docs and Slides | Pluckr"
improved_desc = "Extract every image from Google Docs and Slides. Bulk rename, convert to WebP or AVIF, crop, edit alt text, and export clean Markdown. One-time $5, runs in your browser."

head_and_nav = re.sub(r"<title>.*?</title>", f"<title>{improved_title}</title>", head_and_nav, count=1)
head_and_nav = re.sub(r'<meta content=".*?" name="description">', f'<meta content="{improved_desc}" name="description">', head_and_nav, count=1)
head_and_nav = re.sub(r'<meta content=".*?" property="og:description">', f'<meta content="{improved_desc}" property="og:description">', head_and_nav, count=1)
head_and_nav = re.sub(r'<meta content=".*?" name="twitter:description">', f'<meta content="{improved_desc}" name="twitter:description">', head_and_nav, count=1)

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
      <h1>Pluck every image from Google Docs &amp; Slides</h1>
      <div class="v4-hero-row">
        <p class="lede">Preview, bulk rename, and convert images to WebP or AVIF right inside your document. Keep alt text intact, export clean Markdown, and download everything in one organized ZIP.</p>
        <div class="v4-hero-cta">
          {button}
          <span class="v4-note">One-time $5 · No subscription · Images never leave your browser</span>
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
      <p class="lede">Google Docs has no built-in way to save your images. The default download dumps an unwanted HTML file and a folder of numbered mystery files. Pluckr gives you clean, web-ready assets in seconds.</p>
      <div class="v4-split">
        <div class="v4-then">
          <h3>File → Download → Web page (.html, zipped)</h3>
          <ul class="v4-files">{files_then}</ul>
          <p class="v4-cap">An unwanted HTML file, generic numbers with no previews, heavy uncompressed PNGs, and all alt text lost.</p>
        </div>
        <div class="v4-now">
          <h3>Extensions → Pluckr → Extract images</h3>
          <ul class="v4-files">{files_now}</ul>
          <p class="v4-cap">Consistent custom names, converted to modern WebP, cropped to aspect ratio, with alt text metadata and clean Markdown included.</p>
        </div>
      </div>
      <a class="v4-link" href="/guides/download-all-images-from-google-docs">How to download all images from a Google Doc (4 ways) →</a>
    </div>
  </section>

  <section id="formats">
    <div class="v4-wrap">
      <h2>Convert Google Docs images to WebP: {lake['png']} KB shrinks to {lake['webp']} KB</h2>
      <p class="lede">Google Docs stores images as bloated PNGs. Pluckr converts them to modern WebP or AVIF directly in your browser—cutting file size by up to 90% so your web pages load instantly and uploads never stall.</p>
      <div class="v4-chart" role="img" aria-label="File sizes of the same photo: PNG {lake['png']} KB, JPEG {lake['jpg']} KB, WebP {lake['webp']} KB">
        <div class="v4-bar"><span>PNG</span><i style="--w: 100%"></i><span>{lake['png']} KB</span></div>
        <div class="v4-bar"><span>JPEG</span><i style="--w: {pct(lake['jpg'])}%"></i><span>{lake['jpg']} KB</span></div>
        <div class="v4-bar is-best"><span>WebP</span><i style="--w: {pct(lake['webp'])}%"></i><span>{lake['webp']} KB</span></div>
      </div>
      <p class="v4-source">Measured on a sample high-res photo cropped to 16:9 (1000 × 562 px) at 80% quality using standard cwebp and libjpeg. AVIF produces even smaller files. Test your own images right in the sidebar.</p>
      <a class="v4-link" href="/convert-google-docs-images-to-webp">Guide: How to convert Google Docs images to WebP or AVIF →</a>
    </div>
  </section>

  <section id="how-it-works">
    <div class="v4-wrap">
      <h2>Inspect, rename, crop, and convert without leaving your Doc</h2>
      <p class="lede">Open Extensions → Pluckr → Extract images. Everything happens in a fast, lightweight sidebar designed specifically for your Google Docs and Slides workflow.</p>
    </div>
    <div class="v4-stripwrap"><div class="v4-strip">{''.join(strip_html)}</div></div>
  </section>

  <section id="markdown">
    <div class="v4-wrap">
      <h2>Export clean Markdown with an organized images folder</h2>
      <p class="lede">Check one box in export settings to get a clean content.md with images linked and alt text preserved. Ready to drop straight into Obsidian, Astro, Hugo, or your static site generator.</p>
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
            <li>Pay once, use forever. No subscription or recurring fees.</li>
            <li>One $5 license covers both Google Docs and Google Slides.</li>
            <li>100% private: all conversion runs locally in your browser.</li>
            <li>14-day money-back guarantee if it doesn’t save you time.</li>
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

if "--live" in sys.argv:
    live = html.replace('  <meta name="robots" content="noindex">\n', "", 1)
    (SITE / "index.html").write_text(live)
    print("wrote index.html")

print(f"wrote {out} ({len(html) / 1024:.0f} KB); sizes: {sizes}")
