# Pluckr: Google Workspace Marketplace listing

Everything to paste into Marketplace SDK > Store Listing. Limits from Google's docs.

## App details

- Language: English (United States)
- Application name (max 50): `Pluckr`  (matches the OAuth consent screen)
- Category: Productivity
- Pricing model: Paid (one-time purchase)

### Short description (max 200; this one is 166)

Preview, rename, convert and download every image in your Google Docs™ or Google Slides™ file. Edit alt text, export Markdown with images, and shrink images in place.

### Detailed description (max 16,000)

Pluckr pulls the images out of a Google Docs™ document or a Google Slides™ presentation without the "publish to web" and "download as HTML" detour.

Open Pluckr from Extensions > Pluckr and the sidebar lists every image: in Google Docs™, every inline image, including images in tables and in every document tab; in Google Slides™, every picture on every slide, including grouped ones.

What you can do
- Preview each image with its real pixel size and file size.
- Tick the images you want. Downloads, conversion, renaming and optimizing apply to the ticked ones.
- Rename images one by one, or all at once with a pattern such as {doc}-{n}, with a live preview.
- Download images one by one, or as a single ZIP of originals.
- Copy an image straight to your clipboard.
- Convert to AVIF, WebP, JPEG or PNG, set the quality, crop to a fixed aspect ratio (1:1, 4:3, 3:2, 16:9 and more) and cap the width. Images are never enlarged.
- See which images have no alt text, write alt text in the sidebar, and copy it. Save it back to the file when you choose, or export it with the images as CSV and JSON.
- In Google Docs™: export the document as Markdown with its images in an images folder, ready for a blog, a static site or Obsidian.
- Optimize file images: shrink the images inside the document or presentation so it opens and scrolls faster. Pictures keep their size on the page, their alt text and their links.
- Light and dark themes. Pluckr follows your system setting until you choose one.

Private by design
- Conversion happens in your browser. Your images and text are never sent to Pluckr's servers or to anyone except Google.
- Pluckr asks only for access to the current file and to show its sidebar.
- Pluckr changes your file only when you press Save, or confirm Optimize, and it tells you to make a copy first.
- To check your licence, Pluckr reads your Google Account™ email address and sends an identity token to its licence service. Nothing from your file is included.

Pricing
Pluckr is a one-time purchase of $5 USD for one Google Account™, for Google Docs™ and Google Slides™, paid through Polar (polar.sh). There is no subscription. Open Pluckr and choose "Buy Pluckr" in the sidebar. Refunds within 14 days: support@docpluckr.com.

Not supported yet: floating images and images in headers, footers or footnotes in Google Docs™; images used as shape fills, backgrounds, or on layouts and masters in Google Slides™; Google Sheets™.

Google Docs™, Google Slides™, Google Sheets™ and Google Account™ are trademarks of Google LLC. Pluckr is not affiliated with or endorsed by Google.

## Graphic assets (in this folder)

- Icons: icon-32.png, icon-48.png, icon-96.png, icon-128.png
- Card banner: banner-220x140.png
- Screenshots: take 3 to 5 real ones in a Doc, 1280x800, full bleed, square corners, no padding. See SCREENSHOTS below.

## Support links

- Terms of service URL: https://docpluckr.com/terms
- Privacy policy URL: https://docpluckr.com/privacy
- Support URL: https://docpluckr.com/#faqs   (support@docpluckr.com for email)

## App configuration (Marketplace SDK > App Configuration)

- Visibility: Public (cannot be changed after publishing)
- Installation: Individual and admin install
- Integration: Docs add-on and (the release after the menu fix, script version 3) Slides add-on, both on the same script. Apps Script deployment ID: `AKfycbxcfNun4c4REi2wgEVmS9Ky0eYZg5O_ewg1aXIuoUfKSjGCVQLwfvxhDGzYJii2zSCAiw` (versioned deployment @1, "Marketplace 1.0"). The Slides release needs a new numbered script version (3).
- OAuth scopes (must match the manifest): documents.currentonly, presentations.currentonly (new in version 2), script.container.ui, openid, userinfo.email
- Developer info: name, website https://docpluckr.com, email support@docpluckr.com

## SCREENSHOTS (version 2)

Neutral content only: the sample Doc "Blog draft: image SEO" (built by `scripts/build-sample-doc.py` from the Unsplash photos and infographics in `brand/marketplace/assets/`). The Slides shot needs a neutral deck (not made yet). The old folders `screenshots-v1`, `screenshots` and `shots` hold client content; do not upload them.

Take them from script version 3 on a test deployment (Apps Script editor > Deploy > Test deployments), because the published add-on is still version 2:

1. `node scripts/marketplace-screenshots.mjs docs <doc-url>` writes raw 2560x1600 shots to `brand/marketplace/shots/`: the list with alt text, bulk rename, output settings (WebP, 16:9, alt text and Markdown ticked), converted, light.
2. `node scripts/marketplace-screenshots.mjs slides <deck-url>` for the Slides shot.
3. `PLUCKR_SHOTS_OUT=brand/marketplace/screenshots-r2 python3 scripts/marketplace-shots.py <files in order>`, then `PLUCKR_SHOTS_OUT=brand/marketplace/screenshots-r2 python3 scripts/blur-avatar.py` (blur the Google account photo).

The shot order: 1 Docs list with selection and alt text (dark); 2 Slides sidebar next to a deck; 3 Bulk rename with the live preview; 4 Output settings with WebP and 16:9; 5 light theme. Browser zoom 100%.

The four shots for the live version 2 are in `brand/marketplace/screenshots-live/`.

The Release 2 set (taken from the version 3 test on Oct 30, 2026, neutral content, avatars blurred) is in `brand/marketplace/screenshots-r2/`: 1 Docs list with selection and alt text, 2 Slides, 3 bulk rename, 4 output settings, 5 light theme. The 2560x1600 originals are in `hires/`. To retake a Docs shot, run the test (Deploy > Test deployments > Execute), then pass the opened Doc's full address (it carries `addon_dry_run`) as the last argument: `node scripts/marketplace-screenshots.mjs docs "<address>"`. The capture runs hidden.
