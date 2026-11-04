import Image from "next/image";

import { ArrowDown, Merge, Split } from "@/components/flow-connectors";

// A titled card with a black inner panel. Used for every box in the flow.
function Card({
  title,
  className = "",
  panelClassName = "",
  children,
}: {
  title: string;
  className?: string;
  panelClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2 ${className}`}
    >
      <h3 className="font-display p-2 text-lg leading-[normal] capitalize">
        {title}
      </h3>
      <div
        className={`flex-1 overflow-clip rounded-2xl border border-white/5 bg-black ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

function Check({ checked, label, dim }: { checked: boolean; label: string; dim?: boolean }) {
  return (
    <div className={`flex items-start gap-2 ${dim ? "opacity-10" : ""}`}>
      <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-white bg-white">
        {checked && (
          <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8.8 3.825L4.95 7.675L3.2 5.925"
              stroke="black"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-xs leading-[1.4] text-white/80">{label}</span>
    </div>
  );
}

const files = [
  "content.md",
  "images-metadata.csv",
  "images-metadata.json",
  "images/",
  "  west-coast-road-trip-01.webp",
  "  west-coast-road-trip-02.webp",
  "  west-coast-road-trip-03.webp",
];

const readyFor = ["A blog", "A static site", "Obsidian"];

export function MarkdownExport() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-black to-[#0d0d0d] px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[920px] text-[clamp(32px,5vw,56px)] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          <span className="block">Export a Google Doc as Markdown,</span>
          <span className="block">with its images</span>
        </h2>
        <p className="w-full max-w-[488px] text-base leading-normal text-balance">
          Tick one box and the download holds a content.md, an images folder and
          the alt text, ready for a blog, a static site or Obsidian.
        </p>
      </div>

      <div className="flex w-full max-w-[616px] flex-col items-center gap-8">
        <Card title="In the Google Doc" className="w-full" panelClassName="">
          <Image
            src="/md/doc-screenshot.png"
            alt="A Google Doc open in the editor with a heading, a paragraph and an image"
            width={3840}
            height={2160}
            sizes="(min-width: 640px) 600px, 100vw"
            draggable={false}
            className="aspect-[3840/2160] w-full opacity-45"
          />
        </Card>

        <ArrowDown />

        <div className="w-full max-w-[300px] bg-black p-2">
          <div className="relative flex flex-col gap-4 overflow-clip rounded-2xl border border-white/5 bg-[#0d0d0d] p-3">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px opacity-40"
              style={{
                backgroundImage: 'url("/assets/hero-noise.png")',
                backgroundSize: "220px 220px",
              }}
            />
            <div className="relative flex flex-col gap-4">
              <Check checked dim label="Add alt text files (CSV and JSON)" />
              <Check checked label="Add the Doc as Markdown (content.md)" />
            </div>
          </div>
        </div>

        <Split />

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Card title="content.md" className="w-full">
            <pre className="font-mono p-4 text-[10px] leading-[1.75] whitespace-pre-wrap">
              {"# West Coast Road Trip\n\nSeventy-two hours, four people and one car.\n\n![Rocky coast at sunset](./images/west-coast-road-trip-01.webp)"}
            </pre>
          </Card>
          <Card title="In your download" className="w-full">
            <pre className="font-mono p-4 text-[10px] leading-[1.75] whitespace-pre-wrap">
              {files.join("\n")}
            </pre>
          </Card>
        </div>

        <Merge />

        <Card title="Ready for" className="w-full max-w-[300px]" panelClassName="border-0 bg-transparent">
          <ul className="flex flex-col gap-2">
            {readyFor.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/5 bg-black p-4 text-base leading-[1.2] whitespace-nowrap"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
