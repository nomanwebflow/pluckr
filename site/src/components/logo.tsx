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

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1" aria-label="Pluckr home">
      <Mark />
      <span className="font-display text-[17.455px] leading-normal">Pluckr</span>
    </Link>
  );
}
