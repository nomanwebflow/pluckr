# Pluckr paid version: draft changes to the privacy policy and terms

DRAFT. Not published. Apply these when the paid flow ships, in the same release, so the policy never
describes something the add-on does not do (or the other way round). Have a lawyer read it before
publishing: it covers payments, refunds and personal data.

Text in [square brackets] is a decision or a fact I could not know. Resolve every one before publishing.

## Assumptions I made (correct me)

1. The add-on gets the user's identity with ScriptApp.getIdentityToken() (scopes: openid, userinfo.email)
   and the sidebar sends that token to a Convex HTTP endpoint over HTTPS. Convex verifies it with Google.
2. Convex stores per user: [Google account email], [Google account ID (the token "sub")], licence status,
   [Polar order/customer ID], purchase date. Nothing else. [Add anything else you store, e.g. install
   counts, last-seen time, IP address, logs.]
3. Polar takes the payment. Pluckr never sees card details. Polar sends a webhook to Convex when an order is paid.
4. The $5 is paid once. The licence belongs to one Google account. [Decide: one account only, or any
   number of devices for that account.]
5. Document images and content are never sent to Convex or Polar. Only the identity token (email)
   and licence checks leave the add-on.
6. docpluckr.com is now served by Cloudflare Pages (the current policy still says Webflow).

---

## PRIVACY POLICY

Change the "Last updated" date to the release date.

### 1. "The short version" box: replace with

Pluckr accesses inline images in the Google Doc where you open the add-on. Image conversion runs in your
browser and your document images are never sent to Pluckr's servers. Because Pluckr is a one-time paid
add-on, it also reads your Google account email address to check whether you have a licence. That check
and your purchase records are handled by Pluckr's licence service and by Polar, our payment provider.

### 2. "What Pluckr does": add this paragraph at the end

Pluckr is sold as a one-time purchase. To tell whether you have bought it, the add-on asks Google for an
identity token for your account and sends that token to Pluckr's licence service, which returns whether a
paid licence exists for your account.

### 3. "Information the add-on accesses": replace "Authorization." and add two items

Google account email and identity. When you open Pluckr, the add-on asks Google for an identity token
(the openid and userinfo.email scopes). The token contains your Google email address and a Google account
ID. It is used only to check and record your licence.

Licence and purchase record. Pluckr's licence service stores your email address, Google account ID,
whether you have a paid licence, the date of purchase, and [the Polar order or customer reference].
[List anything else you store.] It does not store document content.

Authorization. The add-on requests access to the current document and permission to display a Google Docs
sidebar, and your Google email address and account identity for licence checks. Its manifest uses the
documents.currentonly, script.container.ui, openid and userinfo.email scopes. It does not request access
to browse your entire Google Drive.

### 4. "How document data is handled and shared": replace the sentence "The add-on does not make external requests with document data." with

The add-on makes requests to Pluckr's licence service only to check your licence, and those requests
contain your identity token and nothing from your document. Document images and content are never sent to
Pluckr's licence service, Polar, or any other company besides Google.

Also replace the second paragraph's last sentence with:

Website hosting and content-delivery providers may receive ordinary connection information when you
visit docpluckr.com, as described below. The licence service and payment provider receive only the
information described in "Licence checks and purchases".

### 5. NEW section: "Licence checks and purchases" (put it after section 4)

Pluckr is a one-time purchase of [$5 USD]. Payments are processed by Polar (polar.sh). When you buy,
Polar collects your payment details and billing information under its own privacy policy. Pluckr does not
receive or store your card number. Polar tells Pluckr's licence service that your order was paid, along
with [your email address and an order reference], so we can record your licence.

Pluckr's licence service is hosted on Convex. When you open Pluckr, it checks the licence record
for your Google account. It uses your email address and licence record only to:

- check whether you have a paid licence;
- provide purchase support and handle refunds; and
- prevent misuse of licences.

We do not sell this information, use it for advertising, or share it for purposes unrelated to the
add-on. Polar and Convex process it on our behalf under their own terms and privacy policies.
[Add: where Convex stores data (region), if you want to state it.]

### 6. "Data protection": add two items

Identity token verification. The licence service verifies each identity token with Google before
trusting it, and the token is sent only over HTTPS. [Add: tokens are not stored.]

