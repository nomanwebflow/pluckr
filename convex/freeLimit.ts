// The free-plan counting rule, kept free of database code so it can be tested on its own.

/** How many distinct images a free account may use in total. Mirrors FREE_IMAGE_LIMIT in the add-on. */
export const FREE_IMAGE_LIMIT = 50;

/**
 * Add `requested` image hashes to the ones an account has already used. Used images stay used and cost nothing again.
 * New ones are taken in the order given until the limit; the rest are `rejected`. Duplicates in one request count once.
 */
export function claimHashes(used: readonly string[], requested: readonly string[], limit = FREE_IMAGE_LIMIT) {
  const claimed = [...used];
  const have = new Set(claimed);
  const rejected: string[] = [];
  for (const hash of requested) {
    if (have.has(hash)) continue;
    if (claimed.length >= limit) {
      if (!rejected.includes(hash)) rejected.push(hash);
      continue;
    }
    claimed.push(hash);
    have.add(hash);
  }
  return { claimed, rejected };
}
