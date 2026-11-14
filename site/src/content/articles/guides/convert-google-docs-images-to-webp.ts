import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "convert-google-docs-images-to-webp",
  title: "How to convert Google Docs images to WebP",
  description:
    "Google Docs does not export WebP images. Learn how to convert document images to WebP or AVIF without external upload tools.",
  updated: "2026-11-06",
  cover: {
    src: "/guides/pluckr-converted-sizes.webp",
    alt: "The Pluckr sidebar showing converted WebP image file sizes next to original Google Docs images",
    width: 1280,
    height: 800,
  },
  readingMinutes: 4,
  summary: [
    "Google Docs does not export images as WebP. You can convert images manually with a third-party converter, or in your browser with Pluckr.",
    "In a Pluckr test, a 796 KB PNG from a Google Doc became an 83 KB WebP at quality 80, about 90 percent smaller. Pluckr costs a one-time {{price}}.",
  ],
  sections: [
    {
      id: "why-webp",
      title: "Why convert Docs images to WebP?",
      blocks: [
        {
          type: "p",
          html: "Convert Google Docs images to WebP because WebP files are much smaller than PNG files at a similar visual quality. Smaller images help your Largest Contentful Paint score, save bandwidth for your visitors and fit CMS upload limits. Google Docs stores most pictures as PNG or JPEG files, so the saving is often large. To shrink the images inside the Doc itself, see <a href=\"/guides/compress-images-in-google-docs\">how to compress images in Google Docs</a>.",
        },
        {
          type: "table",
          columns: ["One test image from a Google Doc", "File size", "Smaller than the PNG"],
          highlight: 1,
          rows: [
            ["PNG", "796 KB", "-"],
            ["JPEG", "104 KB", "87 percent"],
            ["WebP at quality 80", "83 KB", "90 percent"],
          ],
        },
        {
          type: "p",
          html: "The saving depends on the image. In a second Pluckr test, a 213.3 KB image became a 105.8 KB WebP, about 50 percent smaller.",
        },
      ],
    },
    {
      id: "method-1-manual",
      title: "Method 1: download the zipped web page and convert online",
      blocks: [
        {
          type: "p",
          html: "You can convert Google Docs images to WebP for free with the built-in zipped web page download and an online converter such as Squoosh. The method needs no install, but it takes several steps and the files have generic names. Some online converters upload your pictures, so check the policy of the site first.",
        },
        {
          type: "ol",
          items: [
            "Open your document in Google Docs.",
            "Choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Open the downloaded ZIP archive.",
            "Open the <strong>images</strong> folder to find your original image files.",
            "Upload the images to an online converter like Squoosh.",
            "Select WebP format and download each converted file.",
          ],
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: convert directly inside Google Docs with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr converts Google Docs images to WebP inside the Doc, so you do not upload files to a converter. You can preview, rename and resize every image, and Pluckr shows the converted size before you download. Every picture converts locally in your browser, and Pluckr never uploads your images to external servers.",
        },
        {
          type: "ol",
          items: [
            "Open your document in Google Docs.",
            "Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Click <strong>Output settings</strong> at the bottom of the sidebar.",
            "Choose <strong>WebP</strong> under the Format menu.",
            "Adjust the quality slider to your target level.",
            "Click <strong>Download converted</strong> to get your ZIP file.",
          ],
        },
        {
          type: "image",
          src: "/guides/pluckr-converted-sizes.webp",
          alt: "The Pluckr sidebar showing image list with original sizes and estimated converted WebP sizes",
          width: 1280,
          height: 800,
          caption: "Pluckr calculates the exact converted WebP file size before you download.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the WebP conversion methods compare?",
      blocks: [
        {
          type: "p",
          html: "Both methods produce WebP files. An online converter is free, but it works outside your Doc and you rename the files by hand. Pluckr costs {{price}} once and adds batch conversion, bulk renaming, a maximum width, an aspect-ratio crop and alt text export in one sidebar inside Google Docs.",
        },
        {
          type: "table",
          columns: ["", "Manual Online Converter", "Pluckr"],
          rows: [
            ["One-click batch conversion", false, true],
            ["Client-side conversion privacy", "Depends on the site", true],
            ["Bulk rename files", false, true],
            ["Set maximum width", false, true],
            ["Crop to aspect ratio", false, true],
            ["Export alt text as metadata", false, true],
            ["Cost", "Free", "{{price}} once"],
          ],
          highlight: 2,
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can Google Docs save images as WebP natively?",
      a: "No. Google Docs downloads documents in formats such as PDF, Word, EPUB, Markdown and zipped HTML. None of these formats gives you WebP image files.",
    },
    {
      q: "Does converting to WebP reduce image quality?",
      a: "WebP at quality 80 is lossy, so keep your originals. In a Pluckr test at quality 80, a 796 KB PNG became an 83 KB WebP and kept its sharp look.",
    },
    {
      q: "Does Pluckr also support AVIF?",
      a: "Yes. In Output settings, you can choose AVIF, WebP, JPEG, or PNG. Pluckr handles AVIF encoding client-side in the browser.",
    },
    {
      q: "Are my images uploaded to a server for conversion?",
      a: "No. All conversion runs on your computer inside your web browser. Your document images stay completely private.",
    },
  ],
  related: [
    "compress-images-in-google-docs",
    "see-image-file-size-in-google-docs",
    "pluckr-vs-google-docs-built-in-downloads",
  ],
};
