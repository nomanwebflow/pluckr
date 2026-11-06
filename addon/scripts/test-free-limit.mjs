// The free-plan counting rule (convex/freeLimit.ts). Run: node --experimental-strip-types --no-warnings addon/scripts/test-free-limit.mjs
import assert from 'node:assert/strict';
import { FREE_IMAGE_LIMIT, claimHashes } from '../../convex/freeLimit.ts';

const h = (n) => String(n).padStart(43, 'x');
const range = (from, to) => Array.from({ length: to - from }, (_, i) => h(from + i));

assert.equal(FREE_IMAGE_LIMIT, 50);
assert.deepEqual(claimHashes([], []), { claimed: [], rejected: [] }, 'asking for nothing changes nothing');
assert.deepEqual(claimHashes([], range(0, 3)), { claimed: range(0, 3), rejected: [] }, 'new images are claimed');
assert.deepEqual(claimHashes(range(0, 3), range(0, 3)), { claimed: range(0, 3), rejected: [] }, 'using an image again costs nothing');
assert.deepEqual(claimHashes(range(0, 3), range(2, 5)), { claimed: range(0, 5), rejected: [] }, 'only the new ones are added');
assert.deepEqual(claimHashes([], [h(1), h(1), h(1)]).claimed, [h(1)], 'duplicates in one request count once');

// The limit is 50 in total, ever, across every file.
const full = claimHashes(range(0, 48), range(48, 53));
assert.equal(full.claimed.length, 50, 'never more than 50');
assert.deepEqual(full.claimed.slice(48), [h(48), h(49)], 'new images are taken in the order given');
assert.deepEqual(full.rejected, [h(50), h(51), h(52)], 'the rest are rejected');

const spent = range(0, 50);
assert.deepEqual(claimHashes(spent, range(50, 55)), { claimed: spent, rejected: range(50, 55) }, 'at the limit nothing new fits');
assert.deepEqual(claimHashes(spent, [h(3), h(7)]), { claimed: spent, rejected: [] }, 'images already used stay usable at the limit');
assert.deepEqual(claimHashes(spent, [h(3), h(60), h(7)]).rejected, [h(60)], 'used images are never rejected');
assert.deepEqual(claimHashes(spent, [h(60), h(60)]).rejected, [h(60)], 'a rejected image is listed once');
assert.equal(claimHashes(range(0, 10), range(0, 100), 12).claimed.length, 12, 'the limit is a parameter');

// Retrying the same request gives the same state.
const once = claimHashes([], range(0, 60));
const twice = claimHashes(once.claimed, range(0, 60));
assert.deepEqual(twice.claimed, once.claimed, 'a retry does not double count');
console.log('convex/freeLimit.ts: all checks passed');
