import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ASPECTS, FORMATS, cancelEncoding, detectSupportedFormats, exportName, prefetchAvifCodec, processImage, zipBlobs } from './process.js';
import { PAYWALL_ENABLED, PRICE_LABEL, createCheckout, fetchLicence } from './licence.js';
import './styles.css';

const DEMO_IMAGES = [
  {
    id: 'demo-1',
    name: 'Pluckr Add-on Test-image-1.png',
    mimeType: 'image/png',
    size: 308_940,
    width: 688,
    height: 1031,
    src: '/assets/demo-photo.png',
  },
  {
    id: 'demo-2',
    name: 'Product-overview.svg',
    mimeType: 'image/svg+xml',
    size: 186_410,
    width: 1200,
    height: 800,
    src: '/assets/sample-product.svg',
  },
];

function Asset({ name, className = '', alt = '' }) {
  const sources = window.PLUCKR_ASSETS || {};
  return <img className={className} src={sources[name] || `/assets/${name}.svg`} alt={alt} />;
}

function formatSize(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

function decodeBase64(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

/** Google reports the size an image is drawn at in the Doc, not its real pixels, so read the real size from the file. */
function naturalSize(image) {
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve({ width: probe.naturalWidth, height: probe.naturalHeight });
    probe.onerror = () => resolve({});
    probe.src = imageUrl(image);
  });
}

// Images fetched per server call, and how many such calls run at once.
const SCAN_BATCH_SIZE = 8;
const SCAN_CONCURRENCY = 4;

// Blob URLs created for the current scan; a rescan releases the previous scan's so a long session does not keep them all.
const blobUrls = new Set();
function takeBlobUrls() {
  const taken = [...blobUrls];
  blobUrls.clear();
  return taken;
}

function prepareOriginal(image) {
  if (image._blobUrl) return image._blobUrl;
  if (image.src) return image.src;
  if (image.blob) {
    image._blobUrl = URL.createObjectURL(image.blob);
    blobUrls.add(image._blobUrl);
    return image._blobUrl;
  }
  if (image.data) {
    image.blob = new Blob([decodeBase64(image.data)], { type: image.mimeType || 'image/png' });
    image._blobUrl = URL.createObjectURL(image.blob);
    blobUrls.add(image._blobUrl);
    return image._blobUrl;
  }
  return '';
}

function imageUrl(image) {
  return prepareOriginal(image);
}

function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadImage(image) {
  const url = imageUrl(image);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = image.name;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** The async clipboard only reliably takes PNG, so anything else is redrawn. PNGs are copied as they are. */
function imageAsPng(image) {
  if (image.mimeType === 'image/png') {
    if (image.blob) return Promise.resolve(image.blob);
    if (image.data) {
      image.blob = new Blob([decodeBase64(image.data)], { type: 'image/png' });
      return Promise.resolve(image.blob);
    }
  }
  return new Promise((resolve, reject) => {
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = source.naturalWidth || image.width || 1;
      canvas.height = source.naturalHeight || image.height || 1;
      canvas.getContext('2d').drawImage(source, 0, 0);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not read image.'))), 'image/png');
    };
    source.onerror = () => reject(new Error('Could not load image.'));
    source.src = imageUrl(image);
  });
}

// Handing the clipboard a promise inside the click keeps the user gesture valid while the PNG is prepared.
const copyImage = (image) => navigator.clipboard.write([new window.ClipboardItem({ 'image/png': imageAsPng(image) })]);

function withExtension(name, original) {
  const clean = name.trim();
  const extension = original.includes('.') ? original.slice(original.lastIndexOf('.')) : '';
  return clean.includes('.') || !extension ? clean : clean + extension;
}

