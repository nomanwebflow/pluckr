/**
 * @OnlyCurrentDoc
 * Add an image extraction command to each Google Docs and Google Slides editor session.
 */
function onOpen() {
  var slides = host_() === 'slides';
  var ui = ui_();
  // The standard add-on menu in both editors: Extensions > Pluckr > Extract images.
  ui.createAddonMenu()
    .addItem(slides ? 'Extract images (Google reads this deck’s images)' : 'Extract images (Google reads this Doc’s images)', 'openPluckrSidebar')
    .addToUi();
}

/**
 * Which editor this run is in: 'docs' or 'slides'. Asked through getUi(), which each App refuses outside its own editor.
 * getActiveDocument() / getActivePresentation() are not used here: before the user has authorized the add-on they
 * throw in onOpen, and the menu would never appear.
 */
var hostCache_ = null;
function host_() {
  if (hostCache_) return hostCache_;
  try { DocumentApp.getUi(); return (hostCache_ = 'docs'); } catch (error) { /* not Docs */ }
  try { SlidesApp.getUi(); return (hostCache_ = 'slides'); } catch (error) { /* not Slides */ }
  throw new Error('Open Pluckr from a Google Doc or a Google Slides deck.');
}

function ui_() {
  return host_() === 'slides' ? SlidesApp.getUi() : DocumentApp.getUi();
}

function onInstall() {
  onOpen();
}

