/** Add an image extraction command to each Google Docs editor session. */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Pluckr')
    .addItem('Extract images', 'openPluckrSidebar')
    .addToUi();
}

function onInstall() {
  onOpen();
}

function openPluckrSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Pluckr');
  DocumentApp.getUi().showSidebar(html);
}

/** Revoke this add-on's authorization for the current user; Docs asks for consent again next run. */
function logout() {
  ScriptApp.invalidateAuth();
}

/** Return image previews and metadata for every document tab. */
function getDocumentImages() {
  var document = DocumentApp.getActiveDocument();
  var images = collectDocumentImages_(document);

  return {
    documentName: document.getName(),
    images: images.map(function (image, index) {
      var blob = image.getBlob();
      var bytes = blob.getBytes();
      var mimeType = blob.getContentType() || 'image/png';
      var name = 'image-' + String(index + 1).padStart(2, '0') + '.' + extensionForMime_(mimeType);

      return {
        id: 'image-' + index,
        sourceIndex: index,
        name: name,
        mimeType: mimeType,
        size: bytes.length,
        width: image.getWidth(),
        height: image.getHeight(),
        data: Utilities.base64Encode(bytes)
      };
    })
  };
}

/** Package selected document images into a ZIP. `names` maps sourceIndex to a custom file name. */
function getImagesArchive(sourceIndexes, names) {
  var document = DocumentApp.getActiveDocument();
  var images = collectDocumentImages_(document);
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

  var archive = Utilities.zip(blobs, safeFileName_(document.getName()) + '-images.zip');
  return {
    name: archive.getName(),
    data: Utilities.base64Encode(archive.getBytes())
  };
}

function collectDocumentImages_(document) {
  var images = [];

  function visitTabs(tabs) {
    tabs.forEach(function (tab) {
      if (tab.getType() === DocumentApp.TabType.DOCUMENT_TAB) {
        visitElement_(tab.asDocumentTab().getBody(), images);
      }
      visitTabs(tab.getChildTabs());
    });
  }

  visitTabs(document.getTabs());
  return images;
}

function visitElement_(element, images) {
  if (element.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
    images.push(element.asInlineImage());
    return;
  }

  if (typeof element.getNumChildren !== 'function') return;
  for (var index = 0; index < element.getNumChildren(); index += 1) {
    visitElement_(element.getChild(index), images);
  }
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
