import { ClosingCta } from "@/components/closing-cta";
import { Nav } from "@/components/nav";
import { Rich, leadList, prose } from "@/components/prose";

export type LegalBlock =
  | { readonly type: "p"; readonly html: string }
  | { readonly type: "ul"; readonly items: readonly string[] };

export type LegalDoc = {
  readonly updated: string;
  readonly shortTitle: string;
  readonly shortParagraphs: readonly string[];
  readonly sections: readonly {
    readonly title: string;
    readonly blocks: readonly LegalBlock[];
  }[];
};

export function LegalPage({ title, doc }: { title: string; doc: LegalDoc }) {
  return (
    <>
      <Nav />
      <main className="relative flex flex-col items-center gap-16 px-6 pt-12 pb-24 text-white md:p-16 md:pb-32">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-[#0d0d0d]" />
          <div
            className="absolute inset-0 bg-top-left opacity-40"
            style={{
              backgroundImage: 'url("/assets/hero-noise.png")',
              backgroundSize: "220px 220px",
              // Fade the grain out above the CTA so it does not end on a
              // hard line.
              maskImage:
                "linear-gradient(to bottom, #000 calc(100% - 200px), transparent)",
            }}
          />
        </div>

        <header className="relative flex flex-col items-center gap-6 text-center">
          <h1 className="font-display w-full text-[clamp(40px,7vw,72px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
            {title}
          </h1>
          <p className="text-base leading-normal">
            Last updated: {doc.updated}
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
              {doc.shortTitle}
            </h2>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black p-4">
              {doc.shortParagraphs.map((text) => (
                <p key={text} className="font-reading text-sm leading-normal">
                  {text}
                </p>
              ))}
            </div>
          </section>

          {doc.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-8">
              <h2 className="font-display -mb-3 text-[32px] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
                {section.title}
              </h2>
              {section.blocks.map((block, i) =>
                block.type === "p" ? (
                  <p key={i} className={prose}>
                    <Rich html={block.html} />
                  </p>
                ) : (
                  <ul
                    key={i}
                    className={`${prose} flex list-disc flex-col gap-4 pl-7 ${leadList}`}
                  >
                    {block.items.map((item, j) => (
                      <li key={j}>
                        <Rich html={item} />
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>
      </main>
      <ClosingCta />
    </>
  );
}
