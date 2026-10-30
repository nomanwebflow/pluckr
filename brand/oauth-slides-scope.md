# OAuth resubmission for Release 2 (Slides): adding presentations.currentonly

Project `pkuckr` (number 315157378382). Docs v1/v2 is live and verified. Release 2 is script version 3 (Slides, alt text, Markdown, optimize, bulk rename, selection). Console path: Google Auth Platform > Data Access > Add or remove scopes, then Verification Center.

## Read first: two ways to break the live add-on

1. **Do not touch Marketplace SDK > App Configuration until the new scope is verified.** Store listing edits (text, screenshots) went live immediately when you saved one. Scope and script-version changes may do the same. If version 3 reaches the live Docs add-on before `presentations.currentonly` is verified, every existing user gets the "Google hasn't verified this app" screen. Order: OAuth first, then the SDK.
2. **Do not paste the Release 2 listing text yet.** `LISTING.md` describes Slides, alt text and Markdown. Saved early, it would promise features the live add-on (version 2) does not have. Use it only together with the version 3 switch.

## Scopes at version 3 (the manifest, and the SDK list must match it)

| Scope | Status | Use |
|---|---|---|
| `documents.currentonly` | verified | read the open Doc; write only on Save / Optimize |
| `presentations.currentonly` | **new** | same, for the open deck |
| `script.container.ui` | verified | open the sidebar |
| `openid`, `userinfo.email` | verified | identify the licence holder |

Check before you submit: the manifest (`apps-script/appsscript.json`) has no `userinfo.profile`. If the SDK scope list or the consent screen has it, remove it there too, or add it to the manifest on purpose. Mismatched lists are a common rejection. Also confirm in the console whether the new scope shows as "Sensitive". Google's public scope pages do not list `presentations.currentonly`, so the console is the only authority. If it shows as sensitive, expect a review of several days and the demo video below. If it is non-sensitive, no verification is needed and you can go straight to the SDK.

## 1. Data Access

Add `https://www.googleapis.com/auth/presentations.currentonly`. Keep the others.

### How will the scope be used? (809 of 1000 characters)

Pluckr lists the pictures on the slides of the open presentation so the user can preview, rename, convert and download them. Only when the user presses Save or confirms Optimize does it change the file: it edits a picture's alt text, or replaces a picture with a smaller copy of itself. presentations.currentonly is the narrowest scope that lets Apps Script read slides and their pictures (SlidesApp.getActivePresentation) and it limits access to the single presentation in which the user opened the add-on. It cannot reach other files. Picture data is read by Google Apps Script and handled in the user's browser. Nothing from the presentation is sent to Pluckr's servers or to any third party. Use of Google user data follows the Google API Services User Data Policy, including the Limited Use requirements.

### Additional info (743 of 1000 characters; fill the two links)

Version 2 of Pluckr adds Google Slides support (new scope: presentations.currentonly). Pluckr is a one-time $5 purchase; the reviewer account gsmtestuser@marketplacetest.net is pre-licensed, no payment needed. To test: open the shared deck [DECK LINK] or Doc [DOC LINK], choose Extensions > Pluckr > Extract images, approve the consent screen, and the sidebar lists the images. Try Download originals, Output settings > WebP > Convert, and alt text > Save to deck. Optimize changes the file only after a confirmation; use a copy. openid and userinfo.email only identify the licence holder (identity token sent to the licence service; no file content). Home https://docpluckr.com, privacy /privacy, terms /terms. Contact: support@docpluckr.com.

## 2. Demo video (YouTube link, unlisted is fine, about 3 minutes)

Record from **script version 3**, not from the old test: Apps Script editor > Deploy > Test deployments, install version 3 on the test deck and the test Doc.

- Consent screen language English, showing the app name "Pluckr", the logo and **all five scopes**, including the new Slides one.
- The "Google hasn't verified this app" screen if it appears (the console says to show it).
- Slides: open the deck, Extensions > Pluckr > Extract images, grant access, the list, Download originals, convert to WebP, edit alt text and press Save to deck, then Optimize on a copy (show the confirmation).
- Docs: the same sidebar on a Doc, Markdown export.
- Say or caption what each scope does: `presentations.currentonly` only reads and, on Save or Optimize, edits the open presentation.
- Use neutral content only (the Unsplash sample Doc and a neutral deck). No client files, no personal Drive in view, avatar not shown.

## 3. Test files for the reviewer

- A test **Doc** with 3 or 4 inline images: "Blog draft: image SEO" (`1yntVX-3Y_S3z2WQSKecH7vav1n04_HtDD0Y5Fg3-UpY`).
- A test **deck** with pictures on several slides, one grouped, one with alt text: still to make (neutral photos only). The deck in `marketplace-screenshots.mjs` was not checked for client content; do not use it until you have.
- Share both with `gsmtestuser@marketplacetest.net` as Editor. The licence for that account stays active until the review ends (`reviewer-grant-gsm-1`; revoke afterwards).

## 4. After verification is approved (or if the scope is non-sensitive)

In this order:

1. Marketplace SDK > App Configuration: Docs add-on script version 3; add the Slides add-on (same script, version 3); the scope list.
2. Store Listing: paste `LISTING.md`, upload the new screenshots (neutral content only), Save.
3. Submit for review and use the reply text in `docs/review-reply.md` (update the scope list and links).
4. When approved: merge `release/v2` into `main`, deploy the site (`scripts/deploy-site.sh`), post the release note.

## Existing users

They see one new consent prompt the next time they open Pluckr after version 3 goes live. Say so in the release notes (`docs/release-notes-v2.md`).
