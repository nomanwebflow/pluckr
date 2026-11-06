# Pluckr site copy

Written Nov 2, 2026. Copy for the rebuilt site in `docs/website-plan.md`. It covers the free tier added in v2.

Plan: Free = list, preview and download originals for up to 50 images in each Doc or deck. Pro = $12 once: bulk rename, alt text editing, convert, crop, resize, optimize and Markdown export.

## Keywords

No search volumes here. The numbers I could get came from a tool you told me not to use, so I dropped them. These choices come from `docs/seo-plan.md` and a live check of the results on Nov 2, 2026.

| Page | Main phrase | Support phrases |
|---|---|---|
| `/` | extract images from google docs | google docs image extractor, download all images from google docs, google docs add-on |
| `/extract-images-from-google-slides` | extract images from google slides | download images from google slides, google slides to zip |
| `/export-google-docs-to-markdown-with-images` | export google docs to markdown with images | google doc to markdown, google docs markdown images, obsidian |
| `/export-google-docs-alt-text` | export alt text from google docs | google docs image alt text, alt text audit |
| `/convert-google-docs-images-to-webp` | convert google docs images to webp | google docs images avif, compress images from google docs |
| `/pricing` | pluckr pricing | pluckr google docs add-on cost |

What the results show today:

- "Extract all images from Google Docs": one how-to (Labnol, Apps Script), one bookmarklet page, and the Extract and Download add-on. That add-on needs a subscription after a trial.
- "Download all images from Google Slides": blog posts that teach the .pptx-to-.zip rename trick, and a Marketplace add-on that exports slides as images.
- "Export Google Doc to Markdown with images": scripts, pandoc guides and converter sites. Few of them give you a clean images folder.
- "Google Docs add-on to convert images to WebP": no add-on that works inside a Doc. This gap is still open.

More phrases from the related-search list (screenshot, Nov 2, 2026):

| Phrase | Use |
|---|---|
| how to download google doc images | H2 and FAQ on `/guides/download-all-images-from-google-docs` |
| how to save google doc images | Same guide. Add it to the guide intro. |
| how to copy google doc images | New FAQ on `/faq` and a short section in the same guide |
| how to move google doc images | New FAQ: move images from a Doc to a CMS, a site or another Doc |
| google doc images blurry | New FAQ: download the original file, not a screenshot |
| google doc images not loading, not showing | Skip. This is a Google fault, not a Pluckr job. |

Use these exact words in H1s and titles: "extract images", "download all images", "WebP or AVIF", "alt text", "Markdown with images".

## Home (`/`)

**Title:** Extract and Convert Images from Google Docs | Pluckr
**Description:** Pull every image out of a Google Doc or Slides deck. Rename them, convert to WebP or AVIF, keep alt text. 50 images free. Pro is $12 once.

### Nav
Docs · Slides · Pricing · Guides · [Add to Google Docs]

### Hero
**H1:** Get every image out of a Google Doc.
**Sub:** Pluckr lists the images in your Doc or Slides deck. Pick them, rename them, convert them, and download them at one time.
**Button:** Add to Google Docs
**Trust line:** Free for 50 images in a file. Pro is $12 once. Your images stay in your browser.
**Works in:** Google Docs · Google Slides

### Before and after
**Headline:** Stop opening image7.png to find out what it is.

**Card A, the built-in way**
Go to File, Download, Web page. You get an HTML file that you did not want. The images folder holds image1.png to image7.png. There is no preview and no alt text.

**Card B, with Pluckr**
Each file has a name from one pattern, for example west-coast-road-trip-01.webp. The file is 83 KB. Pluckr also gives you images-metadata.csv and content.md.

**Note:** Sizes are from our three sample photos.
**Link:** How to download all images from a Google Doc, four ways

### Six jobs

| Title | Line |
|---|---|
| Pick | Tick the images you need. Filter to the images that have no alt text. |
| Rename | Use one pattern for every file name. Look at the preview before you apply it. |
| Convert | Choose WebP, AVIF, JPEG or PNG. Set the quality, the aspect ratio and the maximum width. |
| Alt text | See which images have none. Write it in the sidebar. Export it as CSV or JSON. |
| Optimize | Replace the heavy pictures in the file with smaller copies. The size on the page does not change. |
| Slides | Use the same sidebar in a deck. Pluckr reads every picture on every slide. |

