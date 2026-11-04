import { Button } from "@/components/ui/button";

const MARKETPLACE_URL =
  "https://workspace.google.com/marketplace/app/pluckr/315157378382";

// Bar fill heights are from the Figma (PNG full, JPEG 370px of 513px, WebP
// 97px of 513px). They are not drawn to scale with the file sizes.
const formats = [
  { name: "PNG", size: "796 KB", fill: "100%" },
  { name: "JPEG", size: "796 KB", fill: "72.1%" },
  { name: "WEBP", size: "83 KB", fill: "18.9%" },
];

export function Size() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-[#0d0d0d] to-black px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[488px] text-[clamp(36px,5vw,56px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Same image, 796&nbsp;KB down to 83&nbsp;KB
        </h2>
        <p className="w-full max-w-[432px] text-base leading-normal text-balance">
          Docs stores images as PNG. WebP looks the same at a tenth of the
          size, so pages load faster and uploads fit.
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
              <p className="w-full text-sm leading-normal">{f.size}</p>
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
        <Button
          asChild
          className="font-display h-auto rounded-[16px] border-0 bg-[#0062fb] px-8 py-3 text-xs leading-[normal] text-white transition-colors hover:bg-[#0062fb]/85 active:translate-y-0"
        >
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
            Add to Google Docs
          </a>
        </Button>
      </div>
    </section>
  );
}
