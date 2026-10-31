#!/usr/bin/env python3
"""Standalone hero variant: a simplified Google Docs window, and the images fly from the Doc into the Pluckr sidebar
with GSAP Flip. Output: brand/hero-flip.html (one file; GSAP, Flip, photos and font are embedded).

    python3 scripts/export-hero-flip.py

The sidebar styles are cut out of pluckr.webflow/index.html (same as export-hero-animation.py). The sidebar is in
normal flow, never absolutely positioned. GSAP 3.12.5 and Flip are kept in scripts/vendor/gsap (GreenSock standard licence).
"""
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "webflow"
src = (SITE / "index.html").read_text()


def between(text, start, end, include_end=False):
    a = text.index(start)
    b = text.index(end, a)
    return text[a : b + (len(end) if include_end else 0)]


def data_uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


IMG = SITE / "images" / "v2"
photos = {name: data_uri(IMG / f"{name}.jpg", "image/jpeg") for name in ("lake", "library", "building")}
icon = {name: data_uri(IMG / f"{name}.svg", "image/svg+xml") for name in ("mark", "more", "edit", "chevron-down")}
font = data_uri(SITE / "fonts" / "PPNeueMontreal-Medium.ttf", "font/ttf")

variables = between(src, "--black: #000;", "color: var(--white);")
inner_css = between(src, ".hero3 .sidebar {", ".hero3 .cursor svg {")
inner_css += src[src.index(".hero3 .cursor svg {") : src.index("\n", src.index(".hero3 .cursor svg {"))]
resets = "\n".join(
    line.strip()
    for line in between(src, ".hero3 *, .hero3 *::before", ".hero3 a { text-decoration: none; }", include_end=True).splitlines()
    if line.strip()
)

gsap = (ROOT / "scripts/vendor/gsap/gsap.min.js").read_text()
flip = (ROOT / "scripts/vendor/gsap/Flip.min.js").read_text()

ROWS = [
    ("lake", "image-01.jpg", "2.1 MB", "Loch shore with snow-capped mountain"),
    ("library", "image-02.jpg", "2.4 MB", "Library atrium with crossing staircases"),
    ("building", "image-03.jpg", "1.2 MB", "White building with round windows"),
]

rows_html = "\n".join(
    f"""            <article class="image-row" data-row="{i}">
              <div class="thumb-slot" data-slot="{i}"></div>
              <div class="image-info">
                <div class="name-row"><p class="image-name"><span>{name}</span></p><span class="edit-button"><img src="{icon['edit']}" alt=""></span></div>
                <div class="meta-row"><p>3000 × 3000</p><p>{size}</p><p data-after></p></div>
              </div>
              <div class="actions"><button class="action-button" type="button" tabindex="-1">Copy</button><button class="action-button" type="button" tabindex="-1">Download</button></div>
            </article>"""
    for i, (_, name, size, _) in enumerate(ROWS)
)

figures_html = "\n".join(
    f"""          <figure class="doc-figure" data-fig="{i}"><img class="doc-img" data-img="{i}" src="{photos[key]}" alt="{alt}"></figure>"""
    for i, (key, _, _, alt) in enumerate(ROWS)
)

