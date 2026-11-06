# How to add a guide or a comparison page

This folder holds every guide and comparison page on the site. Each page is one typed file. The site builds the page, the index card, the table of contents and the search data from that file.

## What you get

| Page type | Folder | URL | Use it for |
|---|---|---|---|
| Guide | `guides/` | `/guides/<slug>` | A task that people want to do, with steps. |
| Comparison | `compare/` | `/compare/<slug>` | A side-by-side look at Pluckr and other options. |

The index pages are `/guides` and `/compare`. Each page also shows a "Keep reading" row of related pages.

## Add a page in five steps

1. Copy a file that exists. Copy `guides/download-all-images-from-google-docs.ts` for a guide. Copy `compare/pluckr-vs-google-docs-built-in-downloads.ts` for a comparison.
2. Rename the file to the slug. The slug is the end of the URL. Use lowercase words with hyphens, for example `convert-google-docs-images-to-webp.ts`.
3. Change the content. The field list and the block list are below.
4. Add a card thumbnail illustration for the new `slug` in `src/components/article-illustration.tsx`.
5. Open `index.ts`. Import the new file and add it to the `articles` list.

```ts
import { article as convertToWebp } from "./guides/convert-google-docs-images-to-webp";

export const articles: readonly Article[] = [
  downloadAll,
  pluckrVsBuiltIn,
  convertToWebp, // new
];
```

The routes pick the new page up with no other change.

## Check your work

Run these commands in the `site` folder.

```bash
npx tsc --noEmit
npx eslint src
npm run dev
```

Open `http://localhost:3100/guides` or `/compare`. Make sure that the card shows, the page opens, and the table of contents links work. Run `npx next build` before you push.

## Fields

| Field | Required | What it does |
|---|---|---|
| `kind` | Yes | `"guide"` or `"compare"`. It must match the folder. |
| `slug` | Yes | The end of the URL. It must match the file name. |
| `title` | Yes | The page heading and the card title. |
| `description` | Yes | The search description and the card text. Write 1 or 2 sentences. |
| `updated` | Yes | The date of the last real change, as `2026-11-05`. |
| `readingMinutes` | Yes | The reading time, as a whole number. |
| `summary` | Yes | The "short version" card. It is a list of 1 to 3 short paragraphs. |
| `sections` | Yes | The body. Each section has an `id`, a `title` and a list of `blocks`. |
| `faq` | No | A list of `{ q, a }` pairs. It shows as an accordion and as search data. |
| `cover` | No | A picture for the cards, as `{ src, alt, width, height }`. |
| `related` | No | A list of other slugs for "Keep reading". |
| `draft` | No | `true` builds the page but tells search engines not to index it. |

The table of contents comes from the section titles. It shows when a page has more than 2 headings.

## Blocks

A section holds a list of blocks. Use the block that fits the content.

| Block | Use it for | Shape |
|---|---|---|
| `p` | A paragraph. | `{ type: "p", html: "..." }` |
| `h3` | A subheading inside a section. | `{ type: "h3", text: "..." }` |
| `ul` | A list of items with no order. | `{ type: "ul", items: ["...", "..."] }` |
| `ol` | Steps or a ranked list. | `{ type: "ol", items: ["...", "..."] }` |
| `callout` | One note that the reader must not miss. | `{ type: "callout", title: "...", html: "..." }` |
| `table` | A comparison. | `{ type: "table", columns, rows, highlight }` |
| `image` | A screenshot with a caption. | `{ type: "image", src, alt, width, height, caption }` |
| `code` | A code sample. | `{ type: "code", code: "..." }` |

### Text rules for `html` strings

- Use only `<strong>`, `<a>` and `<code>`.
- Write `&gt;` for the `>` sign, as in `File &gt; Download`.
- Add `target="_blank" rel="noopener"` to links that leave the site.
- Write `{{price}}` for the price. The site replaces it with the one price in `src/content/site.ts`. Never type the price by hand.

### Tables

The first column names the row. The other columns are the options. A cell can be:

- `true` for a tick.
- `false` for a dash.
- A short text, for example `"In the code"`.

Set `highlight` to the column number of Pluckr, which starts at 0. The first column of a comparison needs an empty header: `columns: ["", "Option A", "Pluckr"]`.

### Images and card illustrations

Use screenshots inside the article body (`{ type: "image", ... }`) to show real steps in the add-on:

1. Put the file in `public/guides/`. Use WebP.
2. Write the real `width` and `height`.
3. Write alt text that says what the picture shows. Do not start with "image of".
4. Write a caption that says why the picture matters.

For the card thumbnail on `/guides`, `/compare` and "Keep reading", do not use a screenshot. Add a dark-mode schematic illustration in `src/components/article-illustration.tsx` and match it to `article.slug`:

1. Use the site's dark surfaces (`bg-black`, `bg-[#0d0d0d]`, `border-white/10`) and the `/assets/hero-noise.webp` texture.
2. Show the core job of the page (for example, `doc.gdoc` -> `images.zip`, or `796 KB PNG` -> `83 KB WEBP`) with `font-mono` labels and `#0062fb` accents.
3. Map the new `slug` in `ArticleIllustration` so the card renders the schematic in its `8/5` frame.

### Links to other pages

- Link to pages on the new site with a path, for example `/guides/some-guide`.
- Some older pages, such as `/extract-images-from-google-docs`, exist only on the legacy site. A link to them can fail on the new site until the page moves.
- Do not link to a page that does not exist.

## Write for answer engines

Answer engines are tools such as Google AI Overviews, ChatGPT and Perplexity. They read a page, take the passage that answers a question, and show it to the reader. A page gets quoted when a short passage answers the question with no other context.

