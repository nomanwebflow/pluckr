/**
 * @OnlyCurrentDoc
 * Add an image extraction command to each Google Docs or Google Slides editor session.
 */
function onOpen() {
  var ui = getActiveUi_();
  if (!ui) return;
  var label = isSlides_() ? 'Extract images (Google reads this Presentation’s images)' : 'Extract images (Google reads this Doc’s images)';
  ui.createMenu('Pluckr')
    .addItem(label, 'openPluckrSidebar')
    .addToUi();
}

function onInstall() {
  onOpen();
}

function openPluckrSidebar() {
  // Rendered here, before the page loads: a still-valid entitlement lets the sidebar open straight onto the images
  // instead of flashing a "checking your licence" screen first.
  var bootData = { theme: getTheme_() };  // null until the user picks one; the page then follows the system setting
  var cached = cachedEntitlement_();
  if (cached) { bootData.entitlement = cached.entitlement; bootData.expiresAt = cached.expiresAt; }
  var boot = JSON.stringify(bootData).replace(/</g, '\\u003c');
  var page = HtmlService.createHtmlOutputFromFile('Sidebar').getContent()
    .replace('<!--PLUCKR_BOOT-->', function () { return '<script>window.PLUCKR_BOOT = ' + boot + ';document.documentElement.setAttribute("data-theme", window.PLUCKR_BOOT.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));</script>'; });
  var ui = getActiveUi_();
  if (ui) {
    ui.showSidebar(HtmlService.createHtmlOutput(page).setTitle('Pluckr'));
  }
}

function getActiveUi_() {
  try {
    if (typeof DocumentApp !== 'undefined') return DocumentApp.getUi();
  } catch (e) {}
  try {
    if (typeof SlidesApp !== 'undefined') return SlidesApp.getUi();
  } catch (e) {}
  return null;
}

function isSlides_() {
  try {
    if (typeof SlidesApp !== 'undefined' && SlidesApp.getActivePresentation()) return true;
  } catch (e) {}
  return false;
}

function getActiveContainer_() {
  try {
    if (typeof DocumentApp !== 'undefined') {
      var doc = DocumentApp.getActiveDocument();
      if (doc) return { type: 'doc', name: doc.getName(), images: collectDocumentImages_(doc) };
    }
  } catch (e) {}

  try {
    if (typeof SlidesApp !== 'undefined') {
      var pres = SlidesApp.getActivePresentation();
      if (pres) return { type: 'slide', name: pres.getName(), images: collectPresentationImages_(pres) };
    }
  } catch (e) {}

  throw new Error('No active Google Doc or Presentation found.');
}

/**
 * The last entitlement the licence service issued to this user, if it is still valid. Otherwise null.
 * Stored with the user's Google ID, so the signature can be checked here without asking Google for a token.
 */
function cachedEntitlement_() {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty('ENTITLEMENT_SECRET');
    var saved = JSON.parse(PropertiesService.getUserProperties().getProperty('entitlement') || 'null');
    if (!secret || !saved) return null;
    var parts = String(saved.entitlement).split('.');
    var exp = Number(parts[0]);
    var valid = parts.length === 2 && exp > Date.now() / 1000 + 60 &&
      constantTimeEquals_(signEntitlement_(secret, saved.sub + '.' + exp), parts[1]);
    return valid ? { entitlement: saved.entitlement, expiresAt: exp } : null;
  } catch (error) {
    return null;
  }
}

/** Called by the sidebar after the licence service confirms a licence. Only a verified entitlement is kept. */
function rememberEntitlement(entitlement) {
  if (!PropertiesService.getScriptProperties().getProperty('ENTITLEMENT_SECRET')) return;
  requireEntitlement_(entitlement);
  var sub = decodeJwtPayload_(ScriptApp.getIdentityToken()).sub;
  PropertiesService.getUserProperties().setProperty('entitlement', JSON.stringify({ entitlement: entitlement, sub: sub }));
}

function forgetEntitlement() {
  PropertiesService.getUserProperties().deleteProperty('entitlement');
}

/** Light or dark. Remembered per user once chosen; until then the sidebar follows the system theme. Applied before the page paints. */
function getTheme_() {
  var saved = PropertiesService.getUserProperties().getProperty('theme');
  return saved === 'light' || saved === 'dark' ? saved : null;
}

function setTheme(theme) {
  PropertiesService.getUserProperties().setProperty('theme', theme === 'light' ? 'light' : 'dark');
}

/** The AVIF encoder (deflated, base64), loaded by the sidebar only when AVIF is used. */
function getAvifCodec() {
  return HtmlService.createHtmlOutputFromFile('AvifCodec').getContent();
}

/** Google identity token for the licence service. Needs the openid and userinfo.email scopes in the manifest. */
function getIdentityToken() {
  return ScriptApp.getIdentityToken();
}

/**
 * Run once from the Apps Script editor. Logs the identity token's issuer and audience, which Convex needs
 * (GOOGLE_CLIENT_ID must equal "aud"). Logs claims only, never the token itself.
 */
function logIdentityTokenClaims() {
  var token = ScriptApp.getIdentityToken();
  if (!token) throw new Error('No identity token: add the openid and userinfo.email scopes to the manifest and re-authorize.');
  var claims = decodeJwtPayload_(token);
  Logger.log(JSON.stringify({ iss: claims.iss, aud: claims.aud, azp: claims.azp, emailInToken: Boolean(claims.email) }));
}

