import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "compress-images-in-google-docs",
  title: "How to compress images in Google Docs",
  description:
    "Google Docs has no setting to compress images. Learn three ways to make the images in a Doc smaller so it opens, scrolls and exports faster.",
  updated: "2026-11-13",
  readingMinutes: 5,
  summary: [
    "Google Docs cannot compress its images. When you drag an image smaller, the Doc keeps the full-size file. You can compress each image outside the Doc and replace it, or use an add-on.",
    "Pluckr Optimize compresses the images inside the open Doc in one run. Each image keeps its place, its size on the page, its alt text and its link. Optimize is a Pro feature, {{price}} once.",
  ],
  sections: [
    {
      id: "can-docs-compress-images",
      title: "Can Google Docs compress images?",
      blocks: [
        {
          type: "p",
          html: "Google Docs cannot compress images. It has no compression setting, and the image options only change how the picture looks on the page. You can make the images in a Doc smaller with three methods: compress each image yourself and replace it, use a compression add-on, or use Pluckr Optimize.",
        },
        {
          type: "p",
          html: "Large images make a Doc slow to open and scroll, and they make PDF and Word exports big. Photos from a phone or a camera are often 3000 pixels wide or more, but a Doc page shows them at less than 700 pixels.",
        },
      ],
    },
    {
      id: "why-resizing-does-not-help",
      title: "Why does dragging an image smaller not reduce its size?",
      blocks: [
        {
          type: "p",
          html: "When you drag the corner of an image, you change only the size it is drawn at. The Doc keeps the original file with all of its pixels. Crop and the Image options panel work the same way. To make the file smaller, you must put a smaller file in the Doc.",
        },
        {
          type: "p",
          html: "To see the real size of each image, open the Doc in Pluckr. The free plan lists every image with its pixel size and its file size. You do not have to copy or download anything to see the list. For the steps, see <a href=\"/guides/see-image-file-size-in-google-docs\">how to see the file size of images in a Google Doc</a>.",
        },
      ],
    },
    {
      id: "method-1-compress-and-replace",
      title: "Method 1: compress each image and replace it in the Doc",
      blocks: [
        {
          type: "p",
          html: "This method is free and needs no add-on. You get each image out of the Doc, make it smaller with an image tool, and put it back with Replace image. It takes a few minutes for each image, so it suits a Doc with only a few large pictures.",
        },
        {
          type: "ol",
          items: [
            'Get the image files out of the Doc. Use <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>, or see <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a>.',
            "Open each large image in an image tool. Resize it to about 1600 pixels wide or less, and save it as a JPEG at about 80% quality.",
            "In the Doc, right-click the image and choose <strong>Replace image &gt; Upload from computer</strong>.",
            "Select the smaller file. Check the size and the position of the new image on the page.",
          ],
        },
        {
          type: "p",
          html: "Keep a PNG for screenshots and for images with transparent areas. A JPEG fills transparent areas with a solid color.",
        },
      ],
    },
    {
      id: "method-2-add-ons",
      title: "Method 2: use a compression add-on",
      blocks: [
        {
          type: "p",
          html: 'Some Marketplace add-ons compress images, but check what each one supports before you install it. The <a href="https://workspace.google.com/marketplace/app/boa_compress/961206810969" target="_blank" rel="noopener">Boa Compress</a> listing describes compression for Google Slides and says that Google Docs support is coming. <a href="https://workspace.google.com/marketplace/app/pixelcinch_%E2%80%93_bulk_image_compressor/1094395567848" target="_blank" rel="noopener">PixelCinch</a> compresses image files that are stored in Google Drive, not images that are already in a Doc.',
        },
        {
          type: "p",
          html: "Read the privacy section of a listing before you use it on private documents. Some tools send each image to an outside service to compress it.",
        },
      ],
    },
    {
      id: "method-3-pluckr-optimize",
      title: "Method 3: compress every image in the Doc with Pluckr Optimize",
      blocks: [
        {
          type: "p",
          html: "Pluckr Optimize replaces the heavy images in the open Doc with smaller copies, one after the other. Each new image takes the place, the size on the page, the alt text and the link of the old image, so the page looks the same. The compression runs in your browser. Optimize is a Pro feature, and it also works in Google Slides.",
        },
        {
          type: "ol",
          items: [
            "Make a copy of the Doc first: <strong>File &gt; Make a copy</strong>.",
            "Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Tick the images that you want to compress.",
            "Click the <strong>More options</strong> button at the top of the sidebar. Choose <strong>Optimize Doc images</strong>.",
            "Choose a preset, then tick the box that confirms you have a copy.",
            "Click <strong>Optimize</strong>. Pluckr shows how much smaller the images became.",
          ],
        },
        {
          type: "h3",
          text: "Which preset should you choose?",
        },
        {
          type: "ul",
          items: [
            "<strong>Web friendly</strong> makes images no wider than 1600 pixels at 82% quality. Use it for most Docs.",
            "<strong>Ultra light</strong> makes images no wider than 1200 pixels at 75% quality. Use it when the file size is more important than fine detail.",
          ],
        },
        {
          type: "h3",
          text: "Which images does Optimize change?",
        },
        {
          type: "p",
          html: "Optimize works on JPEG, PNG and BMP images. A PNG with transparent areas stays a PNG. Other images become JPEG files. Pluckr skips an image if the new copy would be less than a tenth smaller, and it never makes a small image bigger.",
        },
        {
          type: "callout",
          title: "Optimize changes your Doc",
          html: "Optimize replaces images in the open file. Make a copy first. You can also go back with <strong>File &gt; Version history</strong>. Crop or rotation that you set in the Docs editor can be lost when an image is replaced.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the three ways to compress Docs images compare?",
      blocks: [
        {
          type: "p",
          html: "Manual replace is free but slow, one image at a time. The add-ons in the Marketplace today do not compress images that are already in a Doc. Pluckr Optimize compresses all ticked images in the Doc in one run, for {{price}} once.",
        },
        {
          type: "table",
          columns: ["", "Compress and replace", "Add-ons listed above", "Pluckr Optimize"],
          highlight: 3,
          rows: [
            ["Compresses images already in a Doc", true, false, true],
            ["All images in one run", false, "Varies", true],
            ["Keeps size on the page, alt text and link", "Size only", "Varies", true],
            ["Images stay in your browser", true, "Check the listing", true],
            ["Cost", "Free", "Varies", "Pro ({{price}} once)"],
          ],
        },
        {
          type: "p",
          html: 'If you need the images as separate files and not inside the Doc, see <a href="/guides/convert-google-docs-images-to-webp">how to convert Google Docs images to WebP</a>. To compare the built-in download options, see <a href="/compare/pluckr-vs-google-docs-built-in-downloads">Pluckr vs the Google Docs downloads</a>.',
        },
      ],
    },
  ],
  faq: [
    {
      q: "Does Google Docs compress images automatically?",
      a: "No. Google Docs has no setting that compresses images. When you make an image smaller on the page, the Doc keeps the original file.",
    },
    {
      q: "Why is my Google Doc so slow with many images?",
      a: "Large image files make a Doc slow to open and scroll. Photos are often much larger than the size that the page shows them at. Compress the images to make the Doc faster.",
    },
    {
      q: "Will compressing images change how my Doc looks?",
      a: "Pluckr Optimize keeps the size on the page, the alt text and the link of each image, so the layout stays the same. Crop or rotation that you set in the Docs editor can be lost. Make a copy of the Doc first.",
    },
    {
      q: "Does Pluckr upload my images to compress them?",
      a: "No. Pluckr compresses the images in your browser. Google Apps Script then puts the smaller copies in the Doc. Pluckr's servers do not receive the images.",
    },
    {
      q: "Is Optimize free in Pluckr?",
      a: "No. Optimize is a Pro feature. Pro costs {{price}} once for one Google account, with no subscription. The free plan lists every image with its pixel size and file size.",
    },
  ],
  related: [
    "see-image-file-size-in-google-docs",
    "google-docs-to-wordpress-images",
    "convert-google-docs-images-to-webp",
  ],
};
