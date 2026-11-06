// Checks the alt-text/Markdown bundle (src/bundle.js) and the Doc-reading and Doc-writing code in apps-script/Code.gs
// against a small mock of Google's DocumentApp. Run: node addon/scripts/test-features.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { unzipSync, strFromU8 } from 'fflate';
import { bulkNames } from '../src/rename.js';
import { exportFiles, linkMarkdownImages, metadataCsv, uniqueNames, zipBundle } from '../src/bundle.js';

const codeGs = readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');

// ---- bundle.js ----
assert.deepEqual(uniqueNames(['a.png', 'b.png', 'a.png', 'a.png']), ['a.png', 'b.png', '(1) a.png', '(2) a.png']);
assert.equal(
  metadataCsv([{ filename: 'a.webp', original_name: 'a.png', alt_title: 'Say "hi"', alt_description: 'one, two', width: 10, height: 5, format: 'webp', link_url: '' }]),
  'filename,original_name,alt_title,alt_description,width,height,format,link_url'.split(',').map((c) => `"${c}"`).join(',') +
  '\n"a.webp","a.png","Say ""hi""","one, two","10","5","webp",""\n',
);
assert.equal(linkMarkdownImages('![a](pluckr-image:0) ![b](pluckr-image:3)', { 0: './images/my pic.webp' }), '![a](./images/my%20pic.webp) ', 'an unticked image is dropped');
assert.equal(linkMarkdownImages('x [![b \\] c](pluckr-image:3)](https://l.test) y', {}), 'x  y', 'its link goes with it');

const entry = (name, sourceIndex, alt) => ({
  blob: new Blob([new Uint8Array([1, 2, 3])]), name, width: 4, height: 3, format: 'png',
  original: { name: `src-${name}`, sourceIndex, altTitle: 'T', altDescription: alt, linkUrl: '' },
});
const zip = unzipSync(new Uint8Array(await (await zipBundle([entry('a.png', 0, 'First'), entry('a.png', 1, 'Second')], { metadata: true, markdown: '![First](pluckr-image:0)\n![Second](pluckr-image:1)\n' })).arrayBuffer()));
assert.deepEqual(Object.keys(zip).sort(), ['content.md', 'images-metadata.csv', 'images-metadata.json', 'images/(1) a.png', 'images/a.png']);
assert.match(strFromU8(zip['content.md']), /\(\.\/images\/a\.png\)[\s\S]*\(\.\/images\/\(1\)%20a\.png\)/);
assert.equal(JSON.parse(strFromU8(zip['images-metadata.json']))[1].filename, '(1) a.png');
const flat = unzipSync(new Uint8Array(await (await zipBundle([entry('a.png', 0, '')])).arrayBuffer()));
assert.deepEqual(Object.keys(flat), ['a.png'], 'no extras: a flat ZIP like before');
// Drive gets the same files as the ZIP, in one flat folder, so content.md links to ./name there.
const drivePaths = exportFiles([entry('a.png', 0, 'First')], { metadata: true, markdown: '![First](pluckr-image:0)\n', imageFolder: '' });
assert.deepEqual(drivePaths.map((f) => f.path), ['a.png', 'images-metadata.csv', 'images-metadata.json', 'content.md']);
assert.match(drivePaths[3].data, /\(\.\/a\.png\)/, 'flat Drive folder: no images/ prefix');
assert.equal(exportFiles([entry('a.png', 0, '')], { markdown: '![x](pluckr-image:0)' })[0].path, 'images/a.png', 'ZIP keeps images/ with Markdown');

