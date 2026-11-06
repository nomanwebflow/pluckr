import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "convert-google-docs-images-to-webp",
  title: "How to convert Google Docs images to WebP",
  description:
    "Google Docs does not export WebP images. Learn how to convert document images to WebP or AVIF without external upload tools.",
  updated: "2026-11-05",
  cover: {
    src: "/guides/pluckr-converted-sizes.webp",
    alt: "The Pluckr sidebar showing converted WebP image file sizes next to original Google Docs images",
    width: 1280,
    height: 800,
  },
  readingMinutes: 4,
  summary: [
    "Google Docs does not offer a WebP export option. You can convert images manually with third-party converters or automatically in your browser with Pluckr.",
    "WebP reduces image file sizes by up to 80 percent compared to PNG. Pluckr converts images client-side for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "why-webp",
      title: "Why convert Docs images to WebP?",
      blocks: [
        {
          type: "p",
          html: "Websites need fast images. Google Docs stores most pictures as heavy PNG or JPEG files. WebP gives the same visual quality at a fraction of the weight.",
        },
        {
          type: "p",
          html: "Smaller images improve your Largest Contentful Paint score in Google Search. WebP also saves bandwidth for your visitors and fits CMS upload limits.",
        },
        {
          type: "callout",
          title: "Real test numbers",
          html: "In our sample test, a 796 KB PNG image from a Google Doc became an 83 KB WebP image at quality 80. The image kept its sharp look.",
        },
      ],
    },
    {
      id: "method-1-manual",
      title: "Method 1: download the zipped web page and convert online",
      blocks: [
        {
          type: "p",
          html: "You can get original images out of Google Docs without add-ons by using the built-in HTML download option.",
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
        {
          type: "p",
          html: "<strong>Good:</strong> this method is free and needs no software install. <strong>Downside:</strong> it takes several steps, files have generic names, and third-party sites can store your pictures.",
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: convert directly inside Google Docs with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr adds image conversion directly inside Google Docs. You can preview, resize, and convert images to WebP in one step.",
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
          type: "p",
          html: "Every picture converts locally in your browser. Pluckr never uploads your images to external servers.",
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
      title: "Comparing WebP conversion methods",
      blocks: [
        {
          type: "table",
          columns: ["", "Manual Online Converter", "Pluckr"],
          rows: [
            ["One-click batch conversion", false, true],
            ["Client-side conversion privacy", false, true],
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
      a: "No. Google Docs only allows downloading documents as PDF, Word, EPUB, or HTML zip archives. It does not export WebP files directly.",
    },
    {
      q: "Does converting to WebP reduce image quality?",
      a: "WebP uses modern compression algorithms. At quality 80, visual quality matches the original image while reducing file size by 60 to 80 percent.",
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
    "download-all-images-from-google-docs",
    "export-google-docs-to-markdown-with-images",
    "pluckr-vs-google-docs-built-in-downloads",
  ],
};
