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

/**
 * Swaps the sidebar's pluckr-image:N placeholders for the exported files' paths. An image that was not exported
 * (left unticked) is dropped from the Markdown, and so is the link around it.
 */
export function linkMarkdownImages(markdown, pathBySourceIndex) {
  return markdown
    .replace(/!\[((?:\\.|[^\]\\])*)\]\(pluckr-image:(\d+)\)/g, (all, alt, index) => (pathBySourceIndex[index] ? `![${alt}](${encodeURI(pathBySourceIndex[index])})` : ''))
    .replace(/\[\]\([^)]*\)/g, '');
}

/**
 * Every file an export holds, as { path, data, mimeType }: the images, plus the optional metadata files and content.md.
 * The ZIP puts images in images/ when Markdown is included; a Drive folder is flat (imageFolder ''), so its content.md
 * links to ./name instead.
 * entries: { blob, name, original: { name, sourceIndex, altTitle, altDescription, linkUrl }, width, height, format }
 */
export function exportFiles(entries, { metadata = false, markdown = null, imageFolder = markdown ? 'images/' : '' } = {}) {
  const names = uniqueNames(entries.map((entry) => entry.name));
  const files = names.map((name, index) => ({ path: imageFolder + name, data: entries[index].blob, mimeType: entries[index].blob.type || 'application/octet-stream' }));

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
    files.push({ path: 'images-metadata.csv', data: metadataCsv(rows), mimeType: 'text/csv' });
    files.push({ path: 'images-metadata.json', data: JSON.stringify(rows, null, 2) + '\n', mimeType: 'application/json' });
  }
  if (markdown) {
    const paths = {};
    entries.forEach((entry, index) => { paths[entry.original.sourceIndex] = `./${imageFolder}${names[index]}`; });
    files.push({ path: 'content.md', data: linkMarkdownImages(markdown, paths), mimeType: 'text/markdown' });
  }
  return files;
}

/** Returns a ZIP of exportFiles(): the images are stored (already compressed), the text files are deflated. */
export async function zipBundle(entries, options = {}) {
  const zipFiles = {};
  for (const file of exportFiles(entries, options)) {
    zipFiles[file.path] = typeof file.data === 'string' ? [strToU8(file.data), { level: 6 }] : new Uint8Array(await file.data.arrayBuffer());
  }
  return new Blob([zipSync(zipFiles, { level: 0 })], { type: 'application/zip' });
}
