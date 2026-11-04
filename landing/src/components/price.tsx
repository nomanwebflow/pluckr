// Feature lists follow docs/site-copy.md (the pricing page copy).
const plans = [
  {
    price: "Free",
    note: ["Up to 50 images, lifetime.", "No extra features."],
    features: [
      "List and preview every image",
      "Download the originals as one ZIP file",
    ],
  },
  {
    price: "$12",
    note: ["Everything unlocked forever"],
    features: [
      "Everything in Free",
      "No limit on images",
      "Bulk rename",
      "Alt text editing",
      "Alt text export as CSV or JSON",
      "Convert to WebP, AVIF, JPEG or PNG",
      "Crop and resize",
      "Optimize the images in your file",
      "Markdown export with an images folder",
      "Google Docs and Slides",
    ],
  },
];

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

      <ul className="flex w-full flex-wrap items-stretch justify-center gap-4">
        {plans.map((plan) => (
          <li
            key={plan.price}
            className="flex w-full flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2 sm:w-[300px]"
          >
            <div className="rounded-2xl border border-white/5 bg-black p-8">
              <p className="text-[80px] leading-none tracking-[-0.06em]">
                {plan.price}
              </p>
            </div>
            <p className="font-display p-2 text-lg leading-[normal] capitalize sm:min-h-[calc(2lh+1rem)]">
              {plan.note.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-2 px-2 pr-3 pb-3 pl-7 text-sm leading-normal text-white/80 marker:text-white/40">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
