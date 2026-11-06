import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArticleIllustration } from "@/components/article-illustration";
import { ClosingCta } from "@/components/closing-cta";
import { Nav } from "@/components/nav";
import { Rich, prose } from "@/components/prose";
import { articles, sectionOf } from "@/content/articles";
import type { Article, ArticleBlock } from "@/content/articles/types";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

// Shared page frame: nav, grain background, the closing CTA. Used by the
// article pages and the index pages.
export function ArticleFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="relative flex flex-col items-center gap-16 px-6 pt-12 pb-24 text-white md:p-16 md:pb-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-[#0d0d0d]" />
          <div
            className="absolute inset-0 bg-top-left opacity-40"
            style={{
              backgroundImage: 'url("/assets/hero-noise.webp")',
              backgroundSize: "220px 220px",
              // Fade the grain out above the CTA so it does not end on a
              // hard line.
              maskImage:
                "linear-gradient(to bottom, #000 calc(100% - 200px), transparent)",
            }}
          />
        </div>
        {children}
      </main>
      <ClosingCta />
    </>
  );
}

// Shown for a moment while the route params resolve.
export function ArticleSkeleton() {
  return (
    <ArticleFrame>
      <div className="min-h-[60vh]" />
    </ArticleFrame>
  );
}

function Tick() {
  return (
    <>
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto"
      >
        <path d="M3.5 8.5 6.5 11.5 12.5 5" />
      </svg>
      <span className="sr-only">Yes</span>
    </>
  );
}

