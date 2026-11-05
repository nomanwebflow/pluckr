---
name: pluckr-seo-writer
description: >-
  Researches, structures, and writes production-ready, typed SEO guides and comparison articles for Pluckr
  in Simplified Technical English (ASD-STE100 derivative). Use when creating a new SEO article, guide,
  or comparison page for docpluckr.com.
---

# Pluckr SEO Content Writer

This skill guides the creation of high-ranking, highly readable guides and comparison pages for Pluckr (`docpluckr.com`).

All articles in Pluckr are strictly typed TypeScript files stored in:
- Guides: `site/src/content/articles/guides/<slug>.ts`
- Comparisons: `site/src/content/articles/compare/<slug>.ts`

---

## 1. Article Specifications & Required Structure

Every article must export a single `article: Article` object matching `site/src/content/articles/types.ts`:

```ts
import type { Article } from "../types";

export const article: Article = {
  kind: "guide", // or "compare"
  slug: "your-keyword-slug",
  title: "Target Keyword Title Under 60 Chars",
  description: "Accurate, compelling summary under 155 characters for search engines.",
  updated: "YYYY-MM-DD",
  readingMinutes: 4,
  summary: [
    "Short version: Direct answer in the first 2 sentences. A reader gets the core answer immediately.",
    "Second paragraph explaining the key nuance or fastest method with Pluckr."
  ],
  sections: [
    {
      id: "section-slug",
      title: "How do I do X?", // Written as a natural user question
      blocks: [
        { type: "p", html: "Direct explanation." },
        { type: "ol", items: ["Step 1", "Step 2", "Step 3"] },
        { type: "callout", title: "Key note", html: "Important information." }
      ]
    }
  ],
  faq: [
    {
      q: "Specific question people search for?",
      a: "Stand-alone, 1-2 sentence direct factual answer."
    }
  ],
  related: ["download-all-images-from-google-docs"]
};
```

---

## 2. Editorial Rules (Simplified Technical English)

The Pluckr site uses Simplified Technical English (ASD-STE100 derivative). This guarantees high human readability (7th grade level) and optimizes passages for AI answer engines (Google AI Overviews, Perplexity, ChatGPT).

### Sentence & Paragraph Limits
- **Procedural steps (`ol`)**: Max 20 words per sentence.
- **Descriptive prose (`p`)**: Max 25 words per sentence.
- **Paragraph length**: Max 6 sentences per paragraph.
- **Topic**: Exactly one main idea per paragraph.

### Banned Stylistic Elements
- **NO Em dashes or en dashes (`—`, `–`)**: Never use dashes in copy. Break thoughts into separate sentences.
- **NO Semicolons (`;`)**: Use periods.
- **NO Contractions**: Write `do not` instead of `don't`, `it is` instead of `it's`, `cannot` instead of `can't`.
- **NO Fluff Modals**: Do not use `should`, `would`, `could`, `may`, or `might`. Use only **can** (possibility), **will** (future), or **must** (rule/necessity).
- **NO AI Clichés**: Avoid words like "crucial", "delve", "seamlessly", "revolutionize", "utilize", "prior to".

### Price Token Rule
- **NEVER hardcode dollar prices** (like `$5` or `$12`) in body copy.
- **Always use `{{price}}`**. The site automatically injects the single source of truth price from `site/src/content/site.ts`.

### Approved Block Types
Only use blocks defined in `site/src/content/articles/types.ts`:
1. `{ type: "p", html: "..." }` (Allowed tags: `<strong>`, `<a>`, `<code>`)
2. `{ type: "h3", text: "..." }`
3. `{ type: "ul", items: ["...", "..."] }`
4. `{ type: "ol", items: ["...", "..."] }`
5. `{ type: "callout", title: "...", html: "..." }`
6. `{ type: "table", columns: [...], rows: [...], highlight: number }`
7. `{ type: "image", src: "/guides/name.webp", alt: "...", width: 1200, height: 675, caption: "..." }`
8. `{ type: "code", code: "..." }`

---

## 3. Step-by-Step Writing Workflow

1. **Pick the Keyword & Intent**: Determine if it belongs in `guides/` (how-to intent) or `compare/` (comparison intent).
2. **Review Existing References**: Inspect `site/src/content/articles/guides/download-all-images-from-google-docs.ts` or `site/src/content/articles/compare/pluckr-vs-google-docs-built-in-downloads.ts`.
3. **Draft the `.ts` file**: Create the new file in `site/src/content/articles/<kind>/<slug>.ts`.
4. **Answer Engine Optimization (The Quote Test)**:
   - Ensure the `summary` card answers the title immediately.
   - Every paragraph must make sense alone if extracted by a search engine (repeat nouns rather than ambiguous pronouns like "it").
5. **Add FAQs**: Add 3 to 6 genuine search questions with concise, standalone answers.
6. **Register the Article**: Import and add the article to `articles` in `site/src/content/articles/index.ts`.
7. **Run QA**: Hand off to the QA skill (`pluckr-seo-qa`) or execute the verification script.
