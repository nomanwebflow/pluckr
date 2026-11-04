// Flow connectors for the Markdown section.
//
// Why this is built from CSS and not drawn as a fixed-size SVG or image:
// the lines are positioned from the same grid the cards use (two equal
// columns with a 16px gap), so their x positions are derived from the layout
// and cannot drift when the container resizes. Card centers sit at
// calc(25% - 4px) from each side: (W - 16) / 4 = W / 4 - 4. Strokes are 1px,
// so the line boxes are nudged half a pixel to center on that point.
//
// Below md the two cards stack, so the split and merge collapse to a single
// stem instead of a bracket pointing at nothing.

const line = "bg-white";

// Open arrowhead (Figma ARROW_LINES) that sits on the end of a stem.
function Head({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="9"
      height="6"
      viewBox="0 0 9 6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`absolute bottom-0 text-white ${className}`}
    >
      <path d="M1 1.25 4.5 4.75 8 1.25" />
    </svg>
  );
}

// One arrow pointing down, 32px stem.
export function ArrowDown() {
  return (
    <div aria-hidden className="relative h-8 w-px shrink-0">
      <span className={`absolute inset-0 ${line}`} />
      <Head className="left-1/2 -translate-x-1/2" />
    </div>
  );
}

// One stem into a bracket, two arrows out: one into each card below.
export function Split() {
  return (
    <>
      <div className="md:hidden">
        <ArrowDown />
      </div>
      <div aria-hidden className="relative hidden h-16 w-full shrink-0 md:block">
        <span className={`absolute top-0 left-1/2 h-8 w-px -translate-x-1/2 ${line}`} />
        <span className="absolute top-8 bottom-0 left-[calc(25%-4.5px)] right-[calc(25%-4.5px)] border-x border-t border-white" />
        <Head className="left-[calc(25%-4px)] -translate-x-1/2" />
        <Head className="right-[calc(25%-4px)] translate-x-1/2" />
      </div>
    </>
  );
}

// Two stems from the cards above merge into one arrow.
export function Merge() {
  return (
    <>
      <div className="md:hidden">
        <ArrowDown />
      </div>
      <div aria-hidden className="relative hidden h-16 w-full shrink-0 md:block">
        <span className="absolute top-0 h-8 left-[calc(25%-4.5px)] right-[calc(25%-4.5px)] border-x border-b border-white" />
        <span className={`absolute top-8 bottom-0 left-1/2 w-px -translate-x-1/2 ${line}`} />
        <Head className="left-1/2 -translate-x-1/2" />
      </div>
    </>
  );
}
