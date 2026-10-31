// Pure, so scripts/test-features.mjs can run it in Node.

const slugText = (text) => text
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/**
 * New file names for a whole list from one pattern. Tokens: {n} number, {name} current name, {doc} document name,
 * {alt} alt text. The extension stays, and names never repeat: a clash gets -2, -3 and so on.
 */
export function bulkNames(images, { pattern, start = 1, clean = false, docName = '' }) {
  const width = Math.max(2, String(start + images.length - 1).length);
  const taken = new Set();
  return images.map((image, index) => {
    const dot = image.name.lastIndexOf('.');
    const base = dot > 0 ? image.name.slice(0, dot) : image.name;
    const ext = dot > 0 ? image.name.slice(dot) : '';
    const alt = (image.altDescription || image.altTitle || '').slice(0, 60);
    const values = { n: String(start + index).padStart(width, '0'), name: base, doc: docName || base, alt: alt || base };

    let name = pattern.replace(/\{(n|name|doc|alt)\}/gi, (_, token) => values[token.toLowerCase()]);
    name = name.replace(/[\\/:*?"<>|]+/g, '-').trim();
    name = name.replace(/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i, '');
    if (clean) name = slugText(name);
    if (!name) name = base;

    let unique = name;
    for (let tries = 2; taken.has((unique + ext).toLowerCase()); tries += 1) unique = `${name}-${tries}`;
    taken.add((unique + ext).toLowerCase());
    return unique + ext;
  });
}
