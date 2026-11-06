import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "download-all-images-from-google-docs",
  title: "How to download all images from a Google Doc",
  description:
    "Google Docs has no save-all-images button. Four ways to get every image out of a Doc, with what each one costs you.",
  updated: "2026-10-30",
  cover: {
    src: "/guides/pluckr-image-list.webp",
    alt: "The Pluckr sidebar next to a Google Doc listing each image with a preview, name and file size",
    width: 1280,
    height: 800,
  },
  readingMinutes: 5,
  summary: [
    "Google Docs has no “save all images” button. There are four ways around it.",
    "The free methods work but give you generic file names and a bit of cleanup. Pluckr lists the images, lets you rename and convert them, and saves everything in one go for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "the-problem",
      title: "The problem",
      blocks: [
        {
          type: "p",
          html: "You need the pictures from a Google Doc: a blog draft, a client brief, a report with screenshots. Docs lets you download the document as a file, but it does not offer a folder of the images.",
        },
        {
          type: "p",
          html: "These are the four routes people use, in order of effort, with the honest downside of each. Nobody needs to publish the Doc for any of them.",
        },
      ],
    },
    {
      id: "method-1",
      title: "Method 1: download the Doc as a zipped web page",
      blocks: [
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Open the downloaded ZIP so it unpacks.",
            "Open the <strong>images</strong> folder. Your pictures are inside.",
          ],
        },
        {
          type: "p",
          html: "<strong>Good:</strong> nothing to install, and it is free. <strong>Not so good:</strong> the files have generic names like image1.png. You cannot see which is which until you open them, and the folder sits next to an unwanted HTML file.",
        },
      ],
    },
    {
      id: "method-2",
      title: "Method 2: download as Word and open the ZIP inside",
      blocks: [
        {
          type: "ol",
          items: [
            "Choose <strong>File &gt; Download &gt; Microsoft Word (.docx)</strong>.",
            "Rename the file so it ends in .zip instead of .docx, then unzip it. On Windows you may need to turn on file extensions first.",
            "Open <strong>word &gt; media</strong>.",
          ],
        },
        {
          type: "p",
          html: "<strong>Good:</strong> also free, and the images are plain files. <strong>Not so good:</strong> the same generic names, and a rename step that confuses some people.",
        },
      ],
    },
    {
      id: "method-3",
      title: "Method 3: run an Apps Script",
      blocks: [
        {
          type: "p",
          html: 'A short script can loop over the document and save each image to Google Drive. <a href="https://labnol.org/extract-images-google-docs-slides-230913" target="_blank" rel="noopener">Amit Agarwal’s guide on Digital Inspiration</a> walks through a fuller version. The core idea looks like this:',
        },
        {
          type: "code",
          code: "function saveImages() {\n  const images = DocumentApp.getActiveDocument().getBody().getImages();\n  const folder = DriveApp.createFolder('Doc images');\n  images.forEach((img, i) =>\n    folder.createFile(img.getBlob().setName('image-' + (i + 1))));\n}",
        },
        {
          type: "p",
          html: "<strong>Good:</strong> free and repeatable once set up. <strong>Not so good:</strong> you paste code, authorize it yourself, and then download the files from Drive. It has no preview and no resizing.",
        },
      ],
    },
    {
      id: "method-4",
      title: "Method 4: use Pluckr",
      blocks: [
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
          html: '<strong>Good:</strong> you see the images first, you choose the names, and you can shrink or reshape them in the same step. <strong>Not so good:</strong> it costs {{price}}, once. You can read how Pluckr handles <a href="/guides/convert-google-docs-images-to-webp">converting images to WebP or AVIF</a> on its own page.',
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
      title: "Which one should you use",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>One Doc, once, no rush:</strong> Method 1.",
            "<strong>You like scripts and do this often:</strong> Method 3.",
            "<strong>Many Docs, or images that need good names, a smaller format or a fixed shape:</strong> Pluckr.",
          ],
        },
      ],
    },
    {
      id: "after",
      title: "After you have the files",
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