// ---- rename.js ----
const pics = [{ name: 'image-01.PNG', altDescription: 'A Chart: Q3!' }, { name: 'photo.jpg' }, { name: 'photo2.jpg' }];
assert.deepEqual(bulkNames(pics, { pattern: '{doc}-{n}', docName: 'My Doc', clean: true }), ['my-doc-01.PNG', 'my-doc-02.jpg', 'my-doc-03.jpg']);
assert.deepEqual(bulkNames(pics, { pattern: '{alt}', clean: true }), ['a-chart-q3.PNG', 'photo.jpg', 'photo2.jpg'], 'no alt text falls back to the name');
assert.deepEqual(bulkNames(pics, { pattern: 'same', clean: false }), ['same.PNG', 'same.jpg', 'same-2.jpg'], 'clashes get a number');
assert.deepEqual(bulkNames(pics, { pattern: 'x/{n}.png', start: 9 }).slice(0, 2), ['x-09.PNG', 'x-10.jpg'], 'path characters go, a typed extension is not doubled');
assert.deepEqual(bulkNames([{ name: 'a.png' }], { pattern: '   ', clean: true }), ['a.png'], 'an empty pattern keeps the name');
console.log('bundle.js and rename.js: all checks passed');

// ---- Code.gs against a mock Doc ----
const T = { PARAGRAPH: 'P', LIST_ITEM: 'L', TABLE: 'TABLE', HORIZONTAL_RULE: 'HR', TEXT: 'TEXT', INLINE_IMAGE: 'IMG' };
const H = { TITLE: 'TITLE', HEADING1: 'H1', HEADING2: 'H2', HEADING3: 'H3', HEADING4: 'H4', HEADING5: 'H5', HEADING6: 'H6', NORMAL: 'N' };
const node = (type, extra = {}, children = []) => {
  const self = { getType: () => type, getNumChildren: () => children.length, getChild: (i) => children[i], ...extra };
  Object.assign(self, { asParagraph: () => self, asListItem: () => self, asTable: () => self, asText: () => self, asInlineImage: () => self });
  return self;
};
const run = (text, style = {}) => ({ text, ...style });
const text = (runs) => {
  const full = runs.map((r) => r.text).join('');
  const starts = [];
  let at = 0;
  runs.forEach((r) => { starts.push(at); at += r.text.length; });
  const at_ = (o) => runs[starts.filter((s) => s <= o).length - 1];
  return node(T.TEXT, {
    getText: () => full, getTextAttributeIndices: () => starts,
    getFontFamily: (o) => at_(o).font || 'Arial', isBold: (o) => Boolean(at_(o).bold), isItalic: (o) => Boolean(at_(o).italic),
    isStrikethrough: () => false, getLinkUrl: (o) => at_(o).link || null,
  });
};
const image = (alt, link) => node(T.INLINE_IMAGE, { getAltDescription: () => alt, getAltTitle: () => null, getLinkUrl: () => link || null });
const para = (heading, kids) => node(T.PARAGRAPH, { getHeading: () => heading }, kids);
const item = (level, glyph, kids) => node(T.LIST_ITEM, { getNestingLevel: () => level, getGlyphType: () => glyph }, kids);
const cell = (kids) => node('CELL', {}, kids);
const table = (rows) => node(T.TABLE, { getNumRows: () => rows.length, getRow: (r) => node('ROW', { getNumCells: () => rows[r].length, getCell: (c) => rows[r][c] }) });

const body = node('BODY', {}, [
  para(H.HEADING1, [text([run('Title', { bold: true })])]),
  para(H.NORMAL, [text([run('Hello '), run('world', { bold: true }), run(' and '), run('site', { link: 'https://x.test' }), run(' a_b', {})])]),
  para(H.NORMAL, [image('A chart', null)]),
  para(H.NORMAL, [image(null, null)]),
  item(0, 'BULLET', [text([run('one')])]),
  item(1, 'NUMBER', [text([run('nested')])]),
  node(T.HORIZONTAL_RULE),
  table([[cell([para(H.NORMAL, [text([run('H1')])])]), cell([para(H.NORMAL, [text([run('H2')])])])], [cell([para(H.NORMAL, [image('In cell', 'https://l.test')])]), cell([para(H.NORMAL, [text([run('x|y')])])])]]),
]);
const doc = { getName: () => 'Doc', getTabs: () => [{ getType: () => 'DOC', asDocumentTab: () => ({ getBody: () => body }), getChildTabs: () => [] }] };

