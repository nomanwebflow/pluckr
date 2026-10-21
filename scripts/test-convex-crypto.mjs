// Checks convex/crypto.ts against the reference Standard Webhooks library. Run: node scripts/test-convex-crypto.mjs
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { Webhook } from 'standardwebhooks';
import { signEntitlement, verifyStandardWebhook } from '../convex/crypto.ts';

const now = Math.floor(Date.now() / 1000);
const body = JSON.stringify({ type: 'order.paid', data: { id: 'ord_1', paid: true } });
const headersFor = (signer, id = 'msg_1', ts = new Date()) => ({
  id, timestamp: String(Math.floor(ts.getTime() / 1000)), signature: signer.sign(id, ts, body),
});

// New-style secret: whsec_ + base64 key.
const secret = `whsec_${randomBytes(24).toString('base64')}`;
const signer = new Webhook(secret);
assert.equal(await verifyStandardWebhook(secret, headersFor(signer), body, now), true, 'valid new-style signature');
assert.equal(await verifyStandardWebhook(secret, headersFor(signer), body + ' ', now), false, 'tampered body');
assert.equal(await verifyStandardWebhook(`whsec_${randomBytes(24).toString('base64')}`, headersFor(signer), body, now), false, 'wrong secret');
const stale = headersFor(signer, 'msg_2', new Date(Date.now() - 10 * 60 * 1000));
assert.equal(await verifyStandardWebhook(secret, stale, body, now), false, 'replay outside tolerance');
assert.equal(await verifyStandardWebhook(secret, { id: 'msg_1', timestamp: String(now), signature: '' }, body, now), false, 'missing signature');

// Legacy Polar secret: raw string is the key (the library wants it base64-encoded).
const legacy = `polar_whs_${randomBytes(12).toString('hex')}`;
const legacySigner = new Webhook(Buffer.from(legacy, 'utf-8').toString('base64'));
assert.equal(await verifyStandardWebhook(legacy, headersFor(legacySigner), body, now), true, 'valid legacy signature');

// Rotation: header may carry several signatures, only one needs to match.
const h = headersFor(signer);
assert.equal(await verifyStandardWebhook(secret, { ...h, signature: `v1,AAAA ${h.signature}` }, body, now), true, 'multiple signatures');

// Entitlement: what the Apps Script side recomputes.
const sub = '1234567890';
const exp = now + 3600;
const ent = await signEntitlement('shared-secret', sub, exp);
const expected = createHmac('sha256', 'shared-secret').update(`${sub}.${exp}`).digest('base64url');
assert.equal(ent, `${exp}.${expected}`, 'entitlement format');
console.log('convex/crypto.ts: all checks passed');
