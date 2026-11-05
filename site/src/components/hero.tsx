"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import { CtaButton } from "@/components/cta-button";
import { HeroVideo } from "@/components/hero-video";

gsap.registerPlugin(SplitText, useGSAP);

// Line masks clip at the line box, which shaves descenders (g, y) and
// ascenders. Pad each mask clear of the cut and pull the layout back.
function clearTheCut(masks: Element[]) {
  gsap.set(masks, {
    paddingBlock: "0.2em",
    marginBlock: "-0.2em",
  });
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = (name: string) =>
          root.current!.querySelector<HTMLElement>(`[data-hero="${name}"]`)!;
        const panel = q("panel");

        // Entrance: fades and slides in. Nothing is hidden by CSS, so with JS
        // off the page is fully readable; opacity is only set once GSAP runs.
        gsap.from(panel, {
          yPercent: 6,
          opacity: 0,
          duration: 1.4,
          delay: 0.35,
          ease: "power3.out",
        });

        SplitText.create(q("h1"), {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            clearTheCut(self.masks);
            return gsap.from(self.lines, {
              yPercent: 115,
              opacity: 0,
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
              delay: 0.1,
            });
          },
        });

        SplitText.create(q("p"), {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            clearTheCut(self.masks);
            return gsap.from(self.lines, {
              yPercent: 110,
              opacity: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power3.out",
              delay: 0.5,
            });
          },
        });

        gsap.from(q("cta"), {
          y: 24,
          opacity: 0,
          duration: 0.9,
          delay: 0.7,
          ease: "power3.out",
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex flex-col items-center gap-16 px-6 py-14 text-white md:p-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0d0d0d,#000_60%,#0d0d0d)]" />
        <div
          className="absolute inset-0 bg-top-left opacity-40"
          style={{
            backgroundImage: 'url("/assets/hero-noise.png")',
            backgroundSize: "220px 220px",
            // Feather the grain out before the section edge so it does not
            // end on a hard line against the next section.
            maskImage: "linear-gradient(to bottom, #000 80%, transparent)",
          }}
        />
      </div>

      <div className="relative flex shrink-0 flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1
            data-hero="h1"
            className="font-display w-full max-w-[18ch] text-[clamp(34px,7vw,72px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]"
          >
            Download every image from a Google Doc
          </h1>
          <p
            data-hero="p"
            className="w-full max-w-[40ch] text-base leading-normal text-balance"
          >
            Pull every image out of a Doc or Slides deck. Rename in bulk,
            convert to WebP or AVIF, keep the alt text.
          </p>
        </div>
        <div data-hero="cta">
          <CtaButton />
        </div>
      </div>

      <div
        data-hero="panel"
        className="relative z-10 aspect-video w-full max-w-[1312px] shrink-0 overflow-clip rounded-[20px] border-2 border-white/5 bg-[#0d0d0d]"
      >
        <HeroVideo />
      </div>
    </section>
  );
}
