import { CtaButton } from "@/components/cta-button";

// Measured on one sample photo (1000 x 562 px, quality 80, cwebp and libjpeg).
// Bar fills are drawn to scale against the PNG.
const formats = [
  { name: "PNG", kb: 796 },
  { name: "JPEG", kb: 104 },
  { name: "WEBP", kb: 83 },
].map((f) => ({ ...f, fill: `${((f.kb / 796) * 100).toFixed(2)}%` }));

export function Size() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-[#0d0d0d] to-black px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[640px] text-[clamp(32px,5vw,56px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          <span className="block">Same image,</span>
          <span className="block">796&nbsp;KB down to 83&nbsp;KB</span>
        </h2>
        <p className="w-full max-w-[480px] text-base leading-normal">
          Docs stores images as PNG. WebP looks the same{" "}
          <span className="whitespace-nowrap">at a tenth of the size,</span> so
          pages load faster and uploads fit.
        </p>
      </div>

      <ul className="flex aspect-square w-full max-w-[646px] items-start gap-4 p-[10px] sm:gap-8">
        {formats.map((f) => (
          <li
            key={f.name}
            className="flex h-full min-w-px flex-1 flex-col gap-8"
          >
            <div className="relative flex min-h-px flex-1 flex-col justify-end overflow-clip rounded-2xl bg-[#0d0d0d] p-3">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'url("/assets/hero-noise.png")',
                  backgroundSize: "220px 220px",
                }}
              />
              <div
                className="relative w-full rounded-2xl bg-gradient-to-t from-[#0d0d0d] to-black"
                style={{ height: f.fill }}
              />
            </div>
            <div className="flex flex-col items-center gap-[14px] px-3 text-center">
              <h3 className="font-display w-full text-[22px] leading-none capitalize [text-box:trim-both_cap_alphabetic] sm:text-[32px]">
                {f.name}
              </h3>
              <p className="w-full text-sm leading-normal">{f.kb} KB</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-6">
        <p className="w-full max-w-[576px] text-center text-xs leading-normal text-balance">
          One of our sample photos, cropped to 16:9 (1000 × 562 px), quality
          80, measured with cwebp and libjpeg. Your results depend on the image
          and the settings. AVIF is usually smaller still; try it on your own
          images.
        </p>
        <CtaButton />
      </div>
    </section>
  );
}
