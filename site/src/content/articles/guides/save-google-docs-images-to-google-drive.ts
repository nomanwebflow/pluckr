import type { Article } from "../types";

export const article: Article = {
  kind: "guide",
  slug: "save-google-docs-images-to-google-drive",
  title: "How to save Google Docs images to Google Drive",
  description:
    "Google Docs has no button to send its images to Drive. Learn four ways to save every image from a Google Doc into a Drive folder.",
  updated: "2026-11-07",
  readingMinutes: 5,
  summary: [
    "Google Docs cannot save its images to Google Drive. You can download the Doc as a zipped web page and upload the images folder, run an Apps Script, or use an add-on.",
    "Pluckr saves every selected image to a Drive folder with one click, and Pro adds conversion to WebP or AVIF first. Pro costs {{price}} once.",
  ],
  sections: [
    {
      id: "can-docs-save-images-to-drive",
      title: "Can Google Docs save its images to Google Drive?",
      blocks: [
        {
          type: "p",
          html: "Google Docs cannot save its images to Google Drive. The File menu exports the whole document and has no option to export only the pictures. You can still get every image into a Drive folder with four methods: a zipped web page, an Apps Script, a single-image add-on, or Pluckr.",
        },
        {
          type: "p",
          html: "All four methods save the images as normal files. Only the last two write to Drive without a manual upload.",
        },
      ],
    },
    {
      id: "method-1-download-and-upload",
      title: "Method 1: download the Doc as a web page and upload the images folder",
      blocks: [
        {
          type: "p",
          html: "The zipped web page method is free and needs no add-on. Google Docs exports the document as an HTML file and puts every picture in an images folder inside a ZIP. You then upload that folder to Drive yourself. The files keep generic names such as image1.png, and the images travel through your own computer twice.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>File &gt; Download &gt; Web Page (.html, zipped)</strong>.",
            "Open the downloaded ZIP file so it unpacks on your computer.",
            "Open <strong>drive.google.com</strong>. Choose <strong>New &gt; Folder upload</strong>.",
            "Select the <strong>images</strong> folder from the unpacked ZIP and upload it.",
          ],
        },
        {
          type: "p",
          html: "Repeat the steps each time the Doc changes. Drive does not know that the new files replace the old files.",
        },
      ],
    },
    {
      id: "method-2-apps-script",
      title: "Method 2: run an Apps Script that writes the images to a Drive folder",
      blocks: [
        {
          type: "p",
          html: "An Apps Script is free and saves the images to Drive without an upload step. You paste the code into the Doc, run it, and approve its access to your Drive. The method needs code, and you must trust and read the script before you run it on a Doc that you care about.",
        },
        {
          type: "p",
          html: 'Two public examples are the <a href="https://labnol.org/extract-images-google-docs-slides-230913" target="_blank" rel="noopener">Labnol guide</a> and the <a href="https://greenflux-blog.pages.dev/extract-images-from-a-google-doc-and-save-to-drive-folder" target="_blank" rel="noopener">GreenFlux script</a>. Both publish the code and explain how to run it.',
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>Extensions &gt; Apps Script</strong>.",
            "Paste the code from the guide that you chose.",
            "Run the function and approve the access that Google asks for.",
            "Open Drive and find the folder that the script made.",
          ],
        },
      ],
    },
    {
      id: "method-3-single-image-add-on",
      title: "Method 3: use a Marketplace add-on that saves one image",
      blocks: [
        {
          type: "p",
          html: 'The <a href="https://workspace.google.com/marketplace/app/save_inline_images/137726803369" target="_blank" rel="noopener">Save Inline Images</a> add-on saves an image from a Doc or a deck to your My Drive. Its listing says that you select an image and press <strong>Save Selected Image</strong>. The listing shows the add-on as free. Check the listing for the current limits before you rely on it for a long Doc.',
        },
      ],
    },
    {
      id: "method-4-pluckr",
      title: "Method 4: save every image to a Drive folder with Pluckr",
      blocks: [
        {
          type: "p",
          html: "Pluckr lists every picture in your Doc and saves the ones that you tick to a Drive folder with one click. Pluckr makes a folder named after the Doc in your My Drive. It saves the same files that go into the ZIP, so the images can be originals or converted to WebP, AVIF, JPEG or PNG. Save to Drive is a Pro feature.",
        },
        {
          type: "ol",
          items: [
            "Open the Doc and choose <strong>Extensions &gt; Pluckr &gt; Extract images</strong>.",
            "Tick the images that you want to save.",
            "Optional: open <strong>Output settings</strong> to choose a format, a maximum width or a crop.",
            "Click the <strong>Save to Google Drive</strong> button next to the main button.",
            "Wait for the message <strong>Saved files to Drive</strong>. Click <strong>Open folder</strong>.",
          ],
        },
        {
          type: "p",
          html: "The folder is named <code>&lt;Doc name&gt; images</code> and sits in your My Drive. It does not sit next to the Doc, even when someone shared the Doc with you. You can share the folder from Drive like any other folder.",
        },
        {
          type: "callout",
          title: "A second run does not make duplicates",
          html: "Pluckr reuses the folder on the next run. A file with the same name is replaced, so you can save again after you change the Doc. If a save stops half way, run it again. The files that Pluckr already saved are replaced, not copied.",
        },
        {
          type: "h3",
          text: "Which files does Pluckr save?",
        },
        {
          type: "p",
          html: "Pluckr saves the images. If you tick the options in Output settings, it also saves <code>images-metadata.csv</code> and <code>images-metadata.json</code> with the alt text, and <code>content.md</code> for a Google Doc. The ZIP download holds the same files.",
        },
        {
          type: "h3",
          text: "What can Pluckr reach in your Drive?",
        },
        {
          type: "p",
          html: "Pluckr uses the narrow Google permission <code>drive.file</code>. It can reach only the files that it creates. It cannot read or list the other files in your Drive. Pluckr only saves to Drive when you click the Drive button, and the files go from Google Apps Script to Google Drive. They do not pass through Pluckr's servers.",
        },
      ],
    },
    {
      id: "comparison",
      title: "How do the four ways to save Docs images to Drive compare?",
      blocks: [
        {
          type: "p",
          html: "The web page ZIP is free but needs a manual upload and gives generic names. An Apps Script is free and writes to Drive, but needs code. The Save Inline Images add-on needs no code. Pluckr saves all ticked images in one click, with a format choice, for {{price}} once.",
        },
        {
          type: "table",
          columns: [
            "",
            "Web page ZIP and upload",
            "Apps Script",
            "Save Inline Images",
            "Pluckr",
          ],
          highlight: 4,
          rows: [
            ["Needs no code", true, false, true, true],
            ["Writes to Drive without a manual upload", false, true, true, true],
            ["Convert to WebP or AVIF before saving", false, false, false, true],
            ["Cost", "Free", "Free", "Free", "Pro ({{price}} once)"],
          ],
        },
        {
          type: "p",
          html: "The conversion row is about the methods as described above. A custom script can add conversion if you write that code yourself.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Can Google Docs save its images to Google Drive directly?",
      a: "No. Google Docs has no command that saves its images to Drive. You must download the Doc and upload the images, run an Apps Script, or use an add-on such as Pluckr.",
    },
    {
      q: "Where does Pluckr save the images in Google Drive?",
      a: "Pluckr makes a folder named after the Doc, with the word images at the end, in your My Drive. The folder does not sit next to the Doc. You can share it from Drive.",
    },
    {
      q: "Is Save to Drive free in Pluckr?",
      a: "No. Save to Drive is a Pro feature. Pro costs {{price}} once for one Google account, with no subscription. The free plan downloads up to 50 images per Google account as originals or in a ZIP.",
    },
    {
      q: "Does Pluckr send my images to its servers when it saves to Drive?",
      a: "No. The files go from Google Apps Script to your Google Drive. Pluckr's servers do not receive the images. Pluckr can reach only the Drive files that it creates.",
    },
    {
      q: "What happens if I save to Drive twice?",
      a: "Pluckr reuses the same folder and replaces the files that have the same name. You do not get duplicates.",
    },
  ],
  related: [
    "download-all-images-from-google-docs",
    "copy-image-from-google-docs-to-figma-canva",
    "compress-images-in-google-docs",
  ],
};
