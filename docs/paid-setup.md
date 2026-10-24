# Paid flow: what is built and what you still configure

Status: LIVE since Oct 21, 2026. Google OAuth verification for project `pkuckr` was approved on Oct 23, 2026 (scope `script.container.ui`). The paywall, the server-side gate (`ENTITLEMENT_SECRET` in Apps Script Script
Properties), the updated privacy policy and the updated terms are all deployed.

## Current state

| Piece | State |
|---|---|
| Convex production deployment | `kindly-hawk-555` (EU). Site URL: https://kindly-hawk-555.eu-west-1.convex.site. A dev deployment, `courteous-butterfly-858`, is for experiments only. |
| Convex env (prod) | `ENTITLEMENT_SECRET` (copy in `.secrets/entitlement-secret.txt`, git-ignored; the same value is in Apps Script Script Properties), `POLAR_PRODUCT_ID`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `GOOGLE_CLIENT_ID` (the token audience; issuer https://accounts.google.com). |
| Polar organisation | `pluckr`. Product "Life Time Access" (`c6f6026a-717a-464c-992e-818f2bc18ea2`), **$5**, one-time. |
| Polar token | `pluckr-convex-licences`, scope `checkouts:write` only, expires Oct 20, 2027 (create a new one and reset `POLAR_ACCESS_TOKEN` before then). |
| Polar webhook | `pluckr-licences` -> `/polar-webhook`, events `order.paid` and `order.refunded`, raw format. |
| Manifest | `openid` and `userinfo.email` in `apps-script/appsscript.json`. |
| Sidebar | `.env.production` holds the production URL and the `$5` label. Keep it equal to the Polar price. |

OAuth verification:
- Approved for the sensitive scope `script.container.ui`. `documents.currentonly`, `openid` and `userinfo.email` are non-sensitive.
- A new scope, or a change to the consent screen (name, logo, links, domain), needs a new verification request. Do not edit the scopes in `apps-script/appsscript.json` without one.
- Keep the project Owner and Editor emails current so Google's messages arrive.
- The older project `pluckr-add-on` (its submission was not approved) has been deleted.

Notes:
- Reviewer licence: `pluckr.tester@gmail.com` has a free licence (row with order `reviewer-grant-1`, matched by Google-verified email). Revoke with `npx convex run --prod licences:markRefunded '{"orderId":"reviewer-grant-1"}'`.
- Polar may attach an order to a customer it already knows by email, so `external_id` is not always the Google
  account ID. `/licence` therefore also matches the Google-verified email.
- The privacy/terms checkbox on the unlock screen is recorded in the Convex `consents` table before checkout.
- Apps Script keeps the last valid entitlement in User Properties and injects it when the sidebar opens, so a
  licensed user skips the "checking" screen. `Log out` clears it.
- Setting a secret: copy the value, then run `npx convex env set --deployment kindly-hawk-555 NAME "$(pbpaste)"`
  straight away. Check what is stored with the first characters only; never print a secret.

## How it works

1. The sidebar asks Apps Script for a Google identity token and sends it to Convex (`POST /licence`).
2. Convex verifies the token with Google and looks up a paid licence for that Google account ID (`sub`).
3. If licensed, Convex returns a short-lived (6 hour) entitlement signed with `ENTITLEMENT_SECRET`.
4. The sidebar passes the entitlement to `getDocumentInfo`, `getDocumentImage` and `getImagesArchive`. `Code.gs` verifies it offline
   with the same secret, so the images cannot be read without a licence even from the browser console.
5. Not licensed: the sidebar shows "Unlock Pluckr". Buy opens a Polar checkout created by Convex (`POST /checkout`)
   with the Google account ID as the customer's external ID. Polar's `order.paid` webhook (`POST /polar-webhook`,
   signature-checked) then records the licence, and the sidebar unlocks by itself within a few seconds.
   `order.refunded` (status "refunded") switches the licence off.

Files: `convex/` (backend), `src/licence.js` and `src/main.jsx` (sidebar), `apps-script/Code.gs` (server gate).

## Tests

```sh
npm run test:paid
```

Checks the webhook signature code against the reference Standard Webhooks library and runs the real `Code.gs` gate
against entitlements signed by the Convex code.

## One-time setup

### A. Polar (use the sandbox first: sandbox.polar.sh)

1. Create a product "Pluckr", one-time price $5. Copy its product ID.
2. Settings > Developers: create an Organization Access Token with the `checkouts:write` scope.
3. After the Convex production deployment exists, add a webhook endpoint
   `https://<production-deployment>.convex.site/polar-webhook` for the events `order.paid` and `order.refunded`.
   Copy the webhook secret.

### B. Convex environment variables

A dev deployment already exists (`courteous-butterfly-858`, project `pluckr-licences`). Create the production one
with `npx convex deploy`, then set these on it (add `--prod`; leave it off for the dev deployment):

```sh
npx convex env set --prod GOOGLE_CLIENT_ID <aud from step C>
npx convex env set --prod ENTITLEMENT_SECRET "$(openssl rand -base64 32)"   # note it down: it goes in Apps Script too
npx convex env set --prod POLAR_ACCESS_TOKEN <polar_oat_...>
npx convex env set --prod POLAR_PRODUCT_ID <product uuid>
npx convex env set --prod POLAR_WEBHOOK_SECRET <whsec_...>
npx convex env set --prod POLAR_API_URL https://sandbox-api.polar.sh        # sandbox only; remove for live payments
```

Optional: `CHECKOUT_SUCCESS_URL` (where Polar sends the buyer after paying, for example https://docpluckr.com).
`GOOGLE_CLIENT_ID` is currently a placeholder (`REPLACE_WITH_TOKEN_AUD`) on the dev deployment.

### C. Find the token's audience (GOOGLE_CLIENT_ID)

1. Add `"openid"` and `"https://www.googleapis.com/auth/userinfo.email"` to `oauthScopes` in `apps-script/appsscript.json`.
2. `npm run push`, then in the Apps Script editor run the function `logIdentityTokenClaims` and approve access.
3. Read the Execution log. It prints `iss` and `aud`.
   - Set Convex `GOOGLE_CLIENT_ID` to `aud`.
   - `iss` must be exactly `https://accounts.google.com`. If it is not, change `domain` in `convex/auth.config.ts`.

### D. Apps Script

Project Settings > Script properties: add `ENTITLEMENT_SECRET` with the SAME value as in Convex.
Setting it is what switches the server-side gate on. Remove it to switch the gate off.

### E. Sidebar build

Create `.env.production` (not committed) with the production site URL, then `npm run push`:

```
VITE_PLUCKR_LICENCE_URL=https://<production-deployment>.convex.site
VITE_PRICE_LABEL=$5
```

Without `VITE_PLUCKR_LICENCE_URL` the sidebar shows no paywall.

## Release order (avoids locking anyone out)

1. Convex production deployed, variables set, Polar webhook pointed at it (sandbox first, then live keys).
2. Buy once yourself in the sandbox and confirm the sidebar unlocks and a refund locks it again.
3. Add the two scopes to the manifest and push (step C). Set `GOOGLE_CLIENT_ID`.
4. Build with `.env.production` and push the sidebar.
5. Set `ENTITLEMENT_SECRET` in Apps Script (step D). The paywall is now live.
6. Publish the privacy policy and the updated terms the same day: `./scripts/deploy-site.sh`.
   The privacy policy in `pluckr.webflow/privacy.html` is already updated. The terms are NOT: they still say the
   add-on is free. See `brand/paid-policy-draft.md`.
7. Then record the demo video and submit OAuth verification (`brand/oauth-submission.md`).

## Operating notes

- Delete a person's data: Convex dashboard > Functions > `licences:deleteBySub` with their Google account ID.
- A purchase made outside the checkout from the sidebar has no Google account attached. The webhook logs
  `order.paid without external_id`; handle those by hand.
- Only a fully refunded order switches a licence off. A partial refund does not.
- The licence is tied to one Google account, not to a Doc or a device.
