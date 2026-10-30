# Marketplace review: reply, test access and demo video

The review team (GWM Reviews) has started the review of app Pluckr (project 315157378382). Their email asks for three things:

1. Test credentials, if the app needs them, and allowlisting of their test account `gsmtestuser@marketplacetest.net`.
2. A screen recording of the complete end-to-end workflow that shows how the requested scopes are used.
3. Sensitive and restricted scopes already submitted and approved in Google Cloud (done: verification approved Oct 23, 2026).

Reply to the same email thread. Write to gwm-review@google.com only if a question comes up.

## Before replying (about 20 minutes)

1. **Give the reviewer account a licence** (Pluckr is paid, so without this they hit the unlock screen). Run from the project folder, with your Convex login:

   ```bash
   npx convex run --prod licences:recordOrder '{"sub":"unmatched:reviewer-gsm-1","email":"gsmtestuser@marketplacetest.net","orderId":"reviewer-grant-gsm-1","status":"active","paidAt":1793000000000}'
   ```

   The licence service matches on the Google-verified email, so the placeholder `sub` is fine. Check it with a sign-in from that account. Revoke after the review:

   ```bash
   npx convex run --prod licences:markRefunded '{"orderId":"reviewer-grant-gsm-1"}'
   ```

   A refund is final for that order. Grant a new order id if you need to restore it.
2. **Share a test Doc with `gsmtestuser@marketplacetest.net`** (Editor). Use a copy with 3 or 4 inline images, one inside a table. The Doc used for the screenshots is
   `https://docs.google.com/document/d/1hVJjoBh2O_wLD5wSjhVIaJNdC7ERmdxTRBsYBbdks68/edit`. Make a clean copy if you prefer.
3. **Do not change the listing, the scopes or script version 1 while the review runs.** The review looks at version 1 (Docs only). The version 2 work (Slides, alt text, Markdown, optimize, bulk rename) waits for approval.
4. **Record the video from version 1, not from the latest code.** The latest code asks for an extra Slides permission and has features the listing does not mention. In the Apps Script editor: Deploy > Test deployments, and for your saved Docs test pick the version "Marketplace 1.0" (version 1) instead of "Latest Code", then run the test. The consent screen then lists exactly the scopes under review.

## Reply email (paste, then edit the bracketed parts)

Subject: Re: Review of Pluckr (315157378382)

> Hi,
>
> Thanks for starting the review of Pluckr.
>
> **Test access.** Pluckr has no separate sign-in or API token: it uses the user's Google account. It is a paid add-on (one-time $5), so I have given your test account **gsmtestuser@marketplacetest.net** a free licence. Please use that account and no payment is needed. I have also shared a test Doc with it: [LINK TO THE SHARED DOC].
>
> **How to test**
> 1. Open the shared Doc (it has several inline images, one inside a table).
> 2. Choose Extensions > Pluckr > Extract images.
> 3. Approve the consent screen. The sidebar opens and lists the images with previews, names, sizes.
> 4. Try: Copy on one image, rename it with the pencil, Download, then "Download originals" for a ZIP.
> 5. Open "Output settings", pick WebP, choose a 16:9 aspect ratio, press Convert, then download the converted set.
> 6. The menu (three dots) has Light/Dark mode, Log out, the privacy policy and the terms.
>
> **Scopes and how they are used**
> - `documents.currentonly`: reads the inline images of the one open Doc, so they can be listed, converted and downloaded. Pluckr does not edit the Doc.
> - `script.container.ui`: opens the Pluckr sidebar (Ui.showSidebar). It is the add-on's own bundled interface and loads no remote content.
> - `openid` and `userinfo.email`: identify the licence holder. The add-on sends an identity token to its licence service to check whether that account has a paid licence. Nothing from the Doc is sent.
>
> Image conversion runs in the user's browser. Document images are not sent to any Pluckr server. OAuth verification for these scopes is approved (Oct 23, 2026).
>
> **Demo video:** [YOUTUBE OR DRIVE LINK], about 2 minutes, showing the full flow and each scope in use.
>
> Links: https://docpluckr.com (home), /privacy, /terms. Support: support@docpluckr.com.
>
> Thanks,
> Noman

