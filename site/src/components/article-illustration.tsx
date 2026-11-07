import type { ArticleKind } from "@/content/articles/types";

function Arrow() {
  return (
    <svg
      aria-hidden
      width="24"
      height="14"
      viewBox="0 0 24 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-white/50"
    >
      <path d="M2 7h20M17 2l5 5-5 5" />
    </svg>
  );
}

function ImageGlyph({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2.5" width="12" height="11" rx="2" />
      <circle cx="5.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <path d="m2.5 11.5 3.5-3.2 2.5 2.2 2.2-1.8 2.8 2.8" />
    </svg>
  );
}

function TickGlyph() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
    </svg>
  );
}

function DownloadAllIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-5 sm:px-8">
      {/* Doc page with inline images */}
      <div className="flex w-[42%] max-w-[170px] flex-col gap-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#0062fb]" />
          <span className="font-mono text-[10px] text-white/60">doc.gdoc</span>
        </div>
        <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-white/10 bg-black text-white/70">
            <ImageGlyph />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-white/10 bg-black text-white/70">
            <ImageGlyph />
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10" />
        <div className="flex h-7 items-center justify-center rounded-md border border-white/10 bg-black text-white/70">
          <ImageGlyph />
        </div>
      </div>

      <Arrow />

      {/* Extracted ZIP list */}
      <div className="flex w-[48%] max-w-[195px] flex-col gap-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/60">
            images.zip
          </span>
          <span className="rounded bg-[#0062fb]/20 px-1.5 py-0.5 font-mono text-[9px] text-[#6ea8fe]">
            3 files
          </span>
        </div>
        {["image-01.png", "image-02.jpg", "image-03.png"].map((name) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-black px-2.5 py-1.5"
          >
            <ImageGlyph className="size-3 shrink-0 text-white/60" />
            <span className="truncate font-mono text-[10px] text-white/85">
              {name}
            </span>
          </div>
        ))}
        <div className="mt-0.5 rounded-lg bg-[#0062fb] py-1 text-center font-mono text-[10px] font-medium text-white">
          Download ZIP
        </div>
      </div>
    </div>
  );
}

function SaveToDriveIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-5 sm:px-8">
      {/* Doc with inline images */}
      <div className="flex w-[40%] max-w-[160px] flex-col gap-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#0062fb]" />
          <span className="font-mono text-[10px] text-white/60">doc.gdoc</span>
        </div>
        <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-white/10 bg-black text-white/70">
            <ImageGlyph />
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-white/10 bg-black text-white/70">
            <ImageGlyph />
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10" />
      </div>

      <Arrow />

      {/* Drive folder with the saved files */}
      <div className="flex w-[50%] max-w-[200px] flex-col gap-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[10px] text-white/60">
            My Drive / doc images
          </span>
        </div>
        {["image-01.webp", "image-02.webp", "image-03.webp"].map((name) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-black px-2.5 py-1.5"
          >
            <ImageGlyph className="size-3 shrink-0 text-white/60" />
            <span className="truncate font-mono text-[10px] text-white/85">
              {name}
            </span>
          </div>
        ))}
        <div className="mt-0.5 rounded-lg bg-[#0062fb] py-1 text-center font-mono text-[10px] font-medium text-white">
          Saved 3 files to Drive
        </div>
      </div>
    </div>
  );
}

function ConvertWebpIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-5 sm:px-8">
      {/* Heavy PNG card */}
      <div className="flex h-[78%] w-[36%] max-w-[148px] flex-col justify-between rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/50">BEFORE</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/70">
            PNG
          </span>
        </div>
        <div className="my-auto flex flex-col gap-1.5">
          <div className="h-12 w-full rounded-lg border border-white/10 bg-gradient-to-t from-white/15 to-white/5" />
        </div>
        <div>
          <p className="font-display text-xl leading-none text-white">796 KB</p>
          <p className="mt-1 font-mono text-[9px] text-white/50">
            Raw Doc image
          </p>
        </div>
      </div>

      {/* Quality pill + arrow */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="rounded-full border border-white/10 bg-[#0d0d0d] px-2 py-0.5 font-mono text-[9px] text-white/70">
          q: 80%
        </span>
        <Arrow />
      </div>

      {/* Small WebP card */}
      <div className="flex h-[78%] w-[36%] max-w-[148px] flex-col justify-between rounded-xl border border-[#0062fb]/40 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#6ea8fe]">AFTER</span>
          <span className="rounded bg-[#0062fb] px-1.5 py-0.5 font-mono text-[9px] text-white">
            WEBP
          </span>
        </div>
        <div className="my-auto flex h-12 flex-col justify-end">
          <div className="h-2.5 w-full rounded-sm bg-[#0062fb]" />
        </div>
        <div>
          <p className="font-display text-xl leading-none text-white">83 KB</p>
          <p className="mt-1 font-mono text-[9px] text-[#6ea8fe]">
            90% smaller
          </p>
        </div>
      </div>
    </div>
  );
}

function ExtractSlidesIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-5 sm:px-8">
      {/* Stacked 16:9 slides */}
      <div className="relative flex w-[44%] max-w-[180px] flex-col gap-2">
        <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[9px] text-white/60">SLIDE 01</span>
            <span className="size-1.5 rounded-full bg-[#fbbc04]" />
          </div>
          <div className="grid aspect-[16/9] grid-cols-3 gap-1 rounded-lg border border-white/5 bg-black p-1.5">
            <div className="flex items-center justify-center rounded bg-white/10 text-white/75">
              <ImageGlyph className="size-3" />
            </div>
            <div className="flex items-center justify-center rounded bg-white/10 text-white/75">
              <ImageGlyph className="size-3" />
            </div>
            <div className="flex items-center justify-center rounded bg-white/10 text-white/75">
              <ImageGlyph className="size-3" />
            </div>
          </div>
        </div>
        <div className="mx-2 flex items-center justify-between rounded-lg border border-white/5 bg-[#0d0d0d]/70 px-2.5 py-1.5">
          <span className="font-mono text-[9px] text-white/40">SLIDE 02</span>
          <span className="font-mono text-[9px] text-white/40">2 images</span>
        </div>
      </div>

      <Arrow />

      {/* Extracted slide images */}
      <div className="flex w-[44%] max-w-[180px] flex-col gap-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <span className="font-mono text-[10px] text-white/60">
          Extracted pictures
        </span>
        {[
          { name: "slide-01-01.jpg", size: "555 KB" },
          { name: "slide-01-02.jpg", size: "412 KB" },
          { name: "slide-02-01.png", size: "290 KB" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-black px-2.5 py-1.5"
          >
            <span className="truncate font-mono text-[9px] text-white/85">
              {item.name}
            </span>
            <span className="shrink-0 font-mono text-[9px] text-white/45">
              {item.size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportMarkdownIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-4 sm:px-7">
      {/* content.md card */}
      <div className="flex h-[78%] w-[52%] max-w-[210px] flex-col justify-between rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/60">
            content.md
          </span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/70">
            MD
          </span>
        </div>
        <div className="rounded-lg border border-white/5 bg-black p-2.5 font-mono text-[9px] leading-[1.6] text-white/75">
          <p className="text-white"># Image SEO Guide</p>
          <p className="text-white/45">Fast pages need light files.</p>
          <p className="mt-1 truncate text-[#6ea8fe]">
            ![Chart](./images/01.webp)
          </p>
        </div>
      </div>

      {/* images/ folder card */}
      <div className="flex h-[78%] w-[42%] max-w-[170px] flex-col justify-between rounded-xl border border-[#0062fb]/40 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#6ea8fe]">images/</span>
          <span className="rounded bg-[#0062fb] px-1.5 py-0.5 font-mono text-[9px] text-white">
            ZIP
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {["01.webp", "02.webp", "alt-text.csv"].map((file) => (
            <div
              key={file}
              className="flex items-center gap-1.5 rounded-md border border-white/5 bg-black px-2 py-1 font-mono text-[9px] text-white/80"
            >
              <span className="size-1.5 rounded-full bg-[#0062fb]" />
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareIllustration() {
  const rows = [
    "Preview images",
    "Custom file names",
    "WebP & AVIF",
    "One-click ZIP",
  ];
  return (
    <div className="flex size-full items-center justify-center px-5 py-4 sm:px-8">
      <div className="grid w-full max-w-[360px] grid-cols-[1.2fr_0.9fr_0.9fr] gap-1.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="px-2 py-1 font-mono text-[9px] text-white/40">
          FEATURE
        </div>
        <div className="px-2 py-1 text-center font-mono text-[9px] text-white/50">
          BUILT-IN
        </div>
        <div className="rounded-t-lg bg-black px-2 py-1 text-center font-mono text-[9px] text-[#6ea8fe]">
          PLUCKR
        </div>

        {rows.map((label) => (
          <div key={label} className="contents text-[10px]">
            <div className="flex items-center rounded-lg bg-black/60 px-2.5 py-1.5 font-mono text-[9px] text-white/80">
              {label}
            </div>
            <div className="flex items-center justify-center rounded-lg bg-black/60 py-1.5">
              <span className="block h-0.5 w-2.5 rounded-full bg-white/25" />
            </div>
            <div className="flex items-center justify-center rounded-lg border border-[#0062fb]/30 bg-black py-1.5 text-[#6ea8fe]">
              <TickGlyph />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WordpressExportIllustration() {
  return (
    <div className="flex size-full items-center justify-center gap-3 px-5 py-4 sm:gap-4 sm:px-7">
      {/* Google Doc source card */}
      <div className="flex h-[80%] w-[46%] max-w-[185px] flex-col justify-between rounded-xl border border-white/10 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/60">Google Docs</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/70">
            RAW
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black px-2.5 py-1.5">
            <span className="truncate font-mono text-[9px] text-white/60">image1.png</span>
            <span className="font-mono text-[9px] text-white/40">2.4 MB</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black px-2.5 py-1.5">
            <span className="truncate font-mono text-[9px] text-white/60">image2.png</span>
            <span className="font-mono text-[9px] text-white/40">1.8 MB</span>
          </div>
        </div>
        <div className="rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-center font-mono text-[9px] text-red-300">
          Heavy &amp; generic
        </div>
      </div>

      <Arrow />

      {/* WordPress Media Library card */}
      <div className="flex h-[80%] w-[48%] max-w-[195px] flex-col justify-between rounded-xl border border-[#0062fb]/40 bg-[#0d0d0d] p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#6ea8fe]">WP Media</span>
          <span className="rounded bg-[#0062fb] px-1.5 py-0.5 font-mono text-[9px] text-white">
            WEBP
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black px-2.5 py-1.5">
            <span className="truncate font-mono text-[9px] text-[#6ea8fe]">hero-banner.webp</span>
            <span className="font-mono text-[9px] text-white/70">84 KB</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black px-2.5 py-1.5">
            <span className="truncate font-mono text-[9px] text-[#6ea8fe]">chart-data.webp</span>
            <span className="font-mono text-[9px] text-white/70">52 KB</span>
          </div>
        </div>
        <div className="rounded border border-[#0062fb]/30 bg-[#0062fb]/10 px-2 py-1 text-center font-mono text-[9px] text-[#6ea8fe]">
          SEO keywords + alt
        </div>
      </div>
    </div>
  );
}

export function ArticleIllustration({
  slug,
  kind,
}: {
  slug: string;
  kind: ArticleKind;
}) {
  return (
    <div
      aria-hidden
      className="relative size-full overflow-clip bg-black select-none"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: 'url("/assets/hero-noise.webp")',
          backgroundSize: "220px 220px",
        }}
      />
      <div className="relative size-full transition-transform duration-300 group-hover:scale-[1.02]">
        {slug === "download-all-images-from-google-docs" ? (
          <DownloadAllIllustration />
        ) : slug === "convert-google-docs-images-to-webp" ? (
          <ConvertWebpIllustration />
        ) : slug === "extract-images-from-google-slides" ? (
          <ExtractSlidesIllustration />
        ) : slug === "export-google-docs-to-markdown-with-images" ? (
          <ExportMarkdownIllustration />
        ) : slug === "google-docs-to-wordpress-images" ? (
          <WordpressExportIllustration />
        ) : slug === "save-google-docs-images-to-google-drive" ? (
          <SaveToDriveIllustration />
        ) : kind === "compare" ? (
          <CompareIllustration />
        ) : (
          <DownloadAllIllustration />
        )}
      </div>
    </div>
  );
}

