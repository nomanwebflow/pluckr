# Pluckr website rebuild: plan

Written Oct 31, 2026. Replaces the homepage and shared layout. Companion to `docs/seo-plan.md` (keyword map, still valid) and `docs/marketing-plan.md` (positioning, still valid).

## 1. What is wrong with the current site (docpluckr.com)

| Problem | Evidence | Fix |
|---|---|---|
| Hero wastes the first screen | Huge headline, tiny gray copy far left, button far right, dead black gap between. Nothing says what Pluckr is until you scroll | Hero is one composition: headline, one button, the live sidebar visible on the same screen |
| No navigation | No nav bar. Visitor cannot reach Pricing, FAQ, Guides or Slides without scrolling | A real nav (section 4) |
| Same weight everywhere | Every section is a huge H2 on flat black. Nothing leads the eye, nothing groups | Bento sections on soft surfaces, clear hierarchy |
| Sidebar screenshots are tiny | Six 300px shots in a strip, text unreadable, cut off at the right edge | Interactive workbench plus three large crops |
| Four homepage drafts, one live | `index.html`, `index-v3.html`, `home-v4.html`, `homepage/index.html` | One source of truth (section 7) |
| Webflow baggage | 1 MB `hero-flip.html`, template CSS/JS, `styleguide`, `example-components` | Static HTML, one CSS file, no framework |
| FAQ has 12 questions in one accordion | Hides the answers search engines and buyers want | Split: 5 on home, rest on `/faq` |
| Site does not look like the product | Product is a calm sidebar with hairlines and PP Neue Montreal. Site is a different dark template | Site speaks the sidebar's language (section 3) |

## 2. Direction from your references

Taken from the four references: light page, one white rounded container floating on a soft tinted backdrop, a contained glass-ish nav bar, black primary buttons, bento cards with real populated UI inside, a quiet row of real marks, big calm type.

Taken from the sidebar (`src/styles.css`): PP Neue Montreal Medium only, 12px uppercase labels, 12/16px radii, hairline edges at low opacity, panel tone one step off the page, fine noise texture, blue `#0062fb` for the single primary action, dark and light themes that mirror each other.

Kept out on purpose (your design law): purple or blue-purple gradients, the glowing gradient pricing card from reference 1, icon-in-tile feature cards, eyebrow pills, fill-plus-ghost button pair, three-tier pricing, floating bobbing cards, grid backgrounds, cream or default UI-kit gray.

## 3. Visual system

