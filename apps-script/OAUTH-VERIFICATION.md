# OAuth verification preparation

Prepared for Google Cloud project `pluckr-add-on` (project number `1084365211840`). This file is a submission aid; it does not submit or publish the application.

## App identity and URLs

- App name: Pluckr
- App homepage: https://www.docpluckr.com/
- Privacy policy: https://www.docpluckr.com/privacy
- Terms of use: https://www.docpluckr.com/terms
- Authorized domain: `docpluckr.com`
- Support contact: `support@docpluckr.com`

Before submitting, publish the updated local homepage and policy pages to the verified `docpluckr.com` domain, then confirm that each URL loads without signing in and that the homepage links to the policy. The local export changes do not update the live site.

## Scope inventory and justification

The Apps Script manifest requests only these scopes:

| Scope | User-facing purpose | Why it is needed |
| --- | --- | --- |
| `https://www.googleapis.com/auth/documents.currentonly` | Read inline images in the Google Doc where the user opened Pluckr. | Read image bytes, image type and dimensions for previews, individual downloads, original-image ZIPs, and optional local conversion. Access is limited to the current document. |
| `https://www.googleapis.com/auth/script.container.ui` | Display the Pluckr sidebar in Google Docs. | Required to open the add-on interface. |

The source also has the `@OnlyCurrentDoc` annotation. Do not add broader Drive or Docs scopes unless a reviewed feature requires them.

## Google user data handling

- **Accessed:** embedded inline-image bytes, image MIME type, image dimensions, and the document name used for the original ZIP filename. The add-on walks document body elements to locate inline images; it does not extract ordinary text, comments, or revision history. It includes tables and nested document tabs. It does not currently extract floating images, headers, footers, or footnotes.
- **Use:** show image previews and metadata; copy or download an image when requested; create an original-image ZIP when requested; or convert/resize images in the sidebar when the user chooses conversion settings.
- **Recipients/transfers:** Google Docs and Google Apps Script (Google LLC) process the document image data to return it to the sidebar and prepare original-image archives. Conversion occurs in the browser. A user-initiated Copy writes the chosen image to the device clipboard; a download saves the chosen file to the device. The add-on does not send document image data to a separate Pluckr server or another third party.
- **Storage/retention:** the add-on does not write image bytes or conversion results to persistent app storage or application logs. They are held in the Apps Script operation and sidebar memory to complete the requested feature; the add-on does not keep an independent copy after the operation. Google’s independent infrastructure handling is governed by Google’s terms and policies. User-downloaded files remain on the user’s device until deleted.
- **Protection:** the app requests the current-document scope, requires Google authorization, uses Google Apps Script’s Google-managed service connection (HTTPS/TLS in transit), and avoids a separate Pluckr image server or persistent image store. Pluckr does not add a separate encryption layer to image data.
- **Prohibited use:** no advertising, sale, unrelated disclosure, human review, or AI/ML training of Google user data.
- **Revocation:** uninstall Pluckr from Google Docs and/or remove its authorization in Google Account permissions: https://myaccount.google.com/permissions

## OAuth consent-screen descriptions

Use descriptions consistent with the app and policy. Suggested scope descriptions:

- **Current document access:** “Pluckr reads inline images and their basic image details from the current Google Doc so you can preview, copy, download, or convert them. It does not edit the document.”
- **Sidebar display:** “Pluckr uses this permission to show its image extraction and conversion interface in Google Docs.”

Do not describe the add-on as reading all Drive files, fetching page images, using `documents.readonly`, or providing full-resolution access through the Docs API; those descriptions do not match this Apps Script implementation.

## Demo video recording plan

Record a short, unedited walkthrough using a test document containing an inline image in the body and an image in a table. Show:

1. The Google Doc and **Extensions → Pluckr → Extract images** menu action.
2. Pluckr’s in-product data-use notice before a document scan; open the Privacy Policy link and then select **Continue and scan this document**.
3. Google’s authorization prompt and the limited current-document access requested.
4. The returned image preview, dimensions, file size, rename, Copy, and individual/original ZIP download controls.
5. The output settings, optional conversion/resizing, and a converted download.
6. The privacy policy’s sharing and protection disclosures.

Use a document and Google account created for testing. Avoid exposing unrelated personal information or document contents in the recording.

## Pre-submission checklist

- [ ] Deploy the updated add-on source and manifest to the intended Apps Script project.
- [ ] Test the published add-on with a clean user account and confirm Google's consent screen appears before the first scan.
- [ ] Confirm the authorization screen lists only the two manifest scopes and that `@OnlyCurrentDoc` is reflected in the current-document access.
- [ ] Test extraction and original ZIP generation with normal, table-nested, and nested-tab inline images; confirm unsupported locations are not claimed.
- [ ] Test Copy and each output format in a supported browser; ensure the images remain local except for Google Apps Script processing.
- [ ] Publish the updated exported homepage, Privacy Policy, and Terms to `docpluckr.com`; confirm public access, working links, verified domain ownership, and page content match the deployed add-on.
- [ ] Set the exact homepage, privacy, terms, support, and authorized-domain values in the Cloud Console OAuth branding/consent configuration.
- [ ] Enter the scope justifications above, upload the demo video, and review all application-use-case and data-handling answers for consistency with the privacy policy.
- [ ] Submit from Cloud Console. After remediation, reply to Google’s review email as requested; do not treat the console submission alone as that reply.

## Current audit notes

- The local add-on is an Apps Script project and asks for current-document access; it is not the Chrome extension described in the older exported pages.
- The add-on previously scanned immediately on opening the sidebar. The menu item now says Google reads the Doc’s images; Pluckr is paid: before buying, the sidebar's unlock screen asks the user to tick "I agree to the Privacy Policy and Terms" (links included). Images are read only after a licence is confirmed.
- **Verify first-run consent ordering.** Google’s Apps Script documentation says Workspace add-ons can show the authorization prompt at the start of execution when scopes are missing, before the add-on code runs. The sidebar notice therefore cannot be assumed to precede the initial OAuth scope prompt. Test with a clean account and confirm whether the Docs menu item plus Google’s consent screen provide adequate notice; if not, confirm an approved pre-consent flow with Google before resubmitting. Do not claim the sidebar notice precedes the Google prompt unless that has been verified.
- The local exported privacy policy and homepage have been updated, but they still need to be published to the public domain before Google can review the updated copy.
- This repository does not contain the live Cloud Console OAuth configuration, domain verification state, add-on deployment state, or a demo recording. Those items must be confirmed in the owner’s Google accounts.
