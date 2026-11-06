---
name: pluckr-seo-qa
description: >-
  Audits and verifies Pluckr SEO articles against Simplified Technical English rules, schema standards,
  and build health before deployment. Use when checking or approving a new or updated SEO article.
---

# Pluckr SEO Content QA & Gate

This skill verifies that any new or edited article under `site/src/content/articles/` satisfies all strict editorial, stylistic, and technical standards before it can be deployed to production.

---

## 1. Automated Verification Script

Run the automated verification script first to catch syntactic, lexical, and stylistic violations:

```bash
node .agents/skills/pluckr-seo-qa/scripts/verify-article.mjs <path-to-article.ts>
```

The script automatically validates:
- [x] All required metadata fields (`kind`, `slug`, `title`, `description`, `updated`, `readingMinutes`, `summary`, `sections`) are present.
- [x] No hardcoded prices (`$5`, `$12`); ensures `{{price}}` token is used.
- [x] Zero em/en dashes (`—`, `–`).
- [x] Zero semicolons in prose text.
- [x] Zero contractions (`don't`, `it's`, `can't`, etc.).
- [x] Zero forbidden modal verbs (`should`, `would`, `could`, `may`, `might`).
- [x] Forbidden words from ASD-STE100 (e.g. `utilize`, `commence`, `ensure`, `prior to`).
- [x] Sentence length: max 25 words in descriptive prose, max 20 words in steps.
- [x] Paragraph length: max 6 sentences per paragraph.

If the script outputs any errors, **do not proceed**. Return the exact line numbers and error details to the writer for correction.

---

## 2. Qualitative & Fact Check Checklist

After the automated script passes, verify the qualitative requirements:

1. **The Quote Test**:
   - Pick any paragraph at random. If quoted in isolation by Google AI Overviews or ChatGPT, does it provide a complete, clear, and accurate answer?
   - Does it avoid dangling pronouns ("It handles this...")?
2. **First-Screen Answer**:
   - Does the `summary` card answer the core user query within the first 2 sentences?
3. **Factual Accuracy**:
   - Pluckr extracts inline images from Google Docs and pictures from Google Slides.
   - It runs entirely in-browser (Apps Script + WebAssembly/HTML5 Canvas).
   - Conversions supported: WebP, AVIF, JPEG, PNG.
   - Known limitations: Floating images ("Wrap text" / "Break text") in Docs and slide background fills are not extractable via Apps Script API.
   - Does any comparison page link to legitimate external sources?
4. **CTAs & Links**:
   - External links must include `target="_blank" rel="noopener"`.
   - Internal links must point to valid live routes (e.g., `/`, `/privacy`, `/terms`, `/guides`, `/compare`).
5. **SEO Meta**:
   - Title must be under 60 characters and front-load target verbs/nouns.
   - Description must be under 155 characters.
6. **Card Thumbnail Illustration**:
   - Verify that `site/src/components/article-illustration.tsx` includes a tailored dark-mode schematic illustration for the article's `slug` (using `#000`/`#0d0d0d` surfaces, `font-mono` labels, and `#0062fb` accents), rather than displaying a raw screenshot on the card thumbnail.

---

## 3. Build & Compilation Verification

Ensure the changes do not break Next.js build or typing:

```bash
cd site
npx tsc --noEmit
npx eslint src
npm run build
```

Verify that all routes render and dynamic routes (`/guides/[slug]` or `/compare/[slug]`) compile successfully.

---

## 4. Deployment Approval

Only when both Section 1, Section 2, and Section 3 pass:
1. Update `site/public/sitemap.xml` with `<loc>https://docpluckr.com/<kind>/<slug></loc>`.
2. Run `./marketing/scripts/deploy-site.sh` to publish live to Cloudflare Pages.
3. Test the live page with `curl -sI https://docpluckr.com/<kind>/<slug> | head -n 5`.
