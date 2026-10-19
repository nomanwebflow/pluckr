import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FORMATS, baseName, detectSupportedFormats, processImage, zipBlobs } from './process.js';
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

function imageUrl(image) {
  return image.data ? `data:${image.mimeType || 'image/png'};base64,${image.data}` : image.src;
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
  if (image.data) {
    saveBlob(new Blob([decodeBase64(image.data)], { type: image.mimeType }), image.name);
    return;
  }

  const anchor = document.createElement('a');
  anchor.href = image.src;
  anchor.download = image.name;
  anchor.click();
}

/** The async clipboard only reliably takes PNG, so redraw whatever the image is. */
function copyImage(image) {
  return new Promise((resolve, reject) => {
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = source.naturalWidth || image.width || 1;
      canvas.height = source.naturalHeight || image.height || 1;
      canvas.getContext('2d').drawImage(source, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Could not read image.'));
        return navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]).then(resolve, reject);
      }, 'image/png');
    };
    source.onerror = () => reject(new Error('Could not load image.'));
    source.src = imageUrl(image);
  });
}

function withExtension(name, original) {
  const clean = name.trim();
  const extension = original.includes('.') ? original.slice(original.lastIndexOf('.')) : '';
  return clean.includes('.') || !extension ? clean : clean + extension;
}

function ImageRow({ image, result, onRename, onDownload }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(image.name);
  const [copyLabel, setCopyLabel] = useState('Copy');
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

  const copy = () => {
    copyImage(image).then(
      () => setCopyLabel('Copied'),
      () => setCopyLabel('Copy failed'),
    ).finally(() => window.setTimeout(() => setCopyLabel('Copy'), 1500));
  };

  return (
    <article className="image-row" aria-label={`Extracted image ${image.name}`}>
      <img className="thumb" src={imageUrl(image)} alt="" />
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
        </div>
        <div className="actions">
          <button className="action-button" type="button" onClick={copy}><span className="trim">{copyLabel}</span></button>
          <button className="action-button" type="button" onClick={() => onDownload(image, result)}><span className="trim">Download</span></button>
        </div>
      </div>
    </article>
  );
}

function useImageExtractor() {
  const scriptRun = useMemo(() => window.google?.script?.run, []);
  const isAppsScript = Boolean(scriptRun);
  const [images, setImages] = useState(isAppsScript ? [] : DEMO_IMAGES);
  const [loading, setLoading] = useState(isAppsScript);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const extractImages = useCallback(() => {
    setError('');
    setLoading(true);

    if (!isAppsScript) {
      setImages(DEMO_IMAGES);
      setLoading(false);
      return;
    }

    scriptRun
      .withSuccessHandler((result) => {
        setImages(result.images || []);
        setLoading(false);
      })
      .withFailureHandler((failure) => {
        setError(failure?.message || 'Could not read images from this document. Try again.');
        setLoading(false);
      })
      .getDocumentImages();
  }, [isAppsScript, scriptRun]);

  const renameImage = useCallback((id, name) => {
    setImages((current) => current.map((image) => (image.id === id ? { ...image, name } : image)));
  }, []);

  const downloadAll = useCallback(() => {
    if (images.length === 0) return;
    setError('');

    if (!isAppsScript) {
      images.forEach((image, index) => window.setTimeout(() => downloadImage(image), index * 250));
      return;
    }

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
        setError(failure?.message || 'Could not prepare the image download. Try again.');
      })
      .getImagesArchive(images.map((image) => image.sourceIndex), names);
  }, [images, isAppsScript, scriptRun]);

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

  useEffect(() => {
    if (isAppsScript) extractImages();
  }, [isAppsScript, extractImages]);

  return { images, loading, downloading, error, extractImages, renameImage, downloadAll, closeSidebar, logout };
}

function TopBar({ loading, extractImages, closeSidebar, logout }) {
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
      <button className="icon-button" type="button" aria-label="Extract images again" onClick={extractImages} disabled={loading}>
        <Asset name="refresh" className={loading ? 'is-spinning' : ''} />
      </button>
      <button className="icon-button" type="button" aria-label="More options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        <Asset name="more" />
      </button>
      {menuOpen && (
        <div className="menu" role="menu">
          <button className="menu-item" type="button" role="menuitem" onClick={closeSidebar}>Close sidebar</button>
          <button className="menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); logout(); }}>Log out</button>
        </div>
      )}
    </header>
  );
}