const calls = [];
const sandbox = {
  Date, Logger: { log() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'secret' }) },
  ScriptApp: { getIdentityToken: () => 'h.' + Buffer.from('{"sub":"s"}').toString('base64url') + '.x' },
  Utilities: {
    computeHmacSha256Signature: () => [], base64EncodeWebSafe: () => 'sig',
    base64DecodeWebSafe: (t) => [...Buffer.from(t, 'base64')], newBlob: (b, mime, name) => ({ b, mime, name, getDataAsString: () => Buffer.from(b).toString() }),
    base64Decode: (t) => [...Buffer.from(t, 'base64')],
  },
  DocumentApp: { ElementType: { ...T, LIST_ITEM: T.LIST_ITEM }, ParagraphHeading: H, TabType: { DOCUMENT_TAB: 'DOC' }, getActiveDocument: () => doc, getUi: () => ({}) },
};
vm.createContext(sandbox);
vm.runInContext(codeGs, sandbox);

// The menu is the add-on menu (Extensions > Pluckr), never a top-level one, in Docs too.
const docsMenu = [];
sandbox.DocumentApp.getUi = () => ({
  createAddonMenu: () => ({ addItem(label, fn) { docsMenu.push([label, fn]); return this; }, addToUi() {} }),
  createMenu: () => { throw new Error('a top-level menu is not allowed'); },
});
sandbox.onOpen();
assert.deepEqual(docsMenu, [['Extract images (Google reads this Doc’s images)', 'openPluckrSidebar']]);

// Both new calls sit behind the paywall.
for (const call of [() => sandbox.getDocumentMarkdown('bad'), () => sandbox.replaceDocumentImage(0, '', 'image/jpeg', 'bad'), () => sandbox.setImageAlt(0, '', '', 'bad')]) {
  assert.throws(call, /LICENCE_REQUIRED/);
}

// With the gate open, read the mock Doc.
sandbox.requireEntitlement_ = () => {};
const { markdown, imageCount } = sandbox.getDocumentMarkdown('ok');
assert.equal(imageCount, 3);
assert.equal(markdown, [
  '# Title',
  '',
  'Hello **world** and [site](https://x.test) a\\_b',
  '',
  '![A chart](pluckr-image:0)',
  '',
  '![](pluckr-image:1)',
  '',
  '- one',
  '    1. nested',
  '',
  '---',
  '',
  '| H1 | H2 |',
  '| --- | --- |',
  '| [![In cell](pluckr-image:2)](https://l.test) | x\\|y |',
  '',
].join('\n'));

// Replacing an image keeps its displayed size, alt text and link, and removes the old one.
const log = [];
const made = { setWidth(w) { log.push(['w', w]); return this; }, setHeight(h) { log.push(['h', h]); return this; }, setAltTitle: (v) => log.push(['title', v]), setAltDescription: (v) => log.push(['alt', v]), setLinkUrl: (v) => log.push(['link', v]) };
const parent = { getType: () => T.PARAGRAPH, getChildIndex: () => 2, asParagraph: () => ({ insertInlineImage: (at, blob) => { log.push(['insert', at, blob.mime]); return made; } }) };
const old = { getParent: () => parent, getWidth: () => 300, getHeight: () => 200, getAltTitle: () => 'T', getAltDescription: () => 'D', getLinkUrl: () => 'https://l.test', removeFromParent: () => log.push(['removed']) };
sandbox.collectDocumentImages_ = () => [old];
sandbox.replaceDocumentImage(0, Buffer.from('x').toString('base64'), 'image/jpeg', 'ok');
assert.deepEqual(log, [['insert', 2, 'image/jpeg'], ['w', 300], ['h', 200], ['title', 'T'], ['alt', 'D'], ['link', 'https://l.test'], ['removed']]);
assert.throws(() => sandbox.replaceDocumentImage(0, '', 'image/webp', 'ok'), /Unsupported/);
assert.throws(() => sandbox.replaceDocumentImage(5, '', 'image/png', 'ok'), /no longer/);

