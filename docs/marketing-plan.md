# Pluckr marketing plan

Written Oct 26, 2026. Companion to `docs/seo-plan.md` (search) and `docs/slides-rollout.md` (release).

All numbers marked "assumption" are guesses to be replaced with real data from the Marketplace dashboard, Search Console and Polar after launch. Nothing here has been measured yet. Reddit could not be searched while writing this, so community advice comes from the product and from what Google and competitor pages show.

## 1. What we are selling

**Pluckr** is a Google Docs and Slides sidebar that lists every image in a file, lets you tick the ones you want, rename them in bulk, convert them (AVIF, WebP, JPEG, PNG), crop and resize, edit alt text, export Markdown with an images folder (Docs), and shrink the file's own images in place. One-time $5, no subscription. Conversion runs in the browser.

**One sentence:** Get every image out of a Google Doc or Slides deck, named, converted and ready to publish, for $5 once.

### Why it can win

| Strength | Proof | Who cares |
|---|---|---|
| One price, no subscription | The closest competitor charges a subscription after a trial | Anyone who does this a few times a month |
| Images stay in the browser | No Pluckr image server; Boa Compress, a Slides compressor, says it sends images to a third-party service | Agencies, legal, health, schools |
| Convert and crop in the same step | Nobody else extracts and converts to WebP/AVIF inside Docs | Bloggers, SEO, web teams |
| Alt text in one place | Show, filter, edit, export as CSV/JSON | SEO, accessibility |
| Markdown with an images folder | Competitors are separate tools, some paid | Obsidian, static-site and docs-as-code people |
| Docs and Slides | Competitor covers both, the others cover one | Teachers, designers, marketers |

### What works against us

- New developer, new domain, no reviews yet. Trust has to be built.
- $5 is easy to buy and easy to undervalue. Some buyers read it as "toy".
- No account system means no email list unless we add one (see section 6).
- The Marketplace is the main discovery channel and it is still in review.

## 2. Who to go after first

Pick one beachhead. Everything else follows from word of mouth and search.

1. **Content and SEO people who write in Docs and publish elsewhere** (bloggers, content agencies, in-house marketers). They feel the pain weekly: images lost on paste, generic names, huge PNGs, missing alt text. They pay for tools and read how-to content. **This is the beachhead.**
2. **Accessibility and compliance owners.** Alt text export and a "No alt text" filter is a clear job. Smaller audience, strong need.
3. **Teachers and designers with Slides decks.** Large audience. Weak buying habit for a $5 tool, so reach them through the Marketplace and through "how to" content, not outreach.
4. **Developers and note-takers (Markdown, Obsidian, static sites).** Small, vocal, good for early reviews and Show HN-style attention.

## 3. Positioning and message

Lead with the job, not the feature list.

- **Headline for 1 and 2:** "Pluck every image out of a Google Doc. Named, converted, alt text kept."
- **Second line:** "One price. Nothing leaves your browser."
- **Objection answers (use on the site and in replies):**
  - "I can use Download as web page." Yes, and you get image1.png, image2.png, no preview, no conversion. Link the honest guide.
  - "Why pay?" $5 once, no trial clock. Refund within 14 days.
  - "Is it safe?" Show the permissions, the 300 px sidebar screenshots, the privacy page. Say plainly that Pluckr edits a file only when you press Save or confirm Optimize.
- **Tone:** specific and plain. Real numbers only: the demo PNG that went from 2.5 MB to 98 KB is one example, labelled as an example.
- **Do not say:** "best", "#1", "AI-powered", anything about speed we have not measured, or that it is on the Marketplace before it is live.

## 4. Pricing and packaging

- **Keep $5 until there are reviews.** Changing price during review is risky and adds noise.
- **After 50 to 100 sales**, test a **team or agency pack** (for example 5 seats). Reasons: one buyer, several editors; agencies are the best fit for the beachhead; it lifts the average order. Polar supports products and discount codes. Do not build accounts for it: sell a code that grants N licences.
- **Fees matter at this price.** Check Polar's current fee. If it has a fixed per-order part, a $5 sale keeps noticeably less than $5, and refunds cost more. Work out net revenue per sale before setting targets.
- **Launch codes** (for example 50% for the first 100) are fine for a launch day but must be real and time-limited. No fake urgency.

