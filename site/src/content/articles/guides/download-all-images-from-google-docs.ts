import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "download-all-images-from-google-docs",
  title: "How to download all images from a Google Doc",
  description:
    "Google Docs has no button to save all images. Learn four ways to download every image from a Google Doc, and what each method costs you.",
  updated: "2026-11-06",
  cover: {
    src: "/guides/pluckr-image-list.webp",
    alt: "The Pluckr sidebar next to a Google Doc listing each image with a preview, name and file size",
    width: 1280,
    height: 800,
  },
  readingMinutes: 5,
  summary: [
    "Google Docs has no button to save all images at once. You can use four methods to download every image from a Google Doc.",
    "The free methods give generic file names. Pluckr lists every picture, renames and converts them, and saves one ZIP for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "the-problem",
      title: "Why can you not save all images from a Google Doc directly?",
      blocks: [
        {
          type: "p",
          html: "Google Docs has no button to download all images, because its File menu only exports the whole document. You can still save every image from a Google Doc with four methods: a zipped web page, a Word file, an Apps Script, or the Pluckr add-on. None of the four methods needs you to publish the Doc.",
        },
        {
          type: "p",
          html: "If you only need to save a single image from a Google Doc, right-click the picture and choose <strong>Save to Keep</strong>.",
        },
      ],
    },
    {
      id: "method-1",
      title: "Method 1: download the Doc as a zipped web page",
      blocks: [
        {
          type: "p",
          html: "The zipped web page method saves every image from a Google Doc for free, with nothing to install. Google Docs exports the document as an HTML file and puts the pictures in an images folder inside a ZIP. The files get generic names such as image1.png, and the folder sits next to an HTML file.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Open the downloaded ZIP so it unpacks.",
            "Open the <strong>images</strong> folder. Your pictures are inside.",
          ],
        },
      ],
    },
    {
      id: "method-2",
      title: "Method 2: save as Word and open the ZIP inside",
      blocks: [
        {
          type: "p",
          html: "The Word method also gets every image from a Google Doc for free. A .docx file is a ZIP archive, so you can rename the download to .zip and open the word/media folder. The images are plain files with generic names, and the rename step is harder on Windows, where file extensions can be hidden.",
        },
        {
          type: "ol",
          items: [
            "Choose <strong>File &gt; Download &gt; Microsoft Word (.docx)</strong>.",
            "Rename the file so it ends in .zip instead of .docx, then unzip it. On Windows you may need to turn on file extensions first.",
            "Open <strong>word &gt; media</strong>.",
          ],
        },
      ],
    },
    {
      id: "method-3",
      title: "Method 3: run an Apps Script",
      blocks: [
        {
          type: "p",
          html: 'An Apps Script is a short program that loops over a Google Doc and saves each image to Google Drive. The method is free and repeatable, but you paste the code and authorize it yourself, and you get no preview and no resizing. <a href="https://labnol.org/extract-images-google-docs-slides-230913" target="_blank" rel="noopener">Amit Agarwal’s guide on Digital Inspiration</a> shows a fuller version. The core idea looks like this:',
        },
        {
          type: "code",
          code: "function saveImages() {\n  const images = DocumentApp.getActiveDocument().getBody().getImages();\n  const folder = DriveApp.createFolder('Doc images');\n  images.forEach((img, i) =>\n    folder.createFile(img.getBlob().setName('image-' + (i + 1))));\n}",
        },
      ],
    },
    {
      id: "method-4",
      title: "Method 4: extract and download all images with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr is a Google Docs add-on that lists every image in a Doc with a preview, a size and its dimensions, including images in tables and other tabs. You rename the images, then download one image or a ZIP of all images. Pluckr is free for up to 50 images, and Pro costs {{price}} once.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "See every image with a preview, a size and its dimensions, including images in tables and other tabs.",
            "Rename what you need, then download one image, or press <strong>Download originals</strong> for a ZIP of all of them.",
            "Optional: open <strong>Output settings</strong>, pick WebP, AVIF, JPEG or PNG, and download the converted files.",
          ],
        },
        {
          type: "image",
          src: "/guides/pluckr-image-list.webp",
          alt: "The Pluckr sidebar next to a Google Doc listing each image with a preview, name and file size",
          width: 1280,
          height: 800,
          caption:
            "Pluckr in a Doc: every image listed with a preview, its name and its size.",
        },
        {
          type: "p",
          html: 'You can read how Pluckr handles <a href="/guides/convert-google-docs-images-to-webp">converting images to WebP or AVIF</a> or <a href="/guides/export-google-docs-to-markdown-with-images">exporting a Doc to Markdown with images</a>.',
        },
        {
          type: "image",
          src: "/guides/pluckr-converted-sizes.webp",
          alt: "The Pluckr sidebar showing an image reduced from 213.3 KB to 105.8 KB after conversion to WebP",
          width: 1280,
          height: 800,
          caption:
            "The optional step: convert while you download. This image went from 213.3 KB to 105.8 KB.",
        },
      ],
    },
    {
      id: "which-one",
      title: "Which method is best for downloading images from a Google Doc?",
      blocks: [
        {
          type: "p",
          html: "Use the zipped web page for one Doc, once, because it is free and needs no install. Use an Apps Script if you like scripts and do this task often. Use Pluckr for many Docs, or when the images need good names, a smaller format such as WebP, or a fixed shape.",
        },
        {
          type: "table",
          columns: ["", "Web page (.zip)", "Word (.docx)", "Apps Script", "Pluckr"],
          highlight: 4,
          rows: [
            ["Cost", "Free", "Free", "Free", "Free up to 50 images, then {{price}} once"],
            ["See the images before you save", false, false, false, true],
            ["Choose the file names", false, false, "In the code", true],
            ["Convert to WebP or AVIF", false, false, false, true],
            ["Nothing to paste or authorize", true, true, false, true],
          ],
        },
      ],
    },
    {
      id: "after",
      title: "What do you do after you save the image files?",
      blocks: [
        {
          type: "p",
          html: "Give the files descriptive names before they go on a website, because image names are one of the things search engines read. Keep the originals somewhere, since converting to a lossy format cannot be undone. And write alt text where the image is published. The file name is not a substitute for it.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "How do I save a single image from a Google Doc?",
      a: "Right-click the image and choose Save to Keep. Right-click the picture in the Keep sidebar to save it to your computer. With Pluckr, you can click Download next to any image in the sidebar.",
    },
    {
      q: "Do I need to publish the Doc to download its images?",
      a: "No. None of these methods needs you to publish the Doc.",
    },
    {
      q: "Which method is fastest?",
      a: "For a single Doc, the zipped web page download. For many Docs, or when you also want to rename or convert the images, Pluckr.",
    },
    {
      q: "Does Pluckr find images inside tables?",
      a: "Yes. It lists images in tables and in other document tabs.",
    },
    {
      q: "Why are my downloaded images called image1, image2?",
      a: "Docs uses generic names when it exports a document. Pluckr lets you rename each image before you download it.",
    },
    {
      q: "Can I get the images in a smaller format?",
      a: "With the manual methods you need a separate converter. Pluckr converts to WebP, AVIF, JPEG or PNG in the same sidebar.",
    },
    {
      q: "Are floating images included?",
      a: "Not in Pluckr yet. It reads inline images. Images set to float in front of or behind text are not listed.",
    },
  ],
  related: [
    "convert-google-docs-images-to-webp",
    "extract-images-from-google-slides",
    "pluckr-vs-google-docs-built-in-downloads",
  ],
};
