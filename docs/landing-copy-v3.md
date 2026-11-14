# Landing page copy, v3

Updated copy for docpluckr.com, section by section, in page order. It fixes the loopholes from the Nov 13, 2026 audit, answers the likely objections, and adds a creator section.

- Text in `[brackets]` is for you to fill in or confirm. I did not invent anything about you.
- Each section ends with a **Why** line that names the loophole or objection it fixes.

---

## Hero

**Headline:** Download every image from a Google Doc

**Subline:** Pull every image out of a Doc or a Slides deck in one ZIP. Free for 50 images. Pro adds bulk rename, WebP and AVIF, alt text and Markdown.

**Button:** Install free

**Under the button (small):** Works in Google Docs and Google Slides. No credit card.

> **Why:** the old subline sold Pro features (rename, convert, alt text) with no label, so free users hit the paywall by surprise. "Add to Google Docs" hid Slides support. "No credit card" removes the first objection before the click.

---

## Three steps (features)

**Heading:** Three steps. No screenshots.

**Intro:** Open Pluckr from the Extensions menu. It lists every image with a preview, its pixel size and its file size.

| Step | Copy |
|---|---|
| 1. Scan | Open Pluckr in your Doc or deck. It finds every image, in tables and in every tab. |
| 2. Choose | Tick the images you want. Download the originals for free, or pick a format, quality and width with Pro. |
| 3. Download | Get one ZIP, or save it straight to a folder in Google Drive (Pro). |

**Link:** How to download all images from a Google Doc, four ways

> **Why:** "Convert" as step 2 looked free. The new step 2 states which part is free and which is Pro. Step 3 now mentions Save to Drive, which the page left out.

---

## Size (WebP)

**Heading:** Same image, 796 KB down to 83 KB

**Copy:** Google Docs often stores images as large PNG files. As WebP, the same image is about a tenth of the size, so pages load faster and uploads fit.

**Labels:** PNG 796 KB · JPEG 104 KB · WebP 83 KB

**Footnote:** One of our sample photos, cropped to 16:9 (1000 × 562 px), quality 80, measured with cwebp and libjpeg. Your results depend on the image and the settings. Conversion is a Pro feature.

**Link:** Convert Google Docs images to WebP or AVIF

> **Why:** "Docs stores images as PNG" was not true for every image (Docs keeps JPEGs as JPEGs). The footnote now says that conversion is Pro.

---

## Markdown export

**Heading:** Export a Google Doc as Markdown, with its images

**Label above the heading (small, quiet):** Pro

**Copy:** Tick one box and the download holds content.md, an images folder and the alt text. Ready for a blog, a static site or Obsidian.

**Link:** Export Google Docs to Markdown with images

> **Why:** this is the largest feature block on the page and it is Pro-only. The label sets the right expectation.

---

## Will it change my Doc? (new, short band before the price)

**Heading:** Your Doc stays as it is

**Copy:** Pluckr reads your file and downloads copies. It changes the file only when you save alt text or run Optimize, and Optimize asks you to make a copy first. You can always go back with File > Version history.

> **Why:** "Will an add-on mess up my document?" is the most common worry before installing anything into Docs. Today the page does not answer it.

---

## Price

**Heading:** One price, paid once

**Copy:** No subscription. 14-day refund.

### Free
- **Title:** Free
- **Note:** 50 images per Google account, in total. An image counts once, the first time you copy or download it.

### Pro
- **Title:** $12
- **Note:** Paid once. No image limit, every feature.

### Table

| What's included | Free | $12 |
|---|---|---|
| List and preview every image | ✓ | ✓ |
| Download one image, or all as one ZIP | ✓ | ✓ |
| Copy an image to the clipboard | ✓ | ✓ |
| Rename one image | ✓ | ✓ |
| Images you can download | 50 | No limit |
| Bulk rename from a pattern | – | ✓ |
| Alt text editing, and export as CSV or JSON | – | ✓ |
| Convert to WebP, AVIF, JPEG or PNG | – | ✓ |
| Crop and resize | – | ✓ |
| Optimize the images in your file | – | ✓ |
| Markdown export with an images folder | – | ✓ |
| Save to Google Drive | – | ✓ |

**Button:** Install free

**Under the button:** Upgrade inside the sidebar when you need Pro. Secure checkout by Polar.

> **Why:**
> - The table was missing Save to Drive (Pro), copy and single rename (both free), so the free column looked emptier than it is.
> - "Everything unlocked forever" was a promise you cannot guarantee, so it now reads "Paid once".
> - The refund was hidden inside a closed FAQ answer.
> - "50 per account, lifetime" left people asking "per Doc?". The note now answers that.

---

## Made by (new, after the price, before the FAQ)

**Heading:** Made by one person, supported by the same person