## Demo video: shot list (about 2 minutes, screen recording with voice or captions)

Record at 1280x800 or larger, browser zoom 100%, signed in as a normal user with a licence. Hide your profile photo or blur it. Say the scope names aloud or add captions.

| Time | Show | Say |
|---|---|---|
| 0:00 | The test Doc with images (one in a table). | "This is a Google Doc with four inline images, one inside a table." |
| 0:10 | Extensions > Pluckr > Extract images. | "Pluckr opens from its own menu." |
| 0:20 | The consent screen, with all scopes visible and the app name and logo. | "It asks for four permissions. documents.currentonly lets it read the images of this one document. script.container.ui lets it show this sidebar. openid and userinfo.email identify the licence holder." |
| 0:40 | The sidebar loads: the licence check passes, the images appear. | "It checks my licence with my Google identity token. No Doc content is sent." |
| 0:55 | Preview, name, size on each card. Copy one, rename one. | "Each image lists with its real size. I can copy it or rename it." |
| 1:10 | Download one image, then Download originals (ZIP). | "Downloads happen in the browser. The ZIP of originals is made by Apps Script from this document only." |
| 1:25 | Output settings: WebP, quality, 16:9, Convert, show the new sizes, download. | "Conversion runs in my browser. Nothing is uploaded." |
| 1:50 | Menu: Light mode, privacy policy, terms, Log out. | "Privacy and terms are one click away. Log out clears the stored licence." |
| 2:00 | The Doc is unchanged. | "Pluckr never edited the document." |

Upload as unlisted on YouTube, or share a Drive link with view access for anyone with the link.

## After the review

- If approved: revoke the reviewer licence (command above), then start the version 2 release in `docs/slides-rollout.md`.
- If they ask for changes: read the exact message first; do not touch scopes without telling the reviewer.
- Keep `pluckr.tester@gmail.com` licensed until the review ends too (it is the earlier reviewer account).

## Rejection on Oct 26, 2026: what was asked and the reply

The submission was rejected for two reasons:

1. **Trademark attribution.** Google product names in the descriptions need a ™ symbol, with a footnote such as "Google Docs™ is a trademark of Google LLC". Fixed in the new listing text: `brand/marketplace/LISTING-v1.md` (for the version 1 resubmission) and `LISTING.md` (for version 2). Also the "Pluckr" name has no Google trademark, so it stays.
2. **Testing credentials.** Pluckr has no login of its own, so there is nothing to share except the licence for their account (done: `gsmtestuser@marketplacetest.net`, order `reviewer-grant-gsm-1`, active) and a test Doc.

### What to do, in order

1. Marketplace SDK > Store Listing: paste the short and detailed description from `LISTING-v1.md`. Keep the name and the four version 1 screenshots.
2. Share a test Doc with `gsmtestuser@marketplacetest.net` (Editor), with 3 or 4 images and one inside a table.
3. Submit the listing for review again.
4. Reply on the rejection email with the text below.

### Reply (paste, fill in the Doc link)

Subject: Re: Pluckr (315157378382): attribution and testing credentials

> Hi,
>
> Thanks for the review. I have fixed both points and resubmitted.
>
> **Trademark attribution.** The short and detailed descriptions now put the ™ symbol after every Google product name (Google Docs™, Google Account™) and end with "Google Docs™ and Google Account™ are trademarks of Google LLC."
>
> **Testing credentials.** Pluckr has no separate login, password or API token: it works with the Google account of the person who opens it. Your test account **gsmtestuser@marketplacetest.net** already has a free licence, so no payment or code is needed. I have shared a test Doc with that account: [LINK TO THE SHARED DOC].
>
> To test: open the Doc, choose Extensions > Pluckr > Extract images, approve the consent screen, and the sidebar lists the images. You can then copy, rename and download images, press "Download originals" for a ZIP, and in "Output settings" convert to WebP and download the result.
>
> If your reviewers use a different test account, tell me its address and I will give it a free licence the same day.
>
> Thanks,
> Noman