### Convert
**Headline:** 796 KB becomes 83 KB.
**Body:** Docs images are often PNG files. WebP and AVIF keep the look at a small part of the size. Pages load faster and uploads fit.
**Bars:** PNG 796 KB · JPEG 104 KB · WebP 83 KB
**Footnote:** One of our sample photos, cropped to 16:9 (1000 x 562 px) at quality 80. We measured it with cwebp and libjpeg. Your results depend on the image and the settings.
**Link:** Convert Google Docs images to WebP or AVIF

### Markdown
**Headline:** Export a Doc as Markdown, images included.
**Body:** Tick one box. The download holds content.md, an images folder and the alt text. Use it for a blog, a static site or Obsidian.
**Tag:** Pro
**Link:** Export Google Docs to Markdown with images

### Private
**Headline:** Nothing leaves your browser.
**Body:** Conversion runs on your computer. Pluckr asks for the open file only. Pluckr changes your file only when you press Save or confirm Optimize. Before Optimize, Pluckr tells you to make a copy.
**Second paragraph:** Pluckr sends your Google sign-in token to a licence service to check your licence. It sends no images and no text.
**Link:** Privacy policy

### Pricing
**Headline:** Start free. Pay $12 once for Pro.
**Free:** List, preview and download up to 50 images in each Doc or deck.
**Pro:** Bulk rename, alt text editing, convert, crop, resize, optimize and Markdown export. One purchase covers Docs and Slides.
**Lines:** No subscription. You can get a refund in 14 days.
**Button:** Add to Google Docs

### FAQ (also in FAQPage schema)

**How do I download all images from a Google Doc?**
Open the Doc. Choose Extensions, then Pluckr. Click Download originals. You get one ZIP file with every image.

**Does Pluckr work with Google Slides?**
Yes. Pluckr lists every picture on every slide, and the pictures inside groups. It does not read images that are shape fills, backgrounds or part of a layout.

**Can I convert Google Docs images to WebP or AVIF?**
Yes, with Pro. Choose WebP, AVIF, JPEG or PNG. Set the quality, the aspect ratio and the maximum width. Pluckr does not make small images bigger.

**Are my images uploaded anywhere?**
No. Conversion runs in your browser. Pluckr sends a Google sign-in token to its licence service to check your licence. It sends no image and no text.

**How much does Pluckr cost? Is there a subscription?**
Pluckr is free for up to 50 images in each file. Pro costs $12 once. There is no subscription. You can get a refund in 14 days.

### Closing
**Headline:** Your next Doc can ship with named, small images.
**Body:** Add Pluckr to Google Docs and Slides. List the images, pick the ones you need, and download them in one ZIP file. Pluckr is free for 50 images in each file. Pro is $12 once.
**Button:** Add Pluckr to Google Docs
**Under the button:** No account. Your images stay in your browser.

### Footer
Product: Docs, Slides, Pricing. Guides: Download all images, Convert to WebP, Markdown, Alt text. Legal: Privacy, Terms.
Support: support@docpluckr.com
Trademark line: Google Docs and Google Slides are trademarks of Google LLC. Pluckr is not made by or linked to Google.

## Slides (`/extract-images-from-google-slides`)

**Title:** Extract Images from Google Slides
**Description:** List every picture on every slide, tick the ones you want, rename them and download them. One sidebar. Free for 50 images.
**H1:** Extract images from Google Slides.
**Lead:** Pluckr lists every picture in your deck. Tick the ones you want and download them as one ZIP file.

**Every slide, every group.** Pluckr reads each slide in order. It also reads the pictures inside groups. Each image shows its pixel size and its file size.

**Name them once.** Use a pattern such as {deck}-{n}. The preview shows every file name before you apply the pattern. (Pro)

**Convert and shrink.** Choose WebP, AVIF, JPEG or PNG. Optimize the images in the deck to make the file smaller. Pluckr asks you to confirm first and suggests a copy. (Pro)

**Add alt text.** Filter to the pictures that have no alt text. Write it in the sidebar and press Save. (Pro)

**What Pluckr does not read yet.** Images that are shape fills, backgrounds, or on layouts and masters.

**FAQ**
- *Do I need to publish the deck?* No. Pluckr reads the deck in the open file.
- *Does Pluckr change my slides?* Only when you press Save or confirm Optimize.
- *Is it free?* Yes, for up to 50 images in each deck. Pro costs $12 once.

## Markdown (`/export-google-docs-to-markdown-with-images`)

