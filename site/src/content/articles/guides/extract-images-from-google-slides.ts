import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "extract-images-from-google-slides",
  title: "How to extract images from Google Slides",
  description:
    "Google Slides has no button to save images. Learn three ways to extract all pictures from a presentation as a ZIP file.",
  updated: "2026-11-06",
  cover: {
    src: "/guides/pluckr-slides-list.webp",
    alt: "The Pluckr sidebar open next to a Google Slides presentation listing each slide image with a preview and file size",
    width: 1280,
    height: 800,
  },
  readingMinutes: 4,
  summary: [
    "Google Slides has no button to save a single picture or download all slide images at once. You can extract images for free with the PowerPoint ZIP trick or Google Keep, or download every picture in one step with Pluckr.",
    "Pluckr lists every picture across all slides and groups for free up to 50 images. Pro adds bulk renaming and WebP or AVIF conversion for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "why-slides-hard",
      title: "Why can I not save an image from Google Slides?",
      blocks: [
        {
          type: "p",
          html: "Google Slides does not offer a Save Image As option when you right-click a picture. Selecting File and Download only exports the full slide as a PNG, JPEG, or PDF.",
        },
        {
          type: "p",
          html: "Taking a screenshot or exporting a full slide lowers image resolution and captures text boxes over the photo. The three methods below extract the original image files stored inside your presentation.",
        },
      ],
    },
    {
      id: "method-1-pptx-zip",
      title: "Method 1: download as PowerPoint and unpack the ZIP",
      blocks: [
        {
          type: "p",
          html: "A PowerPoint (.pptx) file is a ZIP archive. You can download your presentation as a PowerPoint file and open the media folder inside.",
        },
        {
          type: "ol",
          items: [
            "Open your presentation in Google Slides.",
            "Choose <strong>File &gt; Download &gt; Microsoft PowerPoint (.pptx)</strong>.",
            "Rename the downloaded file on your computer so the extension changes from <code>.pptx</code> to <code>.zip</code>.",
            "Open the ZIP archive and open the <strong>ppt &gt; media</strong> folder to find your original images.",
          ],
        },
        {
          type: "p",
          html: "<strong>Good:</strong> this method is free and extracts every picture at full resolution. <strong>Not so good:</strong> files get generic names like image1.png, and Windows or macOS hides file extensions by default.",
        },
      ],
    },
    {
      id: "method-2-keep",
      title: "Method 2: save a single image with Google Keep",
      blocks: [
        {
          type: "p",
          html: "When you only need one or two pictures from a slide deck, you can send them to the Google Keep side panel.",
        },
        {
          type: "ol",
          items: [
            "Right-click the picture on your slide.",
            "Choose <strong>Save to Keep</strong> from the context menu.",
            "Wait for the Google Keep panel to open on the right side of the screen.",
            "Right-click the image inside the Keep note and choose <strong>Save image as</strong>.",
          ],
        },
        {
          type: "p",
          html: "<strong>Good:</strong> this method requires no file renaming and works for a single picture. <strong>Not so good:</strong> you must repeat the process one image at a time, and grouped pictures require ungrouping first.",
        },
      ],
    },
    {
      id: "method-3-pluckr",
      title: "Method 3: extract all slide images at once with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr opens a sidebar inside Google Slides and lists every picture across every slide in order. Pluckr also finds pictures nested inside slide groups.",
        },
        {
          type: "ol",
          items: [
            "Open your presentation in Google Slides.",
            "Choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Review the image list with pixel dimensions and file sizes.",
            "Click <strong>Download originals</strong> to save all pictures in one ZIP file.",
          ],
        },
        {
          type: "image",
          src: "/guides/pluckr-slides-list.webp",
          alt: "The Pluckr sidebar in Google Slides showing a slide photo preview, 1536 x 2048 dimensions, 555.6 KB size, and the Download originals button",
          width: 1280,
          height: 800,
          caption:
            "Pluckr lists every picture in your Google Slides deck with a preview, pixel dimensions, and file size.",
        },
        {
          type: "p",
          html: 'Pluckr is free for up to 50 images per presentation. Pro costs {{price}} once and unlocks bulk file patterns like <code>{deck}-{n}</code>, alt text editing, and conversion to <a href="/guides/convert-google-docs-images-to-webp">WebP or AVIF</a>.',
        },
        {
          type: "callout",
          title: "What Pluckr does not read in Slides",
          html: "Pluckr reads pictures placed on slides and inside groups. Pluckr does not read slide background fills, shape fills, or images locked on slide masters and layouts.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the Google Slides extraction methods compare?",
      blocks: [
        {
          type: "table",
          columns: ["", "PowerPoint (.pptx) ZIP", "Save to Keep", "Pluckr"],
          highlight: 3,
          rows: [
            ["Download all slide images at once", true, false, true],
            ["See image previews before saving", false, true, true],
            ["Read pictures inside slide groups", true, false, true],
            ["Bulk rename files by pattern", false, false, "Pro ({{price}} once)"],
            ["Convert to WebP or AVIF", false, false, "Pro ({{price}} once)"],
            ["No file extension rename needed", false, true, true],
            ["Cost", "Free", "Free", "Free up to 50 images"],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      q: "How do I download all images from Google Slides at once?",
      a: "You can download the presentation as a PowerPoint (.pptx) file, rename it to .zip, and open the ppt/media folder. Or you can use the Pluckr add-on to download all slide pictures as a ZIP in one click.",
    },
    {
      q: "Why does Google Slides save the whole slide instead of one image?",
      a: "The File > Download > PNG image command in Google Slides exports the entire slide canvas. To save a single image, right-click the picture and choose Save to Keep, or extract the original file with Pluckr.",
    },
    {
      q: "Does Pluckr extract images inside grouped objects in Google Slides?",
      a: "Yes. Pluckr scans every slide in order and reads pictures placed inside groups without ungrouping them on your slide.",
    },
    {
      q: "Does extracting images with Pluckr change my Google Slides presentation?",
      a: "No. Extracting and converting images only reads your presentation. Pluckr changes your deck only when you save alt text or run the in-deck Optimize tool.",
    },
    {
      q: "Does one Pluckr Pro purchase cover both Google Docs and Google Slides?",
      a: "Yes. One {{price}} purchase unlocks Pro features for your Google account across both Google Docs and Google Slides.",
    },
  ],
  related: [
    "download-all-images-from-google-docs",
    "convert-google-docs-images-to-webp",
  ],
};

