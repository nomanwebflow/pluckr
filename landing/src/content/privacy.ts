// Privacy policy text, rewritten in plain technical English. Original wording
// is in marketing/webflow/privacy.html. HTML here is our own static copy
// (strong, a, code only), rendered by the privacy page.
export const privacy = {
  "updated": "October 25, 2026",
  "shortTitle": "The short version:",
  "shortParagraphs": [
    "Pluckr reads the inline images in the Google Doc where you open it. Apps Script reads the image data and makes the ZIP files of originals. Your browser converts the images.",
    "Pluckr is a one-time purchase. To check your license, Pluckr reads your Google account email address. Pluckr’s license service and Polar, our payment provider, handle the check and your purchase record.",
    "Pluckr never sends your document images to its servers."
  ],
  "sections": [
    {
      "title": "What Pluckr does",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr is an add-on for Google Docs and Google Slides. It gets the images from the document where you open its sidebar."
        },
        {
          "type": "ul",
          "items": [
            "In Docs, Pluckr reads inline images.",
            "In Slides, Pluckr reads the pictures on slides. This includes grouped pictures."
          ]
        },
        {
          "type": "p",
          "html": "Pluckr shows a preview, a name, the dimensions, and the file size of each image. You can copy, download, or rename each image. You can also convert it to AVIF, WebP, JPEG, or PNG."
        },
        {
          "type": "p",
          "html": "Your browser converts and resizes the images. Apps Script reads the image data of the document. When you ask for it, Apps Script also makes a ZIP file of the original images."
        },
        {
          "type": "p",
          "html": "Pluckr also has four optional features. Each feature runs only when you choose it:"
        },
        {
          "type": "ul",
          "items": [
            "Export alt text files.",
            "Export the document as Markdown.",
            "Edit the alt text of an image.",
            "Optimize the images of the document. Optimize replaces the images in the open document with smaller copies."
          ]
        },
        {
          "type": "p",
          "html": "Pluckr is a one-time purchase. To find out if you bought it, Pluckr asks Google for an identity token for your account. Pluckr sends the token to its license service. The license service replies if a paid license exists for your account."
        }
      ]
    },
    {
      "title": "Information Pluckr accesses",
      "blocks": [
        {
          "type": "ul",
          "items": [
            "<strong>Images in the current document.</strong> After you choose to scan or refresh a scan, Apps Script reads the inline images in the body of the document. This includes images in tables and in document tabs. Apps Script reads the image bytes, file type, and dimensions of each image. It also reads the alt text (title and description) and the link address of each image. Pluckr uses this data to show and export the images. Pluckr does not extract floating images or images in headers, footers, or footnotes at this time.",
            "<strong>Document text and structure (Markdown export only).</strong> Pluckr reads this data only if you tick the Markdown option. Apps Script reads the text, headings, lists, tables, links, and basic formatting of each document tab. Apps Script sends this data to the sidebar. The sidebar builds the content.md file in your browser. Pluckr does not read this data if you do not choose the option.",
            "<strong>Alt text changes (only when you choose them).</strong> If you press Save to Doc on the alt text of an image, Pluckr writes that text to the image. Pluckr changes nothing else.",
            "<strong>Optimize changes (only when you choose them).</strong> If you confirm the optimize step, Pluckr replaces the images in the open document with smaller JPEG or PNG copies. Pluckr replaces the images one by one. Each copy keeps the size that the image already has on the page. Each copy also keeps the alt text and the link of the image. Pluckr does not change anything else in the document.",
            "<strong>Backup.</strong> We recommend that you make a copy of the document first. Google Docs version history can restore the earlier version.",
            "<strong>Document name.</strong> Apps Script uses the name of the document to name the ZIP file of original images.",
            "<strong>Google account identity and email.</strong> When you open Pluckr, it asks Google for an identity token. The token contains your Google account ID. Pluckr asks for the email scope, so the token also contains your email address. Pluckr uses the account ID and the email address only to check and record your license.",
            "<strong>License and purchase record.</strong> Pluckr’s license service stores your Google account ID and your email address. It also stores if you have a paid license and the date of purchase. It stores the order and customer references from Polar. It records the time when your Google account agreed to the Privacy Policy and the Terms before checkout. It does not store document content or your identity token.",
            "<strong>Authorization.</strong> Pluckr asks for access to the current document. It asks for permission to show a Google Docs sidebar. It also asks for your Google account identity and email to check your license. The manifest uses the <code>documents.currentonly</code>, <code>script.container.ui</code>, <code>openid</code> and <code>userinfo.email</code> scopes. Pluckr does not ask for access to browse all of your Google Drive."
          ]
        }
      ]
    },
    {
      "title": "How document data is handled and shared",
      "blocks": [
        {
          "type": "p",
          "html": "Apps Script reads the image bytes from the current document. It sends them to the sidebar for previews and for conversion in your browser. When you ask for a ZIP file of originals, Apps Script makes the archive. It then sends the archive to the sidebar."
        },
        {
          "type": "p",
          "html": "Google Docs and Apps Script process the image data. Google LLC operates them. This is necessary to give you the features of Pluckr."
        },
        {
          "type": "p",
          "html": "Pluckr does not send document images or document text to a separate Pluckr server. Pluckr does not give them to other companies or people. Pluckr sends only your identity token to the license service. The requests contain nothing from your document."
        },
        {
          "type": "p",
          "html": "When you download a file, Pluckr sends it to your device at your request. When you click Copy, Pluckr writes the image to the clipboard of your device. Google can process data under its own terms and privacy practices."
        },
        {
          "type": "p",
          "html": "We do none of these things with Google user data:"
        },
        {
          "type": "ul",
          "items": [
            "We do not sell it.",
            "We do not use it for advertising.",
            "We do not allow human review of document images.",
            "We do not train AI or machine-learning models with it.",
            "We do not share it for purposes that are not related to the image extraction and export features of Pluckr."
          ]
        },
        {
          "type": "p",
          "html": "Website hosting providers and content-delivery providers can receive ordinary connection information when you visit docpluckr.com. The section Website and third-party services describes this. These providers do not receive document image data through Pluckr."
        }
      ]
    },
    {
      "title": "License checks and purchases",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr is a one-time purchase. <a href=\"https://polar.sh\" target=\"_blank\" rel=\"noopener\">Polar</a> processes the payments. When you buy, Polar collects your payment and billing details. Polar uses its own privacy policy for this data. Pluckr does not receive or store your card number."
        },
        {
          "type": "p",
          "html": "To start your checkout, Pluckr’s license service gives Polar your Google account ID and your email address. Polar uses the account ID as your customer reference."
        },
        {
          "type": "p",
          "html": "When your payment succeeds, Polar tells the license service that the order is paid. Polar sends the order reference, the customer reference, and your email address. The license service uses them to record your license against your Google account."
        },
        {
          "type": "p",
          "html": "If Polar refunds your payment, Polar tells the license service. The license service then turns off your license."
        },
        {
          "type": "p",
          "html": "<a href=\"https://www.convex.dev\" target=\"_blank\" rel=\"noopener\">Convex</a> hosts Pluckr’s license service. Each time you open Pluckr, the license service makes sure that your Google identity token is valid. It uses the public keys of Google for this. It then looks up the license for your account."
        },
        {
          "type": "p",
          "html": "The license service uses your account ID and email address only for these purposes:"
        },
        {
          "type": "ul",
          "items": [
            "to make sure that you have a paid license",
            "to give purchase support and refunds",
            "to stop misuse of licenses"
          ]
        },
        {
          "type": "p",
          "html": "We do not sell this information. We do not use it for advertising. We do not share it for purposes that are not related to Pluckr. Convex and Polar process it for us. They use their own terms and privacy policies."
        }
      ]
    },
    {
      "title": "Data protection",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr uses these safeguards for the data that it accesses:"
        },
        {
          "type": "ul",
          "items": [
            "<strong>Limited access.</strong> The manifest asks for the <code>documents.currentonly</code> and <code>presentations.currentonly</code> scopes. These scopes limit access to the one document or presentation where you use Pluckr. The <code>script.container.ui</code> scope shows the sidebar. The <code>openid</code> and <code>userinfo.email</code> scopes identify your license. Google authorization controls access. You can revoke it in the permissions of your Google Account.",
            "<strong>Encryption in transit.</strong> Image data moves between Google Docs, Apps Script, and the sidebar through the Apps Script service of Google. Connections to Google services use HTTPS/TLS. Google manages the service and the infrastructure safeguards. See <a href=\"https://docs.cloud.google.com/docs/security/encryption-in-transit\" target=\"_blank\" rel=\"noopener\">the encryption-in-transit documentation of Google</a>.",
            "<strong>Temporary processing.</strong> Pluckr holds image data and conversion results in memory while it prepares a scan, preview, conversion, or download. Pluckr does not write document image bytes to persistent storage or to application logs. Pluckr does not keep a separate copy after the operation ends.",
            "<strong>Identity checks.</strong> The license service accepts only identity tokens that Google signed for Pluckr. It does not store the token. Requests to the license service use HTTPS.",
            "<strong>Server-side license check.</strong> Before the server code of Pluckr reads document images, it needs a short-lived license confirmation. The license service signs the confirmation. The confirmation belongs to your Google account.",
            "<strong>License data storage.</strong> Convex stores the license records. Convex encrypts data in transit (TLS) and at rest. Only the Pluckr developer has access to the license database. Pluckr keeps service credentials as protected server settings. The credentials are never in Pluckr itself. Pluckr accepts payment notifications from Polar only if their cryptographic signature is valid.",
            "<strong>No separate image store.</strong> Pluckr does not make a persistent server-side copy of document images. Pluckr does not add a separate encryption layer to them. The security and data-handling practices of Google govern how Google processes data in its services."
          ]
        },
        {
          "type": "p",
          "html": "These measures describe the current Pluckr implementation. They do not make Pluckr responsible for the independent infrastructure, security controls, or retention practices of Google."
        }
      ]
    },
    {
      "title": "Retention and deletion",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr does not keep document images after the operation that you ask for. Image previews and conversion results stay in the memory of the sidebar while Pluckr needs them. Pluckr makes the ZIP file of originals only for the download that you ask for. When you close the sidebar, Pluckr releases its memory data."
        },
        {
          "type": "p",
          "html": "Files that you download stay on your device until you delete them. Google has its own operational retention, if any. Google policies govern it. To stop future access, uninstall Pluckr and revoke its authorization in the settings of your Google Account."
        },
        {
          "type": "p",
          "html": "Pluckr keeps your license record while your license is active. Pluckr also keeps the record of a refunded purchase. Pluckr keeps both until you ask us to delete the record."
        },
        {
          "type": "p",
          "html": "The license record contains your Google account ID, your email address, the license status, and the purchase date. It also contains the order and customer references from Polar. It contains the time when you agreed to the policy and the terms."
        },
        {
          "type": "p",
          "html": "To delete your record, email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a>. When we delete it, your license ends. We cannot restore it without proof of purchase. Polar keeps payment and tax records for the period that the law sets. Polar uses its own policy for this."
        }
      ]
    },
    {
      "title": "Website and third-party services",
      "blocks": [
        {
          "type": "p",
          "html": "Google hosts Pluckr and the Apps Script runtime. Convex hosts the license service of Pluckr. Polar processes payments, as this policy describes above."
        },
        {
          "type": "p",
          "html": "Cloudflare hosts the docpluckr.com website. The website loads some scripts from content-delivery networks. Webflow is one example."
        },
        {
          "type": "p",
          "html": "When you visit the website, these providers can receive ordinary connection information. This includes your IP address, your browser details, and the URLs that you request. They use their own policies for this data. Pluckr does not use the add-on to show advertising or to do behavioral analytics."
        }
      ]
    },
    {
      "title": "Google API Services and Limited Use",
      "blocks": [
        {
          "type": "p",
          "html": "Pluckr’s use of information that it receives from Google APIs adheres to the <a href=\"https://developers.google.com/terms/api-services-user-data-policy\" target=\"_blank\" rel=\"noopener\">Google API Services User Data Policy</a>. This includes the Limited Use requirements."
        },
        {
          "type": "p",
          "html": "Pluckr uses Google user data only to:"
        },
        {
          "type": "ul",
          "items": [
            "give the image-extraction and export features that you ask for",
            "check and record your license"
          ]
        },
        {
          "type": "p",
          "html": "Pluckr never uses your Google account ID and email address for advertising. Pluckr never sells them. Humans do not read them, except in three cases: with your consent, for security, or to obey the law."
        },
        {
          "type": "p",
          "html": "We give them only to our service providers, Convex and Polar. They need them to give these features."
        },
        {
          "type": "p",
          "html": "In full: Pluckr shares your Google account ID and email address with Convex (license storage) and with Polar (checkout and payment records). Pluckr shares them with no one else. Pluckr shares document images and content with no one other than Google."
        }
      ]
    },
    {
      "title": "Revoking access",
      "blocks": [
        {
          "type": "p",
          "html": "You can revoke the authorization of Pluckr in the <a href=\"https://myaccount.google.com/permissions\" target=\"_blank\" rel=\"noopener\">permissions of your Google Account</a>. You can also uninstall Pluckr from Google Docs. Or you can choose Log out in the menu of Pluckr. Log out revokes the authorization."
        },
        {
          "type": "p",
          "html": "After you revoke access, Pluckr does not have access to the current document. Pluckr does not delete your license record. To delete it, email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a>."
        }
      ]
    },
    {
      "title": "Changes to this policy",
      "blocks": [
        {
          "type": "p",
          "html": "We will change the “Last updated” date when we change this policy. If a change affects how Pluckr handles Google user data, we will describe the new practices here."
        }
      ]
    },
    {
      "title": "Terms of Use",
      "blocks": [
        {
          "type": "p",
          "html": "Our <a href=\"/terms\">Terms of Use</a> also govern your use of Pluckr."
        }
      ]
    },
    {
      "title": "Contact",
      "blocks": [
        {
          "type": "p",
          "html": "Email <a href=\"mailto:support@docpluckr.com\">support@docpluckr.com</a> with questions or privacy requests."
        }
      ]
    }
  ]
} as const;
