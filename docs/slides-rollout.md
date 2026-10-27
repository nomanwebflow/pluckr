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

## Release steps (the Docs add-on is approved and live)

1. Merge `release/v2` into `main` (Docs features and Slides ship together).
2. Cloud console: add `presentations.currentonly` to the OAuth consent screen, with a one-line justification ("reads the pictures of the open presentation to list, convert and download them"). Resubmit for verification.
3. Create script version 3 (version 2 is the Docs-only menu fix, see `docs/script-versions.md`). In the Marketplace SDK, add a **Slides add-on** configuration (same script ID, version 3) next to the Docs one, update the listing text and screenshots (a Slides screenshot or two), and submit.
4. Deploy the site with the updated privacy and terms (already edited on this branch) and add Slides to the homepage and listing copy.
5. Revoke the reviewer licence once no more review is expected: `npx convex run --prod licences:markRefunded '{"orderId":"reviewer-grant-gsm-1"}'`. Keep it while the Slides review runs.
6. Order matters: deploy the site (Slides copy, privacy, terms) only after the Slides add-on is live, since the live site must not promise what the listing does not offer.

## Known limits

- Pictures only. Images used as a shape fill, as a slide background, or on layouts and masters are not listed.
- No Markdown export in Slides.
- Sheets is not included: Apps Script cannot read floating images in Sheets, and in-cell images need an extra scope.