/**
 * The paywall. The sidebar gets an entitlement from the licence service and passes it with every call that
 * reads images; it is checked here offline with a secret shared with the licence service. Without the secret the
 * gate fails closed: a deleted or missing Script Property must never switch the paywall off.
 */
function requireEntitlement_(entitlement) {
  var secret = PropertiesService.getScriptProperties().getProperty('ENTITLEMENT_SECRET');
  if (!secret) throw new Error('GATE_UNCONFIGURED');

  var parts = String(entitlement || '').split('.');
  var exp = Number(parts[0]);
  var token = ScriptApp.getIdentityToken();
  var sub = token ? decodeJwtPayload_(token).sub : '';
  var valid = parts.length === 2 && exp && sub && exp > Date.now() / 1000 &&
    constantTimeEquals_(signEntitlement_(secret, sub + '.' + exp), parts[1]);
  if (!valid) throw new Error('LICENCE_REQUIRED');
}

function signEntitlement_(secret, text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(text, secret)).replace(/=+$/, '');
}

function decodeJwtPayload_(jwt) {
  var payload = String(jwt).split('.')[1] || '';
  while (payload.length % 4) payload += '=';
  return JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(payload)).getDataAsString());
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

/** Revoke this add-on's authorization for the current user; Docs asks for consent again next run. */
function logout() {
  forgetEntitlement();
  ScriptApp.invalidateAuth();
}

/** Return image previews and metadata for every tab/slide. */
function getDocumentInfo(entitlement) {
  requireEntitlement_(entitlement);
  var container = getActiveContainer_();
  return { documentName: container.name, count: container.images.length };
}

/**
 * One image's preview data.
 */
function getDocumentImage(index, entitlement) {
  requireEntitlement_(entitlement);
  var container = getActiveContainer_();
  var image = container.images[index];
  if (!image) throw new Error('This image is no longer in the file. Scan again.');
  return describeImage_(image, index);
}

/**
 * A batch of images starting at `start`, with the file's total image count.
 */
function getDocumentImages(start, count, entitlement) {
  requireEntitlement_(entitlement);
  var container = getActiveContainer_();
  var images = container.images;
  var end = Math.min(images.length, start + count);
  var batch = [];
  for (var index = start; index < end; index += 1) batch.push(describeImage_(images[index], index));
  return { documentName: container.name, total: images.length, images: batch };
}

function describeImage_(image, index) {
  var blob = image.getBlob();
  var bytes = blob.getBytes();
  var mimeType = blob.getContentType() || 'image/png';

  return {
    id: 'image-' + index,
    sourceIndex: index,
    name: 'image-' + String(index + 1).padStart(2, '0') + '.' + extensionForMime_(mimeType),
    mimeType: mimeType,
    size: bytes.length,
    width: image.getWidth(),
    height: image.getHeight(),
    data: Utilities.base64Encode(bytes)
  };
}

/** Package selected document images into a ZIP. `names` maps sourceIndex to a custom file name. */
function getImagesArchive(sourceIndexes, names, entitlement) {
  requireEntitlement_(entitlement);
  var container = getActiveContainer_();
  var images = container.images;
  var selected = {};
  (sourceIndexes || []).forEach(function (index) {
    selected[String(index)] = true;
  });
  names = names || {};
  var used = {};

  var blobs = images
    .map(function (image, index) { return { image: image, index: index }; })
    .filter(function (entry) { return selected[String(entry.index)]; })
    .map(function (entry, position) {
      var blob = entry.image.getBlob();
      var mimeType = blob.getContentType() || 'image/png';
      var name = String(names[String(entry.index)] || '').replace(/[\\/:*?"<>|]+/g, '-').trim() ||
        'image-' + String(position + 1).padStart(2, '0') + '.' + extensionForMime_(mimeType);
      while (used[name]) name = '(' + (used[name]++) + ') ' + name;
      used[name] = 1;
      return blob.setName(name);
    });

  if (!blobs.length) throw new Error('No images are available to download.');

  var archive = Utilities.zip(blobs, safeFileName_(container.name) + '-images.zip');
  return {
    name: archive.getName(),
    data: Utilities.base64Encode(archive.getBytes())
  };
}

function collectPresentationImages_(presentation) {
  var images = [];
  var slides = presentation.getSlides();
  slides.forEach(function (slide) {
    function walk(elements) {
      elements.forEach(function (element) {
        try {
          if (element.getPageElementType() === SlidesApp.PageElementType.IMAGE) {
            images.push(element.asImage());
          } else if (element.getPageElementType() === SlidesApp.PageElementType.GROUP) {
            walk(element.asGroup().getChildren());
          }
        } catch (e) {}
      });
    }
    walk(slide.getPageElements());
  });
  return images;
}

function collectDocumentImages_(document) {
  var images = [];

  function visitTabs(tabs) {
    tabs.forEach(function (tab) {
      if (tab.getType() === DocumentApp.TabType.DOCUMENT_TAB) {
        // One call per tab. Walking the tree with getChild() costs one call per element, which is slow in long documents.
        images = images.concat(tab.asDocumentTab().getBody().getImages());
      }
      visitTabs(tab.getChildTabs());
    });
  }

  visitTabs(document.getTabs());
  return images;
}

function extensionForMime_(mimeType) {
  var extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/webp': 'webp'
  };
  return extensions[mimeType] || 'img';
}

function safeFileName_(name) {
  return String(name || 'document')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'document';
}