**Title:** Export Google Docs to Markdown with Images
**Description:** One download with content.md, an images folder and alt text. For blogs, static sites and Obsidian. Pro is $12 once.
**H1:** Export a Google Doc to Markdown, with the images.
**Lead:** Pluckr gives you content.md and an images folder in one ZIP file. Each link in the Markdown points to a real file.

**What you get.** content.md holds your text. The images folder holds one file for each picture. The alt text stays in the Markdown image tags.

**Name and convert first.** Choose the file name pattern and the format before you export. WebP files keep the folder small.

**Use it where you write.** Put the folder in your blog repository, your static site or your Obsidian vault. The links work with no change.

**What Pluckr does not read yet.** Floating images, and images in headers, footers and footnotes.

**FAQ**
- *Does the export need Pro?* Yes. Markdown export is a Pro feature.
- *Does the Doc change?* No. Pluckr only reads the Doc for this export.

## Alt text (`/export-google-docs-alt-text`)

**Title:** Export Alt Text from Google Docs
**Description:** See which Doc images have no alt text. Write it in a sidebar and export it as CSV or JSON. Pro is $12 once.
**H1:** Find and fix missing alt text in a Google Doc.
**Lead:** Pluckr shows every image and its alt text. Filter to the images that have none.

**See the gaps.** The list marks each image that has no alt text. Click an image to see it in the sidebar.

**Write it in place.** Type the description and press Save. Pluckr writes the alt text into the image in your Doc.

**Export it.** Download images-metadata.csv or images-metadata.json. Each row has the file name, the size and the alt text.

**FAQ**
- *Is the audit free?* You can see the list for free. Editing and saving alt text is Pro.
- *Does Pluckr write the alt text for me?* No. You write it. Pluckr does not use AI.

## Pricing (`/pricing`)

**Title:** Pluckr Pricing: Free, and $12 Once for Pro
**Description:** Free for 50 images in each file. Pro is one $12 purchase for Google Docs and Slides. No subscription. 14-day refunds.
**H1:** Start free. Pay $12 once for Pro.

**Free:** List and preview the images. Download the originals as one ZIP file. Up to 50 images in each Doc or deck.

**Pro, $12 once:** Bulk rename. Alt text editing. Convert to WebP, AVIF, JPEG or PNG. Crop and resize. Optimize the images in the file. Markdown export. No limit on images.

**Terms:** One purchase covers one Google account, Docs and Slides. There is no subscription. Email support@docpluckr.com in 14 days for a refund.

**Button:** Add to Google Docs

## FAQ page (`/faq`)

Use the five home questions, then add these.

**Which images does Pluckr read in Docs?**
Pluckr reads inline images in the body, in tables and in every tab. It does not read floating images yet. It does not read images in headers, footers or footnotes yet.

**What does Pluckr change in my file?**
Pluckr changes your file only when you press Save for alt text, or when you confirm Optimize. Make a copy first.

**What permissions does Pluckr ask for?**
Pluckr asks for access to the open file and its sidebar. It also reads your Google email address to check your licence. It does not read the rest of your Drive.

**What happens to a file with more than 50 images?**
The free version reads the first 50 images. Pro has no limit.

**How do I copy or save a Google Doc image?**
For one image, right-click it and choose Save to Keep or Copy. For all images, use Pluckr. Choose Download originals to get one ZIP file.

**How do I move images from a Google Doc to my website?**
Download the images with Pluckr. Rename them and convert them to WebP. Then upload the files to your site. With Pro, export a Markdown file and an images folder in one step.

**Why is my Google Doc image blurry?**
The Doc can show a small copy of the picture. Pluckr downloads the original file, so you get the full pixel size. Pluckr shows the size of each image before you download it.

**Does Pluckr work with Google Sheets?**
Not yet.

**How do I get a refund?**
Email support@docpluckr.com in 14 days. Give the email address of your Google account.

## Open points

1. The free limit is 50 images for each file. Make sure that "first 50 images" is how Code.gs picks them, then keep the FAQ answer as written.
2. Check the claim "Pluckr does not read the rest of your Drive" against the OAuth scopes in `addon/apps-script/appsscript.json` before you publish.
3. "Four ways" in the guide link: the SEO plan lists three manual methods plus Pluckr. Keep four only if the guide shows four.
4. The Marketplace listing status decides the button text. Until the listing is live, say what the button does.
