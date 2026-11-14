import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "see-image-file-size-in-google-docs",
  title: "How to see the file size of images in a Google Doc",
  description:
    "Google Docs does not show the file size or pixel size of its images. Learn three ways to find which images make a Doc big and slow.",
  updated: "2026-11-14",
  readingMinutes: 4,
  summary: [
    "Google Docs does not show an image's file size. The Image options panel shows only how big the image is on the page. You can download the Doc as a zipped web page and check each file, read pixel sizes with an add-on, or use Pluckr.",
    "Pluckr lists every image in the Doc with its pixel size and its file size, for free, so you can see which images are heavy in one list.",
  ],
  sections: [
    {
      id: "can-docs-show-file-size",
      title: "Can Google Docs show the file size of an image?",
      blocks: [
        {
          type: "p",
          html: "Google Docs cannot show the file size of an image. The <strong>Image options</strong> panel shows the width and the height of the image on the page, in inches, and it does not show the file size or the pixel size. You can find the sizes with three methods: the web page download, a size add-on, or Pluckr.",
        },
        {
          type: "p",
          html: 'The sizes matter because large images make a Doc slow to open and scroll, and they make exports big. A photo from a phone is often thousands of pixels wide, but a Doc page shows it at less than 700 pixels. See <a href="/guides/compress-images-in-google-docs">how to compress images in Google Docs</a> to fix the heavy ones.',
        },
      ],
    },
    {
      id: "method-1-web-page-download",
      title: "Method 1: download the Doc as a web page and check each file",
      blocks: [
        {
          type: "p",
          html: "This method is free and needs no add-on. Google Docs exports every image as a separate file, so your computer can show the file sizes. The drawback is that the files have generic names, such as <code>image1.png</code>, so you cannot tell which picture in the Doc each file is.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Open the ZIP file so that it unpacks on your computer.",
            "Open the <strong>images</strong> folder and sort the files by size.",
            "Open the biggest files to see what they are. To see the pixel size, use the file's <strong>Get Info</strong> window on a Mac, or <strong>Properties</strong> on Windows.",
          ],
        },
      ],
    },
    {
      id: "method-2-size-add-on",
      title: "Method 2: read the pixel size with an add-on",
      blocks: [
        {
          type: "p",
          html: 'The <a href="https://workspace.google.com/marketplace/app/setimagesize/222949584385" target="_blank" rel="noopener">SetImageSize</a> add-on can read the original size of an image. Its listing says that you select an image and use the sidebar to get its size, and that it works on in-line images only. It gives the dimensions in pixels and not the file size, and you do it for one image at a time. Check the listing for the current features and the price.',
        },
      ],
    },
    {
      id: "method-3-pluckr",
      title: "Method 3: list every image with its size in Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr shows all the images in the Doc in one list. Each row has a preview, the pixel size, such as <code>1600 × 900</code>, and the file size. The list is in the order of the Doc, so you can match a row to the picture on the page. Seeing the list is free, and it does not use up your 50 free images, because an image counts only when you copy or download it.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Scroll the list. Look at the file size and the pixel size of each image.",
            "Note the heavy images. Use the row's preview to find them in the Doc.",
          ],
        },
        {
          type: "h3",
          text: "Which images should you shrink?",
        },
        {
          type: "p",
          html: "There is no official limit, so use a rule of thumb. A Doc page is about 6.5 inches wide, so a photo that is 1600 pixels wide is more than enough on screen. An image that is much wider than that, or that is a few hundred KB or more, is a good candidate. Small icons and screenshots of a few KB are fine.",
        },
        {
          type: "p",
          html: "Pluckr Optimize can replace the heavy images in the Doc with smaller copies in one run. It is a Pro feature, and it keeps each image's place, size on the page, alt text and link.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the three ways to check image sizes compare?",
      blocks: [
        {
          type: "p",
          html: "The Image options panel shows no file size. The web page download shows file sizes but not which picture each file is. SetImageSize shows pixel sizes for one image at a time. Pluckr shows the pixel size and the file size of every image in one list.",
        },
        {
          type: "table",
          columns: [
            "",
            "Image options panel",
            "Web page download",
            "SetImageSize",
            "Pluckr",
          ],
          highlight: 4,
          rows: [
            ["Shows the file size", false, true, false, true],
            [
              "Shows the pixel size",
              false,
              "Open each file",
              true,
              true,
            ],
            [
              "All images in one list",
              false,
              "Files with generic names",
              "One image at a time",
              true,
            ],
            [
              "Cost",
              "Free",
              "Free",
              "Check the listing",
              "Free to view the list",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "Where can I see the file size of an image in a Google Doc?",
      a: "Google Docs does not show it. Download the Doc as a zipped web page and check the files in the images folder, or open the Doc in Pluckr, which lists the file size of every image.",
    },
    {
      q: "Does Pluckr show the pixel size as well as the file size?",
      a: "Yes. Each row shows the width and the height in pixels, and the file size. The pixel size is the size of the stored image, not the size on the page.",
    },
    {
      q: "Does looking at the sizes use up the free 50 images?",
      a: "No. The list and the previews are free. An image counts toward the 50 only when you copy or download it.",
    },
    {
      q: "How big should the images in a Google Doc be?",
      a: "There is no official limit. As a rule of thumb, an image about 1600 pixels wide is enough for a Doc page. Images that are much wider, or a few hundred KB or more, are good candidates to compress.",
    },
    {
      q: "Can Pluckr make the heavy images smaller?",
      a: "Yes, with Pro. Optimize replaces heavy images in the Doc with smaller copies. Pro costs {{price}} once. Make a copy of the Doc first.",
    },
  ],
  related: [
    "compress-images-in-google-docs",
    "convert-google-docs-images-to-webp",
    "download-all-images-from-google-docs",
  ],
};
