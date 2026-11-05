import { CtaButton } from "@/components/cta-button";
import { Logo } from "@/components/logo";

export function ClosingCta() {
  return (
    <section className="relative flex flex-col items-center gap-16 px-6 py-24 text-white md:px-16 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-black" />
        <div
          className="absolute inset-0 bg-top-left opacity-40"
          style={{
            backgroundImage: 'url("/assets/hero-noise.png")',
            backgroundSize: "220px 220px",
            // Fade the grain in from the section above so it does not start
            // on a hard line.
            maskImage: "linear-gradient(to bottom, transparent, #000 20%)",
          }}
        />
      </div>

      <nav className="relative flex w-full items-center justify-center">
        <Logo />
      </nav>

      <div className="relative flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[18ch] text-[clamp(34px,7vw,72px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Download every image from a Google Doc
          </h2>
          <p className="w-full max-w-[60ch] text-base leading-normal text-balance">
            Pull every image out of a Doc or Slides deck.{" "}
            <span className="whitespace-nowrap">Rename in bulk,</span> convert
            to WebP or AVIF, keep the alt text.
          </p>
        </div>
        <CtaButton />
      </div>
    </section>
  );
}
