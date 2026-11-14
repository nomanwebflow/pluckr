import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "copy-image-from-google-docs-to-figma-canva",
  title: "How to copy a Google Docs image into Figma or Canva",
  description:
    "Pasting an image from Google Docs into Figma, Canva or Confluence often pastes nothing. Learn why it fails and four ways to get the image across.",
  updated: "2026-11-14",
  readingMinutes: 5,
  summary: [
    "When you copy an image in Google Docs, it goes on the clipboard as HTML, not as a plain image. Apps like Figma, Canva and Confluence can paste nothing, or paste text. You can copy the image through another app, download it first, use a browser extension, or use Pluckr.",
    "Pluckr puts the image on the clipboard as a PNG, the same format as a screenshot. It copies one image per click, and the free plan covers 50 images.",
  ],
  sections: [
    {
      id: "why-paste-fails",
      title: "Why can't you paste a Google Docs image into Figma or Canva?",
      blocks: [
        {
          type: "p",
          html: 'Google Docs puts a copied image on the clipboard as HTML, and the app that you paste into may not read it. <a href="https://support.google.com/docs/answer/117105" target="_blank" rel="noopener">Google\'s help page on copying and pasting</a> says that images copied out of Docs into other applications travel as HTML. A tool that expects an image file on the clipboard can paste nothing, or only a file name or a line of text.',
        },
        {
          type: "p",
          html: 'People report the problem in the <a href="https://forum.figma.com/ask-the-community-7/can-t-copy-image-from-google-docs-into-figma-39692" target="_blank" rel="noopener">Figma community forum</a> and in <a href="https://community.atlassian.com/forums/Confluence-questions/Is-copy-paste-images-from-Google-Docs-broken/qaq-p/3107316" target="_blank" rel="noopener">an Atlassian community thread about Confluence</a>. The fix is to get the image onto the clipboard, or into a file, in a format that the other app reads.',
        },
      ],
    },
    {
      id: "method-1-another-app",
      title: "Method 1: paste the image into another app first",
      blocks: [
        {
          type: "p",
          html: "This method is free and needs no install. You paste the image from Google Docs into a second app, such as Google Keep, Google Chat or Apple Notes, then copy it again from that app. Some people in the forum threads above report that the second copy pastes correctly. The result varies by app and by computer, so treat it as a quick test, not as a fix that you can count on.",
        },
        {
          type: "ol",
          items: [
            "Click the image in the Doc and press <strong>Ctrl+C</strong> (<strong>Cmd+C</strong> on a Mac).",
            "Paste it into the second app.",
            "Click the image there and copy it again.",
            "Paste it into Figma, Canva or Confluence.",
          ],
        },
      ],
    },
    {
      id: "method-2-download",
      title: "Method 2: download the image and upload the file",
      blocks: [
        {
          type: "p",
          html: 'Downloading the image always works, because every app accepts a file. The cost is extra steps: Google Docs has no download button for one image, so you download the whole Doc as a zipped web page, find the file in the images folder, and drag it into the other app. The file names are generic, such as <code>image3.png</code>. See <a href="/guides/download-all-images-from-google-docs">how to download all images from a Google Doc</a> for the steps.',
        },
      ],
    },
    {
      id: "method-3-extensions",
      title: "Method 3: use a Chrome extension that adds a Copy button",
      blocks: [
        {
          type: "p",
          html: 'Some Chrome extensions add a copy button to Google Docs. <a href="https://chromewebstore.google.com/detail/fplnmnhieghlakiiecjndklcekghhbep" target="_blank" rel="noopener">Google Docs Image Copier</a> says in its listing that it copies the original image to your clipboard when you select an image. <a href="https://chromewebstore.google.com/detail/anlccnonblpahdekogjgfenmedcgkdaj" target="_blank" rel="noopener">Pixlift</a> is a similar extension. An extension works in the browser and not in the Doc, so check what each listing says about permissions before you install it.',
        },
      ],
    },
    {
      id: "method-4-pluckr",
      title: "Method 4: copy the image as a PNG with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr lists every image in the Doc, and each image has a <strong>Copy</strong> button. The button puts the image on your clipboard as a PNG, the same format that a screenshot has. Apps that let you paste a screenshot can usually paste this too. The copy runs in your browser, and Pluckr's servers do not receive the image.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Find the image in the list. Each row shows a preview, the pixel size and the file size.",
            "Click <strong>Copy</strong> on that row. The button shows <strong>Copied</strong> when it is done.",
            "Switch to Figma, Canva or Confluence and paste with <strong>Ctrl+V</strong> (<strong>Cmd+V</strong> on a Mac).",
          ],
        },
        {
          type: "callout",
          title: "What Pluckr does to the image when it copies",
          html: "A PNG is copied as it is. Any other format, such as JPEG, is redrawn as a PNG at its full pixel size. The pasted PNG has the same pixels, but it can be a bigger file than the JPEG. If your browser blocks clipboard access, the button shows <strong>Copy failed</strong>. Use <strong>Download</strong> on the same row instead.",
        },
        {
          type: "h3",
          text: "Does copying an image use up the free plan?",
        },
        {
          type: "p",
          html: "Yes, copying counts. The free plan covers 50 images for each Google account, in total. An image counts once, the first time you copy or download it, so copying the same image again costs nothing. Looking at the list and the previews is always free. Pro costs {{price}} once and removes the limit.",
        },
        {
          type: "p",
          html: "Pluckr copies one image per click. To move many images at once, download them as one ZIP.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the four ways to copy a Google Docs image compare?",
      blocks: [
        {
          type: "p",
          html: "Pasting through another app is free but unreliable. Downloading always works but takes the most steps. An extension and Pluckr both add a copy button. Pluckr also works in Slides and shows the image size before you copy.",
        },
        {
          type: "table",
          columns: [
            "",
            "Through another app",
            "Download and upload",
            "Chrome extension",
            "Pluckr",
          ],
          highlight: 4,
          rows: [
            [
              "Steps for each image",
              "Paste, copy again, paste",
              "Download the Doc, find the file, upload",
              "Select, click Copy, paste",
              "Click Copy, paste",
            ],
            ["Needs an install", false, false, true, true],
            [
              "Cost",
              "Free",
              "Free",
              "Check the listing",
              "Free for 50 images, then Pro ({{price}} once)",
            ],
          ],
        },
        {
          type: "p",
          html: 'If you want the files and not the clipboard, see <a href="/guides/save-google-docs-images-to-google-drive">how to save Google Docs images to Google Drive</a>.',
        },
      ],
    },
  ],
  faq: [
    {
      q: "Why won't a Google Docs image paste into Figma?",
      a: "Google Docs copies an image to the clipboard as HTML, and Figma may not read that. Copy the image as a PNG with a tool like Pluckr, or download it and drag the file in.",
    },
    {
      q: "Does Pluckr work for Canva and Confluence too?",
      a: "Pluckr puts a PNG on the clipboard, the same format as a screenshot. Canva, Confluence and other apps that accept a pasted screenshot can usually paste it. If an app does not, download the image and upload the file.",
    },
    {
      q: "Can I copy more than one image at once?",
      a: "Pluckr copies one image for each click. To move many images, download them as one ZIP, or save them to a Drive folder with Pro.",
    },
    {
      q: "Does Pluckr upload my image to copy it?",
      a: "No. The copy runs in your browser. Pluckr's servers do not receive the image. On the free plan, Pluckr sends a one-way fingerprint of the image, to count your 50.",
    },
    {
      q: "Does copying work in Google Slides?",
      a: "Yes. Pluckr lists every picture on every slide, and each picture has the same Copy button.",
    },
  ],
  related: [
    "download-all-images-from-google-docs",
    "save-google-docs-images-to-google-drive",
    "extract-images-from-google-slides",
  ],
};
