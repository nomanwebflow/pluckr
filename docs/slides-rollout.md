# Slides support: what changed and how to ship it

Branch: `release/v2`. The Docs add-on is live on the Marketplace (script version 2, Docs only). Nothing for Slides is live yet.

## What the code does

- `Code.gs` detects the editor (`host_()`: Docs or Slides) and the same functions serve both. `collectImages_()` returns one list of `{ image, name }` per editor.
- Slides: pictures from every slide, including grouped ones, named `slide-03-image-01`. Read with `Image.getBlob()`. Alt text uses `getTitle` / `getDescription`. Optimize uses `Image.replace(blob, false)`, which swaps the picture inside the same box, then restores alt text and link.
- The sidebar gets the editor from the server (`PLUCKR_BOOT.host`, then `getDocumentInfo().host`) and changes its wording: "deck" instead of "Doc", no Markdown option in Slides.
- New scope in `appsscript.json`: `presentations.currentonly`.
- One licence works in both: it is keyed on the Google account.

## Test before release

Unit tests (`npm run test:features`) use mocks. These need a real deck:

1. Open a deck with images on several slides, one inside a group, one with alt text and a link, one with a transparent PNG. Extract images. Check the count and the names.
2. Download originals, then convert to WebP. Check the ZIP.
3. Edit alt text, press Save to deck, then check Slide > Alt text in the editor.
4. Optimize on a copy. Check the picture stays in its box, keeps alt text and link, and that Version history can undo it. Check cropped or rotated pictures: `replace` may drop the crop.
5. Menu: both editors use `createAddonMenu()` (Extensions > Pluckr > Extract images). Check it in the deck.

## Release steps (the Docs add-on is approved and live; script version 4 is cut)

Full text and the order of operations are in `brand/oauth-slides-scope.md`. Short form:

1. **OAuth first.** Console > Data Access: add `presentations.currentonly` with the justification, check whether it shows as sensitive, record the demo video from a version 4 test deployment, submit for verification. Do not change App Configuration or the listing text until it is approved: those edits may go live at once, and the live Docs add-on must not start asking for an unverified scope.
2. Make a neutral test deck and share it and the test Doc with `gsmtestuser@marketplacetest.net`. Keep that account licensed until the review ends.
3. Take the Release 2 screenshots (neutral content only, from version 4 on a test deployment).
4. After approval: SDK App Configuration (Docs and Slides add-ons, version 4, scopes), Store Listing from `LISTING.md`, Submit for review.
5. After the Marketplace approval: merge `release/v2` into `main`, deploy the site (`scripts/deploy-site.sh`), post `docs/release-notes-v2.md`, revoke the reviewer licence with `npx convex run --prod licences:markRefunded '{"orderId":"reviewer-grant-gsm-1"}'`.
6. The live site must not promise Slides before step 4 ends.

## Known limits

- Pictures only. Images used as a shape fill, as a slide background, or on layouts and masters are not listed.
- No Markdown export in Slides.
- Sheets is not included: Apps Script cannot read floating images in Sheets, and in-cell images need an extra scope.