function Panel({ images, results, loading, error, onRename, onDownload }) {
  return (
    <section className="panel" aria-label="Extracted images" aria-live="polite">
      <div className="panel-texture" aria-hidden="true" />
      {loading && <p className="panel-message"><span className="loading-indicator" />Scanning your document…</p>}
      {!loading && error && <p className="panel-message is-error" role="alert">{error}</p>}
      {!loading && !error && images.length === 0 && <p className="panel-message">No images found in this document.</p>}
      {!loading && !error && images.map((image) => (
        <ImageRow key={image.id} image={image} result={results[image.id]} onRename={onRename} onDownload={onDownload} />
      ))}
    </section>
  );
}

const DEFAULT_SETTINGS = { format: null, quality: 80, maxWidth: '' };

function useProcessedImages(images, settings) {
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const idKey = images.map((image) => image.id).join('|');
  const { format, quality, maxWidth } = settings;

  useEffect(() => {
    if (!format) {
      setResults({});
      setBusy(false);
      return undefined;
    }

    let cancelled = false;
    setBusy(true);
    const timer = window.setTimeout(async () => {
      const next = {};
      for (const image of imagesRef.current) {
        try {
          next[image.id] = await processImage(imageUrl(image), image, { format, quality, maxWidth });
        } catch (failure) {
          next[image.id] = { error: failure.message };
        }
        if (cancelled) return;
      }
      setResults(next);
      setBusy(false);
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [idKey, format, quality, maxWidth]);

  return { results, busy };
}

function ExportPanel({ settings, onChange, supported }) {
  const [open, setOpen] = useState(true);
  const lossy = FORMATS.find((item) => item.id === settings.format)?.lossy;

  return (
    <section className="export" aria-label="Export settings">
      <button className="export-toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span className="trim">Format</span>
        <svg className={`chevron${open ? ' is-open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="format-row" role="group" aria-label="Format">
            {FORMATS.map((item) => {
              const available = supported[item.id] !== false;
              return (
                <button
                  key={item.id}
                  className={`format-button${settings.format === item.id ? ' is-active' : ''}`}
                  type="button"
                  aria-pressed={settings.format === item.id}
                  disabled={!available}
                  title={available ? undefined : `${item.label} is not supported in this browser`}
                  onClick={() => onChange({ format: settings.format === item.id ? null : item.id })}
                >
                  <span className="trim">{item.label}</span>
                </button>
              );
            })}
          </div>
          <label className={`slider-row${settings.format && lossy ? '' : ' is-off'}`}>
            <span className="tiny trim">Quality</span>
            <input
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
            <span className="tiny trim value">{settings.quality}%</span>
          </label>
          <label className={`slider-row${settings.format ? '' : ' is-off'}`}>
            <span className="tiny trim">Max width</span>
            <input
              className="width-input"
              type="number"
              min="16"
              inputMode="numeric"
              placeholder="Auto"
              value={settings.maxWidth}
              disabled={!settings.format}
              onChange={(event) => onChange({ maxWidth: event.target.value })}
            />
            <span className="tiny trim value">PX</span>
          </label>
        </>
      )}
    </section>
  );
}

function App() {
  const extractor = useImageExtractor();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [supported, setSupported] = useState({});
  const [zipping, setZipping] = useState(false);
  const [exportError, setExportError] = useState('');
  const { results, busy } = useProcessedImages(extractor.images, settings);
  const { format } = settings;
  const target = FORMATS.find((item) => item.id === format);

  useEffect(() => { detectSupportedFormats().then(setSupported); }, []);

  const updateSettings = (patch) => setSettings((current) => ({ ...current, ...patch }));

  const processedName = (image, result) => `${baseName(image.name)}.${result.ext}`;

  const downloadOne = (image, result) => {
    if (result?.blob) saveBlob(result.blob, processedName(image, result));
    else downloadImage(image);
  };

  const downloadAll = async () => {
    if (!format) {
      extractor.downloadAll();
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
    if (busy) return 'Processing…';
    return `Download ${extractor.images.length} as ${target.label}`;
  })();

  return (
    <main className="app-shell">
      <div className="sidebar">
        <TopBar loading={extractor.loading} extractImages={extractor.extractImages} closeSidebar={extractor.closeSidebar} logout={extractor.logout} />
        <Panel
          images={extractor.images}
          results={results}
          loading={extractor.loading}
          error={extractor.error || exportError}
          onRename={extractor.renameImage}
          onDownload={downloadOne}
        />
        <ExportPanel settings={settings} onChange={updateSettings} supported={supported} />
        <button
          className="primary-button"
          type="button"
          onClick={downloadAll}
          disabled={extractor.images.length === 0 || extractor.loading || extractor.downloading || zipping || (Boolean(format) && busy)}
        >
          <span className="trim">{label}</span>
        </button>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
