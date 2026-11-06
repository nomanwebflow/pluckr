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
          html: "Writers often draft articles in Google Docs and copy the content into the WordPress block editor. This workflow seems fast, but it creates two serious problems for your website.",
        },
        {
          type: "p",
          html: "First, WordPress frequently hotlinks images to temporary Google user content web addresses instead of hosting them on your server. When Google expires the temporary web address, the image breaks on your live website.",
        },
        {
          type: "p",
          html: "Second, direct pasting often converts your graphics into heavy uncompressed PNG files. Heavy PNG files slow down your pages and hurt your Core Web Vitals score. Google Docs also assigns generic file names like image1.png, which harms your search engine rankings.",
        },
      ],
    },
    {
      id: "method-1-html-zip",
      title: "Method 1: download the zipped web page and upload to WordPress",
      blocks: [
        {
          type: "p",
          html: "You can extract the raw pictures from Google Docs without installing an add-on.",
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
        {
          type: "p",
          html: "<strong>Good:</strong> this method is free and requires no extra software. <strong>Not so good:</strong> renaming generic files like image1.png by hand takes time. You also need a separate tool to convert images to WebP.",
        },
      ],
    },
    {
      id: "method-2-pluckr",
      title: "Method 2: rename, convert to WebP, and export with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr automates image extraction, file renaming, and WebP conversion inside Google Docs. You prepare the whole batch before you upload to WordPress.",
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
          type: "p",
          html: "Pluckr runs entirely in your web browser with WebAssembly. Your document text and images never travel to an external server. You pay a one-time {{price}} fee with no recurring subscription.",
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
      title: "Best practices for WordPress blog images",
      blocks: [
        {
          type: "p",
          html: "Follow these four practices to help your WordPress articles load fast and rank well in Google Images.",
        },
        {
          type: "ul",
          items: [
            "Use descriptive file names with lowercase letters and hyphens (for example, wordpress-seo-settings.webp).",
            "Convert images to modern formats like WebP to cut file sizes by 30 to 80 percent.",
            "Resize images to your theme maximum content width before you upload.",
            "Write concise alternative text in the WordPress media settings for accessibility and search engines.",
          ],
        },
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