chev = icon["chevron-down"]
arrow = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5v6a3 3 0 0 0 3 3h11"/><path d="m15 10 4 4-4 4"/></svg>'
preview_rows = "\n".join(
    f'<div class="rename-row"><span class="rename-old">{name}</span><span class="rename-new">{arrow}<span></span></span></div>'
    for _, name, _, _ in ROWS
)
fmt_options = "".join(
    f'<button class="select-option{" is-selected" if f == "Original" else ""}" type="button" data-format="{f}" tabindex="-1">{f}</button>'
    for f in ("Original", "AVIF", "WebP", "PNG", "JPEG")
)
ar_options = "".join(
    f'<button class="select-option{" is-selected" if a == "Original" else ""}" type="button" data-aspect="{a}" tabindex="-1">{a}</button>'
    for a in ("Original", "1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16")
)
sections_html = f"""<section class="export" id="renameSec">
                      <button class="export-toggle" id="renameToggle" type="button" tabindex="-1"><span>Bulk rename</span><img class="chevron is-closed" src="{chev}" alt=""></button>
                      <div class="export-body" id="renameBody"><div class="export-inner">
                        <div class="field"><span class="field-label">Name pattern</span><div class="field-input" id="patternBox"><span id="patternText"></span></div></div>
                        <div class="rename-preview">{preview_rows}</div>
                        <button class="secondary-button" id="renameBtn" type="button" tabindex="-1">Rename 3 images</button>
                      </div></div>
                    </section>
                    <section class="export" id="outSec">
                      <button class="export-toggle" id="outToggle" type="button" tabindex="-1"><span>Output settings</span><img class="chevron is-closed" src="{chev}" alt=""></button>
                      <div class="export-body" id="outBody"><div class="export-inner">
                        <div class="field"><span class="field-label">Format</span><div class="select" id="fmtSel"><button class="select-button" id="fmtBtn" type="button" tabindex="-1"><span id="fmtValue">Original</span><img class="chevron" src="{chev}" alt=""></button><div class="select-list" role="listbox">{fmt_options}</div></div></div>
                        <div class="field is-off" data-needs-format><div class="field-head"><span class="field-label">Quality</span><span class="field-value">80%</span></div><div class="slider"></div></div>
                        <div class="field is-off" data-needs-format><span class="field-label">Aspect ratio</span><div class="select" id="arSel"><button class="select-button" id="arBtn" type="button" tabindex="-1"><span id="arValue">Original</span><img class="chevron" src="{chev}" alt=""></button><div class="select-list" id="arList" role="listbox">{ar_options}</div></div></div>
                      </div></div>
                    </section>"""
cursor_html = between(src, '<div class="cursor" id="cursor"', "</svg>\n      </div>", include_end=True)

css_extra = """
/* Bulk rename and Output settings: the bodies slide open with GSAP (height 0 to auto). */
.hero3 .export { gap: 0; }
.hero3 .export .export-body { display: block; height: 0; overflow: hidden; }
.hero3 .export-inner { display: flex; flex-direction: column; gap: 16px; padding-top: 16px; }
.hero3 .field > * { transition: opacity 0.3s; }
.hero3 .field-input { min-height: 44px; }
.hero3 .field-input.is-focus { border-color: var(--white); color: var(--white); }
.hero3 .rename-preview { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--edge-card); border-radius: 12px; font-size: 12px; line-height: 1.3; }
.hero3 .rename-row { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-top: 1px solid var(--edge); }
.hero3 .rename-row:first-child { border-top: 0; }
.hero3 .rename-old { color: var(--muted); font-size: 11px; }
.hero3 .rename-new { display: flex; align-items: center; gap: 6px; min-height: 16px; }
.hero3 .rename-new svg { flex: none; color: var(--muted); }
.hero3 .secondary-button { display: flex; align-items: center; justify-content: center; width: 100%; padding: 15px; border: 1px solid var(--edge-card); border-radius: 16px; background: var(--panel); color: var(--white); font-size: 12px; line-height: normal; text-transform: uppercase; }
.hero3 .secondary-button.is-pressed { background: #171717; }
.hero3 #list.is-wide .thumb-slot { aspect-ratio: 16 / 9; }
"""