// Saving alt text writes both fields and clears them when told to.
const alts = [];
const target = { setAltTitle: (v) => alts.push(['title', v]), setAltDescription: (v) => alts.push(['alt', v]) };
sandbox.collectDocumentImages_ = () => [target];
sandbox.setImageAlt(0, 'T', 'A chart', 'ok');
sandbox.setImageAlt(0, null, null, 'ok');
assert.deepEqual(alts, [['title', 'T'], ['alt', 'A chart'], ['title', ''], ['alt', '']]);
assert.throws(() => sandbox.setImageAlt(3, '', '', 'ok'), /no longer/);
console.log('Code.gs markdown, replace and alt text: all checks passed');

// ---- Code.gs in Google Slides ----
const slideImage = (name, { title = '', description = '', link = null, bytes = [1, 2, 3] } = {}) => {
  const calls = [];
  const image = {
    calls,
    getBlob: () => ({ getBytes: () => bytes, getContentType: () => 'image/png' }),
    getWidth: () => 300, getHeight: () => 200,
    getTitle: () => title, getDescription: () => description,
    getLink: () => (link ? { getLinkType: () => 'URL', getUrl: () => link } : null),
    setTitle: (v) => calls.push(['title', v]), setDescription: (v) => calls.push(['alt', v]), setLinkUrl: (v) => calls.push(['link', v]),
    replace(blob, crop) { calls.push(['replace', blob.mime, crop]); return image; },
  };
  return { image, element: { getPageElementType: () => 'IMAGE', asImage: () => image } };
};
const first = slideImage('a', { title: 'T', description: 'A chart', link: 'https://l.test' });
const nested = slideImage('b');
const third = slideImage('c');
const shape = { getPageElementType: () => 'SHAPE' };
const group = { getPageElementType: () => 'GROUP', asGroup: () => ({ getChildren: () => [nested.element] }) };
const deck = {
  getName: () => 'My Deck',
  getSlides: () => [{ getPageElements: () => [first.element, shape, group] }, { getPageElements: () => [] }, { getPageElements: () => [third.element] }],
};
const menu = [];
const slidesLimited = { on: true };
const slidesSandbox = {
  Date, Logger: { log() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'secret' }) },
  ScriptApp: { getIdentityToken: () => 'h.' + Buffer.from('{"sub":"s"}').toString('base64url') + '.x' },
  Utilities: {
    base64Encode: (bytes) => Buffer.from(bytes).toString('base64'), base64Decode: (text) => [...Buffer.from(text, 'base64')],
    computeHmacSha256Signature: () => [], base64EncodeWebSafe: () => 'sig',
    base64DecodeWebSafe: (text) => [...Buffer.from(text, 'base64')],
    newBlob: (b, mime, name) => ({ b, mime, name, getDataAsString: () => Buffer.from(b).toString() }),
  },
  // Outside Docs, DocumentApp refuses getUi() like the real one does.
  DocumentApp: { getActiveDocument: () => null, getUi: () => { throw new Error('Cannot call DocumentApp.getUi() from this context.'); } },
  SlidesApp: {
    PageElementType: { IMAGE: 'IMAGE', GROUP: 'GROUP' }, LinkType: { URL: 'URL' },
    // Before authorization (onOpen), the real getActivePresentation() throws. Detection must not need it.
    getActivePresentation: () => { if (slidesLimited.on) throw new Error('Authorization is required.'); return deck; },
    getUi: () => ({ createAddonMenu: () => ({ addItem(label, fn) { menu.push(['addon', label, fn]); return this; }, addToUi() {} }) }),
  },
};
vm.createContext(slidesSandbox);
vm.runInContext(codeGs, slidesSandbox);

