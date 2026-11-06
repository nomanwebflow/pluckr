import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "google-docs-to-wordpress-images",
  title: "How to Export Google Docs Images to WordPress",
  description:
    "Pasting from Google Docs creates broken image links. Learn how to export Google Docs images to WordPress with clean file names and WebP files.",
  updated: "2026-11-06",
  readingMinutes: 4,
  summary: [
    "Pasting images directly from Google Docs into WordPress often creates broken image links or heavy uncompressed PNG files.",
    "Pluckr extracts every picture with descriptive file names and converts them to WebP for a one-time {{price}}. You can then drop the whole batch into the WordPress Media Library.",
  ],
  sections: [
    {
      id: "the-copy-paste-problem",
      title: "What happens when you paste Google Docs images into WordPress?",
      blocks: [
        {
          type: "p",
          html: "Pasting Google Docs images into WordPress causes two problems. WordPress can link to temporary Google addresses instead of hosting the images, so the images break when an address expires. Direct pasting can also create heavy uncompressed PNG files with generic names like image1.png, which slow your pages and tell search engines nothing.",
        },
        {
          type: "p",
          html: "Heavy PNG files also hurt your Core Web Vitals score.",
        },
      ],
    },
    {
      id: "method-1-html-zip",
      title: "Method 1: download the zipped web page and upload to WordPress",
      blocks: [
        {
          type: "p",
          html: "You can move Google Docs images to WordPress for free with the zipped web page download. You get the raw pictures in an images folder, then rename and convert them yourself and upload them to the Media Library. Renaming generic files like image1.png by hand takes time, and you need a separate WebP tool.",
        },
        {
          type: "ol",
          items: [
            "Open your draft in Google Docs.",
            "Choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Unpack the downloaded ZIP archive file on your computer.",
            "Open the <strong>images</strong> folder to inspect your extracted pictures.",
            "Rename each file with descriptive keywords to improve your image SEO.",
            "Convert the files to WebP with an image conversion application.",
            "Go to your WordPress dashboard and open <strong>Media &gt; Add New Media File</strong>.",
            "Drag the converted files into the upload area.",
          ],
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: rename, convert to WebP, and export with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr renames and converts every Google Docs image to WebP inside the Doc, so the whole batch is ready before you upload to WordPress. Pluckr runs in your web browser with WebAssembly, so your images do not go to an external server. Pluckr costs a one-time {{price}} with no subscription.",
        },
        {
          type: "ol",
          items: [
            "Open your document in Google Docs.",
            "Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Click <strong>Bulk rename</strong> to set a clean pattern like <code>{doc}-{n}</code>.",
            "Open <strong>Output settings</strong> and select <strong>WebP</strong> format.",
            "Set a maximum image width to match your WordPress blog container.",
            "Click <strong>Convert</strong> to download all images in one ZIP file.",
            "Unpack the archive and drag the images into the WordPress Media Library.",
          ],
        },
        {
          type: "callout",
          title: "Add clean Markdown for WordPress",
          html: "If you publish through a static site generator or the WordPress REST API, tick <strong>Add the Doc as Markdown</strong> in Output settings. Pluckr generates a clean content.md file with relative links to your WebP images.",
        },
      ],
    },
    {
      id: "wordpress-image-best-practices",
      title: "What are the best practices for WordPress blog images?",
      blocks: [
        {
          type: "p",
          html: "WordPress blog images load fast when you follow four practices. Use descriptive file names with lowercase letters and hyphens, for example wordpress-seo-settings.webp. Use a modern format such as WebP. Resize each image to the maximum content width of your theme. Write concise alt text in the WordPress media settings.",
        },
        { type: "h3", text: "How do the methods compare?" },
        {
          type: "table",
          columns: [
            "Feature",
            "Direct paste",
            "HTML zip download",
            "Subscription SaaS",
            "Pluckr",
          ],
          highlight: 4,
          rows: [
            ["Cost", "Free", "Free", "Monthly subscription", "One-time {{price}}"],
            ["Self-hosted images", false, true, true, true],
            ["Bulk keyword renaming", false, false, true, true],
            ["WebP conversion", false, false, true, true],
            ["Browser-only privacy", true, true, false, true],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Why do images break after pasting from Google Docs into WordPress?",
      a: "WordPress sometimes points to temporary Google user content web links. When Google closes the temporary web link, the picture stops displaying.",
    },
    {
      q: "Does WordPress natively support WebP images?",
      a: "Yes. WordPress has supported WebP image uploads natively since version 5.8.",
    },
    {
      q: "Can I move alt text from Google Docs to WordPress automatically?",
      a: "Pluckr exports alt text into structured metadata files. You can copy the alt text straight into the WordPress media editor.",
    },
    {
      q: "What image dimensions work best for WordPress blog posts?",
      a: "Most blog themes use a content column between 800 and 1200 pixels wide. You can set this limit in Pluckr Output settings before you download.",
    },
  ],
  related: [
    "download-all-images-from-google-docs",
    "convert-google-docs-images-to-webp",
    "export-google-docs-to-markdown-with-images",
  ],
};

