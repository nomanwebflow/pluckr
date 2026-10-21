# Pluckr OAuth verification: text to paste

Console path: Google Auth Platform > Data Access (verification mode) for the justification and video,
then Verification Center > Prepare for verification > Confirm.

## How will the scopes be used? (985 / 1000 characters)

Pluckr is a Google Docs add-on that lists the inline images in the open document so the user can preview, rename, convert and download them. script.container.ui is used only to open the Pluckr sidebar inside the open Doc (Ui.showSidebar with HtmlService, from the menu Extensions > Pluckr > Extract images). The sidebar is the add-on's own interface, bundled with the add-on: image previews and download/convert controls. It loads no remote or third-party web content. No narrower scope can show a sidebar: Apps Script requires script.container.ui for Ui.showSidebar, and without it the add-on has no interface at all. Together with the non-sensitive documents.currentonly scope, the add-on only reads images in the current document. It never edits the document, cannot reach other files, sends no document data to any external server, stores nothing, and has no backend. Use of Google user data follows the Google API Services User Data Policy, including the Limited Use requirements.

## Additional info (limit 1000 characters)

Edit the bracketed parts, then paste.

No test credentials are needed: Pluckr has no sign-in, accounts or backend. To test: open the shared Google Doc [LINK], which contains inline images and has the add-on attached, then choose Extensions > Pluckr > Extract images, approve the consent screen, and the sidebar lists the images. Home page https://docpluckr.com, privacy policy https://docpluckr.com/privacy, terms https://docpluckr.com/terms. Only the two scopes in the manifest are requested (documents.currentonly, script.container.ui). There are no other OAuth clients or projects. Contact: support@docpluckr.com.

## Demo video checklist (YouTube link is required to save)

- Consent screen language set to English, showing the app name "Pluckr", the logo, and BOTH scopes.
- The "Google hasn't verified this app" screen for your test account (the console says this is expected and must be shown).
- The full flow: open a Doc with images, Extensions > Pluckr > Extract images, grant access, the sidebar opening, images listed, a download.
- Say aloud (or caption) that script.container.ui is used only to open this sidebar.
- No other OAuth clients are assigned to this project, so there is nothing else to show.

## Paid version (planned): scopes and text that change

Console scopes now listed (Data Access): documents.currentonly, userinfo.email, openid (all non-sensitive) and script.container.ui (sensitive).
(Done: `openid` and `userinfo.email` are in the manifest and the paid flow is live.)

"Additional info" for the paid flow (keep within 1000 characters in total; the test-user steps above must be rewritten, since a tester needs a licence: offer a 100% discount code, or say the reviewer account is pre-licensed):

Pluckr is a one-time $5 purchase (reviewer account pluckr.tester@gmail.com is pre-licensed, no payment needed). openid and userinfo.email are used only to identify the licence holder: the add-on obtains an identity token (ScriptApp.getIdentityToken) and sends it to Pluckr's licence service (Convex) over HTTPS, which checks whether that email has a paid licence. Payment is handled by Polar; Pluckr never sees card details. Document images and content are never sent anywhere. The email is used only for licence checks and purchase support, is never sold or used for advertising, and can be deleted on request at support@docpluckr.com.

## Must be updated BEFORE the paid version ships (and before you submit verification)

- Privacy policy: new section on the email address and licence record, Convex (storage) and Polar (payments) as processors, retention and deletion, and remove "no backend / no account server" wording.
- Terms: the one-time $5 price, what it covers, refunds, and that Polar is the seller of record if that applies.
- Homepage FAQ ("Do I need an account", "Are my images uploaded") and the add-on's own "Before you scan" notice.
- Marketplace listing (if used): disclose that the add-on is paid.