Licence data storage. Licence records are stored with Convex, which provides encryption in transit and
at rest [confirm against Convex's current documentation]. Access to the licence database is limited to
[the Pluckr developer].

Also change the "Temporary processing" item's last sentence to:
The add-on does not keep a separate copy of document images after the requested operation completes.
(Remove any wording that says Pluckr has no server at all: it now has a licence service.)

Also replace the "No separate image store." item's first sentence with:
Pluckr does not create a persistent server-side copy of document images and does not apply a separate
encryption layer to them.

### 7. "Retention and deletion": replace with

Pluckr does not retain document images after the requested operation. Image previews and conversion
results exist in sidebar memory while needed, and closing the sidebar releases them.

Pluckr keeps your licence record (email address, Google account ID, licence status, purchase date and order
reference) for as long as your licence is active. [Decide: keep for X years after the last use, or until
you request deletion.] To have it deleted, email support@docpluckr.com. Deleting the record ends your
licence, and we cannot restore it without proof of purchase. Polar keeps payment and tax records for the
period the law requires, under its own policy. Downloads saved to your device remain there until you
delete them. Google's independent retention is governed by Google's policies. You can stop future access by
uninstalling the add-on and revoking its authorization in your Google Account settings.

### 8. "Website and third-party services": replace with

Google hosts the Docs add-on and Apps Script runtime. Convex hosts Pluckr's licence service, and Polar
processes payments. The docpluckr.com website is hosted by Cloudflare [and was designed in Webflow].
When you visit the website, hosting and delivery providers may receive ordinary connection information
such as your IP address, browser details, and requested URLs under their own policies. Pluckr does not use
this add-on to serve advertising or behavioral analytics.

### 9. "Google API Services and Limited Use": replace with

Pluckr's use and transfer to any other app of information received from Google APIs will adhere to the
Google API Services User Data Policy, including the Limited Use requirements. Your Google account email
address and identity are used only to check and record your licence and to provide purchase support. We do
not sell Google user data, use it for advertising, or allow humans to read it except with your consent, for
security, or to comply with law. We transfer it only to our service providers (Convex and Polar) as needed
to provide these features.

### 10. "Revoking access": add at the end

You can also choose Log out in the add-on's menu, which revokes Pluckr's authorization. Revoking access
does not delete your licence record; to delete it, email support@docpluckr.com.

### 11. "Changes to this policy": no change.

---

## TERMS OF USE

Change the "Last updated" date to the release date.

### 1. "The short version" box: replace the last two sentences with

Pluckr is a one-time paid add-on. Use Pluckr only with content you are authorized to access. The Service is
provided as-is, without warranty.

### 2. "What the Service is": add at the end

To use Pluckr you need a paid licence. The add-on checks your licence with Pluckr's licence service using
your Google account email address, as described in the Privacy Policy.

### 3. "Cost": replace the whole section with "Price, licence and payment"

Price. Pluckr is a one-time purchase of [$5 USD], plus any taxes [that Polar calculates at checkout].
There is no subscription [and no recurring charge].

What you get. [Choose one:]
(a) one licence for one Google account, for as long as Pluckr is offered; or
(b) one licence for one Google account, for [version 1.x], including free updates within that version.
[Free trial or free tier: state it, or delete this line.]

Payment. Payments are processed by Polar (polar.sh), which handles your payment details. [If correct:
Polar acts as the seller of record and is responsible for collecting and remitting sales taxes.] Polar's
terms apply to the purchase. We do not receive your card details.

Licence. Your licence is personal, non-transferable, and tied to the Google account you bought it with
[and may be used on any device where you sign in with that account]. Do not share or resell it.

Refunds. [Decide the policy, for example: you may request a refund within 14 days of purchase by emailing
support@docpluckr.com.] [Refunds are processed through Polar.] After a refund, your licence ends.

Price changes. If we change the price, it does not affect licences already purchased.

### 4. "Your Google account and your documents": add a sentence

Pluckr also asks for your Google email address and account identity so it can verify your licence.

### 5. NEW section: "Licence checks and availability" (after "Cost" replacement)

Pluckr checks your licence with Pluckr's licence service when you open it. If the licence service or your
internet connection is unavailable, the add-on may not be usable until the check can be completed. We
aim to keep the service available but do not guarantee uninterrupted access.

### 6. "Third-party services": replace with

The Service relies on Google Docs and Google Apps Script, and on Convex (licence hosting) and Polar
(payments), which Pluckr does not control. Your use of those services is governed by their own terms. We
are not responsible for third-party services, their availability, or changes that affect the Service.

### 7. "Changes to the Service and these Terms": replace the first sentence with

We may change the Service at any time. If we discontinue it entirely, [we will give notice of at least
X days and refund purchases made in the last Y days / we will keep licences working for Z months].

### 8. "Termination": replace with

You may stop using the Service at any time by closing or uninstalling the add-on and revoking its
authorization. We may suspend or end a licence if these Terms are violated, for example if a licence is
shared or resold [without a refund / with a refund of the unused period].

### 9. "Limitation of liability": add

Our total liability to you for any claim is limited to the amount you paid for your licence, to the extent
the law allows.

---

## OTHER PLACES THAT MUST CHANGE AT THE SAME TIME

- Homepage FAQ "Are my images uploaded anywhere?": keep the answer about images, and add: "Pluckr checks
  your licence with your Google email address. Your document images are never sent to our servers."
- Homepage FAQ "Do I need a Google account?": add that Pluckr is a one-time purchase and how to buy it.
- Homepage pricing mention: add the price and a buy link (once you have it).
- The add-on's "Before you scan" notice currently says Pluckr does not send images to a separate Pluckr
  server. That is still true, but add: "Pluckr also reads your Google email address to check your licence."
- OAuth consent screen: the two new scopes are already listed. The Additional info text is in
  brand/oauth-submission.md.
- Marketplace listing, if you use it: state that the add-on is a paid, one-time purchase.
