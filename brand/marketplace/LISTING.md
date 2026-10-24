# Pluckr: Google Workspace Marketplace listing

Everything to paste into Marketplace SDK > Store Listing. Limits from Google's docs.

## App details

- Language: English (United States)
- Application name (max 50): `Pluckr`  (matches the OAuth consent screen)
- Category: Productivity
- Pricing model: Paid (one-time purchase)

### Short description (max 200; this one is 148)

Preview, rename, copy and download every inline image in your Google Doc. Convert to AVIF, WebP, JPEG or PNG and resize before export.

### Detailed description (max 16,000)

Pluckr pulls the images out of a Google Doc without the "publish to web" and "download as HTML" detour.

Open Pluckr from Extensions > Pluckr and the sidebar lists every inline image in the Doc, including images in tables and in every document tab.

What you can do
- Preview each image with its real pixel size and file size.
- Rename images and download them one by one, or as a single ZIP of originals.
- Copy an image straight to your clipboard.
- Convert to AVIF, WebP, JPEG or PNG, set the quality, crop to a fixed aspect ratio (1:1, 4:3, 3:2, 16:9 and more) and cap the width. Images are never enlarged.
- Light and dark themes. Pluckr follows your system setting until you choose one.

Private by design
- Conversion happens in your browser. Your document images are never sent to Pluckr's servers or to anyone except Google.
- Pluckr asks only for access to the current document and to show its sidebar. It never edits your Doc.
- To check your licence, Pluckr reads your Google account email address and sends an identity token to its licence service. Nothing from your document is included.

Pricing
Pluckr is a one-time purchase of $5 USD for one Google account, paid through Polar (polar.sh). There is no subscription. Open Pluckr in a Doc and choose "Buy Pluckr" in the sidebar. Refunds within 14 days: support@docpluckr.com.

Not supported yet: floating images and images in headers, footers or footnotes.

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
- Integration: Docs add-on, Apps Script deployment ID: `AKfycbxcfNun4c4REi2wgEVmS9Ky0eYZg5O_ewg1aXIuoUfKSjGCVQLwfvxhDGzYJii2zSCAiw` (versioned deployment @1, "Marketplace 1.0")
- OAuth scopes (must match the manifest): documents.currentonly, script.container.ui, openid, userinfo.email
- Developer info: name, website https://docpluckr.com, email support@docpluckr.com

## SCREENSHOTS to take (real, in a Doc with 3 or 4 good photos)

1. Sidebar open next to the Doc, image list visible (dark).
2. Output settings open: WebP, quality, 16:9 crop.
3. After converting: file sizes shown ("2.5 MB -> 109.9 KB") and the Download button.
4. Light theme.
Use a window of 1280x800, browser zoom 100%, and crop the browser chrome so the shot is Docs only.