## 5. Channels, in order

### 5.1 Google Workspace Marketplace listing (primary)

This is where most installs will come from.

- Get approved, then update to version 2 (screenshots and copy are ready in `brand/marketplace/`).
- Add a short **demo video** to the listing (60 to 90 seconds: Doc with six images, tick, bulk rename, WebP 16:9, download; then Slides).
- **Reviews:** ask each early buyer, once, after they have used it. Put a one-line ask in the post-install tip and in the purchase success flow. No incentives for reviews (against Marketplace policy).
- Keep the first line of the short description keyword-led ("Preview, rename, convert and download every image...").
- Watch the Marketplace analytics tab weekly (views, installs, uninstall rate).

### 5.2 Search (secondary, slow)

Follow `docs/seo-plan.md`. Additions now that features exist:

| New page | Targets |
|---|---|
| `/export-google-docs-to-markdown-with-images` | Obsidian, static sites, docs-as-code |
| `/export-google-docs-alt-text` | SEO, accessibility |
| `/extract-images-from-google-slides` | Slides audience |
| `/guides/google-docs-to-wordpress-images` | Content teams (the beachhead) |
| `/pluckr-vs-extract-and-download` | Comparison, buying intent. Be fair and factual |

Write each as a real answer first. Request indexing after publishing. Expect months, not weeks, for a new domain.

### 5.3 Communities (fast feedback, uneven results)

Only post where it is useful and allowed. Read each community's rules first. Say you made it.

- **Reddit:** r/googledocs, r/GoogleWorkspace, r/SEO, r/bigseo, r/Wordpress, r/ObsidianMD, r/blogging. Best form: answer an existing question ("how do I download all images from a Doc?") with the manual method first and Pluckr as the fast way. One "I built this" post per community, not more.
- **Indie Hackers and Hacker News (Show HN):** one honest post each, on the day of the version 2 release, with the privacy angle and the one-time price. Be ready to answer comments for a few hours.
- **Product Hunt:** worth one launch for the badge and directory links, but not a main source of buyers for a $5 utility. Launch on version 2 so there is more to show.
- **X and LinkedIn:** short clips of the before and after (2.5 MB to 98 KB; "image1.png" to `pluckr-test-01.png`). Link to the matching landing page, not the homepage.

### 5.4 Outreach (small, high value)

- **Authors of how-to posts** that already rank for these searches (for example the Apps Script guide on Digital Inspiration). A short, polite note: "there is now a one-time-fee add-on that does X; here is a free licence if you want to try it". No pressure to link.
- **WordPress and content-ops newsletters and agencies** that publish Docs-to-CMS workflows.
- **Accessibility consultants** for the alt text features.
- **Google Workspace tips creators** (YouTube, newsletters). Offer a free licence and a demo Doc.
- Track every contact in a simple sheet: name, date, ask, result. Cap at 10 messages a week and personalise each.

### 5.5 Directories (one afternoon)

AlternativeTo (as an alternative to Extract and Download), SaaSHub, Uneed, Indie Hackers product page, G2/Capterra later when there are reviews. Identical name, URL and one-line description everywhere.

### 5.6 Paid ads (not yet)

At $5 a sale, paid search rarely pays back: a typical cost per click for software keywords would eat the margin. Revisit only after a team pack exists and the conversion rate is known. A small test ($150 to $300, exact-match keywords like "extract images from google docs") is fine for learning conversion, not for scaling.

## 6. Owned audience and analytics

- **Right now there is no email list and no analytics** by design. That is a selling point, so keep it simple.
- **Before sending any marketing email** to buyers, update the privacy policy (it says the email is used only for licence checks and purchase support) and add a clear opt-in at checkout. Until then, use only transactional emails.
- **Measurement without tracking people:**
  - Marketplace analytics: views, installs, uninstalls.
  - Search Console: queries, pages, indexing.
  - Polar: orders, refunds, the discount code or `ref` each order used.
  - UTM-style `?ref=` links on every post and outreach message, counted from Polar orders. No cookies needed.
