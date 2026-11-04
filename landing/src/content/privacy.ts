// Privacy policy text, from marketing/webflow/privacy.html. HTML here is
// our own static copy (strong, a, code only), rendered by the privacy page.
export const privacy = {
  "updated": "October 25, 2026",
  "shortTitle": "The short version:",
  "shortBody": "Pluckr accesses inline images in the Google Doc where you open the add-on. Google Apps Script reads image data and prepares original-image ZIP downloads; image conversion runs in your browser. Pluckr is a one-time purchase, so it also reads your Google account email address to check whether you have a licence; that check and your purchase record are handled by Pluckr’s licence service and by Polar, our payment provider. Your document images are never sent to Pluckr’s servers.",
  "sections": [
    {
      "title": "What Pluckr does",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr is a Google Docs and Google Slides add-on that extracts images from the document or presentation where you open its sidebar. In Docs it reads embedded inline images; in Slides it reads pictures placed on slides, including grouped ones. It lists image previews, names, dimensions, and file sizes, and lets you copy, download, rename, or convert images to AVIF, WebP, JPEG, or PNG. Image conversion and resizing run in your browser. Google Apps Script reads document image data and prepares ZIP archives of original images when you request them. Three optional features go further, and each runs only when you choose it: exporting alt text files, exporting the document as Markdown, editing image alt text, and optimizing the document’s images, which replaces them in the open document with smaller copies."
        },
        {
          "type": "p",
          "html": "Pluckr is sold as a one-time purchase. To tell whether you have bought it, the add-on asks Google for an identity token for your account and sends that token to Pluckr’s licence service, which answers whether a paid licence exists for your account."
        }
      ]
    },
    {
      "title": "Information the add-on accesses",
      "blocks": [
        {
          "type": "ul",
          "items": [
            "<strong>Images in the current document.</strong> After you choose to scan or refresh a scan, Google Apps Script reads embedded inline images from the document body, including images nested in tables and document tabs. It reads image bytes, file type, and dimensions to display and export those images. It also reads each image’s alt text (title and description) and its link address, so it can show and export them. It does not currently extract floating images or images in headers, footers, or footnotes.",
            "<strong>Document text and structure (Markdown export only).</strong> If you tick the Markdown option, Google Apps Script reads the text, headings, lists, tables, links, and basic formatting of every document tab and returns them to the sidebar, which builds the content.md file in your browser. Nothing is read this way unless you choose that option.",
            "<strong>Changes to the document (only when you choose them).</strong> If you press Save to Doc on an image’s alt text, Pluckr writes that text to the image and changes nothing else. If you confirm the optimize step, Pluckr replaces images in the open document with smaller JPEG or PNG copies, one by one, at the size they already have on the page, keeping each image’s alt text and link. Pluckr edits nothing else in the document. We recommend making a copy first, and Google Docs version history can restore the earlier version.",
            "<strong>Document name.</strong> Google Apps Script uses the document name to name an original-image ZIP download.",
            "<strong>Google account identity and email.</strong> When you open Pluckr, the add-on asks Google for an identity token. The token contains your Google account ID and, because the add-on requests the email scope, your email address. They are used only to check and record your licence.",
            "<strong>Licence and purchase record.</strong> Pluckr’s licence service stores your Google account ID, your email address, whether you have a paid licence, the date of purchase, and the order and customer references from Polar. It also records, with a timestamp, that your Google account agreed to the Privacy Policy and Terms before checkout. It does not store document content or your identity token.",
            "<strong>Authorization.</strong> The add-on requests access to the current document, permission to display a Google Docs sidebar, and your Google account identity and email for licence checks. Its manifest uses the <code>documents.currentonly</code>, <code>script.container.ui</code>, <code>openid</code> and <code>userinfo.email</code> scopes. It does not request access to browse your entire Google Drive."
          ]
        }
      ]
    },
    {
      "title": "How document data is handled and shared",
      "blocks": [
        {
          "type": "p",
          "html": "Google Apps Script reads image bytes from the current document and returns them to the sidebar for previews and browser-side conversion. When you request a ZIP of originals, Apps Script assembles that archive and returns it to the sidebar. This means image data is processed by Google Docs and Google Apps Script, which are operated by Google LLC, as necessary to provide the add-on’s features. Pluckr does not send document images or document text to a separate Pluckr server or disclose them to other companies or people. The add-on’s only requests to Pluckr’s licence service contain your identity token and nothing from your document. When you download a file, it is transferred to your device at your request; when you click Copy, the image is written to your device clipboard. Google may process data under its own terms and privacy practices."
        },
        {
          "type": "p",
          "html": "We do not sell Google user data, use it for advertising, allow human review of document images, train AI or machine-learning models with the data, or share it for purposes unrelated to the add-on’s image extraction and export features. Website hosting and content-delivery providers may receive ordinary connection information when you visit docpluckr.com, as described below; they do not receive document image data through the add-on."
        }
      ]
    },
    {
      "title": "Licence checks and purchases",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr is a one-time purchase. Payments are processed by <a href=\"https://polar.sh\" target=\"_blank\" rel=\"noopener\">Polar</a>. When you buy, Polar collects your payment and billing details under its own privacy policy; Pluckr does not receive or store your card number. To start your checkout, Pluckr’s licence service gives Polar your Google account ID, as your customer reference, and your email address. When your payment succeeds, Polar tells the licence service that the order was paid, with your order and customer references and your email address, so your licence can be recorded against your Google account. If your payment is refunded, Polar tells the licence service and your licence is switched off."
        },
        {
          "type": "p",
          "html": "Pluckr’s licence service is hosted on <a href=\"https://www.convex.dev\" target=\"_blank\" rel=\"noopener\">Convex</a>. Each time you open Pluckr it verifies your Google identity token with Google’s public keys and looks up the licence for your account. It uses your account ID and email only to check whether you have a paid licence, to provide purchase support and refunds, and to prevent misuse of licences. We do not sell this information, use it for advertising, or share it for purposes unrelated to the add-on. Convex and Polar process it on our behalf under their own terms and privacy policies."
        }
      ]
    },
    {
      "title": "Data protection",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr uses the following safeguards for data accessed by the add-on:"
        },
        {
          "type": "ul",
          "items": [
            "<strong>Limited access.</strong> The manifest requests the <code>documents.currentonly</code> and <code>presentations.currentonly</code> scopes to limit access to the single document or presentation where the add-on is being used, <code>script.container.ui</code> to display its sidebar, and <code>openid</code> and <code>userinfo.email</code> to identify your licence. Google authorization controls access, and you can revoke it through your Google Account permissions.",
            "<strong>Encryption in transit.</strong> Image data moves between Google Docs, Google Apps Script, and the sidebar through Google’s Apps Script service. Connections to Google services use HTTPS/TLS, and Google manages the service and infrastructure safeguards. See <a href=\"https://docs.cloud.google.com/docs/security/encryption-in-transit\" target=\"_blank\" rel=\"noopener\">Google’s encryption-in-transit documentation</a>.",
            "<strong>Temporary processing.</strong> The add-on holds image data and conversion results in memory while a scan, preview, conversion, or download is being prepared. It does not write document image bytes to persistent storage or application logs. The add-on does not keep a separate copy after the requested operation completes.",
            "<strong>Identity verification.</strong> The licence service accepts only identity tokens that Google has signed and that were issued for this add-on, and it does not store the token. Requests to it use HTTPS.",
            "<strong>Server-side licence check.</strong> The add-on’s server code reads document images only after it has verified a short-lived licence confirmation, signed by the licence service and tied to your Google account.",
            "<strong>Licence data storage.</strong> Licence records are stored with Convex, which encrypts data in transit (TLS) and at rest. Access to the licence database is limited to the Pluckr developer. Service credentials are kept as protected server settings, never in the add-on, and payment notifications from Polar are accepted only when their cryptographic signature is valid.",
            "<strong>No separate image store.</strong> Pluckr does not create a persistent server-side copy or apply a separate encryption layer to document images. Google’s own security and data-handling practices govern its processing of data in Google services."
          ]
        },
        {
          "type": "p",
          "html": "These measures describe the current add-on implementation. They do not make Pluckr responsible for Google’s independent infrastructure, security controls, or retention practices."
        }
      ]
    },
    {
      "title": "Retention and deletion",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr does not retain document images after the requested operation. Image previews and conversion results exist in sidebar memory while needed; original-image ZIP archives are generated for the download you request. Closing the sidebar releases its in-memory data. Downloads saved to your device remain there until you delete them. Google’s independent operational retention, if any, is governed by Google’s policies. You can stop future access by uninstalling the add-on and revoking its authorization in your Google Account settings."
        },
        {
          "type": "p",
          "html": "Pluckr keeps your licence record (Google account ID, email address, licence status, purchase date, Polar order and customer references, and the time you agreed to the policy and terms) for as long as your licence is active, and keeps a refunded purchase on record as well, until you ask us to delete it. To have your record deleted, email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a>. Deleting it ends your licence, and we cannot restore it without proof of purchase. Polar keeps payment and tax records for the period the law requires, under its own policy."
        }
      ]
    },
    {
      "title": "Website and third-party services",
      "blocks": [
        {
          "type": "p",
          "html": "Google hosts the Docs add-on and Apps Script runtime. Convex hosts Pluckr’s licence service and Polar processes payments, as described above. The docpluckr.com website is hosted by Cloudflare and loads some scripts from content-delivery networks, including Webflow’s. When you visit the website, those providers may receive ordinary connection information such as your IP address, browser details, and requested URLs under their own policies. Pluckr does not use this add-on to serve advertising or behavioral analytics."
        }
      ]
    },
    {
      "title": "Google API Services and Limited Use",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr’s use of information received from Google APIs adheres to the <a href=\"https://developers.google.com/terms/api-services-user-data-policy\" target=\"_blank\" rel=\"noopener\">Google API Services User Data Policy</a>, including the Limited Use requirements. Google user data is used only to provide the image-extraction and export features you request and to check and record your licence. Your Google account ID and email address are never used for advertising or sold, and humans do not read them except with your consent, for security, or to comply with law. We transfer them only to our service providers, Convex and Polar, as needed to provide these features. In full: your Google account ID and email address are shared with Convex (licence storage) and Polar (checkout and payment records), and with no one else. Document images and content are shared with no one other than Google."
        }
      ]
    },
    {
      "title": "Revoking access",
      "blocks": [
        {
          "type": "p",
          "html": "You can revoke Pluckr’s authorization from your <a href=\"https://myaccount.google.com/permissions\" target=\"_blank\" rel=\"noopener\">Google Account permissions</a> or uninstall the add-on from Google Docs. Revoking access prevents future authorized use of the current document by the add-on. You can also choose Log out in the add-on’s menu, which revokes its authorization. Revoking access does not delete your licence record; to delete it, email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a>."
        }
      ]
    },
    {
      "title": "Changes to this policy",
      "blocks": [
        {
          "type": "p",
          "html": "We will update the “Last updated” date when this policy changes. If a change affects how the add-on handles Google user data, we will describe the updated practices here."
        }
      ]
    },
    {
      "title": "Terms of Use",
      "blocks": [
        {
          "type": "p",
          "html": "Your use of Pluckr is also governed by our <a href=\"/terms\">Terms of Use</a>."
        }
      ]
    },
    {
      "title": "Contact",
      "blocks": [
        {
          "type": "p",
          "html": "Questions or privacy requests? Email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a>."
        }
      ]
    }
  ]
} as const;
