# Long-tail keyword targets for Pluckr

Checked Nov 14, 2026 with live SERP searches and Search Console. **No search volume data.** I had no keyword tool, and GSC has only about 18 impressions in 3 weeks, so nothing here is ranked by demand. "Easy" means the current results are weak, not that the term has traffic. Confirm the top picks in Google Keyword Planner (free) before you write them.

The head terms ("download images from google docs", "extract images from google docs") are taken by howtogeek, nira, zapier, Labnol and about ten Chrome extensions. Skip them. We already sit at position 50 or lower for those, and that is where they will stay for months.

## Status (Nov 14, 2026)

| # | Page | State |
|---|---|---|
| 2 | `/guides/copy-image-from-google-docs-to-figma-canva` | Written, not deployed |
| 3 | `/guides/see-image-file-size-in-google-docs` | Written, not deployed |
| 1 | Image order in the zipped HTML export | **Not written.** The claim could not be tested: it needs a real Google Doc and an HTML export, and the one account that could make them was off limits. Run the test by hand (see below) before writing it. |
| 4, 5, 6, 7, 8 | Not started | Still open |

What was verified, and how:
- **Copy (#2):** read from the add-on source. The Copy button writes a PNG to the clipboard; other formats are redrawn as PNG at full pixel size; copying counts toward the free 50, once per image. **Not tested in Figma, Canva or Confluence.** The guide says only that a PNG is the format a screenshot uses, and that apps accepting a pasted screenshot can usually take it. Paste into each app once before you promote the page for those names.
- **File size (#3):** read from the add-on source. Each row shows the real pixel size (measured in the browser) and the byte size, in document order, for free.
- **Google's HTML clipboard behaviour:** taken from Google's help page, as the search result summarised it. Open the page once and confirm the wording.

## The picks

| # | Target query (and variants) | What ranks today | Pluckr angle | Page |
|---|---|---|---|---|
| 1 | google docs download images in order / google docs image names out of order / rename google docs images in document order | One forum post says the zipped HTML export numbers files `image1.png`, `image2.png` in an order that does not match the document. No guide. | The sidebar lists images in document order. Bulk rename from a pattern is Pro. | New guide |
| 2 | can't paste image from google docs into figma / google docs image won't paste into confluence / copy image from google docs to canva or photoshop | Only forum threads (Figma, Atlassian, Canvas, Keyboard Maestro) plus two small Chrome extensions. No how-to. | Copy to clipboard is **free**, so this one feeds installs. | New guide |
| 3 | how to see image file size in google docs / which images make my google doc so big / check image resolution in google docs | `SetImageSize` add-on (dimensions only, inline images only), and generic "check image size" pages that never mention Docs. | The free list shows pixel size and file size for every image. Links to the compress guide. | New guide |
| 4 | find images without alt text in google doc / export alt text from google doc to csv / bulk edit alt text google docs | A few accessibility add-on listings (Good Dog, Grackle, a University of Michigan one). **Nothing on exporting alt text to CSV.** | Alt text filter, editing and CSV or JSON export. Pro, so it can earn. | New guide |
| 5 | google docs floating image not downloading / convert floating image to inline google docs / images missing when extracting from google doc | Guides mention "inline only" in one line. Nobody explains it. | Honest limits page: why floating images are skipped, and the fix (set to In line, then extract). Also answers the "it found no images" objection. | New guide |
| 6 | google docs markdown export base64 images / google docs markdown data:image fix / google docs to markdown for obsidian or hugo images | GitHub gists and docs.rs source files. No human-written guide. | content.md plus an images folder, no base64. Pro. | New narrow guide |
| 7 | google docs images blurry after download / do google docs compress images / google docs image quality lost | Junk: a LibreOffice bug report, spam pages, unrelated Gemini posts. | Pluckr extracts the image data Docs stores. **Needs a real test first** (see below). | New guide, after the test |
| 8 | download images from all tabs in google doc / google docs document tabs images | Nothing tab-aware except a developer tool. Volume is probably tiny. | Pluckr covers every document tab. | Not a page: add a section and an FAQ to the download-all guide |

Suggested order: **2, 3, 1, 4, 5**, then 6 and 7.
- 2 and 3 land on free features and have the weakest results.
- 1 has the most original angle.
- 4 can earn, because alt text export is a Pro feature.
- 5 cuts bad reviews, because it answers the unsupported-images objection.

## Verify before writing

Do not publish a claim we have not tested. A real test on the sample doc is enough for each.

1. **Order (#1):** export a doc with 8 or more images as "Web Page (.html, zipped)" and check whether `image1.png`... follows document order. If it does, drop #1. The forum post may be old.
2. **Paste (#2):** use Pluckr's Copy button, then paste into Figma, Canva and Confluence. Write up only the apps where it works, and say so plainly for the ones where it does not.
3. **Floating images (#5):** set a floating image to In line, run Pluckr, and confirm it appears in the list.
4. **Quality (#7):** insert a very large image, extract it with Pluckr, and compare its size and pixels with the original. If Docs recompresses it, say that plainly. Do not claim "original quality" unless the test shows it.
5. **Alt text (#4):** confirm the CSV export columns, so the guide shows the real file.

## Checked and rejected

- **"google docs unsupported image type webp" / insert AVIF into Docs.** Wrong direction. These people want to insert WebP into a Doc, and Pluckr cannot help: Apps Script only inserts JPEG and PNG.
- **"transparent PNG in google docs".** The results are junk, but the term is far from our product and the volume is probably near zero.
- **"alt text lost pasting google docs to wordpress".** Kinsta, WPBeginner and Wordable already hold it. Add one FAQ to the existing WordPress guide instead.
- **Slides image order.** Labnol's script already answers it. Add a line to the Slides guide.

## Notes for when these get written

- **Style:** same as the other guides: a short version, the methods, a comparison, FAQs and a "Keep reading" block. Every claim comes from the product or a test.
- **Links:** each new guide needs inbound links. The footer lists it automatically, but also add it to the "Keep reading" block of 2 or 3 related guides and one in-body link, as in the Nov 13 linking pass.
- **Titles:** put the problem in the title, in plain words, for example "Why Google Docs image names are out of order". Under 60 characters.
- **After publishing:** resubmit the sitemap and request indexing. Check GSC at 4 weeks. Keep the pages that show impressions, and rewrite titles on any stuck at positions 8 to 20.