**Copy:**
> I'm Noman Ahmed. [One line on what you do: for example, "I build websites in Webflow and move a lot of client content out of Google Docs."] I built Pluckr because [the real reason, for example, "saving 40 images from a draft one by one was eating my afternoons"].
>
> Every email to support@docpluckr.com reaches me. If Pluckr does not work on your file, tell me, and I will fix it or refund you.

**Links:** LinkedIn (https://www.linkedin.com/in/thewebflowguy/) · support@docpluckr.com

**Photo:** [a real photo of you, small, no frame or box behind it]

> **Why:** an unknown brand asking for $12 and access to Docs needs a real person behind it. The page had no creator, no contact and no email anywhere. A named founder with a direct support promise is the strongest trust signal you can add without reviews.

---

## FAQ

Keep the current six questions, with the answers below. Six new ones address objections. Suggested order:

**What is Pluckr?**
Pluckr is a Google Docs and Google Slides add-on that downloads every image in a file as one ZIP. Pro adds bulk rename, conversion to WebP or AVIF, alt text editing, Markdown export and Save to Drive.

**How do I download all images from a Google Doc?**
Open the Doc, choose Extensions > Pluckr > Extract images, then press Download originals. You get every image in one ZIP. Google Docs has no built-in button for this.

**What does the free plan include?** (new)
You can list and preview every image, copy it, rename it and download it, one at a time or as one ZIP. The limit is 50 images per Google account, in total, across all your Docs and decks. An image counts once, the first time you copy or download it. Previews never count.

**Why pay when File > Download > Web Page is free?** (new)
The web page download works for one Doc, once. It gives you files named image1.png, image2.png, in their original format, with no alt text. Pluckr names the files, converts them, keeps the alt text and works the same way in Slides. See the full comparison: Pluckr vs the Google Docs downloads.

**Does Pluckr work with Google Slides?**
Yes. Pluckr lists every picture on every slide, including pictures inside groups.

**Which images can Pluckr not see yet?** (new)
In Docs: floating images (set to wrap text or sit in front of or behind text), and images in headers, footers and footnotes. In Slides: images used as shape fills or backgrounds, or placed on layouts and masters. Google Sheets is not supported. Tip: set a floating image to In line and Pluckr finds it.

**Can I convert Google Docs images to WebP or AVIF?**
Yes, with Pro. Choose WebP, AVIF, JPEG or PNG. Set the quality, the aspect ratio and the maximum width. Pluckr does not make small images bigger.

**Are my images uploaded anywhere?**
No. Conversion runs in your browser, and Pluckr's servers never receive your images or your text. To check your licence, Pluckr sends a Google sign-in token. On the free plan, it also sends a one-way fingerprint (a hash) of each image you download, to count your 50. A hash cannot be turned back into the image.

**What can Pluckr access in my Google account?** (new)
Only the file you have open, and your email address to check your licence. Save to Drive uses Google's narrow drive.file permission, so Pluckr can reach only the files it creates. It cannot read the rest of your Drive.

**Will Pluckr change my document?** (new)
Only when you ask it to: when you save alt text, or when you run Optimize. Optimize asks you to make a copy first, and File > Version history can undo it.

**How much does Pluckr cost? Is there a subscription?**
Pluckr is free for 50 images per Google account. Pro is $12, paid once, with no subscription. If it does not work for you, email support@docpluckr.com within 14 days for a full refund.

**Does it work with a work or school account?** (new)
Yes, if your Google Workspace admin allows Marketplace add-ons. If the install is blocked, ask your admin to allow Pluckr. A licence covers one Google account.

> **Why:**
> - "Sends no image and no text" hid the free-plan hash, which the privacy policy discloses. The new answer matches the policy.
> - The new questions cover the objections that stop an install: what the free plan really gives, why pay, what is not supported, access to the account, changes to the Doc, and work accounts.
> - The unsupported-images answer heads off the "it found no images" 1-star review.

---

## Closing section

**Headline:** Download every image from a Google Doc

**Subline:** Free for 50 images. $12 once for everything else. 14-day refund.

**Button:** Install free

> **Why:** the last thing people read before the footer repeats the three facts that remove risk: free start, one-time price, refund.

---

## Footer

Add **Support** (mailto:support@docpluckr.com) to the footer links, next to Privacy and Terms.

> **Why:** the site had no contact link on any page.

---

## Not copy, but needed alongside it

1. **Hero animation:** the headline, subline and button fade in from `opacity: 0` (GSAP in `hero.tsx`). In the audit they stayed invisible for 3 to 6 seconds. Keep the slide-up, but drop the fade from 0, or force the animation to finish after about 1.5 seconds.
2. **Structured data:** add `author` and `founder` (Person, Noman Ahmed, LinkedIn URL) to the homepage `SoftwareApplication`, and update the FAQPage JSON-LD to the new questions.
3. **Marketplace listing:** add the same "Which images can Pluckr not see yet?" line, so the listing and the site agree.