slidesSandbox.onOpen();
assert.deepEqual(menu, [['addon', 'Extract images (Google reads this deck’s images)', 'openPluckrSidebar']], 'the menu appears even before the add-on is authorized');
slidesLimited.on = false;
// Without a licence a file lists no readable images by itself (a free account reads by signed grant), and writing needs a licence.
assert.deepEqual({ ...slidesSandbox.getDocumentInfo('bad') }, { documentName: 'My Deck', host: 'slides', count: 0, total: 3 });
assert.throws(() => slidesSandbox.setImageAlt(0, 'x', 'y', 'bad'), /LICENCE_REQUIRED/, 'alt text editing is Pro');
assert.throws(() => slidesSandbox.replaceDocumentImage(0, '', 'image/png', 'bad'), /LICENCE_REQUIRED/, 'optimize is Pro');
assert.throws(() => slidesSandbox.getDocumentMarkdown('bad'), /LICENCE_REQUIRED/, 'Markdown export is Pro');
slidesSandbox.requireEntitlement_ = () => {};
assert.deepEqual({ ...slidesSandbox.getDocumentInfo('ok') }, { documentName: 'My Deck', host: 'slides', count: 3, total: 3 });
const batch = slidesSandbox.getDocumentImages(1, 8, 'ok');
assert.deepEqual(JSON.parse(JSON.stringify([batch.total, batch.available, batch.images.map((item) => item.sourceIndex), batch.documentName, batch.host])), [3, 3, [1, 2], 'My Deck', 'slides'], 'a batch carries the totals');

const img0 = slidesSandbox.getDocumentImage(0, 'ok');
assert.equal(img0.name, 'slide-01-image-01.png');
assert.equal(img0.altTitle, 'T');
assert.equal(img0.altDescription, 'A chart');
assert.equal(img0.linkUrl, 'https://l.test');
assert.equal(slidesSandbox.getDocumentImage(1, 'ok').name, 'slide-01-image-02.png', 'images in a group are found');
const img2 = slidesSandbox.getDocumentImage(2, 'ok');
assert.equal(img2.name, 'slide-03-image-01.png');
assert.deepEqual([img2.altTitle, img2.altDescription, img2.linkUrl], ['', '', ''], 'an image with no alt text or link');
assert.throws(() => slidesSandbox.getDocumentImage(9, 'ok'), /no longer/);

slidesSandbox.setImageAlt(0, 'New', 'Described', 'ok');
assert.deepEqual(first.image.calls.splice(0), [['title', 'New'], ['alt', 'Described']]);

slidesSandbox.replaceDocumentImage(0, Buffer.from('x').toString('base64'), 'image/jpeg', 'ok');
assert.deepEqual(first.image.calls.splice(0), [['replace', 'image/jpeg', false], ['title', 'T'], ['alt', 'A chart'], ['link', 'https://l.test']], 'the swap keeps alt text and link');
slidesSandbox.replaceDocumentImage(2, Buffer.from('x').toString('base64'), 'image/png', 'ok');
assert.deepEqual(third.image.calls.splice(0), [['replace', 'image/png', false]], 'nothing to restore on a plain image');
assert.throws(() => slidesSandbox.getDocumentMarkdown('ok'), /only available in Google Docs/);

