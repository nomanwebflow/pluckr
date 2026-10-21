// Pure helpers (Web Crypto only), so they run in Convex and are testable in Node.
const enc = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) out[index] = binary.charCodeAt(index);
  return out;
}

async function hmacSha256(key: Uint8Array, data: string): Promise<Uint8Array> {
  const imported = await crypto.subtle.importKey("raw", key as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", imported, enc.encode(data)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

/**
 * Entitlement the add-on's Apps Script side can verify offline with the same secret:
 * `${exp}.${base64url(HMAC-SHA256(secret, `${sub}.${exp}`))}`. Bound to one Google account (sub) and expires.
 */
export async function signEntitlement(secret: string, sub: string, exp: number): Promise<string> {
  const signature = await hmacSha256(enc.encode(secret), `${sub}.${exp}`);
  const url = toBase64(signature).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${exp}.${url}`;
}

export type WebhookHeaders = { id: string; timestamp: string; signature: string };

/**
 * Standard Webhooks verification (what Polar uses). New Polar secrets are `whsec_` + a base64 key;
 * older ones use the raw secret string as the key, so both are tried.
 */
export async function verifyStandardWebhook(
  secret: string,
  headers: WebhookHeaders,
  body: string,
  nowSeconds: number,
  toleranceSeconds = 300,
): Promise<boolean> {
  const timestamp = Number(headers.timestamp);
  if (!headers.id || !Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > toleranceSeconds) return false;

  const keys: Uint8Array[] = [enc.encode(secret)];
  if (secret.startsWith("whsec_")) {
    try {
      keys.unshift(fromBase64(secret.slice("whsec_".length)));
    } catch {
      // not valid base64: fall back to the raw-string key only
    }
  }

  const received = headers.signature
    .split(" ")
    .map((part) => part.split(","))
    .filter((part) => part[0] === "v1" && part[1])
    .map((part) => part[1]);
  if (received.length === 0) return false;

  const signedContent = `${headers.id}.${headers.timestamp}.${body}`;
  for (const key of keys) {
    const expected = toBase64(await hmacSha256(key, signedContent));
    if (received.some((candidate) => timingSafeEqual(candidate, expected))) return true;
  }
  return false;
}
