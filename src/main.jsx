import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ASPECTS, FORMATS, cancelEncoding, compressForDoc, detectSupportedFormats, exportName, prefetchAvifCodec, processImage } from './process.js';
import { zipBundle } from './bundle.js';
import { bulkNames } from './rename.js';
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
    altDescription: 'A portrait photo used as the demo image',
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

const lacksAlt = (image) => !(image.altDescription || image.altTitle);
// Pluckr runs in Docs and in Slides. The wording follows the editor it was opened in.
const HostContext = createContext('docs');
function useWords() {
  const slides = useContext(HostContext) === 'slides';
  return { noun: slides ? 'deck' : 'Doc', file: slides ? 'deck' : 'document' };
}

const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

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

async function originalBlob(image) {
  prepareOriginal(image);
  return image.blob || (await fetch(image.src)).blob();
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function slug(name) {
  return String(name || 'document').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'document';
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

function ImageRow({ image, result, thumbAspect, selected, onSelect, onRename, onDownload, onSaveAlt }) {
  const { noun } = useWords();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(image.name);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [downloadLabel, setDownloadLabel] = useState('Download');
  const [altLabel, setAltLabel] = useState('Copy alt');
  const [altEditing, setAltEditing] = useState(false);
  const [altDraft, setAltDraft] = useState('');
  const [altSaving, setAltSaving] = useState(false);
  const [altError, setAltError] = useState('');
  const alt = image.altDescription || image.altTitle || '';
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

  const copyAlt = () => {
    navigator.clipboard.writeText(alt).then(() => setAltLabel('Copied'), () => setAltLabel('Copy failed'))
      .finally(() => window.setTimeout(() => setAltLabel('Copy alt'), 1500));
  };

  const saveAltText = async () => {
    setAltSaving(true);
    setAltError('');
    try {
      await onSaveAlt(image.id, altDraft.trim());
      setAltEditing(false);
    } catch (failure) {
      setAltError(failure?.message || 'Could not save the alt text.');
    }
    setAltSaving(false);
  };

  const download = () => {
    setDownloadLabel('Starting…');
    onDownload(image, result);
    window.setTimeout(() => setDownloadLabel('Download'), 1500);
  };

  return (
    <article className={`image-row${selected ? '' : ' is-off'}`} aria-label={`Extracted image ${image.name}`}>
      <div className="thumb-wrap">
        <img className="thumb" src={imageUrl(image)} alt="" style={{ aspectRatio: thumbAspect }} />
        <input className="row-check" type="checkbox" checked={selected} aria-label={`Include ${image.name}`} onChange={(event) => onSelect(image.id, event.target.checked)} />
      </div>
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
          {altEditing ? (
            <div className="alt-edit">
              <textarea
                className="alt-input"
                rows={3}
                autoFocus
                value={altDraft}
                aria-label={`Alt text for ${image.name}`}
                placeholder="Describe the image"
                onChange={(event) => setAltDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setAltEditing(false);
                  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) saveAltText();
                }}
              />
              <div className="alt-edit-actions">
                <button className="mini-button" type="button" disabled={altSaving} onClick={() => setAltEditing(false)}>Cancel</button>
                <button className="mini-button" type="button" disabled={altSaving} onClick={saveAltText}>{altSaving ? 'Saving…' : `Save to ${noun}`}</button>
              </div>
              {altError && <p className="meta-note is-error" role="alert">{altError}</p>}
            </div>
          ) : (
            <div className="alt-row">
              <p className={`meta-note alt-text${alt ? '' : ' is-missing'}`} title={alt}>{alt ? `Alt: ${alt}` : 'No alt text'}</p>
              {alt && <button className="mini-button" type="button" onClick={copyAlt}>{altLabel}</button>}
              <button className="mini-button" type="button" onClick={() => { setAltDraft(alt); setAltError(''); setAltEditing(true); }}>{alt ? 'Edit' : 'Add alt'}</button>
            </div>
          )}
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
  const [documentName, setDocumentName] = useState('');
  // The server code says which editor this is. In the dev preview, #slides shows the Slides wording.
  const [host, setHost] = useState(boot?.host || (!isAppsScript && window.location.hash === '#slides' ? 'slides' : 'docs'));

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

    try {
      const info = await call('getDocumentInfo', entitlement);
      setDocumentName(info.documentName || '');
      if (info.host) setHost(info.host);
      // Every image is requested at once; Apps Script serves them in parallel.
      const found = await Promise.all(Array.from({ length: info.count }, (_, index) => call('getDocumentImage', index, entitlement)));
      const stale = takeBlobUrls();
      found.forEach(prepareOriginal);
      setImages(found);
      setDeselected(new Set());
      window.setTimeout(() => stale.forEach((url) => URL.revokeObjectURL(url)), 1000);
      // Not awaited: the list shows at once and the sizes correct themselves a moment later.
      Promise.all(found.map(naturalSize)).then((sizes) => {
        setImages((current) => current.map((image, index) => ({ ...image, ...(sizes[index]?.width ? sizes[index] : {}) })));
      });
    } catch (failure) {
      handleServerFailure(failure, 'Could not read images from this file. Try again.');
    }
    setLoading(false);
  }, [isAppsScript, scriptRun, ensureEntitlement, handleServerFailure]);

  /** One server call that needs a licence: the entitlement is appended as the last argument. */
  const serverCall = useCallback(async (method, ...args) => {
    const entitlement = await ensureEntitlement();
    if (entitlement === null) throw new Error('Unlock Pluckr to use this.');
    return new Promise((resolve, reject) => {
      scriptRun.withSuccessHandler(resolve).withFailureHandler((failure) => {
        if (String(failure?.message || '').includes('LICENCE_REQUIRED')) handleServerFailure(failure);
        reject(failure);
      })[method](...args, entitlement);
    });
  }, [scriptRun, ensureEntitlement, handleServerFailure]);

  const fetchMarkdown = useCallback(() => (isAppsScript
    ? serverCall('getDocumentMarkdown')
    : Promise.resolve({ markdown: '# Demo\n\n![Demo](pluckr-image:0)\n\n![Demo](pluckr-image:1)\n', imageCount: DEMO_IMAGES.length })), [isAppsScript, serverCall]);

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

  /** names: { [image id]: new name }. */
  const renameMany = useCallback((names) => {
    setImages((current) => current.map((image) => (names[image.id] ? { ...image, name: names[image.id] } : image)));
  }, []);

  /** Writes the alt text into the Doc, then updates the list. Clearing the text clears the title too. */
  const saveAlt = useCallback(async (id, text) => {
    const image = images.find((item) => item.id === id);
    if (!image) return;
    const title = text ? image.altTitle || '' : '';
    if (isAppsScript) await serverCall('setImageAlt', image.sourceIndex, title, text);
    setImages((current) => current.map((item) => (item.id === id ? { ...item, altTitle: title, altDescription: text } : item)));
  }, [images, isAppsScript, serverCall]);

  // Every image is ticked after a scan; the user unticks the ones to leave out.
  const [deselected, setDeselected] = useState(() => new Set());
  const chosen = useMemo(() => images.filter((image) => !deselected.has(image.id)), [images, deselected]);
  const setSelected = useCallback((id, on) => {
    setDeselected((current) => { const next = new Set(current); if (on) next.delete(id); else next.add(id); return next; });
  }, []);
  /** Ticks or unticks these images and leaves the rest as they are. */
  const setMany = useCallback((ids, on) => {
    setDeselected((current) => { const next = new Set(current); ids.forEach((id) => (on ? next.delete(id) : next.add(id))); return next; });
  }, []);

  const downloadAll = useCallback(async (list = images) => {
    if (list.length === 0) return;
    setError('');

    if (!isAppsScript) {
      list.forEach((image, index) => window.setTimeout(() => downloadImage(image), index * 250));
      return;
    }

    const entitlement = await ensureEntitlement();
    if (entitlement === null) return;

    const names = {};
    list.forEach((image) => { names[image.sourceIndex] = image.name; });
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
      .getImagesArchive(list.map((image) => image.sourceIndex), names, entitlement);
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
    images, loading, downloading, error, ready, licence, licenceError, checkoutUrl, documentName, host, isAppsScript, serverCall, fetchMarkdown,
    checkLicence, startCheckout, extractImages, renameImage, renameMany, saveAlt, chosen, deselected, setSelected, setMany, downloadAll, closeSidebar, logout,
  };
}