// Free plan: 50 distinct images per account for good, counted by the licence service and signed into a grant. The
// server code returns bytes only for images the grant covers. (The grant signature itself is tested in test-addon-gate.mjs.)
const big = vm.createContext({ ...slidesSandbox });
vm.runInContext(readFileSync('addon/apps-script/Code.gs', 'utf8'), big);
const signed = (bytes) => [...bytes].map((b) => (b > 127 ? b - 256 : b));
big.Utilities = {
  ...big.Utilities,
  computeDigest: (_algorithm, bytes) => signed(createHash('sha256').update(Buffer.from(bytes)).digest()),
  base64EncodeWebSafe: (bytes) => Buffer.from(bytes.map((b) => b & 255)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
  DigestAlgorithm: { SHA_256: 'SHA_256' },
};
big.Utilities.DigestAlgorithm = { SHA_256: 'SHA_256' };
big.Utilities.zip = undefined;
const bytesOf = (i) => [(i + 1) & 255, i >> 8, 7];
const fake = Array.from({ length: 120 }, (_, i) => ({ name: `n${i}`, image: { getBlob: () => ({ getBytes: () => bytesOf(i), getContentType: () => 'image/png', setName: () => ({}) }), getWidth: () => 1, getHeight: () => 1, getTitle: () => '', getDescription: () => '', getLink: () => null } }));
big.collectImages_ = () => fake;
const hashOf = (i) => big.imageHash_(bytesOf(i));
const plain = (value) => JSON.parse(JSON.stringify(value));
assert.equal(hashOf(0).length, 43, 'a hash is base64url SHA-256 without padding');
assert.notEqual(hashOf(0), hashOf(1), 'different images, different hashes');
assert.equal(hashOf(3), big.imageHash_(bytesOf(3)), 'the same picture always gives the same hash');

// Listing shows metadata and a hash, never bytes.
const listed = big.getImageFingerprints(10, 3, { skipMeta: true });
assert.deepEqual(plain([listed.total, listed.images.map((x) => x.sourceIndex), listed.images.map((x) => x.hash)]), [120, [10, 11, 12], [hashOf(10), hashOf(11), hashOf(12)]]);
assert.ok(listed.images.every((x) => x.data === undefined), 'a listing carries no image bytes');

// With no licence and no grant nothing is readable.
assert.equal(big.getDocumentImages(0, 8, 'bad').images.length, 0, 'the paid batch call reads nothing without a licence');
assert.equal(big.getDocumentImages(0, 8, 'bad').available, 0);
assert.deepEqual(plain(big.getImagesByIndex([0, 1, 2], '', '').images), [], 'no grant, no bytes');
assert.throws(() => big.getDocumentImage(0, 'bad', ''), /LICENCE_REQUIRED/);

// With a grant the images it names are readable and the others are left out.
big.grantedHashes_ = () => ({ [hashOf(2)]: true, [hashOf(70)]: true });
assert.deepEqual(plain(big.getImagesByIndex([0, 2, 70, 71], '', 'grant').images.map((x) => x.sourceIndex)), [2, 70], 'only granted images come back, in any position');
assert.equal(big.getDocumentImage(70, '', 'grant').sourceIndex, 70);
assert.throws(() => big.getDocumentImage(71, '', 'grant'), /LICENCE_REQUIRED/);
assert.ok(big.getImagesByIndex([2], '', 'grant').images[0].data, 'a granted image carries its bytes');

// The same picture used twice in a file (same bytes) is one grant entry and both copies read.
const twin = { ...fake[2] };
big.collectImages_ = () => [fake[2], twin];
assert.equal(big.getImagesByIndex([0, 1], '', 'grant').images.length, 2, 'duplicate content shares one grant entry');
big.collectImages_ = () => fake;

// The ZIP only includes granted images.
let zipped = 0;
big.Utilities.zip = (blobs) => { zipped = blobs.length; return { getName: () => 'z.zip', getBytes: () => [] }; };
big.Utilities.base64Encode = () => '';
big.getImagesArchive([0, 2, 70, 119], {}, '', 'grant');
assert.equal(zipped, 2, 'the ZIP skips images the grant does not cover');
assert.throws(() => big.getImagesArchive([0, 119], {}, '', 'grant'), /No images are available/, 'nothing granted, nothing to zip');

// A licence reads everything, with or without a grant.
big.requireEntitlement_ = () => {};
assert.deepEqual(plain([big.getDocumentImages(112, 8, 'ok').images.length, big.getDocumentInfo('ok').count]), [8, 120], 'a licence reads everything');
assert.equal(big.getImagesByIndex([0, 5, 99], 'ok', '').images.length, 3, 'a licence needs no grant');
zipped = 0;
big.getImagesArchive([0, 1, 2, 3], {}, 'ok', '');
assert.equal(zipped, 4, 'a licence zips every image');

// Neither editor: a clear message instead of a crash.
const nowhere = { ...slidesSandbox, SlidesApp: { getUi: () => { throw new Error('no'); } } };
const lost = vm.createContext({ ...nowhere });
vm.runInContext(codeGs, lost);
assert.throws(() => lost.host_(), /Google Doc or a Google Slides deck/);
console.log('Code.gs in Slides: all checks passed');

// ---- Save to Drive ----
const driveFiles = new Map(); // id -> { name, parents, trashed }
let nextId = 1;
const props = {};
const driveSandbox = {
  ...slidesSandbox,
  DocumentApp: { ...sandbox.DocumentApp, getActiveDocument: () => doc },
  SlidesApp: undefined,
  PropertiesService: {
    getScriptProperties: () => ({ getProperty: () => 'secret' }),
    getDocumentProperties: () => ({ getProperty: (k) => props[k] ?? null, setProperty: (k, v) => { props[k] = v; } }),
  },
  Drive: {
    Files: {
      get: (id) => { if (!driveFiles.has(id)) throw new Error('File not found'); return { id, trashed: driveFiles.get(id).trashed }; },
      create: (resource, blob) => { const id = `f${nextId++}`; driveFiles.set(id, { ...resource, blob, trashed: false }); return { id }; },
      list: ({ q }) => {
        const name = /name = '((?:\\.|[^'\\])*)'/.exec(q)[1].replace(/\\(.)/g, '$1');
        return { files: [...driveFiles].filter(([, f]) => f.name === name && !f.trashed && f.parents?.length).map(([id]) => ({ id })) };
      },
      update: (resource, id, blob) => { driveFiles.get(id).blob = blob; return { id }; },
    },
  },
};
const drive = vm.createContext(driveSandbox);
vm.runInContext(codeGs, drive);
drive.requireEntitlement_ = () => {};

