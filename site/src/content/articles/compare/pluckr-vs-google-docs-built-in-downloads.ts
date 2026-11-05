import type { Article } from "../types";

// Every fact here comes from the guide "How to download all images from a
// Google Doc". Check new claims before you add them.
export const article: Article = {
  kind: "compare",
  slug: "pluckr-vs-google-docs-built-in-downloads",
  title: "Pluckr vs the built-in ways to download Google Doc images",
  description:
    "A side-by-side look at the zipped web page, the Word trick, an Apps Script and Pluckr for getting images out of a Google Doc.",
  updated: "2026-11-05",
  readingMinutes: 3,
  summary: [
    "The free methods get you the images but with generic names and no preview. Pluckr adds a preview, your own names and conversion, for a one-time {{price}}.",
  ],
  sections: [
    {
      id: "at-a-glance",
      title: "At a glance",
      blocks: [
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
      title: "When the free ways win",
      blocks: [
        {
          type: "p",
          html: "For one Doc, once, the zipped web page is hard to beat. You install nothing and you pay nothing. The cost is generic names like image1.png and an HTML file you did not ask for.",
        },
        {
          type: "p",
          html: "An Apps Script suits people who like scripts and do this often. You paste the code and authorize it yourself, then download the files from Drive.",
        },
      ],
    },
    {
      id: "when-pluckr-wins",
      title: "When Pluckr wins",
      blocks: [
        {
          type: "ul",
          items: [
            "You have many Docs, so the setup of the other ways repeats each time.",
            "The images need good names before they go on a website.",
            "You want a smaller format such as WebP or AVIF, or a fixed shape, in the same step.",
          ],
        },
        {
          type: "callout",
          title: "Try it first",
          html: "Pluckr is free for up to 50 images. You can list and preview every image and download the originals before you pay for anything.",
        },
      ],
    },
  ],
  related: ["download-all-images-from-google-docs"],
};
