import type { Article } from "../types";

// Every fact here comes from the guide "How to download all images from a
// Google Doc". Check new claims before you add them.
export const article: Article = {
  kind: "compare",
  slug: "pluckr-vs-google-docs-built-in-downloads",
  title: "Pluckr vs Built-In Google Docs Image Downloads",
  description:
    "A side-by-side look at the zipped web page, the Word trick, an Apps Script and Pluckr for getting images out of a Google Doc.",
  updated: "2026-11-06",
  readingMinutes: 3,
  summary: [
    "The built-in Google Docs methods get every image for free, but they give generic names and no preview. Pluckr adds a preview, your own file names and WebP or AVIF conversion for a one-time {{price}}, and Pluckr is free for up to 50 images per Google account.",
  ],
  sections: [
    {
      id: "at-a-glance",
      title: "How does Pluckr compare to the built-in Google Docs downloads?",
      blocks: [
        {
          type: "p",
          html: "Four methods get images out of a Google Doc: the zipped web page, the Word file, an Apps Script and Pluckr. The first three are free, but they give generic file names or need code. Only Pluckr shows the images before you save them and converts them to WebP or AVIF.",
        },
        {
          type: "table",
          columns: [
            "",
            "Web page (.zip)",
            "Word (.docx)",
            "Apps Script",
            "Pluckr",
          ],
          highlight: 4,
          rows: [
            ["Free", true, true, true, "One-time {{price}}"],
            ["See the images before you save", false, false, false, true],
            ["Choose the file names", false, false, "In the code", true],
            ["Convert to WebP or AVIF", false, false, false, true],
            ["Resize the images", false, false, false, true],
            ["Nothing to paste or authorize", true, true, false, true],
            ["Images in one download", true, true, "Saved to Drive", true],
          ],
        },
      ],
    },
    {
      id: "when-the-free-ways-win",
      title: "When are the free Google Docs methods the better choice?",
      blocks: [
        {
          type: "p",
          html: "The free methods are the better choice for one Doc, once. The zipped web page needs no install and no payment, and it gives you generic names like image1.png and an HTML file you did not ask for. An Apps Script suits people who like scripts and do this task often.",
        },
        {
          type: "p",
          html: "With an Apps Script, you paste the code and authorize it yourself, then download the files from Drive.",
        },
      ],
    },
    {
      id: "when-pluckr-wins",
      title: "When is Pluckr the better choice?",
      blocks: [
        {
          type: "p",
          html: "Pluckr is the better choice when you have many Docs, when the images need good names before they go on a website, or when you want WebP, AVIF or a fixed shape in the same step. The setup of the free methods repeats for each Doc. Pluckr does all of this in one sidebar.",
        },
        {
          type: "callout",
          title: "Try it first",
          html: "Pluckr is free for up to 50 images per Google account, in total. You can list every image in a Doc, then preview and download up to 50 of them as originals before you pay for anything.",
        },
      ],
    },
  ],
  faq: [
    {
      q: "Is Pluckr free?",
      a: "Pluckr is free for up to 50 images per Google account, in total. You can list every image, then preview and download up to 50 of them as originals before you pay. Pro costs {{price}} once, with no subscription.",
    },
    {
      q: "What is the best free way to get images out of a Google Doc?",
      a: "The zipped web page. Choose File > Download > Web Page (.html, zipped), open the ZIP and open the images folder. You install nothing and you pay nothing, but the files have generic names.",
    },
    {
      q: "Can the built-in Google Docs downloads convert images to WebP?",
      a: "No. The zipped web page and the Word file give you the images with no format choice, so you need a separate converter. Pluckr converts to WebP or AVIF in the same sidebar.",
    },
    {
      q: "Do I need to paste code to use Pluckr?",
      a: "No. Only the Apps Script method needs code. You open Pluckr from Extensions > Pluckr > Extract images inside the Doc.",
    },
  ],
  related: ["download-all-images-from-google-docs"],
};