function Dash() {
  return (
    <>
      <span
        aria-hidden
        className="mx-auto block h-0.5 w-3 rounded-full bg-white/25"
      />
      <span className="sr-only">No</span>
    </>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Tick />;
  if (value === false) return <Dash />;
  return <Rich html={value} className="text-sm" />;
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className={prose}>
          <Rich html={block.html} />
        </p>
      );
    case "h3":
      return (
        <h3 className="font-display text-2xl leading-[normal] capitalize">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className={`${prose} flex list-disc flex-col gap-3 pl-7`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <Rich html={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol
          className={`${prose} flex list-decimal flex-col gap-3 pl-7 marker:text-white/60`}
        >
          {block.items.map((item, i) => (
            <li key={i}>
              <Rich html={item} />
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#0d0d0d] p-2">
          <h3 className="font-display p-2 text-lg leading-[normal] capitalize">
            {block.title}
          </h3>
          <div className="rounded-2xl border border-white/5 bg-black p-4">
            <p className="font-reading text-base leading-normal [&_a]:underline [&_a]:underline-offset-4">
              <Rich html={block.html} />
            </p>
          </div>
        </aside>
      );
    case "table":
      return (
        <div className="relative -mx-2 overflow-x-auto px-2">
          <table className="w-full min-w-[560px] border-separate border-spacing-y-1 text-left">
            <thead>
              <tr className="text-xs text-white/60">
                {block.columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-2 pb-1 font-normal ${i === 0 ? "text-left" : "text-center"} ${i === block.highlight ? "text-white" : ""}`}
                  >
                    {col || <span className="sr-only">Feature</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="text-sm leading-normal">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th
                        key={c}
                        scope="row"
                        className="rounded-l-xl border-y border-l border-white/5 bg-black py-3.5 pr-2 pl-4 font-normal"
                      >
                        {cell as string}
                      </th>
                    ) : (
                      <td
                        key={c}
                        className={`border-y border-white/5 px-2 text-center ${c === row.length - 1 ? "rounded-r-xl border-r" : ""} ${c === block.highlight ? "bg-[#0d0d0d] text-white" : "bg-black text-white/80"}`}
                      >
                        <Cell value={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <figure className="flex flex-col gap-3">
          <div className="overflow-clip rounded-2xl border border-white/5 bg-black">
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(min-width: 832px) 800px, 100vw"
              draggable={false}
              className="h-auto w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="font-reading text-sm leading-normal text-white/60">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-2xl border border-white/5 bg-black p-4 font-mono text-[13px] leading-[1.7]">
          <code>{block.code}</code>
        </pre>
      );
  }
}

// Card used on the index pages and in "Keep reading". Same pattern as the
// other cards on the site: a dark outer card, a black panel, a title bar.
export function ArticleCard({
  article,
  headingLevel = "h3",
}: {
  article: Article;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/${sectionOf(article.kind)}/${article.slug}`}
      className="group flex h-full flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2 transition-colors hover:bg-[#141414]"
    >
      <div className="relative aspect-[8/5] overflow-clip rounded-2xl border border-white/5 bg-black">
        <ArticleIllustration slug={article.slug} kind={article.kind} />
      </div>
      <div className="flex flex-col gap-1.5 p-2">
        <Heading className="font-display text-lg leading-[normal] capitalize transition-colors group-hover:text-white/70">
          {article.title}
        </Heading>
        <p className="font-reading text-sm leading-normal text-white/70 line-clamp-2">
          {article.description}
        </p>
        <p className="font-reading mt-0.5 text-xs leading-normal text-white/50">
          {formatDate(article.updated)} · {article.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}

function Related({ article }: { article: Article }) {
  const items = (article.related ?? [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a));
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-[32px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
        Keep reading
      </h2>
      <ul className="flex flex-wrap gap-4">
        {items.map((item) => (
          <li key={item.slug} className="w-full sm:w-[calc(50%-8px)]">
            <ArticleCard article={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ArticlePage({ article }: { article: Article }) {
  const headings = [
    ...article.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(article.faq ? [{ id: "questions", title: "Questions" }] : []),
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": article.kind === "guide" ? "HowTo" : "Article",
      headline: article.title,
      name: article.title,
      description: article.description,
      dateModified: article.updated,
    },
    ...(article.faq
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <ArticleFrame>
      <header className="relative flex flex-col items-center gap-6 pt-8 text-center">
        <Link
          href={`/${sectionOf(article.kind)}`}
          className="font-reading text-sm text-white/60 transition-colors hover:text-white"
        >
          {article.kind === "guide" ? "All guides" : "All comparisons"}
        </Link>
        <h1 className="font-display w-full max-w-[22ch] text-[clamp(34px,6vw,64px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
          {article.title}
        </h1>
        <p className="font-reading text-base leading-normal text-white/70">
          Updated {formatDate(article.updated)} · {article.readingMinutes} min
          read
        </p>
      </header>

      <div className="relative flex w-full max-w-[800px] flex-col gap-16">
        <section
          aria-labelledby="short-version"
          className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#0d0d0d] p-2"
        >
          <h2
            id="short-version"
            className="font-display p-2 text-lg leading-[normal] capitalize"
          >
            The short version:
          </h2>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black p-4">
            {article.summary.map((text) => (
              <p key={text} className="font-reading text-sm leading-normal">
                <Rich html={text} />
              </p>
            ))}
          </div>
        </section>

        {headings.length > 2 && (
          <nav
            aria-label="On this page"
            className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2"
          >
            <h2 className="font-display p-2 text-lg leading-[normal] capitalize">
              On this page
            </h2>
            <ol className="flex flex-col gap-1">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="font-reading block rounded-xl border border-white/5 bg-black px-4 py-3 text-sm leading-normal transition-colors hover:text-white/60"
                  >
                    {h.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {article.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex scroll-mt-8 flex-col gap-8"
          >
            <h2 className="font-display -mb-3 text-[32px] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
              {section.title}
            </h2>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}

        {article.faq && (
          <section id="questions" className="flex scroll-mt-8 flex-col gap-8">
            <h2 className="font-display -mb-3 text-[32px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
              Questions
            </h2>
            <Accordion type="single" collapsible>
              {article.faq.map((f, i) => (
                <AccordionItem key={f.q} value={`q-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-2xl border border-white/5 bg-black p-6">
                      <p className="font-reading text-base leading-normal">
                        {f.a}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        <Related article={article} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </ArticleFrame>
  );
}

// Index page for one kind of article.
export function ArticleIndex({
  title,
  intro,
  items,
  listHeading,
  children,
}: {
  title: string;
  intro: string | React.ReactNode;
  items: readonly Article[];
  listHeading?: string;
  children?: React.ReactNode;
}) {
  return (
    <ArticleFrame>
      <header className="relative flex flex-col items-center gap-6 pt-8 text-center">
        <h1 className="font-display w-full text-[clamp(40px,7vw,72px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          {title}
        </h1>
        {typeof intro === "string" ? (
          <p className="font-reading max-w-[56ch] text-base leading-normal text-balance text-white/80">
            {intro}
          </p>
        ) : (
          intro
        )}
      </header>

      <section className="relative flex w-full max-w-[1180px] flex-col gap-6">
        <h2 className="font-display text-[28px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          {listHeading ?? `All ${title}`}
        </h2>
        <ul className="flex w-full flex-wrap justify-center gap-4">
          {items.map((item) => (
            <li key={item.slug} className="w-full md:w-[calc(50%-8px)]">
              <ArticleCard article={item} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </section>

      {children && (
        <div className="relative flex w-full max-w-[1180px] flex-col gap-16">
          {children}
        </div>
      )}
    </ArticleFrame>
  );
}