- If a privacy-friendly analytics tool is added to the site later, update the privacy policy first.

## 7. Launch plan

| Phase | When | Work |
|---|---|---|
| 0. Prepare | Now, during review | Demo video (60 to 90 s). Three GIFs: tick and convert; bulk rename; alt text edit. Press kit page (logo, screenshots, one-paragraph description). Draft the Show HN, Indie Hackers and Product Hunt posts. Make the 5 new SEO pages. |
| 1. Approval | Day the listing goes live | Announce to anyone who has asked. Post the "alt text and Markdown for Docs" angle. Submit to directories. Start the review ask. Request indexing for the new pages. |
| 2. Release 2 | When version 2 (Slides, alt text, Markdown, optimize) is approved | The main public launch: Show HN, Product Hunt, Indie Hackers, communities, outreach batch 1. Deploy the updated site. |
| 3. Grow | Weeks 3 to 12 | One new page and one outreach batch a week. Answer questions in communities. Collect reviews and testimonials. Decide on the team pack. |

Two launch moments (approval, then version 2) give two chances at attention. Do not spend the best one on the first.

## 8. Twelve-week calendar

| Weeks | Focus |
|---|---|
| 1 to 2 | Demo video, GIFs, press kit, three new pages (Markdown, alt text, Slides). Draft posts. |
| 3 to 4 | Listing approved: announce, directories, outreach batch 1 (10 messages). WordPress workflow page. |
| 5 to 6 | Version 2 release: Show HN, Product Hunt, Indie Hackers, communities. Comparison page. |
| 7 to 8 | Review ask to first buyers. Fix whatever the first 20 users report. Outreach batch 2. |
| 9 to 10 | Read Search Console: rewrite titles for pages stuck at positions 8 to 20. Publish two more guides for the best-converting topic. |
| 11 to 12 | Decide: team pack, small ad test, or more content. Update this plan with real numbers. |

## 9. Targets (assumptions to replace)

These are directional. Replace them after the first four weeks of real data.

| Metric | Month 1 | Month 3 |
|---|---|---|
| Marketplace installs | 50 to 150 | 300 to 800 |
| Paid conversions (install to purchase) | 10 to 20% | 10 to 20% |
| Reviews on the listing | 5 | 20 |
| Indexed site pages | 10 | 15 |
| Revenue (gross) | $50 to $150 | $300 to $800 |

Success for the first 90 days is not revenue. It is: approved listing, 20 reviews, a clear answer to "which audience actually buys", and one repeatable channel.

## 10. Risks and answers

| Risk | Answer |
|---|---|
| Review takes longer or asks for changes | Keep all other work independent of it. Do not deploy the version 2 site early. |
| People install but do not buy | Make the unlock screen clearer; show what the $5 covers before sign-in; a short free preview (for example convert one image) is an option to test, not a promise. |
| Refunds rise | Read the reasons. Most likely confusion about Slides or floating images: say so on the listing. |
| A bigger tool copies the idea | Stay specific: price, privacy and the Docs-to-CMS workflow. |
| Overclaiming | Use real numbers only; label examples as examples; keep "Not supported yet" on the listing. |
| Policy trouble from promotion | Disclose you are the maker. No review incentives. No unsolicited bulk email. |

## 11. First 14 days

1. Record the 60 to 90 second demo and cut three GIFs.
2. Write the three new SEO pages (Markdown, alt text, Slides) with the build script.
3. Set up the outreach sheet and write 10 personalised messages.
4. Draft the three launch posts (Show HN, Indie Hackers, Product Hunt) and keep them unpublished.
5. Create a press kit page with logos and the five screenshots.
6. Check Polar's fees and write net revenue per sale on the first line of the tracker.
7. Update the privacy policy wording for a future email opt-in (do not send marketing email yet).
8. Wait for the review. Do not deploy the version 2 site, change the listing, or alter scopes until it is approved.
