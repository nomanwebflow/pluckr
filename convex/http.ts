import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { signEntitlement, verifyStandardWebhook } from "./crypto";

const http = httpRouter();

const ENTITLEMENT_TTL_SECONDS = 6 * 60 * 60;

// The sidebar runs on a changing *.googleusercontent.com origin and authenticates with a Bearer token, not cookies.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// A malformed or unverifiable token makes Convex throw; treat any failure as "not signed in".
async function identityOf(ctx: { auth: { getUserIdentity(): Promise<{ subject: string; email?: string; emailVerified?: boolean } | null> } }) {
  try {
    return await ctx.auth.getUserIdentity();
  } catch {
    return null;
  }
}

// Dependency failures use 424: the proxy in front of Convex replaces 5xx replies with ones that lack CORS headers,
// which makes the browser report a bare "Failed to fetch".
const verifiedEmail = (identity: { email?: string; emailVerified?: boolean }) => (identity.emailVerified ? identity.email : undefined);

const preflight = httpAction(async () => new Response(null, { status: 204, headers: cors }));

http.route({ path: "/licence", method: "OPTIONS", handler: preflight });
http.route({ path: "/checkout", method: "OPTIONS", handler: preflight });

/** Is this Google account licensed? If so, hand back a short-lived entitlement for the add-on's server code. */
http.route({
  path: "/licence",
  method: "POST",
  handler: httpAction(async (ctx) => {
    const identity = await identityOf(ctx);
    if (!identity) return json({ error: "unauthenticated" }, 401);

    const licence = await ctx.runQuery(internal.licences.getActiveBySub, { sub: identity.subject, email: verifiedEmail(identity) });
    if (!licence) return json({ licensed: false });

    const secret = process.env.ENTITLEMENT_SECRET;
    if (!secret) return json({ error: "server_misconfigured" }, 424);
    const exp = Math.floor(Date.now() / 1000) + ENTITLEMENT_TTL_SECONDS;
    return json({ licensed: true, entitlement: await signEntitlement(secret, identity.subject, exp), expiresAt: exp });
  }),
});

/** Create a Polar checkout for this Google account and return its URL. */
http.route({
  path: "/checkout",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const identity = await identityOf(ctx);
    if (!identity) return json({ error: "unauthenticated" }, 401);

    const existing = await ctx.runQuery(internal.licences.getActiveBySub, { sub: identity.subject, email: verifiedEmail(identity) });
    if (existing) return json({ licensed: true });

    // The unlock screen only enables Buy once the privacy/terms box is ticked; record that before creating the checkout.
    const body = (await request.json().catch(() => ({}))) as { accepted?: boolean };
    if (body.accepted !== true) return json({ error: "consent_required" }, 400);
    await ctx.runMutation(internal.licences.recordConsent, { sub: identity.subject });

    const token = process.env.POLAR_ACCESS_TOKEN;
    const product = process.env.POLAR_PRODUCT_ID;
    if (!token || !product) return json({ error: "server_misconfigured" }, 424);

    const base = process.env.POLAR_API_URL ?? "https://api.polar.sh"; // sandbox: https://sandbox-api.polar.sh
    const response = await fetch(`${base}/v1/checkouts/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        products: [product],
        // The webhook returns this ID, which is how a payment is matched to the Google account.
        external_customer_id: identity.subject,
        customer_email: identity.email ?? undefined,
        success_url: process.env.CHECKOUT_SUCCESS_URL ?? undefined,
      }),
    });
    if (!response.ok) {
      console.error("Polar checkout failed", response.status, await response.text());
      return json({ error: "checkout_failed" }, 424);
    }
    const checkout = (await response.json()) as { url?: string };
    if (!checkout.url) return json({ error: "checkout_failed" }, 424);
    return json({ url: checkout.url });
  }),
});

/** Polar -> Convex. Signature-checked; order.paid grants the licence, order.refunded revokes it. */
http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) return new Response("server_misconfigured", { status: 500 });

    const body = await request.text();
    const valid = await verifyStandardWebhook(
      secret,
      {
        id: request.headers.get("webhook-id") ?? "",
        timestamp: request.headers.get("webhook-timestamp") ?? "",
        signature: request.headers.get("webhook-signature") ?? "",
      },
      body,
      Math.floor(Date.now() / 1000),
    );
    if (!valid) return new Response("invalid_signature", { status: 400 });

    let event: { type?: string; data?: any };
    try {
      event = JSON.parse(body);
    } catch {
      return new Response("invalid_json", { status: 400 });
    }

    const order = event.data;
    const product = process.env.POLAR_PRODUCT_ID;
    if (!order || (product && order.product_id !== product)) return new Response("ignored", { status: 200 });

    if (event.type === "order.paid" && order.paid === true) {
      const sub: string | undefined = order.customer?.external_id ?? undefined;
      if (!sub) {
        // Bought outside our checkout, so there is no Google account to attach it to. Handle by hand via support.
        console.error("order.paid without external_id", order.id);
        return new Response("no_external_id", { status: 200 });
      }
      await ctx.runMutation(internal.licences.recordOrder, {
        sub,
        email: order.customer?.email ?? undefined,
        orderId: order.id,
        customerId: order.customer?.id ?? undefined,
        status: "active",
        paidAt: Date.now(),
      });
    } else if (event.type === "order.refunded" && order.status === "refunded") {
      await ctx.runMutation(internal.licences.markRefunded, { orderId: order.id });
    }
    return new Response("ok", { status: 200 });
  }),
});

export default http;
