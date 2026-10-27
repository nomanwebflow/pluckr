# Pluckr: Marketplace listing for the resubmission (version 1, Google Docs™ only)

The first submission was rejected on Oct 26, 2026 for two reasons: Google trademarks in the descriptions need a ™ symbol and attribution, and the reviewers asked for testing credentials. This is the text for the resubmission of **script version 2** ("Marketplace 1.1": version 1 with the menu moved under Extensions, see `docs/script-versions.md`). It matches what version 1 does: no Slides, no alt text editing, no Markdown, no optimize. The later listing for version 2 is in `LISTING.md`.

Put the ™ symbol after every use of a Google product name, in the short and the detailed description. The application name `Pluckr` contains no Google trademark, so it stays as it is.

## Short description (max 200; this one is 145)

Preview, rename, copy and download every inline image in your Google Docs™ document. Convert to AVIF, WebP, JPEG or PNG and resize before export.

## Detailed description (max 16,000)

Pluckr pulls the images out of a Google Docs™ document without the "publish to web" and "download as HTML" detour.

Open Pluckr from Extensions > Pluckr and the sidebar lists every inline image in the document, including images in tables and in every document tab.

What you can do
- Preview each image with its real pixel size and file size.
- Rename images and download them one by one, or as a single ZIP of originals.
- Copy an image straight to your clipboard.
- Convert to AVIF, WebP, JPEG or PNG, set the quality, crop to a fixed aspect ratio (1:1, 4:3, 3:2, 16:9 and more) and cap the width. Images are never enlarged.
- Light and dark themes. Pluckr follows your system setting until you choose one.

Private by design
- Conversion happens in your browser. Your document images are never sent to Pluckr's servers or to anyone except Google.
- Pluckr asks only for access to the current document and to show its sidebar. It never edits your document.
- To check your licence, Pluckr reads your Google Account™ email address and sends an identity token to its licence service. Nothing from your document is included.

Pricing
Pluckr is a one-time purchase of $5 USD for one Google Account™, paid through Polar (polar.sh). There is no subscription. Open Pluckr in a Google Docs™ document and choose "Buy Pluckr" in the sidebar. Refunds within 14 days: support@docpluckr.com.

Not supported yet: floating images and images in headers, footers or footnotes.

Google Docs™ and Google Account™ are trademarks of Google LLC. Pluckr is not affiliated with or endorsed by Google.

## Screenshots

The four screenshots from the first submission are in `screenshots-v1/` (they show version 1). Keep those in the listing. Do not upload the five newer ones in `screenshots/` until version 2.

## Testing credentials (the second reason)

Pluckr has no login or API token of its own: it uses the Google account of whoever opens it. The review team's test account `gsmtestuser@marketplacetest.net` has a free licence (order `reviewer-grant-gsm-1`, active). Say so in the reply, and share the test Doc. The full reply and the demo video plan are in `docs/review-reply.md`.

## Steps in the Marketplace SDK

1. Store Listing: replace the short and the detailed description with the text above (App Details). Keep the name.
2. Check that no other field (category text, post-install tip, additional info) names a Google product without the ™.
3. App Configuration: the Docs add-on script version is **2** (done). Save, then **Submit for review** again.
4. Reply to the review email thread with the testing information (see `docs/review-reply.md`).