### Page rules

1. **Answer first.** The "short version" card must answer the question in the title, in 40 to 60 words. Every section must also open with a paragraph of 40 to 60 words that gives the answer before any list, table or detail.
2. **Use the question as the heading.** Write a section title the way a person asks the question, for example "How do I convert Docs images to WebP?" Method steps can use an instruction as the heading.
3. **Make each passage stand alone.** Repeat the noun. Write "Pluckr converts images to WebP", not "It converts them".
4. **Use the list that fits.** Use `ol` for steps. Use `ul` for options. Use a `table` for a comparison.
5. **Write facts, not claims.** Give a number with its unit. Say how you measured it and when. For example: "A 796 KB PNG became 83 KB as WebP at quality 80."
6. **Be fair.** In a comparison, say when the other option wins. Readers and answer engines both trust a fair page.
7. **Use only facts that you can check.** Do not write a claim about another product that you did not test or read in its own documents. Add a source link for each outside fact.
8. **Add a `faq`.** Write 3 to 6 real questions. Write each answer in 1 to 3 sentences that make sense alone. The page turns them into FAQ search data.
9. **Keep the date true.** Change `updated` only when the facts change.

### The quote test

Pick any paragraph on the page. Copy only that paragraph. If a stranger understands it and gets a true answer, the paragraph passes. If it needs the paragraph before it, rewrite it.

## Writing style: Simplified Technical English

Write in plain, short sentences. The rules below follow the Simplified Technical English style. They make text easy to read for people who do not read English well, and easy for machines to quote. This guide is a working approximation. It is not a certified copy of the ASD-STE100 standard.

### Step 1: Pick the text type

- **Procedural text** tells the reader what to do. Use it for steps. Write 20 words or fewer in each sentence.
- **Descriptive text** explains. Write 25 words or fewer in each sentence.

Write 6 sentences or fewer in each paragraph. Give each paragraph one topic.

### Step 2: Write the sentence

- Write one instruction in each sentence. Use the imperative: "Open the panel."
- Put a condition before its command: "If the file is large, choose WebP."
- Use the active voice. Use the passive only when the person who acts is not important.
- Do not drop words to save space. Write "Make sure that the file exists", not "Ensure file exists".
- Use only these verb forms: the infinitive, the imperative, the simple present, the simple past and the simple future.
- Do not use an -ing word as a verb.
- Use these modal verbs: **can** for what is possible, **will** for the future and **must** for a rule. Do not use should, would, could, may or might.
- Write the action as a verb. Write "compress the file", not "do the compression of the file".
- Do not use phrasal verbs. Write "install", not "set up".

### Step 3: Choose the word

- Use one word for one thing. Never swap in a synonym. If you call it "the sidebar" once, always call it "the sidebar".
- Keep product names and button names exactly as they appear. Examples are `Download originals` and `Extensions`.
- Write 3 words or fewer in a noun group. Break a long group with a preposition.
- Use American spelling. Write "license", "optimize" and "color".
- Do not use `e.g.`, `i.e.` or `etc.` Write "for example" and "that is". Write the full list.
- Replace words with the plain word:

| Do not use | Use |
|---|---|
| utilize, employ | use |
| commence, initiate | start |
| terminate | stop, end |
| ensure, verify, confirm | make sure that |
| perform, execute | do |
| obtain, acquire | get |
| sufficient | enough |
| approximately | about |
| prior to | before |
| require | need, must |
| modify, alter | change |
| retain | keep |
| indicate | show |
| via | with, through |
| in order to | to |
| due to | because of |

### Step 4: Check the punctuation

- Do not use a semicolon. Write two sentences.
- Do not use a contraction. Write "do not", not "don't".
- Use parentheses only for a reference, an abbreviation or an item number.
- Join words that work as one unit with a hyphen, for example "one-time purchase".

### Notes and warnings

- **NOTE** gives information. It never gives an instruction.
- **CAUTION** warns about a risk of damage.
- **WARNING** warns about a risk of injury.
- Start a caution or a warning with the command, then give the risk. Write "Make a copy of the Doc first. The Optimize step changes the images in the Doc."

### Before and after

| Before | After |
|---|---|
| You may want to utilize the Optimize feature in order to reduce the file size of images prior to publishing. | Use Optimize to make the images smaller. Do this before you publish the Doc. |
| The files, which have been downloaded as a ZIP, will need to be renamed. | Rename the files after you download the ZIP. |
| Pluckr is quite fast; it handles most Docs in seconds. | Pluckr lists the images of most Docs in seconds. |

### Self-check

Read the page once before you push. Look for each item.

1. A sentence that is longer than 20 words in a step, or 25 words in other text.
2. A paragraph of more than 6 sentences.
3. A semicolon or a contraction.
4. The words should, would, could, may or might.
5. An -ing word that acts as a verb.
6. Two names for one thing.
7. A word from the "Do not use" table.
8. A number with no unit, or a claim with no source.
9. A paragraph that fails the quote test.

## Before you publish

- [ ] `kind` and `slug` match the folder and the file name.
- [ ] The short version answers the question in the title.
- [ ] Every outside fact has a source link.
- [ ] The price shows as `{{price}}`.
- [ ] Every image has alt text, a caption and the real size.
- [ ] `src/components/article-illustration.tsx` has a card illustration for the `slug`.
- [ ] The page has a `faq` with 3 to 6 questions.
- [ ] The page passes the quote test and the self-check.
- [ ] `related` lists 1 or 2 other pages.
- [ ] `npx tsc --noEmit`, `npx eslint src` and `npx next build` pass.
- [ ] `draft` is removed or set to `false`.
