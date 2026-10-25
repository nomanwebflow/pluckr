# Pluckr SEO plan

Goal: rank docpluckr.com (and the Marketplace listing) for what people search when they need the images out of a Google Doc.

Written Oct 25, 2026. Search volumes are NOT verified: I had no keyword tool, only live SERP checks. Treat the priorities as
intent plus how weak the current results look, and confirm numbers in Search Console once it is connected.

## 1. Where we stand

### What the search results look like today

| Query I checked | Who ranks | Read |
|---|---|---|
| extract all images from google docs | [Labnol guide](https://labnol.org/extract-images-google-docs-slides-230913) (Apps Script), a bookmarklet, the [Extract and Download add-on](https://workspace.google.com/marketplace/app/extract_and_download/1076450275207) (paid after a trial) | Few dedicated tools. Mostly one how-to and one competitor. |
| how to save all images from a google doc at once | howtogeek, ryrob, nira, online-tech-tips, guidingtech, thebricks | All teach "File > Download > Web page (.html, zipped)". Big informational audience, strong how-to sites. |
| google docs add-on convert images to webp | [Bulk Images to WebP Converter](https://workspace.google.com/marketplace/app/bulk_images_to_webp_converter/731430378753) (last updated 2022, other direction), Extract and Download (no conversion) | **Nobody offers extract + convert (AVIF/WebP/JPEG/PNG) + crop inside Docs.** This is the gap. |

Positioning that fits: "Extract and convert images from Google Docs. One-time $5, no subscription, images never leave your browser."
The competitor charges a subscription after a trial, so price and privacy are real differentiators.

### Site audit (homepage, Oct 25, 2026)

| Item | State | Action |
|---|---|---|
| Title / meta description | OK ("Pluckr: Extract and Convert Images in Google Docs") | Sharpen, see section 4 |
| One H1, sensible H2s | OK | Keep |
| Image alts | OK, none missing | Keep |
| Canonical tag | Missing | Add |
| Open Graph image | Missing (`og:image`) | Add a 1200x630 image |
| Structured data (JSON-LD) | Missing | Add SoftwareApplication, FAQPage |
| sitemap.xml | 404 | Create and submit |
| robots.txt | Cloudflare-managed, no Sitemap line | Add sitemap line |
| Search Console | `docpluckr.com` is not in the connected account | Verify the domain (DNS TXT in Cloudflare), submit sitemap |
| Pages | One landing page + privacy + terms. No content for the search queries above | Build the pages in section 3 |
| Marketplace listing | Submitted, in review | Optimise (section 5); it will become an indexable page on workspace.google.com |

## 2. Keyword map

Intent clusters, in priority order. "Page" is where each should land.

### A. Tool intent (people who want software). Highest value.
- google docs image extractor / extract images from google docs
- download all images from google docs / google docs add-on download images
- google docs extract images add-on
- Page: homepage (primary) + `/extract-images-from-google-docs`

### B. Conversion intent. **Best gap, least competition.**
- convert google docs images to webp / avif
- compress images in google docs / reduce image size in google doc
- resize images from google docs / crop google doc images to 16:9
- Page: `/convert-google-docs-images-to-webp`, `/compress-images-from-google-docs`

### C. How-to intent (large audience, strong competitors, lower buyer intent).
- how to download images from google docs / how to save all images from a google doc
- extract images from google doc without publishing / download google doc images as zip
- Page: `/guides/download-all-images-from-google-docs` (honest guide: manual method first, then Pluckr as the fast way)

### D. Workflow intent (people who move content between tools). Good buyers.
- google docs to wordpress images / export google doc images for blog / google docs to cms images
- get images from a google doc for a client / design handoff
- Pages: `/guides/google-docs-to-wordpress-images`, `/guides/get-images-from-a-google-doc-for-design`

### E. Comparison / alternative intent
- extract and download alternative / google docs image extractor free vs paid
- Page: `/pluckr-vs-extract-and-download` (fair, factual: price model, conversion, privacy)

### F. Brand
- pluckr, pluckr google docs, docpluckr
- Page: homepage; also the Marketplace listing and the YouTube demo

## 3. Pages to build (static HTML like the rest of the site)

Each page: one H1 with the target phrase, a 400 to 900 word answer with a real screenshot or short clip of the sidebar, a "How Pluckr does it" section, 3 to 5 FAQs (marked up as FAQPage), links to 2 sibling pages and the homepage, and a clear button.

| Priority | URL | Title tag (under 60 chars) | Core content |
|---|---|---|---|
| P1 | `/extract-images-from-google-docs` | Extract Images from Google Docs (All at Once) | Steps, ZIP of originals, tables and tabs covered, what is not covered yet |
| P1 | `/convert-google-docs-images-to-webp` | Convert Google Docs Images to WebP or AVIF | Why WebP/AVIF, quality and width settings, before/after sizes (real numbers from the demo: 2.5 MB to about 98 KB) |
| P1 | `/guides/download-all-images-from-google-docs` | How to Download All Images from a Google Doc | The 3 manual methods (web page zip, Apps Script, Word) with their drawbacks, then Pluckr |
| P2 | `/compress-images-from-google-docs` | Compress Images from Google Docs | Quality slider, max width, never-enlarge rule |
| P2 | `/guides/google-docs-to-wordpress-images` | Google Docs to WordPress: Get the Images Out | Content-team workflow, rename and convert before upload |
| P2 | `/pluckr-vs-extract-and-download` | Pluckr vs Extract and Download | Table: price (one-time vs subscription), formats, conversion, privacy |
| P3 | `/guides/crop-google-docs-images-to-16-9` | Crop Google Docs Images to 16:9 | Aspect ratio feature |
| P3 | `/faq` (or keep on homepage) | Pluckr FAQ | Privacy, supported images, licence |

Content rules: write for the question, not for the keyword; use the real product behaviour (inline images only, no floating images yet);
no invented stats; no em dashes.

## 4. Technical SEO (do first, about half a day)

**Status (Oct 25, 2026): done and live** for items 1 to 3 (title, description, canonical, OG/Twitter image, JSON-LD, sitemap, robots sitemap line).
Still open: the `www` to apex 301 (needs a Cloudflare Redirect Rule, `_redirects` cannot match hostnames; the canonical tag covers duplicates meanwhile), Search Console verification, speed work, and the new pages.

1. **Homepage tags** (index.html `<head>`):
   - Title: `Extract and Convert Images from Google Docs | Pluckr` (keeps the brand, puts the verbs first).
   - Description (under 155): `Pull every image out of a Google Doc, convert to WebP, AVIF, JPEG or PNG, and crop or resize. One-time $5. Images never leave your browser.`
   - `<link rel="canonical" href="https://docpluckr.com/">`
   - `og:image` (1200x630, the sidebar over the headline), `og:url`, `og:type=website`, `twitter:image`.
2. **Structured data** (JSON-LD on the homepage):
   - `SoftwareApplication` (name Pluckr, applicationCategory `BrowserApplication`, operatingSystem Web, offers price 5 USD, url).
   - `FAQPage` mirroring the on-page FAQ (only the questions that are really on the page).
   - Add `aggregateRating` only after there are real reviews.
3. **sitemap.xml** listing every public page; add `Sitemap: https://docpluckr.com/sitemap.xml` to robots.txt. Regenerate in `deploy-site.sh`.
4. **Redirects** via Cloudflare Pages `_redirects`: `www` to apex (301), `/index.html` to `/`.
5. **Speed** (Core Web Vitals):
   - The hero loads the sidebar demo script; keep LCP as the headline text, not an image.
   - Preload the PP Neue Montreal font file, `font-display: swap` is already set.
   - Make the demo photos `loading="lazy"` except the first; they are ~230 KB each, consider AVIF/WebP versions (use Pluckr itself).
   - Drop unused Webflow JS/CSS from the deployed pages.
6. **Search Console + Bing Webmaster**: verify the domain with a DNS TXT record in Cloudflare, submit the sitemap, request indexing for the new pages.
7. 404 page already exists; make sure it returns a real 404 status.

## 5. Off-page and distribution

1. **Marketplace listing is an SEO page too.** After approval it ranks on workspace.google.com. Keep the name exactly "Pluckr", keep the first line of the short description keyword-led (already: "Preview, rename, copy and download every inline image in your Google Doc..."), add the Convex mention and screenshots, and collect real reviews (ask early users).
2. **YouTube**: the OAuth demo video is reusable. Title it "Extract and convert all images from a Google Doc (Pluckr)", add chapters, link the site, and embed it on the landing pages (video helps dwell time and gets its own SERP slot).
3. **Answer the existing questions** where the SERP already sends people: Stack Exchange (Web Applications), Reddit (r/googledocs, r/GoogleWorkspace, r/webdev for the WordPress workflow), Quora. Be useful first, disclose that you made Pluckr, link only where it fits.
4. **Outreach**: Labnol and similar how-to authors who recommend Apps Script, with a note that a one-time-fee add-on now exists. Also roundup posts about Docs add-ons.
5. **Directories**: Product Hunt, AlternativeTo (as an alternative to Extract and Download), SaaSHub, Slashdot-style software lists, Indie Hackers. Use identical brand name and URL everywhere.
6. **Social proof**: the Instagram story and a short clip of the demo loop for X/LinkedIn; link to the matching landing page, not only the homepage.

## 6. Measurement

- Search Console: queries, pages, CTR, position for the keyword map above. Create a saved filter per cluster (A to F).
- Marketplace: installs and listing views (Marketplace SDK > Analytics tab).
- Polar: orders, to see which landing pages convert (add `?ref=` params on page buttons later).
- Targets (realistic for a new domain): indexed pages within 2 to 4 weeks; first rankings for long-tail B and D queries in 6 to 10 weeks; page 1 for "convert google docs images to webp" within 3 to 5 months; branded query "pluckr" first within weeks of the Marketplace approval.

## 7. 90-day schedule

| Weeks | Work |
|---|---|
| 1 | Technical fixes (section 4), verify Search Console, submit sitemap, OG image. |
| 2 to 3 | Build the 3 P1 pages, add FAQ schema, embed the demo video. |
| 4 to 6 | P2 pages, comparison page, Marketplace listing polish after approval, first outreach and community answers. |
| 7 to 10 | P3 pages, internal-link pass, review GSC queries and rewrite titles for pages stuck at positions 8 to 20. |
| 11 to 13 | Double down on whichever cluster is converting; refresh pages with real numbers and reviews. |

## 8. Risks and notes

- **New domain, thin site.** Expect months, not weeks. The Marketplace listing and YouTube will likely rank before the site itself.
- **Informational queries (cluster C) are crowded** by howtogeek-class sites. Win by being the most complete and practical answer, not by volume of posts.
- **Google trademarks.** Describing the product as "for Google Docs" is fine; do not put Google logos in icons or names.
- **Do not overclaim.** No "best" or "#1", no fake reviews or ratings, no claim the add-on is on the Marketplace until it is live.
- **Tracking.** The site currently has no analytics. Search Console is enough to start; add a privacy-friendly analytics tool only if the privacy policy is updated to match.