const driveFolder = drive.getDriveFolder('ok');
assert.equal(driveFiles.get(driveFolder.id).name, 'Doc images');
assert.equal(driveFolder.url, `https://drive.google.com/drive/folders/${driveFolder.id}`);
assert.equal(drive.getDriveFolder('ok').id, driveFolder.id, 'the folder is reused');

const b64 = Buffer.from('hello').toString('base64');
const saved = drive.saveFileToDrive(driveFolder.id, "it's a.png", 'image/png', b64, 'ok');
assert.equal(driveFiles.get(saved).parents[0], driveFolder.id);
assert.equal(drive.saveFileToDrive(driveFolder.id, "it's a.png", 'image/png', b64, 'ok'), saved, 'a second export replaces the file, no duplicate');
assert.equal([...driveFiles.values()].filter((f) => f.name === "it's a.png").length, 1);
assert.throws(() => drive.saveFileToDrive('someone-elses-folder', 'a.png', 'image/png', b64, 'ok'), /Unknown Drive folder/, 'only the remembered folder');

driveFiles.get(driveFolder.id).trashed = true;
assert.notEqual(drive.getDriveFolder('ok').id, driveFolder.id, 'a trashed folder is replaced');
props.driveFolderId = 'gone';
assert.notEqual(drive.getDriveFolder('ok').id, 'gone', 'a deleted folder is replaced');

// Both calls sit behind the paywall.
const gated = vm.createContext({ ...driveSandbox });
vm.runInContext(codeGs, gated);
assert.throws(() => gated.getDriveFolder('bad'), /LICENCE_REQUIRED/);
assert.throws(() => gated.saveFileToDrive('f1', 'a.png', 'image/png', b64, 'bad'), /LICENCE_REQUIRED/);
console.log('Code.gs Save to Drive: all checks passed');