- **World:** a calm workbench. The page is a desk, the sidebar is the tool on it. Everything else stays quiet so the product is the signature.
- **Signature artifact:** the real sidebar, working in the browser. `homepage/index.html` already has a live workbench; promote it to the hero. Populated with the sample doc (West Coast Road Trip, three photos, real alt text). Clipped at the bottom edge of the hero container so depth reads.
- **Type:** PP Neue Montreal Medium for everything (already licensed, already the product's voice). One face, hierarchy by size and tone, not by a second font. Headlines max two lines. Labels in sentence case, not tracked caps, so the site does not copy the sidebar's uppercase costume.
- **Color:** light is the default, dark mirrors it (same switch logic as the sidebar, `data-theme`, follows the system until chosen). Page backdrop is a pale tint pulled from the logo blue (about `#EDF1FA`), containers white, ink `#0A0A0A`. Primary buttons are ink black. Blue appears only inside the product shots and on links in body text. Confirm the exact backdrop tone on screen before locking; it must not drift to slop gray or cream.
- **Edges:** self-colored 1px edges at low opacity and a tonal step between surfaces. No blurry drop shadows. If any lift is needed, one tight low-offset shadow.
- **Container:** the page is one white rounded container (radius 24) with margin on all sides on desktop, full bleed on phones. Sections inside it separated by space and tone, not rules.
- **Nav:** a contained bar floating at the top of the container: logo left, four links center, one black button right. Slides in on load (animate position, never opacity), sticky on scroll. No dot or underline for the active item: active link is the darker weight of ink.
- **Motion (authored, nothing hidden):** the workbench is interactive; converted-size bars fill on scroll into view (content visible by default, only the bar length animates); logo row drifts slowly; theme switch is a plain two-state text control, not a sun-moon pill. All gated by `prefers-reduced-motion`.
- **Logos and icons:** real marks only. Google Docs and Slides product icons (allowed as nominative use next to "for"; add the trademark line in the footer), file-format names set as text. No icon packs, no tiles behind icons.

## 4. Information architecture

### Nav
`Docs` · `Slides` · `Pricing` · `Guides` · [Add to Google Docs]

(`Docs` and `Slides` anchor to home sections for now; they become their own pages when built.)

### URLs

| URL | Status | Target |
|---|---|---|
| `/` | rebuild | Extract images from Google Docs and Slides (cluster A, F) |
| `/extract-images-from-google-docs` | keep, restyle | Cluster A |
| `/convert-google-docs-images-to-webp` | keep, restyle | Cluster B |
| `/guides/download-all-images-from-google-docs` | keep, restyle | Cluster C |
| `/extract-images-from-google-slides` | new, P1 | Slides audience |
| `/export-google-docs-to-markdown-with-images` | new, P2 | Obsidian, static sites |
| `/export-google-docs-alt-text` | new, P2 | SEO and accessibility |
| `/pricing` | new | Short page, same Product schema as home, branded query |
| `/faq` | new | All 12 questions, FAQPage schema |
| `/privacy`, `/terms` | keep, restyle | Required for OAuth |
| `/guides/google-docs-to-wordpress-images`, `/pluckr-vs-extract-and-download` | later | Per `seo-plan.md` |

Do not change or drop any live URL. Add 301s only if a URL moves (none planned).

## 5. Homepage: sections and copy

One job per section. No kicker-over-headline pattern; sections open with the headline or the artifact.

### 5.1 Hero (owns the first screen, split by action, not the stock stack)

Layout: nav bar on top. Left third: headline, one sentence, one button, one trust line. Right two thirds: the live sidebar workbench beside a Doc, clipped at the container's bottom edge. Below the fold line inside the same viewport: a quiet row "Works in" with the Docs and Slides marks.

- **H1:** Get every image out of a Google Doc.
- **Sub:** Pluckr lists the images in your Doc or Slides deck. Pick, rename, convert and download them in one go.
- **Button:** Add to Google Docs
- **Trust line:** $5 once. Your images never leave your browser.

### 5.2 Before and after (bento, two large cards)

- **Headline:** Stop opening image7.png to find out what it is
- **Card A, "The built-in way":** File, Download, Web page. An HTML file you did not want, a folder of image1.png to image7.png, no preview, no alt text.
- **Card B, "With Pluckr":** west-coast-road-trip-01.webp, 83 KB. Named by one pattern, converted to WebP, cropped to 16:9. Plus images-metadata.csv and content.md.
- Small note: sizes measured on our three sample photos.
- Link: `How to download all images from a Google Doc, four ways` to the guide.

### 5.3 Six jobs, bento grid (not three icon cards)

Asymmetric grid of six cards, each with a real cropped screenshot of that state of the sidebar, a 3-word title and one line.

| Card | Line |
|---|---|
| Pick | Tick the images you need, or filter to the ones missing alt text. |
| Rename | One pattern for every file name, with a preview before you apply it. |
| Convert | WebP, AVIF, JPEG or PNG. Set quality, aspect ratio and maximum width. |
| Alt text | See which images have none. Write it in the sidebar, export it as CSV or JSON. |
| Shrink | Replace the heavy pictures inside the file with smaller copies. Size on the page stays the same. |
| Slides | The same sidebar in a deck: every picture on every slide. |

### 5.4 Convert (data, one wide container)

- **Headline:** 796 KB becomes 83 KB
- **Body:** Docs images are often PNGs. WebP and AVIF keep the look at a fraction of the size, so pages load faster and uploads fit.
- Bars: PNG 796 KB, JPEG 104 KB, WebP 83 KB (bars fill on scroll).
- Footnote: One of our sample photos, cropped to 16:9 (1000 x 562 px), quality 80, measured with cwebp and libjpeg. Your results depend on the image and the settings.
- Link: Convert Google Docs images to WebP or AVIF.

### 5.5 Markdown (split container)

- **Headline:** Export a Doc as Markdown, images included
- **Body:** Tick one box. The download holds content.md, an images folder and the alt text. Ready for a blog, a static site or Obsidian.
- Visual: the Doc on the left, the file tree and content.md on the right, real content.

### 5.6 Private by design (one wide statement card, no stat tiles)

- **Headline:** Nothing leaves your browser
- **Body:** Conversion runs on your computer. Pluckr asks only for the current file and its sidebar. It changes your file only when you press Save or confirm Shrink, and it tells you to make a copy first.
- Link: Privacy policy.

### 5.7 Pricing (one card, not three tiers)

- **Headline:** $5, once
- **Lines:** Google Docs and Google Slides, one purchase. No subscription. Refunds within 14 days.
- **Button:** Add to Google Docs

### 5.8 FAQ (5 questions, then link to `/faq`)

Keep these on the page and in FAQPage schema: How do I download all images from a Google Doc? Does Pluckr work with Google Slides? Can I convert Google Docs images to WebP or AVIF? Are my images uploaded anywhere? How much does Pluckr cost? Is there a subscription?
The other six move to `/faq`.

### 5.9 Closing and footer

Closing: one line, one button, no banner slab. **Text:** Leave image1.png behind. [Add to Google Docs]

Footer on the same grid as the content (not flung to the edges): three columns (Product, Guides, Legal), support email, the Google trademark line, theme switch. Oversized PLUCKR wordmark anchored to the bottom edge only if it can be composed properly (centered, whole, top clearance); otherwise omit.

## 6. SEO spec

### Per page
- One H1 with the target phrase. Titles under 60 characters, descriptions under 155. Canonical, OG and Twitter image (1200x630, new, shows the sidebar), `lang`, viewport.
- Real HTML text for all copy (no text baked into images). Alt text on every image describing the content, not the keyword.
- Hero image is not the LCP; the H1 is. Workbench JS loads after first paint. `loading="lazy"` on everything below the fold. Convert the site's photos to WebP/AVIF with Pluckr itself.
- Preload the font file, `font-display: swap`. Target LCP under 2.0s, CLS under 0.05.
- Internal links: every page links to the homepage, two siblings and the install button. Footer links to every public page.

### Titles and descriptions

| Page | Title | Description |
|---|---|---|
| `/` | Extract and Convert Images from Google Docs | Pull every image out of a Google Doc or Slides deck. Rename, convert to WebP or AVIF, keep alt text. $5 once. Images stay in your browser. |
| `/extract-images-from-google-slides` | Extract Images from Google Slides | List every picture on every slide, tick the ones you want, rename and download them. One sidebar, $5 once. |
| `/export-google-docs-to-markdown-with-images` | Export Google Docs to Markdown with Images | One download with content.md, an images folder and alt text. For blogs, static sites and Obsidian. |
| `/export-google-docs-alt-text` | Export Alt Text from Google Docs | See which Doc images have no alt text, write it in a sidebar, export CSV or JSON. |
| `/pricing` | Pluckr Pricing: $5 Once | One purchase for Google Docs and Slides. No subscription. 14-day refunds. |
| `/faq` | Pluckr FAQ | Answers on privacy, formats, Slides support, pricing and what Pluckr changes in your file. |

(Existing titles for the three live pages stay unless Search Console shows a reason to change.)

### Structured data
- Home: `SoftwareApplication` (`BrowserApplication`, offers 5 USD, `featureList`), plus `FAQPage` matching the 5 visible questions. `Organization` with name, URL, logo.
- `/faq`: `FAQPage` for all 12. Guides: `HowTo` or `Article` where the page really is one. `BreadcrumbList` on every inner page.
- No `aggregateRating` until real reviews exist.

### Technical
- `sitemap.xml` regenerated by the build script with all public URLs and real `lastmod`. `robots.txt` with Sitemap line.
- `www` to apex 301 as a Cloudflare Redirect Rule (still open from `seo-plan.md`).
- Search Console and Bing verification by DNS TXT (still open).
- Real 404 status on `404.html`.

## 7. Build approach

- Static HTML + one `site.css` + one small `site.js`. No Webflow CSS or JS. Pages generated from a shared template by a Node script (`scripts/build-site.mjs`, extending today's `build-seo-pages.mjs`) so nav, footer and head tags exist in one place.
- Workbench: lift from `homepage/index.html`, strip its extras, restyle to the new system.
- Consolidate: new source folder `site/`; `scripts/deploy-site.sh` points there. Delete after launch: `pluckr.webflow/` (index-v3, home-v4, styleguide, example-components, search, 401, `hero-flip.html` at 1 MB), `homepage/` once merged.
- Images: crop the six sidebar states from the existing `brand/marketplace/screenshots-r2/hires/` and `homepage/assets/sidebar-*.webp`. New OG image.
- Checks before ship: Lighthouse mobile 95+, keyboard pass on nav, theme switch and workbench, real-click test of every control, contrast check on both themes, zoom into every clipped edge (workbench bottom, container corners), 375px and 1440px screenshots, no em dashes in copy.

## 8. Phases

| Phase | Output |
|---|---|
| 1 | `site.css` tokens, template script, nav and footer, home hero with the workbench. Review on screen. |
| 2 | Rest of the homepage sections, theme switch, OG image, schema. |
| 3 | Restyle the three live SEO pages, privacy, terms, 404 on the new template. |
| 4 | New pages: Slides, Markdown, alt text, pricing, FAQ. Sitemap, deploy. |

## 9. Open decisions

1. Light default as in your references, or dark default to match the sidebar? (Plan assumes light.)
2. Is the Marketplace listing live? The button copy and link depend on it; until then it should say what actually happens.
3. Real Google Docs and Slides marks in the hero row: OK to use, or keep to text?
