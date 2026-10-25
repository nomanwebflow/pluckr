import { strToU8, zipSync } from 'fflate';

// Kept free of browser and worker imports so scripts/test-bundle.mjs can run it in Node.

/** Gives every name a unique one: "a.png", "(1) a.png", "(2) a.png". */
export function uniqueNames(names) {
  const used = {};
  return names.map((name) => {
    let unique = name;
    while (used[unique]) unique = `(${used[name]++}) ${name}`;
    used[unique] = 1;
    return unique;
  });
}

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const METADATA_COLUMNS = ['filename', 'original_name', 'alt_title', 'alt_description', 'width', 'height', 'format', 'link_url'];

export function metadataCsv(rows) {
  return [METADATA_COLUMNS, ...rows.map((row) => METADATA_COLUMNS.map((column) => row[column]))]
    .map((line) => line.map(csvCell).join(','))
    .join('\n') + '\n';
}

/** Swaps the sidebar's pluckr-image:N placeholders for the exported files' paths; an image that was not exported becomes an empty link. */
export function linkMarkdownImages(markdown, pathBySourceIndex) {
  return markdown.replace(/\(pluckr-image:(\d+)\)/g, (_, index) => `(${encodeURI(pathBySourceIndex[index] || '')})`);
}

/**
 * entries: { blob, name, original: { name, sourceIndex, altTitle, altDescription, linkUrl }, width, height, format }
 * Returns a ZIP: images (in images/ when Markdown is included), plus the optional metadata files and content.md.
 */
export async function zipBundle(entries, { metadata = false, markdown = null } = {}) {
  const folder = markdown ? 'images/' : '';
  const names = uniqueNames(entries.map((entry) => entry.name));
  const buffers = await Promise.all(entries.map((entry) => entry.blob.arrayBuffer()));

  const files = {};
  names.forEach((name, index) => { files[folder + name] = new Uint8Array(buffers[index]); });

  const text = (content) => [strToU8(content), { level: 6 }];
  if (metadata) {
    const rows = entries.map((entry, index) => ({
      filename: names[index],
      original_name: entry.original.name,
      alt_title: entry.original.altTitle,
      alt_description: entry.original.altDescription,
      width: entry.width,
      height: entry.height,
      format: entry.format,
      link_url: entry.original.linkUrl,
    }));
    files['images-metadata.csv'] = text(metadataCsv(rows));
    files['images-metadata.json'] = text(JSON.stringify(rows, null, 2) + '\n');
  }
  if (markdown) {
    const paths = {};
    entries.forEach((entry, index) => { paths[entry.original.sourceIndex] = `./images/${names[index]}`; });
    files['content.md'] = text(linkMarkdownImages(markdown, paths));
  }

  // Images are already compressed, so they are stored; the text files above are deflated.
  const zipped = zipSync(files, { level: 0 });
  return new Blob([zipped], { type: 'application/zip' });
}
