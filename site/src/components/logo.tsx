import Link from "next/link";

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
            draggable={false}
            src="/assets/mark.svg"
            className="block size-full max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  if (size === "sm") {
    return (
      <Link
        href="/"
        className="flex items-center gap-[3.111px]"
        aria-label="Pluckr home"
      >
        {/* The mark is drawn at 36px, so scale it down to 28px. */}
        <span className="block size-7">
          <span className="block origin-top-left scale-[0.7778]">
            <Mark />
          </span>
        </span>
        <span className="font-display text-[13.576px] leading-normal">
          Pluckr
        </span>
      </Link>
    );
  }
  return (
    <Link href="/" className="flex items-center gap-1" aria-label="Pluckr home">
      <Mark />
      <span className="font-display text-[17.455px] leading-normal">
        Pluckr
      </span>
    </Link>
  );
}
