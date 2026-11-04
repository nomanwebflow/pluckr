import type { Metadata } from "next";

import { Logo } from "@/components/logo";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Pluckr",
  description:
    "How Pluckr handles the images and account details it accesses in Google Docs and Slides.",
};

// Content is our own static policy text, so inline markup is rendered as is.
function Rich({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

const prose =
  "font-reading text-lg leading-[1.7] [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_strong]:font-medium";

export default function PrivacyPage() {
  return (
    <main className="relative flex flex-col items-center gap-16 px-6 pt-12 pb-24 text-white md:p-16 md:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-[#0d0d0d]" />
        <div
          className="absolute inset-0 bg-top-left opacity-40"
          style={{
            backgroundImage: 'url("/assets/hero-noise.png")',
            backgroundSize: "220px 220px",
          }}
        />
      </div>

      <nav className="relative flex w-full items-center justify-center">
        <Logo />
      </nav>

      <header className="relative flex flex-col items-center gap-6 text-center">
        <h1 className="font-display w-full text-[clamp(40px,7vw,72px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Privacy policy
        </h1>
        <p className="text-base leading-normal">
          Last updated: {privacy.updated}
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
            {privacy.shortTitle}
          </h2>
          <div className="rounded-2xl border border-white/5 bg-black p-4">
            <Rich
              html={privacy.shortBody}
              className="font-reading block text-sm leading-normal"
            />
          </div>
        </section>

        {privacy.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-8">
            <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
              {section.title}
            </h2>
            {section.blocks.map((block, i) =>
              block.type === "p" ? (
                <p key={i} className={prose}>
                  <Rich html={block.html} />
                </p>
              ) : (
                <ul key={i} className={`${prose} flex list-disc flex-col gap-3 pl-7`}>
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
  );
}
