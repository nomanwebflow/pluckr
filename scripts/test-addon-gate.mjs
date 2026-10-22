// Runs the real apps-script/Code.gs gate against entitlements signed by convex/crypto.ts.
// Run: node --experimental-strip-types --no-warnings scripts/test-addon-gate.mjs
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { signEntitlement } from '../convex/crypto.ts';

const jwtFor = (claims) => `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;

function loadGate({ secret, token }) {
  const sandbox = {
    Date,
    Logger: { log() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => (key === 'ENTITLEMENT_SECRET' ? secret ?? null : null) }) },
    ScriptApp: { getIdentityToken: () => token ?? null },
    Utilities: {
      // Apps Script returns signed bytes, and web-safe base64 keeps '=' padding.
      computeHmacSha256Signature: (text, key) => [...createHmac('sha256', key).update(text).digest()].map((b) => (b > 127 ? b - 256 : b)),
      base64EncodeWebSafe: (bytes) => Buffer.from(bytes.map((b) => b & 255)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
      base64DecodeWebSafe: (text) => [...Buffer.from(text.replace(/-/g, '+').replace(/_/g, '/'), 'base64')].map((b) => (b > 127 ? b - 256 : b)),
      newBlob: (bytes) => ({ getDataAsString: () => Buffer.from(bytes.map((b) => b & 255)).toString('utf8') }),
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync('apps-script/Code.gs', 'utf8'), sandbox);
  return sandbox;
}

const now = Math.floor(Date.now() / 1000);
const sub = '109876543210987654321';
const token = jwtFor({ sub, aud: 'client-id', iss: 'https://accounts.google.com' });
const allowed = (gate, entitlement) => { try { gate.requireEntitlement_(entitlement); return true; } catch (e) { assert.match(e.message, /LICENCE_REQUIRED/); return false; } };

// No secret configured: the gate fails closed.
assert.throws(() => loadGate({ secret: undefined, token }).requireEntitlement_(''), /GATE_UNCONFIGURED/, 'no secret => closed');

const gate = loadGate({ secret: 'shared-secret', token });
const good = await signEntitlement('shared-secret', sub, now + 3600);
assert.equal(allowed(gate, good), true, 'valid entitlement from Convex');
assert.equal(allowed(gate, ''), false, 'missing entitlement');
assert.equal(allowed(gate, 'garbage'), false, 'garbage entitlement');
assert.equal(allowed(gate, await signEntitlement('shared-secret', sub, now - 10)), false, 'expired');
assert.equal(allowed(gate, await signEntitlement('other-secret', sub, now + 3600)), false, 'wrong secret');
assert.equal(allowed(gate, await signEntitlement('shared-secret', 'someone-else', now + 3600)), false, 'entitlement of another account');
assert.equal(allowed(gate, good.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A'))), false, 'tampered signature');
assert.equal(allowed(loadGate({ secret: 'shared-secret', token: null }), good), false, 'no identity token (scope not granted)');

// The diagnostic logs claims, not the token.
const logged = [];
const diag = loadGate({ secret: undefined, token });
diag.Logger.log = (line) => logged.push(line);
diag.logIdentityTokenClaims();
assert.deepEqual(JSON.parse(logged[0]), { iss: 'https://accounts.google.com', aud: 'client-id', emailInToken: false });
console.log('Code.gs entitlement gate: all checks passed');
