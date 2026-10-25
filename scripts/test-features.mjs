// Checks the alt-text/Markdown bundle (src/bundle.js) and the Doc-reading and Doc-writing code in apps-script/Code.gs
// against a small mock of Google's DocumentApp. Run: node scripts/test-features.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { unzipSync, strFromU8 } from 'fflate';
import { linkMarkdownImages, metadataCsv, uniqueNames, zipBundle } from '../src/bundle.js';

// ---- bundle.js ----
assert.deepEqual(uniqueNames(['a.png', 'b.png', 'a.png', 'a.png']), ['a.png', 'b.png', '(1) a.png', '(2) a.png']);
assert.equal(
  metadataCsv([{ filename: 'a.webp', original_name: 'a.png', alt_title: 'Say "hi"', alt_description: 'one, two', width: 10, height: 5, format: 'webp', link_url: '' }]),
  'filename,original_name,alt_title,alt_description,width,height,format,link_url'.split(',').map((c) => `"${c}"`).join(',') +
  '\n"a.webp","a.png","Say ""hi""","one, two","10","5","webp",""\n',
);
assert.equal(linkMarkdownImages('![a](pluckr-image:0) ![b](pluckr-image:3)', { 0: './images/my pic.webp' }), '![a](./images/my%20pic.webp) ![b]()');

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
console.log('bundle.js: all checks passed');

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
const image = (alt, link) => node(T.INLINE_IMAGE, { getAltTextDescription: () => alt, getAltTextTitle: () => '', getLinkUrl: () => link || null });
const para = (heading, kids) => node(T.PARAGRAPH, { getHeading: () => heading }, kids);
const item = (level, glyph, kids) => node(T.LIST_ITEM, { getNestingLevel: () => level, getGlyphType: () => glyph }, kids);
const cell = (kids) => node('CELL', {}, kids);
const table = (rows) => node(T.TABLE, { getNumRows: () => rows.length, getRow: (r) => node('ROW', { getNumCells: () => rows[r].length, getCell: (c) => rows[r][c] }) });

const body = node('BODY', {}, [
  para(H.HEADING1, [text([run('Title', { bold: true })])]),
  para(H.NORMAL, [text([run('Hello '), run('world', { bold: true }), run(' and '), run('site', { link: 'https://x.test' }), run(' a_b', {})])]),
  para(H.NORMAL, [image('A chart', null)]),
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
  DocumentApp: { ElementType: { ...T, LIST_ITEM: T.LIST_ITEM }, ParagraphHeading: H, TabType: { DOCUMENT_TAB: 'DOC' }, getActiveDocument: () => doc },
};
vm.createContext(sandbox);
vm.runInContext(readFileSync('apps-script/Code.gs', 'utf8'), sandbox);

// Both new calls sit behind the paywall.
for (const call of [() => sandbox.getDocumentMarkdown('bad'), () => sandbox.replaceDocumentImage(0, '', 'image/jpeg', 'bad')]) {
  assert.throws(call, /LICENCE_REQUIRED/);
}

// With the gate open, read the mock Doc.
sandbox.requireEntitlement_ = () => {};
const { markdown, imageCount } = sandbox.getDocumentMarkdown('ok');
assert.equal(imageCount, 2);
assert.equal(markdown, [
  '# Title',
  '',
  'Hello **world** and [site](https://x.test) a\\_b',
  '',
  '![A chart](pluckr-image:0)',
  '',
  '- one',
  '    1. nested',
  '',
  '---',
  '',
  '| H1 | H2 |',
  '| --- | --- |',
  '| [![In cell](pluckr-image:1)](https://l.test) | x\\|y |',
  '',
].join('\n'));

// Replacing an image keeps its displayed size, alt text and link, and removes the old one.
const log = [];
const made = { setWidth(w) { log.push(['w', w]); return this; }, setHeight(h) { log.push(['h', h]); return this; }, setAltTextTitle: (v) => log.push(['title', v]), setAltTextDescription: (v) => log.push(['alt', v]), setLinkUrl: (v) => log.push(['link', v]) };
const parent = { getType: () => T.PARAGRAPH, getChildIndex: () => 2, asParagraph: () => ({ insertInlineImage: (at, blob) => { log.push(['insert', at, blob.mime]); return made; } }) };
const old = { getParent: () => parent, getWidth: () => 300, getHeight: () => 200, getAltTextTitle: () => 'T', getAltTextDescription: () => 'D', getLinkUrl: () => 'https://l.test', removeFromParent: () => log.push(['removed']) };
sandbox.collectDocumentImages_ = () => [old];
sandbox.replaceDocumentImage(0, Buffer.from('x').toString('base64'), 'image/jpeg', 'ok');
assert.deepEqual(log, [['insert', 2, 'image/jpeg'], ['w', 300], ['h', 200], ['title', 'T'], ['alt', 'D'], ['link', 'https://l.test'], ['removed']]);
assert.throws(() => sandbox.replaceDocumentImage(0, '', 'image/webp', 'ok'), /Unsupported/);
assert.throws(() => sandbox.replaceDocumentImage(5, '', 'image/png', 'ok'), /no longer/);
console.log('Code.gs markdown and replace: all checks passed');
