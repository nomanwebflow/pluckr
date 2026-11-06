import type { Metadata } from "next";

import { ArticleIndex } from "@/components/article-page";
import { byKind } from "@/content/articles";
import { PRICE } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/compare" },
  title: "Compare Google Docs Image Download Methods | Pluckr",
  description:
    "Compare Pluckr with built-in Google Docs download methods: HTML zip, Word docx trick, and Google Keep.",
};

const comparisonMatrix = [
  {
    feature: "Bulk image extraction",
    htmlZip: "Yes",
    docxTrick: "Yes",
    keep: "No (single image)",
    pluckr: "Yes",
  },
  {
    feature: "Visual thumbnail preview",
    htmlZip: "No",
    docxTrick: "No",
    keep: "Yes",
    pluckr: "Yes",
  },
  {
    feature: "Custom keyword file renaming",
    htmlZip: "No (generic image1.png)",
    docxTrick: "No (generic image1.png)",
    keep: "Manual per image",
    pluckr: "Yes (pattern-based)",
  },
  {
    feature: "WebP & AVIF format conversion",
    htmlZip: "No (raw format only)",
    docxTrick: "No (raw format only)",
    keep: "No",
    pluckr: "Yes (configurable quality)",
  },
  {
    feature: "Markdown export with image folder",
    htmlZip: "No",
    docxTrick: "No",
    keep: "No",
    pluckr: "Yes (content.md)",
  },
  {
    feature: "Client-side browser privacy",
    htmlZip: "Yes",
    docxTrick: "Yes",
    keep: "Yes",
    pluckr: "Yes (WebAssembly)",
  },
  {
    feature: "Cost",
    htmlZip: "Free",
    docxTrick: "Free",
    keep: "Free",
    pluckr: `One-time ${PRICE}`,
  },
];

export default function Page() {
  return (
    <ArticleIndex
      title="Comparisons"
      intro="Compare Pluckr with built-in workarounds and tools for extracting images from Google Docs."
      items={byKind("compare")}
      listHeading="All Comparisons"
    >
      <section className="relative flex w-full max-w-[1180px] flex-col items-center gap-[72px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[720px] text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Overview of Download Methods
          </h2>
          <p className="w-full max-w-[520px] text-base leading-normal text-balance text-white/80">
            Google Docs has no single button to save all images. Review the
            trade-offs between manual workarounds and dedicated tools.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                1. Zipped Web Page Download (.html)
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Choose File &gt; Download &gt; Web Page (.html, zipped). Google
                Docs produces an unpacked ZIP file containing an images folder.
                While completely free and built-in, files receive generic names
                like image1.png with no previews or format options.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                2. Word (.docx) Archive Rename Trick
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Download your document as a Microsoft Word file (.docx), change
                the file extension to .zip on your computer, and unpack the
                word/media folder. Effective for offline extraction, but requires
                cumbersome manual renaming and external conversion tools.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                3. Google Keep Side Panel
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Right-click an individual image in Google Docs and choose Save to
                Keep. Open the note in a new tab to save the graphic. Convenient
                for retrieving a single picture, but impractical for documents
                with dozens of photos or diagrams.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                4. Pluckr Browser Add-On
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Opens directly in your Google Docs sidebar. Displays image
                previews, dimensions, and file sizes. Enables pattern-based bulk
                renaming, client-side WebP/AVIF compression, and one-click ZIP
                bundling for a one-time {PRICE} fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex w-full max-w-[1180px] flex-col items-center gap-[72px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[646px] text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Summary Comparison Matrix
          </h2>
          <p className="w-full max-w-[488px] text-base leading-normal text-balance text-white/80">
            A side-by-side look at capabilities, workflow speed, and pricing.
          </p>
        </div>

        <div className="w-full max-w-[760px] rounded-2xl bg-[#0d0d0d] p-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-separate border-spacing-y-1 text-left">
              <thead>
                <tr className="text-xs text-white/60">
                  <th
                    scope="col"
                    className="p-2 pl-4 text-left font-mono font-normal text-white/60"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-2 pb-1 text-center font-mono font-normal text-white/60"
                  >
                    HTML (.zip)
                  </th>
                  <th
                    scope="col"
                    className="px-2 pb-1 text-center font-mono font-normal text-white/60"
                  >
                    Word (.docx)
                  </th>
                  <th
                    scope="col"
                    className="px-2 pb-1 text-center font-mono font-normal text-white/60"
                  >
                    Keep
                  </th>
                  <th
                    scope="col"
                    className="px-2 pb-1 text-center font-mono font-normal text-[#6ea8fe]"
                  >
                    Pluckr
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row) => (
                  <tr key={row.feature} className="text-sm leading-normal">
                    <th
                      scope="row"
                      className="rounded-l-xl border-y border-l border-white/5 bg-black py-3.5 pr-2 pl-4 font-normal text-white"
                    >
                      {row.feature}
                    </th>
                    <td className="border-y border-white/5 bg-black px-2 text-center text-white/70">
                      {row.htmlZip}
                    </td>
                    <td className="border-y border-white/5 bg-black px-2 text-center text-white/70">
                      {row.docxTrick}
                    </td>
                    <td className="border-y border-white/5 bg-black px-2 text-center text-white/70">
                      {row.keep}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-white/5 bg-black px-2 text-center font-medium text-[#6ea8fe]">
                      {row.pluckr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative flex w-full max-w-[1180px] flex-col items-center gap-[72px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[646px] text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Choosing the Right Method
          </h2>
          <div className="flex max-w-[600px] flex-col gap-4 text-center">
            <p className="w-full text-base leading-normal text-balance text-white/80">
              If you only need a single picture from a brief, the Google Keep
              shortcut is the fastest free option. If you need all images once
              and do not mind renaming files by hand, downloading the zipped web
              page is sufficient.
            </p>
            <p className="w-full text-base leading-normal text-balance text-white/80">
              If you publish regularly to WordPress, static websites, or CMSs,
              Pluckr saves significant time by generating clean SEO file names,
              converting images to lightweight WebP, and organizing everything in
              one local step.
            </p>
          </div>
        </div>
      </section>
    </ArticleIndex>
  );
}
