import Image from "next/image";

const steps = [
  {
    title: "Scan",
    body: "Open Pluckr in your Doc. It finds every image.",
    bodyWidth: "max-w-[158px]",
    src: "/process/step-1-scan.png",
    alt: "Pluckr sidebar scanning the document for images",
  },
  {
    title: "Convert",
    body: "Pick a format, quality and max width.",
    bodyWidth: "max-w-[144px]",
    src: "/process/step-2-convert.png",
    alt: "Pluckr output settings with WebP, quality 80% and a 16:9 aspect ratio",
  },
  {
    title: "Download",
    body: "Save the originals or the converted files.",
    bodyWidth: "max-w-[140px]",
    src: "/process/step-3-download.png",
    alt: "Pluckr image list with copy and download buttons and a Download originals action",
  },
];

export function Process() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-black to-[#0d0d0d] px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[646px] text-[clamp(36px,5vw,56px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          <span className="block">Three steps.</span>
          <span className="block">No screenshots.</span>
        </h2>
        <p className="w-full max-w-[488px] text-base leading-normal text-balance">
          Extract every image from a Google Doc or Slides deck. Rename them in
          bulk, convert to WebP or AVIF, and keep the alt text
        </p>
      </div>

      <ol className="flex w-full flex-wrap items-start justify-center gap-4">
        {steps.map((step) => (
          <li key={step.title} className="flex w-[300px] flex-col gap-6">
            <Image
              src={step.src}
              alt={step.alt}
              width={300}
              height={400}
              sizes="300px"
              quality={90}
              className="h-[400px] w-[300px]"
            />
            <div className="flex flex-col items-center gap-[14px] px-3 text-center">
              <h3 className="font-display w-full text-[32px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
                {step.title}
              </h3>
              <p className={`w-full text-sm leading-normal text-balance ${step.bodyWidth}`}>
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
