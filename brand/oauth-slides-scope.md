# OAuth: adding presentations.currentonly (Slides support, version 2)

Do this only after the current Marketplace review is approved. Console path: Google Auth Platform > Data Access > Add or remove scopes, then Verification Center.

New scope: `https://www.googleapis.com/auth/presentations.currentonly`. It limits access to the one presentation where the add-on is opened. It is the narrower of the two scopes Apps Script accepts for these calls (the other is `presentations`).

## How will the scope be used? (under 1000 characters)

Pluckr lists the pictures on the slides of the open presentation so the user can preview, rename, convert and download them, and, only when the user confirms, edit a picture's alt text or replace a picture with a smaller copy of itself. presentations.currentonly is the narrowest scope that lets Apps Script read slides and their pictures (SlidesApp.getActivePresentation), and it limits access to the single presentation in which the user opened the add-on. It cannot reach other files. Picture data is read by Google Apps Script and handled in the user's browser. Nothing from the presentation is sent to Pluckr's servers or to any third party. Use of Google user data follows the Google API Services User Data Policy, including the Limited Use requirements.

## Also change

- Marketplace SDK > App Configuration: add the Slides add-on, same script, version 2. Add the scope to the scope list.
- Store listing: the new description, screenshots and short description are in `brand/marketplace/LISTING.md`.
- Privacy policy and terms: already updated on branch `release/v2` (Slides, alt text edits, optimize, Markdown).
- Reviewer account `pluckr.tester@gmail.com` keeps its licence. Give the reviewer a short test deck link and say that Slides is under Extensions > Pluckr.
- Demo video (if asked): Docs and Slides, showing the consent screen with the new scope, the sidebar, a download, and Optimize on a copy.

## Existing users

They see one new consent prompt the next time they open Pluckr after version 2 goes live. Say so in the release notes.
