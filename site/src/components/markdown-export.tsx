import Image from "next/image";

// A titled card with a black inner panel. Used for every box in this section.
function Card({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2 ${className}`}
    >
      <h3 className="font-display p-2 text-lg leading-[normal] capitalize">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Panel({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-clip rounded-2xl border border-white/5 bg-black ${className}`}
    >
      {label && (
        <p className="px-4 pt-3 text-xs leading-normal text-white/60">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

// Open arrow. Points right on desktop and down when the layout stacks.
function Arrow() {
  return (
    <svg
      aria-hidden
      width="32"
      height="16"
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 rotate-90 text-white/70 md:rotate-0"
    >
      <path d="M2 8h28M24 2.5 30 8l-6 5.5" />
    </svg>
  );
}

// A dark-mode Google Doc, kept simple: a title bar and one page. It shows the
// same text that the content.md preview on the right is made from.
function DocWindow() {
  return (
    <div
      role="img"
      aria-label="A Google Doc in dark mode with a heading, a paragraph and an image"
      className="flex min-h-[320px] flex-1 flex-col bg-[#131314] font-[Arial,Helvetica,sans-serif]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Image
          src="/md/docs-icon.png"
          alt=""
          width={52}
          height={71}
          draggable={false}
          className="h-6 w-auto shrink-0"
        />
        <p className="min-w-0 flex-1 truncate text-xs leading-tight text-white/90">
          Blog draft: image SEO
        </p>
        <span className="rounded-full bg-[#a8c7fa] px-3.5 py-1.5 text-[10px] leading-none font-medium text-[#062e6f]">
          Share
        </span>
      </div>

      <div className="flex min-h-0 flex-1 px-4">
        <div className="mx-auto flex w-full max-w-[360px] flex-col gap-3 overflow-clip rounded-t-[4px] bg-[#1f1f1f] p-6 pb-0">
          <h4 className="text-[13px] leading-snug font-bold text-[#8ab4f8]">
            5 Ways to Speed Up Your Site With Better Images
          </h4>
          <p className="text-[11px] leading-relaxed text-white/90">
            Images are usually the heaviest part of a page. A slow hero image
            pushes back your Largest Contentful Paint.
          </p>
          <div className="relative aspect-[3/2] w-full shrink-0 overflow-clip rounded-[3px]">
            <Image
              src="/md/doc-image.jpg"
              alt=""
              fill
              sizes="320px"
              draggable={false}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const tree = ["content.md", "images/", "  5-ways-to-speed-up-01.webp"];

const markdown = `# 5 Ways to Speed Up Your Site With Better Images

Images are usually the heaviest part of a page. A slow hero image pushes back your Largest Contentful Paint.

![Analytics dashboard on a laptop](./images/5-ways-to-speed-up-01.webp)`;

const readyFor = ["A blog", "A static site", "Obsidian"];

export function MarkdownExport() {
  return (
    <section className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-black to-[#0d0d0d] px-6 py-24 text-white md:px-16 md:py-32">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-display w-full max-w-[820px] text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
          Export a Google Doc as&nbsp;Markdown, with its&nbsp;images
        </h2>
        <p className="w-full max-w-[520px] text-base leading-normal text-balance">
          Tick one box and the download holds a content.md, an
          images&nbsp;folder and the alt&nbsp;text, ready for a blog, a static
          site or Obsidian.
        </p>
      </div>

      <div className="flex w-full max-w-[1180px] flex-col gap-4">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Card title="Your Google Doc" className="h-full">
            <Panel className="flex flex-1 flex-col">
              <DocWindow />
            </Panel>
          </Card>

          <div className="flex flex-col items-center gap-3 self-center md:flex-row">
            <Arrow />
            <div className="w-[280px] max-w-full rounded-2xl border border-white/5 bg-[#0d0d0d] p-3">
              <p className="mb-3 text-xs leading-normal text-white/60">
                In the Pluckr sidebar
              </p>
              <div className="flex flex-col gap-3">
                <Check label="Add alt text files (CSV and JSON)" checked dim />
                <Check label="Add the Doc as Markdown (content.md)" checked />
              </div>
            </div>
            <Arrow />
          </div>

          <Card title="Your download" className="h-full">
            <Panel label="content.md">
              <pre className="font-mono p-4 pt-2 text-[11px] leading-[1.75] whitespace-pre-wrap">
                {markdown}
              </pre>
            </Panel>
            <Panel label="Files">
              <pre className="font-mono p-4 pt-2 text-[11px] leading-[1.75] whitespace-pre-wrap">
                {tree.join("\n")}
              </pre>
            </Panel>
          </Card>
        </div>

        <Card title="Ready for">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {readyFor.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/5 bg-black p-4 text-base leading-[1.2]"
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

function Check({
  label,
  checked,
  dim,
}: {
  label: string;
  checked?: boolean;
  dim?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 ${dim ? "opacity-30" : ""}`}>
      <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-white bg-white">
        {checked && (
          <svg
            aria-hidden
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
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
