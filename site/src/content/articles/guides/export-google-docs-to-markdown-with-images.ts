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
          html: "Google Docs exports a Markdown file under <strong>File &gt; Download &gt; Markdown (.md)</strong>, and this export works well for text-only documents. When a Doc contains pictures, Google Docs converts each picture into a base64 string inside the file. Base64 strings make the file huge and hard to edit in code editors, static site generators or Obsidian.",
        },
      ],
    },
    {
      id: "method-1-manual",
      title: "Method 1: combine Markdown download with the zipped web page",
      blocks: [
        {
          type: "p",
          html: "You can build a clean Markdown folder for free by combining two built-in Google Docs downloads: the Markdown file for the text and the zipped web page for the images. You then delete the base64 data and point each image link to a file. Matching generic names like image1.png to each paragraph is slow.",
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
          html: "To convert the PNG files to WebP with this method, you need a separate tool.",
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: export content.md and an images folder with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr exports a Google Doc as one ZIP file that holds content.md and an images folder. Every image tag in content.md points to the matching file in the images folder, and Pluckr keeps the alt text of each image. You can also rename the files and convert them to WebP in the same step.",
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
          html: "To include structured metadata, tick <strong>Add alt text files (CSV and JSON)</strong>.",
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
          type: "p",
          html: "Three methods export a Google Doc to Markdown. The built-in .md download is free but embeds images as base64. The manual method is free and gives separate images after hand edits. Pluckr costs {{price}} once and gives clean relative links, bulk renaming and WebP or AVIF conversion with no hand edits.",
        },
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