function TopBar({ loading, canScan, extractImages, closeSidebar, logout, theme, toggleTheme, onOptimize }) {
  const { noun } = useWords();
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
          {onOptimize && <button className="menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); onOptimize(); }}>Optimize {noun} images</button>}
          <button className="menu-item" type="button" role="menuitem" onClick={closeSidebar}>Close sidebar</button>
          <button className="menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); logout(); }}>Log out</button>
          <a className="menu-item" role="menuitem" href="https://docpluckr.com/privacy" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Privacy policy</a>
          <a className="menu-item" role="menuitem" href="https://docpluckr.com/terms" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Terms of use</a>
        </div>
      )}
    </header>
  );
}

function Panel({ images, results, thumbAspect, loading, error, deselected, missingOnly, onSelect, onRename, onDownload, onSaveAlt }) {
  const { file } = useWords();
  const hasAlt = (image) => Boolean(image.altDescription || image.altTitle);
  const visible = missingOnly ? images.filter((image) => !hasAlt(image)) : images;
  return (
    <section className="panel" aria-label="Extracted images" aria-live="polite">
      <div className="panel-texture" aria-hidden="true" />
      {loading && <p className="panel-message is-delayed"><span className="loading-indicator" />Scanning your {file}…</p>}
      {!loading && error && <p className="panel-message is-error" role="alert">{error}</p>}
      {!loading && !error && images.length === 0 && <p className="panel-message">No images found in this {file}.</p>}
      {!loading && !error && images.length > 0 && visible.length === 0 && <p className="panel-message">Every image has alt text.</p>}
      {!loading && !error && visible.map((image) => (
        <ImageRow key={image.id} image={image} result={results[image.id]} thumbAspect={thumbAspect} selected={!deselected.has(image.id)} onSelect={onSelect} onRename={onRename} onDownload={onDownload} onSaveAlt={onSaveAlt} />
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

/** An info icon beside a label. The note shows on hover or keyboard focus, and toggles on tap. */
function InfoTip({ label, children }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="info-tip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="info-button"
        type="button"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onFocus={(event) => { if (event.target.matches(':focus-visible')) setOpen(true); }}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 11v5.5" />
          <path d="M12 7.6v.01" />
        </svg>
      </button>
      <span className={`info-note${open ? ' is-open' : ''}`} id={id} role="tooltip">{children}</span>
    </span>
  );
}

/** A titled section that slides open and shut, shared by Bulk rename and Output settings. */
function Disclosure({ title, open, onToggle, children }) {
  // The dropdown lists need to overflow the panel, so clipping applies only while it is sliding. Closing clips at once.
  const [settled, setSettled] = useState(open);
  useEffect(() => {
    if (!open) setSettled(false);
    else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setSettled(true);
  }, [open]);

  return (
    <section className="export" aria-label={title}>
      <div className="panel-texture" aria-hidden="true" />
      <button className="export-toggle" type="button" aria-expanded={open} onClick={onToggle}>
        <span className="trim">{title}</span>
        <Asset name="chevron-down" className={`chevron${open ? '' : ' is-closed'}`} />
      </button>
      <div
        className={`export-body${open ? ' is-open' : ''}${settled ? ' is-settled' : ''}`}
        inert={!open}
        onTransitionEnd={(event) => { if (open && event.target === event.currentTarget && event.propertyName === 'grid-template-rows') setSettled(true); }}
      >
        <div className="export-clip">
          <div className="export-fields">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ExportPanel({ settings, onChange, supported, open, onToggle, extras, onExtras }) {
  const host = useContext(HostContext);
  const lossy = FORMATS.find((item) => item.id === settings.format)?.lossy;
  return (
    <Disclosure title="Output settings" open={open} onToggle={onToggle}>
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
            <div className="field-label-row">
              <span className="field-label">Aspect ratio</span>
              <InfoTip label="About aspect ratio">A fixed aspect ratio crops each image from the centre.</InfoTip>
            </div>
            <Select
              label="Aspect ratio"
              value={settings.aspect}
              options={ASPECTS}
              disabled={!settings.format}
              onChange={(aspect) => onChange({ aspect })}
            />
          </div>
          <div className={`field${settings.format ? '' : ' is-off'}`}>
            <div className="field-label-row">
              <label className="field-label" htmlFor="max-width">Max width (px)</label>
              <InfoTip label="About max width">Leave the width empty to keep the original size. Images are never enlarged.</InfoTip>
            </div>
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
          <label className="notice-agree">
            <input type="checkbox" checked={extras.metadata} onChange={(event) => onExtras({ metadata: event.target.checked })} />
            <span>Add alt text files (CSV and JSON)</span>
          </label>
          {host === 'docs' && (
            <label className="notice-agree">
              <input type="checkbox" checked={extras.markdown} onChange={(event) => onExtras({ markdown: event.target.checked })} />
              <span>Add the Doc as Markdown (content.md)</span>
            </label>
          )}
    </Disclosure>
  );
}

/** Which images the exports, renames and optimizing apply to. The buttons act on the images currently listed. */
function SelectionBar({ images, visible, chosenCount, allVisibleChosen, noAltCount, noAltOnly, onToggleAll, onNoAltOnly }) {
  return (
    <section className="export selection-bar" aria-label="Selection">
      <div className="panel-texture" aria-hidden="true" />
      <span className="selection-count" aria-live="polite">{chosenCount} of {images.length} selected</span>
      <div className="selection-actions">
        <button className="mini-button" type="button" disabled={visible.length === 0} onClick={onToggleAll}>{allVisibleChosen ? 'Clear' : 'Select all'}</button>
        <button className="mini-button" type="button" aria-pressed={noAltOnly} disabled={noAltCount === 0 && !noAltOnly} title="Show only images that have no alt text" onClick={onNoAltOnly}>No alt text ({noAltCount})</button>
      </div>
    </section>
  );
}

/** One pattern for every file name, with a live preview. Renames the list in the sidebar, not the Doc. */
function RenamePanel({ images, docName, open, onToggle, onApply }) {
  const [pattern, setPattern] = useState('{doc}-{n}');
  const [start, setStart] = useState(1);
  const [clean, setClean] = useState(true);
  const [applied, setApplied] = useState(false);
  const names = useMemo(
    () => bulkNames(images, { pattern, start: Number.isFinite(start) ? start : 1, clean, docName: docName || 'image' }),
    [images, pattern, start, clean, docName],
  );
  const shown = names.slice(0, 3);

  const apply = () => {
    onApply(Object.fromEntries(images.map((image, index) => [image.id, names[index]])));
    setApplied(true);
    window.setTimeout(() => setApplied(false), 1500);
  };

  return (
    <Disclosure title="Bulk rename" open={open} onToggle={onToggle}>
      <div className="field">
        <div className="field-label-row">
          <label className="field-label" htmlFor="rename-pattern">Name pattern</label>
          <InfoTip label="About name patterns">{'{n}'} is the number, {'{name}'} the current name, {'{doc}'} the file name and {'{alt}'} the alt text. The file type stays as it is.</InfoTip>
        </div>
        <input id="rename-pattern" className="field-input" value={pattern} spellCheck="false" onChange={(event) => setPattern(event.target.value)} />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="rename-start">Start numbering at</label>
        <input id="rename-start" className="field-input" type="number" min="0" inputMode="numeric" value={start} onChange={(event) => setStart(event.target.value === '' ? NaN : Number(event.target.value))} />
      </div>
      <label className="notice-agree">
        <input type="checkbox" checked={clean} onChange={(event) => setClean(event.target.checked)} />
        <span>Lowercase with hyphens</span>
      </label>
      <div className="field">
        <span className="field-label">Preview</span>
        <ul className="rename-preview" aria-label="Preview">
          {shown.map((name, index) => (
            <li key={images[index].id}>
              <span className="rename-old" title={images[index].name}>{images[index].name}</span>
              <span className="rename-new" title={name}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 5v6a3 3 0 0 0 3 3h11" /><path d="m15 10 4 4-4 4" /></svg>
                <span>{name}</span>
              </span>
            </li>
          ))}
          {names.length > shown.length && <li className="rename-more">and {names.length - shown.length} more</li>}
        </ul>
      </div>
      <button className="secondary-button" type="button" disabled={!pattern.trim() || images.length === 0} onClick={apply}>
        {applied ? 'Renamed' : `Rename ${count(images.length, 'image')}`}
      </button>
    </Disclosure>
  );
}

const PRESETS = [
  { id: 'web', label: 'Web friendly (1600 px, 82%)', maxWidth: 1600, quality: 82 },
  { id: 'light', label: 'Ultra light (1200 px, 75%)', maxWidth: 1200, quality: 75 },
];
const OPTIMIZABLE = ['image/jpeg', 'image/png', 'image/bmp'];

/** Shrinks the file's own images in place. It gets JPEG or PNG back; the size each image is drawn at does not change. */
function OptimizePanel({ images, serverCall, rescan, onBack }) {
  const { noun, file } = useWords();
  const [presetId, setPresetId] = useState('web');
  const [agreed, setAgreed] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const preset = PRESETS.find((item) => item.id === presetId);
  const candidates = images.filter((image) => OPTIMIZABLE.includes(image.mimeType)).length;

  const run = async () => {
    setRunning(true);
    setError('');
    setSummary(null);
    let before = 0;
    let after = 0;
    let replaced = 0;
    // One at a time and in order: each replacement keeps the image where it was, so the scan indexes stay valid.
    for (const [position, image] of images.entries()) {
      setProgress({ done: position, total: images.length });
      try {
        const smaller = await compressForDoc(image, preset);
        if (!smaller) continue;
        await serverCall('replaceDocumentImage', image.sourceIndex, await blobToBase64(smaller.blob), smaller.mimeType);
        before += image.size;
        after += smaller.blob.size;
        replaced += 1;
      } catch (failure) {
        setError(`Stopped at image ${position + 1}: ${failure.message}`);
        break;
      }
    }
    setProgress({ done: images.length, total: images.length });
    setSummary({ replaced, before, after });
    setRunning(false);
    await rescan();
  };

  return (
    <section className="privacy-notice" aria-labelledby="optimize-title" aria-live="polite">
      <div className="panel-texture" aria-hidden="true" />
      <Asset name="mark" className="notice-mark" />
      <h1 id="optimize-title">Optimize {noun} images</h1>
      <p>Shrinks the images inside this {file} so it opens and scrolls faster. Each image is redrawn at the size it already has on the page.</p>
      <p>{candidates} of {images.length} selected images can be optimized (JPEG, PNG and BMP). Others are left alone, and so is any image that would save less than a tenth.</p>
      <div className="field">
        <span className="field-label">Preset</span>
        <Select label="Preset" value={presetId} options={PRESETS} onChange={setPresetId} disabled={running} />
      </div>
      <p className="export-hint">This replaces images in your open {file}. Make a copy first (File &gt; Make a copy). You can also go back with File &gt; Version history. Cropping or rotation set in the editor may be lost.</p>
      <label className="notice-agree">
        <input type="checkbox" checked={agreed} disabled={running} onChange={(event) => setAgreed(event.target.checked)} />
        <span>I have a copy, or I am happy to replace the images in this {file}.</span>
      </label>
      {running && (
        <>
          <p>Optimizing image {Math.min(progress.done + 1, progress.total)} of {progress.total}…</p>
          <div className="progress"><span style={{ width: `${(progress.done / Math.max(progress.total, 1)) * 100}%` }} /></div>
        </>
      )}
      {summary && !running && (
        <p>{summary.replaced ? `Replaced ${summary.replaced} images. ${formatSize(summary.before)} became ${formatSize(summary.after)} (${Math.round((1 - summary.after / summary.before) * 100)}% smaller).` : 'Nothing needed replacing.'}</p>
      )}
      {error && <p className="notice-error" role="alert">{error}</p>}
      <div className="notice-actions">
        <button className="secondary-button" type="button" disabled={running} onClick={onBack}>Back</button>
        <button className="primary-button" type="button" disabled={!agreed || running || candidates === 0} onClick={run}>
          {running ? 'Optimizing…' : `Optimize ${count(candidates, 'image')}`}
        </button>
      </div>
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
              <p>Pluckr is a one-time purchase of {price}. Pay once and use it on any Doc or Slides deck with this Google account.</p>
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
  // One section open at a time: opening one closes the other.
  const [openSection, setOpenSection] = useState(null);
  const [missingOnly, setMissingOnly] = useState(false);
  const visibleImages = missingOnly ? extractor.images.filter(lacksAlt) : extractor.images;
  const exportOpen = openSection === 'export';
  const toggleSection = (name) => setOpenSection((current) => (current === name ? null : name));
  const [supported, setSupported] = useState({});
  const [zipping, setZipping] = useState(false);
  const [exportError, setExportError] = useState('');
  const [extras, setExtras] = useState({ metadata: false, markdown: false });
  // The hash lets the optimize screen be opened directly in the dev preview, where the menu item is hidden.
  const [view, setView] = useState(() => (window.location.hash === '#optimize' ? 'optimize' : 'images'));
  // A collapsed export section means "no conversion"; the choices are kept for when it reopens.
  const activeSettings = exportOpen ? settings : { ...settings, format: null };
  const bundle = exportOpen ? { ...extras, markdown: extras.markdown && extractor.host === 'docs' } : { metadata: false, markdown: false };
  const wantsBundle = bundle.metadata || bundle.markdown;
  const { results, converted, busy, convert } = useConverter(extractor.chosen, activeSettings);
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
    if (!format && !wantsBundle) {
      extractor.downloadAll(extractor.chosen);
      return;
    }
    if (format && !converted) {
      convert();
      return;
    }
    setExportError('');
    setZipping(true);
    try {
      const entries = [];
      for (const [position, image] of extractor.chosen.entries()) {
        const result = results[image.id];
        if (format && !result?.blob) continue;
        entries.push({
          blob: format ? result.blob : await originalBlob(image),
          name: format ? processedName(image, result) : image.name,
          width: format ? result.width : image.width,
          height: format ? result.height : image.height,
          format: format ? target.ext : String(image.mimeType || '').replace('image/', ''),
          original: { ...image, sourceIndex: image.sourceIndex ?? position },
        });
      }
      if (!entries.length) throw new Error('Nothing could be exported in this format.');
      let markdown = null;
      if (bundle.markdown) {
        const doc = await extractor.fetchMarkdown();
        if (doc.imageCount !== extractor.images.length) throw new Error('The Markdown and the scanned images do not line up. Scan again and retry.');
        markdown = doc.markdown;
      }
      const base = slug(extractor.documentName);
      const zipName = markdown ? `${base}-export.zip` : format ? `images-${target.ext}.zip` : `${base}-images.zip`;
      saveBlob(await zipBundle(entries, { metadata: bundle.metadata, markdown }), zipName);
    } catch (failure) {
      setExportError(failure.message);
    }
    setZipping(false);
  };

  const label = (() => {
    if (extractor.downloading || zipping) return 'Preparing download…';
    if (!format) {
      const all = extractor.chosen.length === extractor.images.length;
      if (wantsBundle) return all ? 'Download bundle' : `Download bundle of ${extractor.chosen.length}`;
      return all ? 'Download originals' : `Download ${count(extractor.chosen.length, 'original')}`;
    }
    if (busy) return 'Converting…';
    if (!converted) return 'Convert';
    return `Download ${extractor.chosen.length} as ${target.label}`;
  })();

  return (
    <HostContext.Provider value={extractor.host}>
    <main className="app-shell">
      <div className="sidebar">
<TopBar theme={theme} toggleTheme={toggleTheme} loading={extractor.loading} canScan={extractor.ready} extractImages={extractor.extractImages} closeSidebar={extractor.closeSidebar} logout={extractor.logout} onOptimize={extractor.ready && extractor.isAppsScript && view === 'images' ? () => setView('optimize') : undefined} />
        {extractor.ready && view === 'images' && extractor.images.length > 0 && !extractor.loading && (
          <SelectionBar
            images={extractor.images}
            visible={visibleImages}
            chosenCount={extractor.chosen.length}
            allVisibleChosen={visibleImages.length > 0 && visibleImages.every((image) => !extractor.deselected.has(image.id))}
            noAltCount={extractor.images.filter(lacksAlt).length}
            noAltOnly={missingOnly}
            onToggleAll={() => extractor.setMany(visibleImages.map((image) => image.id), !visibleImages.every((image) => !extractor.deselected.has(image.id)))}
            onNoAltOnly={() => setMissingOnly((value) => !value)}
          />
        )}
        {extractor.ready && view === 'optimize' ? (
          <OptimizePanel images={extractor.chosen} serverCall={extractor.serverCall} rescan={extractor.extractImages} onBack={() => setView('images')} />
        ) : extractor.ready ? (
          <Panel
            images={extractor.images}
            deselected={extractor.deselected}
            missingOnly={missingOnly}
            onSelect={extractor.setSelected}
            onSaveAlt={extractor.saveAlt}
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
        {extractor.ready && view === 'images' && (
          <>
          {extractor.chosen.length > 0 && (
            <RenamePanel images={extractor.chosen} docName={extractor.documentName} open={openSection === 'rename'} onToggle={() => toggleSection('rename')} onApply={extractor.renameMany} />
          )}
          <ExportPanel settings={settings} onChange={updateSettings} supported={supported} open={exportOpen} onToggle={() => toggleSection('export')} extras={extras} onExtras={(patch) => setExtras((current) => ({ ...current, ...patch }))} />
          <button
            className="primary-button"
            type="button"
            onClick={downloadAll}
            disabled={extractor.chosen.length === 0 || extractor.loading || extractor.downloading || zipping || busy}
          >
            <span className="trim">{label}</span>
          </button>
          </>
        )}
      </div>
    </main>
    </HostContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