function ImageRow({ image, result, thumbAspect, onRename, onDownload }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(image.name);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [downloadLabel, setDownloadLabel] = useState('Download');
  const shrunk = result?.blob;
  const dims = shrunk ? [result.width, result.height] : [image.width, image.height];
  const meta = [
    dims[0] && dims[1] ? `${dims[0]} × ${dims[1]}` : null,
    formatSize(image.size),
    shrunk ? `→ ${formatSize(result.blob.size)}` : null,
    result?.error ? `Failed: ${result.error}` : null,
  ].filter(Boolean);

  const commit = () => {
    setEditing(false);
    if (draft.trim()) onRename(image.id, withExtension(draft, image.name));
  };

  // Labels change on the click itself; the heavy work starts on the next frame so the press registers at once.
  const copy = () => {
    setCopyLabel('Copying…');
    copyImage(image).then(
      () => setCopyLabel('Copied'),
      () => setCopyLabel('Copy failed'),
    ).finally(() => window.setTimeout(() => setCopyLabel('Copy'), 1500));
  };

  const download = () => {
    setDownloadLabel('Starting…');
    onDownload(image, result);
    window.setTimeout(() => setDownloadLabel('Download'), 1500);
  };

  return (
    <article className="image-row" aria-label={`Extracted image ${image.name}`}>
      <img className="thumb" src={imageUrl(image)} alt="" style={{ aspectRatio: thumbAspect }} />
      <div className="image-body">
        <div className="image-info">
          <div className="name-row">
            {editing ? (
              <input
                className="name-input"
                autoFocus
                value={draft}
                aria-label="File name"
                onChange={(event) => setDraft(event.target.value)}
                onBlur={commit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') commit();
                  if (event.key === 'Escape') setEditing(false);
                }}
              />
            ) : (
              <p className="image-name" title={image.name}>{image.name}</p>
            )}
            <button
              className="edit-button"
              type="button"
              aria-label={`Rename ${image.name}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => (editing ? commit() : (setDraft(image.name), setEditing(true)))}
            >
              <Asset name="edit" />
            </button>
          </div>
          <div className="meta-row">
            {meta.map((item) => <p className="trim" key={item}>{item}</p>)}
          </div>
          {result?.note && <p className="meta-note">{result.note}</p>}
        </div>
        <div className="actions">
          <button className="action-button" type="button" onClick={copy}><span className="trim">{copyLabel}</span></button>
          <button className="action-button" type="button" onPointerEnter={() => prepareOriginal(image)} onFocus={() => prepareOriginal(image)} onClick={download}><span className="trim">{downloadLabel}</span></button>
        </div>
      </div>
    </article>
  );
}

function useImageExtractor() {
  const scriptRun = useMemo(() => window.google?.script?.run, []);
  const isAppsScript = Boolean(scriptRun);
  const paywall = isAppsScript && PAYWALL_ENABLED;
  // 'ready' also covers "paywall off". Otherwise: checking | unpaid | waiting (payment in progress) | error.
  // PLUCKR_BOOT is filled in by the add-on's server code when it still holds a valid entitlement.
  const boot = window.PLUCKR_BOOT;
  const [licence, setLicence] = useState(paywall && !boot?.entitlement ? 'checking' : 'ready');
  const [licenceError, setLicenceError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const entitlementRef = useRef({ token: boot?.entitlement || '', expiresAt: boot?.expiresAt || 0 });
  const [images, setImages] = useState(isAppsScript ? [] : DEMO_IMAGES);
  // Starts true in the add-on so the panel never paints an empty "no images" frame before the first scan begins.
  const [loading, setLoading] = useState(isAppsScript);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  // Identifies the latest scan, so a rescan makes batches still in flight from the previous one stop publishing.
  const scanRef = useRef(0);

  /** Ask the licence service. `silent` keeps the current screen unless the licence turns out to be missing. */
  const checkLicence = useCallback(async ({ silent = false } = {}) => {
    if (!paywall) return true;
    if (!silent) {
      setLicence('checking');
      setLicenceError('');
    }
    try {
      const result = await fetchLicence(scriptRun);
      if (result.licensed) {
        entitlementRef.current = { token: result.entitlement, expiresAt: result.expiresAt };
        scriptRun.withFailureHandler(() => {}).rememberEntitlement(result.entitlement);
        setLicence('ready');
        return true;
      }
      entitlementRef.current = { token: '', expiresAt: 0 };
      scriptRun.withFailureHandler(() => {}).forgetEntitlement();
      setLicence((current) => (current === 'waiting' ? current : 'unpaid'));
      return false;
    } catch (failure) {
      setLicenceError(failure.message);
      setLicence('error');
      return false;
    }
  }, [paywall, scriptRun]);

  /** A fresh entitlement for server calls, refreshed quietly when it is about to expire. Null = not licensed. */
  const ensureEntitlement = useCallback(async () => {
    if (!paywall) return '';
    const current = entitlementRef.current;
    if (current.token && current.expiresAt * 1000 > Date.now() + 60_000) return current.token;
    return (await checkLicence({ silent: true })) ? entitlementRef.current.token : null;
  }, [paywall, checkLicence]);

  const handleServerFailure = useCallback((failure, fallback) => {
    if (String(failure?.message || '').includes('LICENCE_REQUIRED')) {
      entitlementRef.current = { token: '', expiresAt: 0 };
      scriptRun.withFailureHandler(() => {}).forgetEntitlement();
      setLicence('unpaid');
      return;
    }
    if (String(failure?.message || '').includes('GATE_UNCONFIGURED')) {
      setError('Pluckr is temporarily unavailable. Please try again later or contact support@docpluckr.com.');
      return;
    }
    setError(failure?.message || fallback);
  }, [scriptRun]);

  const extractImages = useCallback(async () => {
    setError('');
    setLoading(true);

    if (!isAppsScript) {
      setImages(DEMO_IMAGES);
      setLoading(false);
      return;
    }

    const entitlement = await ensureEntitlement();
    if (entitlement === null) {
      setLoading(false);
      return;
    }

    const call = (method, ...args) => new Promise((resolve, reject) => {
      scriptRun.withSuccessHandler(resolve).withFailureHandler(reject)[method](...args);
    });

    const scan = scanRef.current + 1;
    scanRef.current = scan;
    const batches = [];
    const publish = () => setImages(batches.flat());

    try {
      // The first batch also reports the total, so no separate count call is needed.
      const first = await call('getDocumentImages', 0, SCAN_BATCH_SIZE, entitlement);
      const stale = takeBlobUrls();
      batches[0] = first.images;
      first.images.forEach(prepareOriginal);
      publish();
      window.setTimeout(() => stale.forEach((url) => URL.revokeObjectURL(url)), 1000);
      // The first images are on screen; the rest fill in as their batches arrive.
      setLoading(false);

      // Not awaited: sizes correct themselves a moment after their images appear.
      const correctSizes = (batch) => Promise.all(batch.map(naturalSize)).then((sizes) => {
        if (scanRef.current !== scan) return;
        const byId = new Map(batch.map((image, index) => [image.id, sizes[index]]));
        setImages((current) => current.map((image) => ({ ...image, ...(byId.get(image.id)?.width ? byId.get(image.id) : {}) })));
      });
      correctSizes(first.images);

      // A few batches in flight at once: each call walks the document, and Apps Script limits concurrent calls.
      let next = SCAN_BATCH_SIZE;
      const worker = async () => {
        while (next < first.total && scanRef.current === scan) {
          const start = next;
          next += SCAN_BATCH_SIZE;
          const { images: batch } = await call('getDocumentImages', start, SCAN_BATCH_SIZE, entitlement);
          if (scanRef.current !== scan) return;
          batch.forEach(prepareOriginal);
          batches[start / SCAN_BATCH_SIZE] = batch;
          publish();
          correctSizes(batch);
        }
      };
      await Promise.all(Array.from({ length: SCAN_CONCURRENCY }, worker));
    } catch (failure) {
      handleServerFailure(failure, 'Could not read images from this document. Try again.');
    }
    setLoading(false);
  }, [isAppsScript, scriptRun, ensureEntitlement, handleServerFailure]);

  const startCheckout = useCallback(async () => {
    setLicenceError('');
    try {
      const result = await createCheckout(scriptRun);
      if (result.licensed) {
        await checkLicence();
        return;
      }
      setCheckoutUrl(result.url);
      window.open(result.url, '_blank', 'noopener');
      setLicence('waiting');
    } catch (failure) {
      setLicenceError(failure.message);
    }
  }, [scriptRun, checkLicence]);

  const renameImage = useCallback((id, name) => {
    setImages((current) => current.map((image) => (image.id === id ? { ...image, name } : image)));
  }, []);

  const downloadAll = useCallback(async () => {
    if (images.length === 0) return;
    setError('');

    if (!isAppsScript) {
      images.forEach((image, index) => window.setTimeout(() => downloadImage(image), index * 250));
      return;
    }

    const entitlement = await ensureEntitlement();
    if (entitlement === null) return;

    const names = {};
    images.forEach((image) => { names[image.sourceIndex] = image.name; });
    setDownloading(true);
    scriptRun
      .withSuccessHandler((archive) => {
        saveBlob(new Blob([decodeBase64(archive.data)], { type: 'application/zip' }), archive.name);
        setDownloading(false);
      })
      .withFailureHandler((failure) => {
        setDownloading(false);
        handleServerFailure(failure, 'Could not prepare the image download. Try again.');
      })
      .getImagesArchive(images.map((image) => image.sourceIndex), names, entitlement);
  }, [images, isAppsScript, scriptRun, ensureEntitlement, handleServerFailure]);

  const closeSidebar = useCallback(() => {
    if (window.google?.script?.host?.close) window.google.script.host.close();
  }, []);

  const logout = useCallback(() => {
    if (!isAppsScript) return;
    scriptRun
      .withSuccessHandler(closeSidebar)
      .withFailureHandler((failure) => setError(failure?.message || 'Could not log out. Try again.'))
      .logout();
  }, [isAppsScript, scriptRun, closeSidebar]);

  // Check the licence on open, then scan once it is confirmed.
  useEffect(() => {
    if (paywall && !entitlementRef.current.token) checkLicence();
  }, [paywall, checkLicence]);

  useEffect(() => {
    if (isAppsScript && licence === 'ready') extractImages();
  }, [licence, isAppsScript, extractImages]);

  // While a checkout is open in another tab, poll until the payment shows up (about 5 minutes at most).
  useEffect(() => {
    if (licence !== 'waiting') return undefined;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (attempts > 75) {
        window.clearInterval(timer);
        setLicence('unpaid');
        return;
      }
      checkLicence({ silent: true });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [licence, checkLicence]);

  // Coming back from the checkout tab: re-check right away instead of waiting for the next poll.
  useEffect(() => {
    if (licence !== 'waiting' && licence !== 'unpaid') return undefined;
    const recheck = () => { if (document.visibilityState === 'visible') checkLicence({ silent: true }); };
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, [licence, checkLicence]);

  const ready = licence === 'ready';

  return {
    images, loading, downloading, error, ready, licence, licenceError, checkoutUrl,
    checkLicence, startCheckout, extractImages, renameImage, downloadAll, closeSidebar, logout,
  };
}

function TopBar({ loading, canScan, extractImages, closeSidebar, logout, theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const dismiss = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [menuOpen]);

  return (
    <header className="top-bar" ref={menuRef}>
      <Asset name="mark" className="brand-mark" />
      <p className="brand trim">Pluckr</p>
      {canScan && (
        <button className="icon-button" type="button" aria-label="Extract images again" onClick={extractImages} disabled={loading}>
          <Asset name="refresh" className={loading ? 'is-spinning' : ''} />
        </button>
      )}
      <button className="icon-button" type="button" aria-label="More options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        <Asset name="more" />
      </button>
      {menuOpen && (
        <div className="menu" role="menu">
          <button className="menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); toggleTheme(); }}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
          <button className="menu-item" type="button" role="menuitem" onClick={closeSidebar}>Close sidebar</button>
          <button className="menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); logout(); }}>Log out</button>
          <a className="menu-item" role="menuitem" href="https://docpluckr.com/privacy" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Privacy policy</a>
          <a className="menu-item" role="menuitem" href="https://docpluckr.com/terms" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Terms of use</a>
        </div>
      )}
    </header>
  );
}

function Panel({ images, results, thumbAspect, loading, error, onRename, onDownload }) {
  return (
    <section className="panel" aria-label="Extracted images" aria-live="polite">
      <div className="panel-texture" aria-hidden="true" />
      {loading && <p className="panel-message is-delayed"><span className="loading-indicator" />Scanning your document…</p>}
      {!loading && error && <p className="panel-message is-error" role="alert">{error}</p>}
      {!loading && !error && images.length === 0 && <p className="panel-message">No images found in this document.</p>}
      {!loading && !error && images.map((image) => (
        <ImageRow key={image.id} image={image} result={results[image.id]} thumbAspect={thumbAspect} onRename={onRename} onDownload={onDownload} />
      ))}
    </section>
  );
}

const DEFAULT_SETTINGS = { format: null, quality: 80, maxWidth: '', aspect: 'original' };
const FORMAT_OPTIONS = [{ id: null, label: 'Original' }, ...FORMATS];

/** Converts only when asked. Changing any setting discards earlier results instead of re-running. */
function useConverter(images, settings) {
  const [done, setDone] = useState({ key: null, results: {} });
  const [busy, setBusy] = useState(false);
  const runRef = useRef(0);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const { format, quality, maxWidth, aspect } = settings;
  // Ids repeat after a refresh, so key on content traits too; a renamed image must not invalidate results.
  const idKey = images.map((image) => `${image.id}:${image.size}:${image.width}x${image.height}`).join('|');
  const key = format ? `${idKey}|${format}|${quality}|${maxWidth}|${aspect}` : null;

  // Settings or images changed: abandon a running conversion, its result would be for the wrong settings.
  useEffect(() => {
    runRef.current += 1;
    cancelEncoding();
    setBusy(false);
  }, [key]);

  useEffect(() => cancelEncoding, []);

  const convert = useCallback(async () => {
    if (!key) return;
    const run = runRef.current + 1;
    runRef.current = run;
    setBusy(true);
    setDone({ key, results: {} });
    const currentImages = imagesRef.current;
    await Promise.all(
      currentImages.map(async (image) => {
        try {
          const res = await processImage(image, image, { format, quality, maxWidth, aspect });
          if (runRef.current !== run) return;
          setDone((prev) => (prev.key === key ? { key, results: { ...prev.results, [image.id]: res } } : prev));
        } catch (failure) {
          if (runRef.current !== run) return;
          setDone((prev) => (prev.key === key ? { key, results: { ...prev.results, [image.id]: { error: failure.message } } } : prev));
        }
      })
    );
    if (runRef.current === run) {
      setBusy(false);
    }
  }, [key, format, quality, maxWidth, aspect]);

  const converted = key !== null && done.key === key && !busy && Object.keys(done.results).length > 0;
  return { results: done.key === key ? done.results : {}, converted, busy, convert };
}

function Select({ value, options, onChange, label, disabled = false, isAvailable = () => true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((option) => option.id === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const dismiss = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [open]);

  return (
    <div className="select" ref={ref} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}>
      <button
        className="select-button"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current.label}`}
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="select-value">{current.label}</span>
        <Asset name="chevron-down" className={`chevron${open ? ' is-flipped' : ''}`} />
      </button>
      {open && (
        <div className="select-list" role="listbox" aria-label={label}>
          {options.map((option) => {
            const available = isAvailable(option);
            return (
              <button
                key={option.label}
                className="select-option"
                type="button"
                role="option"
                aria-selected={option.id === value}
                disabled={!available}
                title={available ? undefined : `${option.label} is not supported in this browser`}
                onClick={() => { onChange(option.id); setOpen(false); }}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExportPanel({ settings, onChange, supported, open, onToggle }) {
  const lossy = FORMATS.find((item) => item.id === settings.format)?.lossy;

  return (
    <section className="export" aria-label="Output settings">
      <div className="panel-texture" aria-hidden="true" />
      <button className="export-toggle" type="button" aria-expanded={open} onClick={onToggle}>
        <span className="trim">Output settings</span>
        <Asset name="chevron-down" className={`chevron${open ? '' : ' is-closed'}`} />
      </button>
      {open && (
        <>
          <div className="field">
            <span className="field-label" id="format-label">Format</span>
            <Select
              label="Output format"
              value={settings.format}
              options={FORMAT_OPTIONS}
              onChange={(format) => onChange({ format })}
              isAvailable={(option) => option.id === null || supported[option.id] !== false}
            />
          </div>
          <div className={`field${settings.format && lossy ? '' : ' is-off'}`}>
            <label className="field-head" htmlFor="quality">
              <span className="field-label is-strong">Quality</span>
              <span className="field-value">{settings.quality}%</span>
            </label>
            <input
              id="quality"
              className="slider"
              type="range"
              min="10"
              max="100"
              step="1"
              value={settings.quality}
              disabled={!settings.format || !lossy}
              style={{ '--pct': `${((settings.quality - 10) / 90) * 100}%` }}
              onChange={(event) => onChange({ quality: Number(event.target.value) })}
            />
          </div>
          <div className={`field${settings.format ? '' : ' is-off'}`}>
            <span className="field-label">Aspect ratio</span>
            <Select
              label="Aspect ratio"
              value={settings.aspect}
              options={ASPECTS}
              disabled={!settings.format}
              onChange={(aspect) => onChange({ aspect })}
            />
          </div>
          <div className={`field${settings.format ? '' : ' is-off'}`}>
            <label className="field-label" htmlFor="max-width">Max width (px)</label>
            <input
              id="max-width"
              className="field-input"
              type="number"
              min="16"
              inputMode="numeric"
              placeholder="Auto"
              value={settings.maxWidth}
              disabled={!settings.format}
              onChange={(event) => onChange({ maxWidth: event.target.value })}
            />
          </div>
          <p className="export-hint">A fixed aspect ratio crops from the centre. Leave the width empty to keep the original size; images are never enlarged.</p>
        </>
      )}
    </section>
  );
}

function PaywallNotice({ state, error, price, checkoutUrl, onBuy, onCheck }) {
  const [agreed, setAgreed] = useState(false);
  const checking = state === 'checking';
  const waiting = state === 'waiting';
  return (
    <section className={`privacy-notice${checking ? ' is-checking' : ''}`} aria-labelledby="paywall-title" aria-live="polite">
      <div className="panel-texture" aria-hidden="true" />
      <Asset name="mark" className="notice-mark" />
      {checking ? (
        <p className="panel-message is-delayed"><span className="loading-indicator" />Checking your licence…</p>
      ) : (
        <>
          <h1 id="paywall-title">{waiting ? 'Waiting for your payment' : 'Unlock Pluckr'}</h1>
          {waiting ? (
            <p>Finish checking out in the tab that just opened. This screen updates by itself when your payment goes through.</p>
          ) : (
            <>
              <p>Pluckr is a one-time purchase of {price}. Pay once and use it on any Doc with this Google account.</p>
              <p>You check out securely with Polar. Pluckr never sees your card details, and uses your Google email only to find your licence. Document images are never sent to Pluckr's servers.</p>
              {state !== 'error' && (
                <label className="notice-agree">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                  <span>
                    I agree to the <a href="https://docpluckr.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://docpluckr.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>.
                  </span>
                </label>
              )}
            </>
          )}
          {error && <p className="notice-error" role="alert">{error}</p>}
          <div className="notice-actions">
            {waiting ? (
              <>
                <a className="secondary-button" href={checkoutUrl} target="_blank" rel="noopener noreferrer">Open checkout again</a>
                <button className="primary-button" type="button" onClick={onCheck}>I have paid, check again</button>
              </>
            ) : (
              <>
                {state === 'unpaid' && <button className="secondary-button" type="button" onClick={onCheck}>I have already paid</button>}
                <button className="primary-button" type="button" disabled={state !== 'error' && !agreed} onClick={state === 'error' ? onCheck : onBuy}>
                  {state === 'error' ? 'Try again' : `Buy Pluckr for ${price}`}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function App() {
  const extractor = useImageExtractor();
  // The add-on's server code picks the saved theme before the page loads; dark is the default.
  const systemLight = useMemo(() => window.matchMedia('(prefers-color-scheme: light)'), []);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || (systemLight.matches ? 'light' : 'dark'));
  const chosen = useRef(Boolean(window.PLUCKR_BOOT?.theme));
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  // With no saved choice, follow the system setting, including when it changes while the sidebar is open.
  useEffect(() => {
    const follow = () => { if (!chosen.current) setTheme(systemLight.matches ? 'light' : 'dark'); };
    systemLight.addEventListener('change', follow);
    return () => systemLight.removeEventListener('change', follow);
  }, [systemLight]);
  const toggleTheme = () => {
    chosen.current = true;
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
    window.google?.script?.run?.withFailureHandler(() => {}).setTheme(next);
  };
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [exportOpen, setExportOpen] = useState(false);
  const [supported, setSupported] = useState({});
  const [zipping, setZipping] = useState(false);
  const [exportError, setExportError] = useState('');
  // A collapsed export section means "no conversion"; the choices are kept for when it reopens.
  const activeSettings = exportOpen ? settings : { ...settings, format: null };
  const { results, converted, busy, convert } = useConverter(extractor.images, activeSettings);
  const { format } = activeSettings;
  // The thumbnail previews the centred crop a fixed aspect ratio will make; otherwise the design's square.
  const previewAspect = format && activeSettings.aspect !== 'original' ? activeSettings.aspect.replace(':', ' / ') : '1 / 1';
  const target = FORMATS.find((item) => item.id === format);

  useEffect(() => { detectSupportedFormats().then(setSupported); }, []);

  const updateSettings = (patch) => {
    if (patch.format === 'avif') prefetchAvifCodec();
    setSettings((current) => ({ ...current, ...patch }));
  };

  const processedName = (image, result) => exportName(image.name, result.ext);

  const downloadOne = (image, result) => {
    if (result?.blob) saveBlob(result.blob, processedName(image, result));
    else downloadImage(image);
  };

  const downloadAll = async () => {
    if (!format) {
      extractor.downloadAll();
      return;
    }
    if (!converted) {
      convert();
      return;
    }
    setExportError('');
    setZipping(true);
    try {
      const entries = extractor.images
        .filter((image) => results[image.id]?.blob)
        .map((image) => ({ name: processedName(image, results[image.id]), blob: results[image.id].blob }));
      if (!entries.length) throw new Error('Nothing could be exported in this format.');
      saveBlob(await zipBlobs(entries), `images-${target.ext}.zip`);
    } catch (failure) {
      setExportError(failure.message);
    }
    setZipping(false);
  };

  const label = (() => {
    if (extractor.downloading || zipping) return 'Preparing download…';
    if (!format) return 'Download originals';
    if (busy) return 'Converting…';
    if (!converted) return 'Convert';
    return `Download ${extractor.images.length} as ${target.label}`;
  })();

  return (
    <main className="app-shell">
      <div className="sidebar">
<TopBar theme={theme} toggleTheme={toggleTheme} loading={extractor.loading} canScan={extractor.ready} extractImages={extractor.extractImages} closeSidebar={extractor.closeSidebar} logout={extractor.logout} />
        {extractor.ready ? (
          <Panel
            images={extractor.images}
            results={results}
          thumbAspect={previewAspect}
            loading={extractor.loading}
            error={extractor.error || exportError}
            onRename={extractor.renameImage}
            onDownload={downloadOne}
          />
        ) : (
          <PaywallNotice
            state={extractor.licence}
            error={extractor.licenceError}
            price={PRICE_LABEL}
            checkoutUrl={extractor.checkoutUrl}
            onBuy={extractor.startCheckout}
            onCheck={() => extractor.checkLicence()}
          />
        )}
        {extractor.ready && (
          <>
          <ExportPanel settings={settings} onChange={updateSettings} supported={supported} open={exportOpen} onToggle={() => setExportOpen((value) => !value)} />
          <button
            className="primary-button"
            type="button"
            onClick={downloadAll}
            disabled={extractor.images.length === 0 || extractor.loading || extractor.downloading || zipping || busy}
          >
            <span className="trim">{label}</span>
          </button>
          </>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
