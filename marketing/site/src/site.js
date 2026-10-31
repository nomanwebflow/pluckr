// Theme, mobile menu and the hero workbench. The workbench converts the three sample photos
// in this tab with the canvas, so the sizes it shows are measured, not typed in.
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Theme: the choice is remembered, light otherwise. */
const setTheme = (t) => {
  root.dataset.theme = t;
  $$('.theme button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
  try { localStorage.setItem('pluckr-theme', t); } catch {}
};
$$('.theme button').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.theme)));
setTheme(root.dataset.theme || 'light');

/* Mobile menu */
const toggle = $('.menu-toggle');
const links = $('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; } });
}

/* Workbench */
const wb = $('#wb');
if (wb) initWorkbench();

function initWorkbench() {
  const DOC = 'west-coast-road-trip';
  const MIME = { webp: 'image/webp', jpeg: 'image/jpeg', png: 'image/png', avif: 'image/avif' };
  const EXT = { webp: 'webp', jpeg: 'jpg', png: 'png', avif: 'avif' };
  const items = $$('.shot', wb).map((el) => ({ el, src: el.dataset.src, on: true, bitmap: null, origBytes: 0, out: null }));
  const rows = $('#p-rows');
  const state = { fmt: 'webp', quality: 80, pattern: '{doc}-{n}' };
  const kb = (n) => `${Math.max(1, Math.round(n / 1024)).toLocaleString('en-US')} KB`;
  let run = 0;

  // AVIF only when this browser can encode it from a canvas. Pluckr itself ships its own encoder.
  const probe = document.createElement('canvas');
  probe.width = probe.height = 1;
  if (probe.toDataURL('image/avif').startsWith('data:image/avif')) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.fmt = 'avif'; b.setAttribute('aria-pressed', 'false'); b.textContent = 'AVIF';
    $('#p-fmt').insertBefore(b, $('#p-fmt [data-fmt="jpeg"]'));
  }

  const cleanName = (s) => s.replace(/[\\/:*?"<>|]+/g, '').trim();
  const nameFor = (i) => {
    const n = items.filter((x) => x.on).indexOf(items[i]) + 1;
    const base = cleanName(state.pattern.replace(/\{doc\}/g, DOC).replace(/\{n\}/g, String(n).padStart(2, '0'))) || `image-${n}`;
    return `${base}.${EXT[state.fmt]}`;
  };

  function paint() {
    const picked = items.filter((x) => x.on);
    items.forEach((it, i) => {
      it.el.setAttribute('aria-pressed', String(it.on));
      const row = rows.children[i];
      row.classList.toggle('is-off', !it.on);
      $('.p-name', row).textContent = it.on ? nameFor(i) : `image${i + 1}.jpg`;
      $('.p-meta', row).innerHTML = it.out
        ? `<span>${kb(it.origBytes)}</span><span aria-hidden="true">to</span><span class="win">${kb(it.out.size)}</span>`
        : `<span>${it.origBytes ? kb(it.origBytes) : 'Reading'}</span>`;
      $('.shot-name', it.el).textContent = it.on ? nameFor(i) : 'Not selected';
    });
    $('#p-count').textContent = `${picked.length} of ${items.length} selected`;
    const total = picked.reduce((a, x) => a + x.origBytes, 0);
    const done = picked.every((x) => x.out) && picked.length;
    const after = picked.reduce((a, x) => a + (x.out ? x.out.size : 0), 0);
    $('#p-sum').textContent = done ? `${kb(total)} becomes ${kb(after)}` : picked.length ? 'Converting in your browser' : 'Pick at least one image';
    const go = $('#p-go');
    go.disabled = !done;
    go.textContent = picked.length ? `Download ${picked.length} as ${EXT[state.fmt].toUpperCase()}` : 'Nothing selected';
    $('#p-qval').textContent = state.fmt === 'png' ? 'Lossless' : `${state.quality}`;
    $('#p-quality').parentElement.classList.toggle('is-off', state.fmt === 'png');
    $('#p-quality').style.setProperty('--pct', `${(state.quality - 10) / 0.9}%`);
  }

  async function convert() {
    const mine = ++run;
    items.forEach((it) => { it.out = null; });
    paint();
    for (const it of items) {
      if (!it.bitmap) continue;
      const c = document.createElement('canvas');
      c.width = it.bitmap.width; c.height = it.bitmap.height;
      const g = c.getContext('2d');
      if (state.fmt === 'jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); }
      g.drawImage(it.bitmap, 0, 0);
      const blob = await new Promise((r) => c.toBlob(r, MIME[state.fmt], state.quality / 100));
      if (mine !== run) return;
      it.out = blob;
      paint();
    }
  }

  let timer;
  const later = () => { clearTimeout(timer); timer = setTimeout(convert, 140); };

  items.forEach((it, i) => {
    const flip = () => { it.on = !it.on; paint(); };
    it.el.addEventListener('click', flip);
    rows.children[i].addEventListener('click', flip);
  });
  $('#p-all').addEventListener('click', () => { items.forEach((x) => { x.on = true; }); paint(); });
  $('#p-none').addEventListener('click', () => { items.forEach((x) => { x.on = false; }); paint(); });
  $('#p-pattern').addEventListener('input', (e) => { state.pattern = e.target.value || '{doc}-{n}'; paint(); });
  $('#p-fmt').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    state.fmt = b.dataset.fmt;
    $$('#p-fmt button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    convert();
  });
  $('#p-quality').addEventListener('input', (e) => { state.quality = +e.target.value; paint(); later(); });
  $('#p-go').addEventListener('click', () => {
    const files = items.map((it, i) => ({ it, name: nameFor(i) })).filter((f) => f.it.on && f.it.out);
    zip(files).then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${DOC}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    });
  });

  Promise.all(items.map(async (it) => {
    const blob = await (await fetch(it.src)).blob();
    it.origBytes = blob.size;
    it.bitmap = await createImageBitmap(blob);
  })).then(convert).catch(() => { $('#p-sum').textContent = 'Could not load the sample photos'; });
  paint();
}

/* A ZIP with stored (uncompressed) entries: converted images are already compressed. */
async function zip(files) {
  const enc = new TextEncoder();
  const table = new Uint32Array(256).map((_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
  const crc = (b) => { let c = ~0; for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8); return ~c >>> 0; };
  const parts = [], central = [];
  let offset = 0;
  for (const { it, name } of files) {
    const data = new Uint8Array(await it.out.arrayBuffer());
    const nm = enc.encode(name);
    const sum = crc(data);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true); head.setUint16(4, 20, true); head.setUint16(6, 0x0800, true);
    head.setUint32(14, sum, true); head.setUint32(18, data.length, true); head.setUint32(22, data.length, true); head.setUint16(26, nm.length, true);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true);
    cen.setUint32(16, sum, true); cen.setUint32(20, data.length, true); cen.setUint32(24, data.length, true); cen.setUint16(28, nm.length, true); cen.setUint32(42, offset, true);
    parts.push(head, nm, data);
    central.push(cen, nm);
    offset += 30 + nm.length + data.length;
  }
  const size = central.reduce((a, p) => a + (p.byteLength ?? p.length), 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, size, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end], { type: 'application/zip' });
}
