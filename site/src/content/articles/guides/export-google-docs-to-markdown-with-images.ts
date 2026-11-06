import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "export-google-docs-to-markdown-with-images",
  title: "How to export Google Docs to Markdown with images",
  description:
    "Google Docs Markdown export embeds images as base64 strings. Learn how to export clean content.md files with an images folder.",
  updated: "2026-11-06",
  cover: {
    src: "/guides/pluckr-output-settings.webp",
    alt: "The Pluckr Output settings panel in Google Docs showing WebP conversion and the Add the Doc as Markdown checkbox",
    width: 1280,
    height: 800,
  },
  readingMinutes: 4,
  summary: [
    "Google Docs can download a Markdown file, but it embeds every picture as a long base64 text string instead of saving separate image files.",
    "Pluckr exports a clean content.md file alongside an images folder in one ZIP archive. You can rename files and convert images to WebP in the same step for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "built-in-markdown",
      title: "What happens when you download Markdown from Google Docs?",
      blocks: [
        {
          type: "p",
          html: "Google Docs includes a built-in Markdown export under <strong>File &gt; Download &gt; Markdown (.md)</strong>. This option works well for text-only documents.",
        },
        {
          type: "p",
          html: "When your Google Doc contains pictures, Google Docs converts each picture into a base64 string inside the Markdown file. Base64 strings make the file huge and hard to edit in code editors, static site generators, or Obsidian.",
        },
      ],
    },
    {
      id: "method-1-manual",
      title: "Method 1: combine Markdown download with the zipped web page",
      blocks: [
        {
          type: "p",
          html: "You can assemble a clean Markdown folder manually by combining two built-in Google Docs downloads.",
        },
        {
          type: "ol",
          items: [
            "Open your document in Google Docs.",
            "Choose <strong>File &gt; Download &gt; Markdown (.md)</strong> to get the document text.",
            "Choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong> and unpack the <strong>images</strong> folder.",
            "Open the Markdown file in a text editor and delete the base64 image definitions at the bottom.",
            "Replace each image reference with the file path to the matching picture in your <strong>images</strong> folder.",
          ],
        },
        {
          type: "p",
          html: "<strong>Good:</strong> this method is free and requires no add-on. <strong>Not so good:</strong> matching generic names like image1.png to each paragraph is slow. You also need a separate tool to convert PNGs to WebP.",
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: export content.md and an images folder with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr bundles your document text and extracted image files into one clean ZIP download. Every image tag in the Markdown file points directly to the matching file in the images folder.",
        },
        {
          type: "ol",
          items: [
            "Open your document in Google Docs.",
            "Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Optional: open <strong>Bulk rename</strong> to set a file name pattern like <code>{doc}-{n}</code>.",
            "Open <strong>Output settings</strong> and choose a format such as <strong>WebP</strong>.",
            "Tick <strong>Add the Doc as Markdown (content.md)</strong>.",
            "Click <strong>Convert</strong> and download your ZIP bundle.",
          ],
        },
        {
          type: "image",
          src: "/guides/pluckr-output-settings.webp",
          alt: "The Pluckr sidebar showing Output settings with WebP format, 80 percent quality, 16:9 aspect ratio, and Add the Doc as Markdown checked",
          width: 1280,
          height: 800,
          caption:
            "Tick Add the Doc as Markdown in Output settings to bundle content.md with your converted images.",
        },
        {
          type: "code",
          code: "# 5 Ways to Speed Up Your Site With Better Images\n\nImages are usually the heaviest part of a page. A slow hero image pushes back your Largest Contentful Paint.\n\n![Analytics dashboard on a laptop](./images/5-ways-to-speed-up-01.webp)",
        },
        {
          type: "p",
          html: "Pluckr preserves the alt text from each Google Docs image inside the Markdown image tag. You can also tick <strong>Add alt text files (CSV and JSON)</strong> to include structured metadata.",
        },
        {
          type: "callout",
          title: "Where you can use the export",
          html: "Drop the unpacked folder into an Astro, Next.js, or Hugo blog repository, or copy it into an Obsidian vault. Every relative image link works without editing.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the Google Docs Markdown export methods compare?",
      blocks: [
        {
          type: "table",
          columns: [
            "",
            "Built-in .md download",
            "Manual .md + HTML ZIP",
            "Pluckr",
          ],
          highlight: 3,
          rows: [
            ["Separate images folder", false, true, true],
            ["Clean relative image links", false, "Manual edit", true],
            ["Bulk rename image files", false, false, true],
            ["Convert images to WebP or AVIF", false, false, true],
            ["Keep image alt text in Markdown", true, "Manual edit", true],
            ["Cost", "Free", "Free", "One-time {{price}}"],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Why does Google Docs Markdown export have huge text blocks at the bottom?",
      a: "Google Docs encodes images as base64 data URIs inside the .md file instead of exporting image files. Pluckr exports a separate images folder and writes clean relative paths in content.md.",
    },
    {
      q: "Does Pluckr keep image alt text in the exported Markdown?",
      a: "Yes. Pluckr reads the alt text on each inline image in your Google Doc and places it inside the ![alt text](./images/file) tag in content.md.",
    },
    {
      q: "Can I convert images to WebP when exporting to Markdown?",
      a: "Yes. When you select WebP or AVIF in Output settings, Pluckr converts every image and updates the file extensions inside content.md to match.",
    },
    {
      q: "Does exporting to Markdown change my original Google Doc?",
      a: "No. Pluckr only reads your document to build the ZIP archive. Your Google Doc stays untouched.",
    },
  ],
  related: [
    "convert-google-docs-images-to-webp",
    "download-all-images-from-google-docs",
  ],
};

