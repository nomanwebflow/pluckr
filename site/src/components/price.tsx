import { PRICE } from "@/content/site";
import { CtaButton } from "@/components/cta-button";

// Plans and the comparison table follow docs/site-copy.md (pricing page copy).
const plans = [
  { name: "Free", price: "Free", note: ["Up to 50 images, lifetime."] },
  { name: PRICE, price: PRICE, note: ["Everything unlocked forever"] },
];

type Cell = boolean | string;

const features: { name: string; free: Cell; pro: Cell }[] = [
  { name: "List and preview every image", free: true, pro: true },
  { name: "Download the originals as one ZIP file", free: true, pro: true },
  { name: "Images you can pull", free: "50", pro: "No limit" },
  { name: "Bulk rename", free: false, pro: true },
  { name: "Alt text editing", free: false, pro: true },
  { name: "Alt text export as CSV or JSON", free: false, pro: true },
  { name: "Convert to WebP, AVIF, JPEG or PNG", free: false, pro: true },
  { name: "Crop and resize", free: false, pro: true },
  { name: "Optimize the images in your file", free: false, pro: true },
  { name: "Markdown export with an images folder", free: false, pro: true },
];

function Mark({ value }: { value: Cell }) {
  if (typeof value === "string") {
    return <span className="text-sm">{value}</span>;
  }
  if (value) {
    return (
      <>
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
        <span className="sr-only">Included</span>
      </>
    );
  }
  return (
    <>
      <span aria-hidden className="mx-auto block h-0.5 w-3 rounded-full bg-white/25" />
      <span className="sr-only">Not included</span>
    </>
  );
}

export function Price() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-[#0d0d0d] to-black px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[18ch] text-[clamp(34px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
          One price, paid once
        </h2>
        <p className="w-full max-w-[488px] text-base leading-normal">
          No subscription.
        </p>
      </div>

      <div className="flex w-full max-w-[616px] flex-col gap-4">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2"
            >
              <div className="rounded-2xl border border-white/5 bg-black p-8">
                <p className="text-[80px] leading-none tracking-[-0.06em]">
                  {plan.price}
                </p>
              </div>
              <p className="font-display p-2 text-lg leading-[normal] capitalize">
                {plan.note.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-[#0d0d0d] p-2">
          <h3 className="font-display p-2 text-lg leading-[normal] capitalize sm:hidden">
            What&apos;s included
          </h3>
          <table className="w-full border-separate border-spacing-y-1 text-left">
            <thead>
              <tr className="text-xs text-white/60">
                <th
                  scope="col"
                  className="p-2 text-left align-middle font-normal text-white sm:text-lg"
                >
                  <span className="sr-only sm:hidden">Feature</span>
                  <span className="font-display hidden leading-[normal] capitalize sm:inline">
                    What&apos;s included
                  </span>
                </th>
                <th scope="col" className="w-[76px] px-1 pb-1 text-center font-normal sm:w-20">
                  Free
                </th>
                <th scope="col" className="w-[76px] px-1 pb-1 text-center font-normal sm:w-20">
                  {PRICE}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.name} className="text-sm leading-normal">
                  <th
                    scope="row"
                    className="rounded-l-xl border-y border-l border-white/5 bg-black py-3.5 pr-2 pl-4 font-normal"
                  >
                    {f.name}
                  </th>
                  <td
                    className={`border-y border-white/5 bg-black px-1 text-center ${f.free === false ? "" : "text-white/80"}`}
                  >
                    <Mark value={f.free} />
                  </td>
                  <td className="rounded-r-xl border-y border-r border-white/5 bg-black px-1 text-center">
                    <Mark value={f.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center pt-6">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