function openPluckrSidebar() {
  // Rendered here, before the page loads: a still-valid entitlement lets the sidebar open straight onto the images
  // instead of flashing a "checking your licence" screen first.
  var bootData = { theme: getTheme_(), host: host_() };  // null until the user picks one; the page then follows the system setting
  var cached = cachedEntitlement_();
  if (cached) { bootData.entitlement = cached.entitlement; bootData.expiresAt = cached.expiresAt; }
  var boot = JSON.stringify(bootData).replace(/</g, '\\u003c');
  var page = HtmlService.createHtmlOutputFromFile('Sidebar').getContent()
    .replace('<!--PLUCKR_BOOT-->', function () { return '<script>window.PLUCKR_BOOT = ' + boot + ';document.documentElement.setAttribute("data-theme", window.PLUCKR_BOOT.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));</script>'; });
  ui_().showSidebar(HtmlService.createHtmlOutput(page).setTitle('Pluckr'));
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

/** The name of the open file, how many images it holds, and which editor it is. */
function getDocumentInfo(entitlement) {
  requireEntitlement_(entitlement);
  var host = host_();
  var name = host === 'slides' ? SlidesApp.getActivePresentation().getName() : DocumentApp.getActiveDocument().getName();
  return { documentName: name, host: host, count: collectImages_().length };
}

/**
 * One image's preview data. The sidebar asks for every image at once: Apps Script runs the calls in parallel, so
 * a scan takes as long as the slowest image instead of the sum of all of them.
 */
function getDocumentImage(index, entitlement) {
  requireEntitlement_(entitlement);
  var entry = collectImages_()[index];
  if (!entry) throw new Error('This image is no longer in the file. Scan again.');
  var image = entry.image;
  var blob = image.getBlob();
  var bytes = blob.getBytes();
  var mimeType = blob.getContentType() || 'image/png';

  return {
    id: 'image-' + index,
    sourceIndex: index,
    name: entry.name + '.' + extensionForMime_(mimeType),
    mimeType: mimeType,
    size: bytes.length,
    width: Math.round(image.getWidth()),
    height: Math.round(image.getHeight()),
    altTitle: altTitle_(image),
    altDescription: altDescription_(image),
    linkUrl: linkUrl_(image),
    data: Utilities.base64Encode(bytes)
  };
}

/** Save an image's alt text into the file. The sidebar calls this only when the user presses Save. */
function setImageAlt(index, altTitle, altDescription, entitlement) {
  requireEntitlement_(entitlement);
  var entry = collectImages_()[index];
  if (!entry) throw new Error('This image is no longer in the file. Scan again.');
  setAlt_(entry.image, String(altTitle || ''), String(altDescription || ''));
  return true;
}

/**
 * Swap one image for a smaller copy, in place. The new image takes the old one's displayed size, alt text and link,
 * so the page looks the same. The sidebar calls this one image at a time, in order, so indexes stay valid.
 */
function replaceDocumentImage(index, data, mimeType, entitlement) {
  requireEntitlement_(entitlement);
  // Apps Script only inserts these (no WebP or AVIF).
  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') throw new Error('Unsupported image type.');
  var entry = collectImages_()[index];
  if (!entry) throw new Error('This image is no longer in the file. Scan again.');
  var target = entry.image;
  var blob = Utilities.newBlob(Utilities.base64Decode(data), mimeType, 'image');

  var title = altTitle_(target);
  var description = altDescription_(target);
  var link = linkUrl_(target);

  if (host_() === 'slides') {
    // Slides swaps the picture inside the same box: same place, same size, scaled to fit.
    var swapped = target.replace(blob, false);
    if (title || description) setAlt_(swapped, title, description);
    if (link) swapped.setLinkUrl(link);
    return true;
  }

  var parent = target.getParent();
  var position = parent.getChildIndex(target);
  var width = target.getWidth();
  var height = target.getHeight();
  var made = parent.getType() === DocumentApp.ElementType.LIST_ITEM
    ? parent.asListItem().insertInlineImage(position, blob)
    : parent.asParagraph().insertInlineImage(position, blob);
  made.setWidth(width).setHeight(height);
  if (title || description) setAlt_(made, title, description);
  if (link) made.setLinkUrl(link);
  target.removeFromParent();
  return true;
}

/**
 * The document as Markdown. Images come out as ![alt](pluckr-image:N), where N is the image's scan index; the sidebar
 * swaps that for the exported file's path. Also returns how many images it met so the sidebar can check the two agree.
 */
function getDocumentMarkdown(entitlement) {
  requireEntitlement_(entitlement);
  if (host_() !== 'docs') throw new Error('Markdown export is only available in Google Docs.');
  var state = { image: 0 };
  var parts = [];

  function visitTabs(tabs) {
    tabs.forEach(function (tab) {
      if (tab.getType() === DocumentApp.TabType.DOCUMENT_TAB) parts.push(containerMarkdown_(tab.asDocumentTab().getBody(), state));
      visitTabs(tab.getChildTabs());
    });
  }

  visitTabs(DocumentApp.getActiveDocument().getTabs());
  return { markdown: parts.filter(Boolean).join('\n\n') + '\n', imageCount: state.image };
}

function containerMarkdown_(container, state) {
  var blocks = [];
  for (var i = 0; i < container.getNumChildren(); i += 1) {
    var child = container.getChild(i);
    var type = child.getType();
    var block = null;
    if (type === DocumentApp.ElementType.PARAGRAPH) block = { text: paragraphMarkdown_(child.asParagraph(), state) };
    else if (type === DocumentApp.ElementType.LIST_ITEM) block = { text: listItemMarkdown_(child.asListItem(), state), list: true };
    else if (type === DocumentApp.ElementType.TABLE) block = { text: tableMarkdown_(child.asTable(), state) };
    else if (type === DocumentApp.ElementType.HORIZONTAL_RULE) block = { text: '---' };
    if (block && block.text) blocks.push(block);
  }
  return blocks.map(function (block, i) {
    if (!i) return block.text;
    return (block.list && blocks[i - 1].list ? '\n' : '\n\n') + block.text;
  }).join('');
}

function paragraphMarkdown_(paragraph, state) {
  var heading = paragraph.getHeading();
  var H = DocumentApp.ParagraphHeading;
  var levels = {};
  levels[H.TITLE] = '# '; levels[H.HEADING1] = '# '; levels[H.HEADING2] = '## '; levels[H.HEADING3] = '### ';
  levels[H.HEADING4] = '#### '; levels[H.HEADING5] = '##### '; levels[H.HEADING6] = '###### ';
  var prefix = levels[heading] || '';
  var text = inlineMarkdown_(paragraph, state, Boolean(prefix)).trim();
  return text ? prefix + text : '';
}

function listItemMarkdown_(item, state) {
  var glyph = String(item.getGlyphType());
  var marker = /NUMBER|LATIN|ROMAN/.test(glyph) ? '1. ' : '- ';
  return '    '.repeat(item.getNestingLevel()) + marker + inlineMarkdown_(item, state, false).trim();
}

function tableMarkdown_(table, state) {
  var rows = [];
  var width = 0;
  for (var r = 0; r < table.getNumRows(); r += 1) {
    var row = table.getRow(r);
    var cells = [];
    for (var c = 0; c < row.getNumCells(); c += 1) {
      var cell = row.getCell(c);
      var lines = [];
      for (var k = 0; k < cell.getNumChildren(); k += 1) {
        var child = cell.getChild(k);
        var type = child.getType();
        if (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM) {
          var line = inlineMarkdown_(child, state, false).trim();
          if (line) lines.push(line);
        }
      }
      cells.push(lines.join('<br>'));
    }
    width = Math.max(width, cells.length);
    rows.push(cells);
  }
  if (!rows.length || !width) return '';
  var pad = function (cells) { while (cells.length < width) cells.push(''); return '| ' + cells.join(' | ') + ' |'; };
  var separator = '|' + Array(width + 1).join(' --- |');
  return [pad(rows[0]), separator].concat(rows.slice(1).map(pad)).join('\n');
}

/** Text and images of one paragraph or list item. Headings skip bold, which is already how a heading looks. */
function inlineMarkdown_(element, state, plainBold) {
  var out = '';
  for (var i = 0; i < element.getNumChildren(); i += 1) {
    var child = element.getChild(i);
    var type = child.getType();
    if (type === DocumentApp.ElementType.TEXT) out += textMarkdown_(child.asText(), plainBold);
    else if (type === DocumentApp.ElementType.INLINE_IMAGE) out += imageMarkdown_(child.asInlineImage(), state);
  }
  return out;
}

function imageMarkdown_(image, state) {
  var alt = String(image.getAltDescription() || image.getAltTitle() || '').replace(/\s+/g, ' ').replace(/([\[\]\\])/g, '\\$1');
  var markdown = '![' + alt + '](pluckr-image:' + state.image + ')';
  state.image += 1;
  var link = image.getLinkUrl();
  return link ? '[' + markdown + '](' + link + ')' : markdown;
}

function textMarkdown_(text, plainBold) {
  var content = text.getText();
  if (!content) return '';
  var starts = text.getTextAttributeIndices();
  var segments = [];
  starts.forEach(function (start, i) {
    var piece = content.substring(start, i + 1 < starts.length ? starts[i + 1] : content.length);
    if (!piece) return;
    var font = String(text.getFontFamily(start) || '');
    var style = {
      code: /mono|courier|consolas/i.test(font),
      bold: !plainBold && Boolean(text.isBold(start)),
      italic: Boolean(text.isItalic(start)),
      strike: Boolean(text.isStrikethrough(start)),
      link: text.getLinkUrl(start) || ''
    };
    var key = JSON.stringify(style);
    var last = segments[segments.length - 1];
    if (last && last.key === key) last.text += piece; else segments.push({ key: key, style: style, text: piece });
  });

  return segments.map(function (segment) {
    var body = segment.text.replace(/\r|\u000b/g, '  \n');
    var core = body.trim();
    if (!core) return body;
    var lead = body.substring(0, body.indexOf(core));
    var trail = body.substring(lead.length + core.length);
    var s = segment.style;
    core = s.code ? '`' + core.replace(/\|/g, '\\|') + '`' : core.replace(/([\\`*_\[\]<>|])/g, '\\$1');
    if (s.strike) core = '~~' + core + '~~';
    if (s.italic) core = '*' + core + '*';
    if (s.bold) core = '**' + core + '**';
    if (s.link) core = '[' + core + '](' + s.link + ')';
    return lead + core + trail;
  }).join('');
}

/** Package selected document images into a ZIP. `names` maps sourceIndex to a custom file name. */
function getImagesArchive(sourceIndexes, names, entitlement) {
  requireEntitlement_(entitlement);
  var entries = collectImages_();
  var selected = {};
  (sourceIndexes || []).forEach(function (index) {
    selected[String(index)] = true;
  });
  names = names || {};
  var used = {};

  var blobs = entries
    .map(function (entry, index) { return { entry: entry, index: index }; })
    .filter(function (item) { return selected[String(item.index)]; })
    .map(function (item) {
      var blob = item.entry.image.getBlob();
      var mimeType = blob.getContentType() || 'image/png';
      var name = String(names[String(item.index)] || '').replace(/[\\/:*?"<>|]+/g, '-').trim() ||
        item.entry.name + '.' + extensionForMime_(mimeType);
      while (used[name]) name = '(' + (used[name]++) + ') ' + name;
      used[name] = 1;
      return blob.setName(name);
    });

  if (!blobs.length) throw new Error('No images are available to download.');

  var name = host_() === 'slides' ? SlidesApp.getActivePresentation().getName() : DocumentApp.getActiveDocument().getName();
  var archive = Utilities.zip(blobs, safeFileName_(name) + '-images.zip');
  return {
    name: archive.getName(),
    data: Utilities.base64Encode(archive.getBytes())
  };
}

/** Every image in the open file, in reading order, with the default name its download gets (without extension). */
function collectImages_() {
  if (host_() === 'slides') return collectSlideImages_(SlidesApp.getActivePresentation());
  return collectDocumentImages_(DocumentApp.getActiveDocument()).map(function (image, index) {
    return { image: image, name: 'image-' + String(index + 1).padStart(2, '0') };
  });
}

/** Pictures on every slide, including ones inside groups. Named slide-03-image-01 so they sort the way the deck reads. */
function collectSlideImages_(presentation) {
  var found = [];
  var pad = function (n) { return String(n).padStart(2, '0'); };
  presentation.getSlides().forEach(function (slide, slideIndex) {
    var inSlide = 0;
    (function visit(elements) {
      elements.forEach(function (element) {
        var type = element.getPageElementType();
        if (type === SlidesApp.PageElementType.IMAGE) {
          inSlide += 1;
          found.push({ image: element.asImage(), name: 'slide-' + pad(slideIndex + 1) + '-image-' + pad(inSlide) });
        } else if (type === SlidesApp.PageElementType.GROUP) {
          visit(element.asGroup().getChildren());
        }
      });
    })(slide.getPageElements());
  });
  return found;
}

// Docs and Slides name the same things differently: InlineImage has getAltTitle, Slides' Image has getTitle.
function altTitle_(image) { return (image.getAltTitle ? image.getAltTitle() : image.getTitle()) || ''; }
function altDescription_(image) { return (image.getAltDescription ? image.getAltDescription() : image.getDescription()) || ''; }
function linkUrl_(image) {
  if (image.getLinkUrl) return image.getLinkUrl() || '';
  var link = image.getLink();
  return link && link.getLinkType() === SlidesApp.LinkType.URL ? link.getUrl() : '';
}
function setAlt_(image, title, description) {
  if (image.setAltTitle) { image.setAltTitle(title); image.setAltDescription(description); }
  else { image.setTitle(title); image.setDescription(description); }
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