js_showcase = r"""
  /* ---- After the scan: Bulk rename, then Output settings, with a pointer ---- */
  var cursor = $('#cursor'), layer = $('.cursor-layer'), pos = { x: 0, y: 0 };
  var renameToggle = $('#renameToggle'), renameBody = $('#renameBody'), renameBtn = $('#renameBtn');
  var patternBox = $('#patternBox'), patternText = $('#patternText');
  var outToggle = $('#outToggle'), outBody = $('#outBody'), fmtBtn = $('#fmtBtn'), fmtValue = $('#fmtValue'), arBtn = $('#arBtn'), arValue = $('#arValue');
  var fmtSel = $('#fmtSel'), arSel = $('#arSel'), arList = $('#arList');
  var ctaBtn = $('.primary-button'), needFormat = $$('[data-needs-format]'), previewNew = $$('.rename-new span');
  var names = $$('.image-name span'), dims = $$('.meta-row p:first-child'), afters = $$('[data-after]');
  var oldNames = names.map(function (n) { return n.textContent; });
  var newNames = ['west-coast-road-trip-01.jpg', 'west-coast-road-trip-02.jpg', 'west-coast-road-trip-03.jpg'];
  var sizesAfter = ['→ 71.2 KB', '→ 108.5 KB', '→ 30.1 KB'];
  var tr = function (p) { return 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px)'; };

  function centerOf(el, dx, dy) {
    var a = el.getBoundingClientRect(), b = layer.getBoundingClientRect();
    return { x: a.left - b.left + a.width / 2 + (dx || 0), y: a.top - b.top + a.height / 2 + (dy || 0) };
  }
  /* Glide along a gentle arc; longer trips take longer, like a hand would. */
  function glide(to, id) {
    var from = pos, dist = Math.hypot(to.x - from.x, to.y - from.y);
    var dur = Math.max(450, Math.min(1300, 380 + dist * 1.9));
    var mid = { x: (from.x + to.x) / 2 + (to.y - from.y) * 0.12, y: (from.y + to.y) / 2 - (to.x - from.x) * 0.12 };
    var anim = cursor.animate([{ transform: tr(from) }, { transform: tr(mid), offset: 0.5 }, { transform: tr(to) }],
      { duration: dur, easing: 'cubic-bezier(.45,.05,.25,1)' });
    pos = to;
    var park = function () { cursor.style.transform = tr(to); anim.cancel(); };
    return anim.finished.then(park, park).then(function () { if (id !== run) throw 0; });
  }
  function go(el, id, dx, dy) { return glide(centerOf(el, dx, dy), id); }
  function press(el, id) {
    cursor.firstElementChild.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.84)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' });
    if (el) el.classList.add('is-pressed');
    return new Promise(function (res, rej) { setTimeout(function () { if (el) el.classList.remove('is-pressed'); id === run ? res() : rej(0); }, 150); });
  }
  function typeInto(el, text, id) {
    el.textContent = '';
    var i = 0;
    return new Promise(function (resolve, reject) {
      (function tick() {
        if (id !== run) return reject(0);
        if (i >= text.length) return resolve();
        el.textContent += text.charAt(i++);
        setTimeout(tick, 55 + Math.random() * 60);
      })();
    });
  }
  /* The body clips while it slides; once open it lets the dropdown lists reach outside it. */
  function setOpen(toggle, body, on, id) {
    $('.chevron', toggle).classList.toggle('is-closed', !on);
    if (!on) body.style.overflow = 'hidden';
    return done(gsap.to(body, { height: on ? 'auto' : 0, duration: 0.55, ease: 'power2.inOut' }), id).then(function () { if (on) body.style.overflow = 'visible'; });
  }
  /* Open a list, move to an option, press it, close the list. */
  async function choose(btn, sel, option, mark, id) {
    await go(btn, id); await press(btn, id);
    sel.classList.add('is-open'); btn.classList.add('is-open');
    await wait(0.6, id);
    if (sel === arSel) { arList.scrollTo({ top: arList.scrollHeight, behavior: 'smooth' }); await wait(0.7, id); }
    await go(option, id); await press(option, id);
    mark();
    sel.classList.remove('is-open'); btn.classList.remove('is-open');
  }
  function swapText(el, text, id) {
    return done(gsap.to(el, { opacity: 0, duration: 0.14 }), id).then(function () {
      el.textContent = text;
      return done(gsap.to(el, { opacity: 1, duration: 0.22 }), id);
    });
  }
  /* Cropping to 16:9 reshapes every card. Flip records the old layout and eases to the new one. */
  function setWide(on, id) {
    return new Promise(function (res, rej) {
      var state = Flip.getState('.image-row, .thumb-slot');
      list.classList.toggle('is-wide', on);
      Flip.from(state, { duration: 0.8, ease: 'power2.inOut', onComplete: function () { id === run ? res() : rej(0); } });
    });
  }

  function resetShowcase() {
    gsap.killTweensOf([renameBody, outBody, fmtValue, arValue, previewNew, names]);
    Flip.killFlipsOf('.image-row, .thumb-slot');
    gsap.set('.thumb-slot', { clearProps: 'transform,width,height' });
    gsap.set([renameBody, outBody], { height: 0, overflow: 'hidden' });
    [fmtSel, arSel, fmtBtn, arBtn].forEach(function (e) { e.classList.remove('is-open'); });
    $$('[data-format]').forEach(function (o) { o.classList.toggle('is-selected', o.dataset.format === 'Original'); });
    $$('[data-aspect]').forEach(function (o) { o.classList.toggle('is-selected', o.dataset.aspect === 'Original'); });
    arList.scrollTop = 0;
    $$('.export-toggle .chevron').forEach(function (c) { c.classList.add('is-closed'); });
    list.classList.remove('is-wide');
    fmtValue.textContent = 'Original'; arValue.textContent = 'Original';
    gsap.set([fmtValue, arValue], { opacity: 1 });
    needFormat.forEach(function (f) { f.classList.add('is-off'); });
    names.forEach(function (n, i) { n.textContent = oldNames[i]; });
    gsap.set(names, { opacity: 1 });
    dims.forEach(function (d) { d.textContent = '3000 × 3000'; });
    afters.forEach(function (a) { a.textContent = ''; });
    renameBtn.textContent = 'Rename 3 images'; patternText.textContent = '';
    patternBox.classList.remove('is-focus');
    previewNew.forEach(function (n, i) { n.textContent = newNames[i]; });
    gsap.set(previewNew, { opacity: 0 });
    ctaBtn.classList.remove('is-busy');
    cursor.classList.remove('is-on');
  }

  async function showcase(id) {
    var s = layer.getBoundingClientRect();
    pos = { x: s.width - 60, y: s.height * 0.84 };
    cursor.style.transform = tr(pos);
    cursor.classList.add('is-on');
    await wait(0.5, id);

    /* Bulk rename: type a pattern, preview the names, apply. */
    await go(renameToggle, id, 40, 0); await press(renameToggle, id);
    await setOpen(renameToggle, renameBody, true, id);
    await go(patternBox, id, 30, 0); await press(patternBox, id);
    patternBox.classList.add('is-focus');
    await typeInto(patternText, '{doc}-{n}', id);
    patternBox.classList.remove('is-focus');
    await done(gsap.to(previewNew, { opacity: 1, duration: 0.35, stagger: 0.12 }), id);
    await wait(0.5, id);
    await go(renameBtn, id); await press(renameBtn, id);
    renameBtn.textContent = 'Renamed';
    await Promise.all(names.map(function (n, i) { return swapText(n, newNames[i], id); }));
    await wait(0.7, id);
    await go(renameToggle, id, 40, 0); await press(renameToggle, id);
    await setOpen(renameToggle, renameBody, false, id);
    await wait(0.3, id);

    /* Output settings: WebP, 16:9, convert. */
    await go(outToggle, id, 40, 0); await press(outToggle, id);
    await setOpen(outToggle, outBody, true, id);
    var webp = $('[data-format="WebP"]');
    await choose(fmtBtn, fmtSel, webp, function () { $$('[data-format]').forEach(function (o) { o.classList.toggle('is-selected', o === webp); }); }, id);
    await swapText(fmtValue, 'WebP', id);
    needFormat.forEach(function (f) { f.classList.remove('is-off'); });
    cta.textContent = 'Convert';
    await wait(0.5, id);
    var wide = $('[data-aspect="16:9"]');
    await choose(arBtn, arSel, wide, function () { $$('[data-aspect]').forEach(function (o) { o.classList.toggle('is-selected', o === wide); }); }, id);
    await swapText(arValue, '16:9', id);
    await setWide(true, id);
    await wait(0.4, id);
    await go(ctaBtn, id, -30, 0); await press(ctaBtn, id);
    cta.innerHTML = '<span class="spin"></span>Converting…'; ctaBtn.classList.add('is-busy');
    await wait(1.3, id);
    ctaBtn.classList.remove('is-busy');
    dims.forEach(function (d) { d.textContent = '3000 × 1688'; });
    afters.forEach(function (a, i) { a.textContent = sizesAfter[i]; });
    cta.textContent = 'Download 3 as WebP';
    await done(gsap.to(list, { y: -(slots[0].offsetHeight + 8), duration: 0.7, ease: 'power2.inOut' }), id);
    await wait(2.4, id);
  }

  /* Put everything back before the pictures return to the Doc. */
  async function unwind(id) {
    await go(outToggle, id, 40, 0); await press(outToggle, id);
    await Promise.all([setOpen(outToggle, outBody, false, id), done(gsap.to(list, { y: 0, duration: 0.6, ease: 'power2.inOut' }), id)]);
    cursor.classList.remove('is-on');
    fmtValue.textContent = 'Original'; arValue.textContent = 'Original';
    $$('[data-format]').forEach(function (o) { o.classList.toggle('is-selected', o.dataset.format === 'Original'); });
    $$('[data-aspect]').forEach(function (o) { o.classList.toggle('is-selected', o.dataset.aspect === 'Original'); });
    arList.scrollTop = 0;
    needFormat.forEach(function (f) { f.classList.add('is-off'); });
    cta.textContent = 'Download originals';
    dims.forEach(function (d) { d.textContent = '3000 × 3000'; });
    afters.forEach(function (a) { a.textContent = ''; });
    renameBtn.textContent = 'Rename 3 images'; patternText.textContent = '';
    gsap.set(previewNew, { opacity: 0 });
    await setWide(false, id);
    await Promise.all(names.map(function (n, i) { return swapText(n, oldNames[i], id); }));
    await wait(0.3, id);
  }
"""

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>Pluckr hero: images fly from the Doc into the sidebar</title>
<!--
  A simplified Google Docs window. The three pictures leave the Doc and land in the Pluckr sidebar (GSAP Flip),
  then fly back and the loop starts again. One file: styles, markup, script, GSAP 3.12.5 + Flip, photos and font.
  GSAP is used under the GreenSock standard licence (https://gsap.com/standard-license).
  Photos: Ben Jessop, Gavin Allanwood and Elina Ayupova on Unsplash.
  Generated by scripts/export-hero-flip.py. Edit the script, then regenerate.
-->
<style>
@font-face {{ font-family: "PP Neue Montreal"; src: url({font}) format("truetype"); font-weight: 500; font-style: normal; font-display: swap; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; background: #000; }}
body {{ display: grid; grid-template-rows: 1fr auto; min-height: 100vh; min-height: 100svh; }}

.hero3 {{
  display: grid;
  min-height: 0;
  {variables.strip()}
  color: var(--white);
  font-family: "PP Neue Montreal", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}}
.hero3 p, .hero3 h1, .hero3 h2, .hero3 figure {{ margin: 0; }}
.hero3 button {{ margin: 0; padding: 0; border: 0; border-radius: 0; background: none; color: inherit; font: inherit; line-height: inherit; text-align: inherit; cursor: default; -webkit-appearance: none; appearance: none; }}

/* Stage: a dark floor with the Docs window centred on it. The window sits in a slot that has its scaled size,
   so it is laid out by grid and nothing here is absolutely positioned. */
.hero3 .stage {{ position: relative; display: grid; place-items: center; min-height: 0; padding: 24px; overflow: hidden; background: #0a0a0a; --s: 0.9; }}
.hero3 .window-slot {{ position: relative; width: calc(900px * var(--s)); height: calc(860px * var(--s)); }}
/* The pointer lives in a layer the size of the white window and is clipped to its rounded corners. */
.hero3 .cursor-layer {{ position: absolute; inset: 0; overflow: hidden; border-radius: calc(12px * var(--s)); pointer-events: none; }}
.hero3 .window {{ display: flex; flex-direction: column; width: 900px; height: 860px; transform: scale(var(--s)); transform-origin: top left; background: #f9fbfd; border-radius: 12px; color: #202124; font-family: Arial, "Helvetica Neue", sans-serif; font-weight: 400; }}

/* The Doc. */
.doc-top {{ display: flex; flex: none; align-items: center; gap: 14px; height: 64px; padding: 0 20px; }}
.doc-icon {{ position: relative; flex: none; width: 24px; height: 32px; border-radius: 3px; background: #1a73e8; }}
.doc-icon::before, .doc-icon::after {{ content: ""; position: absolute; left: 6px; right: 6px; height: 2px; border-radius: 1px; background: rgba(255, 255, 255, 0.9); }}
.doc-icon::before {{ top: 14px; }}
.doc-icon::after {{ top: 20px; }}
.doc-name {{ font-size: 17px; line-height: 1.2; }}
.doc-menu {{ display: flex; gap: 14px; margin-top: 3px; color: #444746; font-size: 12px; line-height: 1.2; }}
.doc-body {{ display: flex; flex: 1; min-height: 0; }}
.doc-canvas {{ flex: 1; min-width: 0; overflow: hidden; padding: 4px 28px 0 36px; }}
.doc-page {{ width: 100%; height: 100%; padding: 40px 44px 0; background: #fff; border: 1px solid #dadce0; border-bottom: 0; }}
.doc-page h2 {{ font-size: 26px; font-weight: 400; line-height: 1.2; }}
.doc-page p {{ margin: 12px 0 0; font-size: 12.5px; line-height: 1.6; color: #3c4043; }}
.doc-figure {{ width: 300px; height: 170px; margin: 12px 0 0; border-radius: 2px; background: #eef1f5; }}
.doc-img {{ display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 2px; }}
.doc-page figure:first-of-type {{ margin-top: 14px; }}

/* The add-on side panel. */
.side {{ display: flex; flex: none; flex-direction: column; width: 332px; padding: 0 16px 16px; }}
.side-head {{ display: flex; flex: none; align-items: center; justify-content: space-between; height: 44px; padding: 0 4px; font-size: 14px; color: #444746; }}
.side-head svg {{ width: 16px; height: 16px; }}
.sidebar-slot {{ flex: none; width: 300px; height: 740px; }}
.sidebar-wrap {{ width: 300px; height: 740px; }}

{inner_css}
{resets}

/* Sidebar tweaks for the flight: nothing may clip the pictures while they cross over, so the sidebar and the list
   are not overflow:hidden. The list is cut at its top and bottom only; sideways it is open. */
.hero3 .sidebar {{ overflow: visible; color: var(--white); font-family: "PP Neue Montreal", "Helvetica Neue", Arial, sans-serif; font-weight: 500; }}
.hero3 .panel {{ overflow: visible; clip-path: inset(0 -3000px 0 -3000px); }}
.hero3 #list {{ position: relative; display: flex; flex-direction: column; gap: 12px; will-change: transform; }}
.hero3 .thumb-slot {{ width: 100%; aspect-ratio: 1 / 1; border-radius: 12px; background: var(--panel); }}
.hero3 .thumb-slot .doc-img {{ border-radius: 12px; }}
.hero3 .image-row .image-info, .hero3 .image-row .actions {{ opacity: 0; }}
.hero3 .image-row {{ opacity: 0; }}
.hero3 .scan {{ position: absolute; inset: 0; display: grid; place-items: center; font-size: 12px; color: var(--muted); }}
.hero3 .scan .spin {{ margin-right: 8px; }}

{css_extra}
.credit {{ margin: 0; padding: 14px 24px; color: rgba(255, 255, 255, 0.58); font: 500 12px/1.4 "Helvetica Neue", Arial, sans-serif; text-align: center; }}
.credit a {{ color: inherit; text-decoration: underline; }}
</style>
</head>
<body>
  <section class="hero3" aria-label="Pluckr">
    <div class="stage" id="stage" role="img" aria-label="The images of a Google Doc fly into the Pluckr sidebar, where they are listed">
      <div class="window-slot">
        <div class="window" id="window">
          <div class="doc-top">
            <span class="doc-icon" aria-hidden="true"></span>
            <div>
              <div class="doc-name">West Coast Road Trip</div>
              <div class="doc-menu"><span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span><span>Tools</span><span>Extensions</span><span>Help</span></div>
            </div>
          </div>
          <div class="doc-body">
            <div class="doc-canvas">
              <div class="doc-page" id="page">
                <h2>West Coast Road Trip</h2>
                <p>Seventy-two hours, four people and one car. We left the city before sunrise and followed the coast road north.</p>
{figures_html.splitlines()[0]}
                <p>Lunch was a long table by the water, then the library in town, all light and staircases.</p>
{figures_html.splitlines()[1]}
                <p>The last stop was the white building with the round windows, just as the sun went down.</p>
{figures_html.splitlines()[2]}
              </div>
            </div>
            <aside class="side" aria-label="Pluckr">
              <div class="side-head"><span>Pluckr</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></div>
              <div class="sidebar-slot">
                <div class="sidebar-wrap" id="wrap">
                  <div class="sidebar" id="sidebar">
                    <header class="top-bar">
                      <img class="brand-mark" src="{icon['mark']}" alt="">
                      <p class="brand">Pluckr</p>
                      <span class="icon-button"><img src="{icon['more']}" alt=""></span>
                    </header>
                    <section class="panel" id="panel" aria-label="Extracted images">
                      <div class="scan" id="scan"><span><span class="spin"></span>Scanning your document…</span></div>
                      <div id="list">
{rows_html}
                      </div>
                    </section>
                    {sections_html}
                    <button class="primary-button" type="button" tabindex="-1"><span id="ctaText">Download originals</span></button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <div class="cursor-layer">{cursor_html}</div>
      </div>
    </div>
  </section>
  <p class="credit">Photos by Ben Jessop, Gavin Allanwood and Elina Ayupova on <a href="https://unsplash.com">Unsplash</a>.</p>
<script>
{gsap}
</script>
<script>
{flip}
</script>
<script>
(function () {{
  gsap.registerPlugin(Flip);
  var root = document.querySelector('.hero3');
  var $ = function (s, r) {{ return (r || root).querySelector(s); }};
  var $$ = function (s, r) {{ return Array.prototype.slice.call((r || root).querySelectorAll(s)); }};
  var stage = $('#stage'), win = $('#window');
  var imgs = $$('.doc-img'), figs = $$('.doc-figure'), slots = $$('.thumb-slot'), rows = $$('.image-row');
  var list = $('#list'), scan = $('#scan'), cta = $('#ctaText');

  /* Scale the whole Docs window to the stage. Doc and sidebar share this one scale, so Flip sees a single space. */
  function fit() {{
    var w = stage.clientWidth - 48, h = stage.clientHeight - 48;
    gsap.set(stage, {{ '--s': Math.max(0.3, Math.min(1.4, w / 900, h / 860)).toFixed(3) }});
  }}
  fit();
  window.addEventListener('resize', fit);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var run = 0, running = false;
  var wait = function (s, id) {{ return new Promise(function (res, rej) {{ gsap.delayedCall(s, function () {{ id === run ? res() : rej(0); }}); }}); }};
  var done = function (tween, id) {{ return new Promise(function (res, rej) {{ tween.eventCallback('onComplete', function () {{ id === run ? res() : rej(0); }}); }}); }};

  /* The list slides up and down behind the panel; no native scrolling, so Flip has plain transforms to read. */
  function showRow(i, id, dur) {{
    return done(gsap.to(list, {{ y: -(rows[i].offsetTop - rows[0].offsetTop), duration: dur, ease: 'power2.inOut' }}), id);
  }}

  /* The move: record where the picture is, put it in its new parent, let Flip animate the difference. */
  function move(img, parent, id, radius) {{
    return new Promise(function (res, rej) {{
      var state = Flip.getState(img);
      parent.appendChild(img);
      gsap.fromTo(img, {{ borderRadius: radius[0] }}, {{ borderRadius: radius[1], duration: 0.95, ease: 'power3.inOut', clearProps: 'borderRadius' }});
      Flip.from(state, {{
        duration: 0.95, ease: 'power3.inOut', zIndex: 40,
        onComplete: function () {{ id === run ? res() : rej(0); }}
      }});
    }});
  }}

  function showInfo(i) {{ return gsap.to([$('.image-info', rows[i]), $('.actions', rows[i])], {{ opacity: 1, duration: 0.35 }}); }}

  function reset() {{
    gsap.killTweensOf([list, scan, cta, rows, imgs]);
    gsap.killTweensOf('.image-info, .actions');
    Flip.killFlipsOf(imgs);
    imgs.forEach(function (img, i) {{ figs[i].appendChild(img); }});
    gsap.set(imgs, {{ clearProps: 'all' }});
    gsap.set(list, {{ y: 0 }});
    gsap.set(rows, {{ opacity: 0 }});
    gsap.set('.image-info, .actions', {{ opacity: 0 }});
    gsap.set(scan, {{ opacity: 1 }});
    cta.textContent = 'Download originals';
    resetShowcase();
  }}

  /* Reduced motion: the finished state, no movement. */
  function settle() {{
    imgs.forEach(function (img, i) {{ slots[i].appendChild(img); }});
    gsap.set(imgs, {{ clearProps: 'all' }});
    gsap.set(rows, {{ opacity: 1 }});
    gsap.set('.image-info, .actions', {{ opacity: 1 }});
    gsap.set(scan, {{ opacity: 0 }});
  }}

{js_showcase}
  async function demo(id) {{
    reset();
    await wait(1.1, id);

    /* The scan ends and the list appears, still empty. */
    await done(gsap.to(scan, {{ opacity: 0, duration: 0.3 }}), id);
    await done(gsap.to(rows, {{ opacity: 1, duration: 0.45, stagger: 0.1 }}), id);
    await wait(0.25, id);

    /* Each picture leaves the Doc and lands in its card, one after another. */
    for (var i = 0; i < imgs.length; i++) {{
      if (i > 0) await showRow(i, id, 0.55);
      await move(imgs[i], slots[i], id, [2, 12]);
      showInfo(i);
      await wait(0.25, id);
    }}
    await showRow(0, id, 0.7);
    await showcase(id);
    await unwind(id);

    /* And back again, so the loop reads as "taken out, not removed". */
    for (var j = imgs.length - 1; j >= 0; j--) {{
      await showRow(j, id, 0.45);
      gsap.to([$('.image-info', rows[j]), $('.actions', rows[j])], {{ opacity: 0, duration: 0.25 }});
      await move(imgs[j], figs[j], id, [12, 2]);
    }}
    await showRow(0, id, 0.5);
    await done(gsap.to(rows, {{ opacity: 0, duration: 0.3 }}), id);
    await wait(0.9, id);
  }}

  async function loop(id) {{
    try {{ while (id === run) await demo(id); }} catch (e) {{ /* superseded by a newer run, or paused */ }}
  }}
  function start() {{ if (running) return; running = true; run += 1; loop(run); }}
  function stop() {{ running = false; run += 1; reset(); }}

  if (reduce) {{ settle(); return; }}

  /* Only play while the page is on screen and in the foreground. */
  var visible = true;
  new IntersectionObserver(function (e) {{ visible = e[0].isIntersecting; sync(); }}, {{ threshold: 0.25 }}).observe(stage);
  document.addEventListener('visibilitychange', sync);
  function sync() {{ (visible && !document.hidden) ? start() : stop(); }}
  reset();
  sync();
}})();
</script>
</body>
</html>
"""

out = ROOT / "brand" / "hero-flip.html"
out.write_text(html)
print(f"wrote {out} ({len(html) / 1024:.0f} KB)")
