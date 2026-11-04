import Link from "next/link";

import { Button } from "@/components/ui/button";

const MARKETPLACE_URL =
  "https://workspace.google.com/marketplace/app/pluckr/315157378382";

function Mark() {
  return (
    <div className="relative size-9 shrink-0 overflow-clip" aria-hidden>
      <div
        className="absolute inset-[0.33%_0.33%_7.93%_7.93%]"
        style={{
          maskImage: 'url("/assets/mark-mask.svg")',
          maskMode: "alpha",
          maskRepeat: "no-repeat",
          maskSize: "36px 36px",
          maskPosition: "-2.854px -0.12px",
        }}
      >
        <div className="absolute inset-[0_0_-0.66%_-0.66%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src="/assets/mark.svg"
            className="block size-full max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex h-svh min-h-[640px] flex-col items-center gap-16 overflow-hidden p-6 text-white md:p-16">
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

      <nav className="relative flex w-full shrink-0 items-center justify-center">
        <Link href="/" className="flex items-center gap-1" aria-label="Pluckr home">
          <Mark />
          <span className="font-display text-[17.455px] leading-normal">
            Pluckr
          </span>
        </Link>
      </nav>

      <div className="relative flex shrink-0 flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-display w-full max-w-[818px] text-[clamp(40px,7vw,72px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
            Download every image from a Google Doc
          </h1>
          <p className="w-full max-w-[392px] text-base leading-normal">
            Pull every image out of a Doc or Slides deck. Rename in bulk,
            convert to WebP or AVIF, keep the alt text.
          </p>
        </div>
        <Button
          asChild
          className="h-auto rounded-[16px] border-0 bg-[#0062fb] px-8 py-3 text-base leading-[normal] text-white hover:bg-[#0062fb]/85 active:translate-y-0"
        >
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
            Add to Google Docs
          </a>
        </Button>
      </div>

      <div
        className="relative h-[738px] w-full shrink-0 rounded-[20px] border-2 border-white/5 bg-[#0d0d0d]"
        role="img"
        aria-label="Product demo"
      />
    </section>
  );
}
