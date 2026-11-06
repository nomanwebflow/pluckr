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
      listHeading="Comparison Articles"
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-[28px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Overview of Google Docs Image Download Methods
        </h2>
        <div className="flex flex-col gap-4 text-white/80">
          <p className="font-reading text-base leading-relaxed">
            Google Docs does not include a direct &ldquo;Download all
            images&rdquo; command in its interface. Because of this limitation,
            users rely on workarounds such as downloading zipped HTML web pages,
            renaming Word (.docx) archive files, sending individual pictures to
            Google Keep, or using dedicated Google Workspace add-ons like
            Pluckr.
          </p>
          <p className="font-reading text-base leading-relaxed">
            Each method comes with clear trade-offs between manual effort, file
            naming convenience, image compression options, and data privacy.
            Review the breakdown below to choose the most effective approach for
            your publishing or design workflow.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-[28px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Comparing the Four Primary Methods
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0d0d0d] p-6">
            <h3 className="font-display text-lg text-white">
              1. Zipped Web Page Download (.html)
            </h3>
            <p className="font-reading text-sm leading-relaxed text-white/70">
              Choose File &gt; Download &gt; Web Page (.html, zipped). Google
              Docs produces an unpacked ZIP file containing an images folder.
              While completely free and built-in, files receive generic names
              like image1.png with no previews or format options.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0d0d0d] p-6">
            <h3 className="font-display text-lg text-white">
              2. Word (.docx) Archive Rename Trick
            </h3>
            <p className="font-reading text-sm leading-relaxed text-white/70">
              Download your document as a Microsoft Word file (.docx), change
              the file extension to .zip on your computer, and unpack the
              word/media folder. Effective for offline extraction, but requires
              cumbersome manual renaming and external conversion tools.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0d0d0d] p-6">
            <h3 className="font-display text-lg text-white">
              3. Google Keep Side Panel
            </h3>
            <p className="font-reading text-sm leading-relaxed text-white/70">
              Right-click an individual image in Google Docs and choose Save to
              Keep. Open the note in a new tab to save the graphic. Convenient
              for retrieving a single picture, but impractical for documents
              with dozens of photos or diagrams.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0d0d0d] p-6">
            <h3 className="font-display text-lg text-white">
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
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-[28px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Summary Comparison Matrix
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0d0d0d] p-4">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="p-3 font-mono text-xs">Feature</th>
                <th className="p-3 font-mono text-xs">HTML (.zip)</th>
                <th className="p-3 font-mono text-xs">Word (.docx)</th>
                <th className="p-3 font-mono text-xs">Google Keep</th>
                <th className="p-3 font-mono text-xs text-[#6ea8fe]">Pluckr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonMatrix.map((row) => (
                <tr key={row.feature} className="text-white/80">
                  <td className="p-3 font-medium text-white">{row.feature}</td>
                  <td className="p-3">{row.htmlZip}</td>
                  <td className="p-3">{row.docxTrick}</td>
                  <td className="p-3">{row.keep}</td>
                  <td className="p-3 font-semibold text-[#6ea8fe]">
                    {row.pluckr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-[28px] leading-none capitalize [text-box:trim-both_cap_alphabetic]">
          Choosing the Right Method for Your Workflow
        </h2>
        <div className="flex flex-col gap-4 text-white/80">
          <p className="font-reading text-base leading-relaxed">
            If you only need a single picture from a brief, the Google Keep
            shortcut is the fastest free option. If you need all images once and
            do not mind renaming files by hand, downloading the zipped web page
            is sufficient.
          </p>
          <p className="font-reading text-base leading-relaxed">
            If you publish regularly to WordPress, static websites, or CMSs,
            Pluckr saves significant time by generating clean SEO file names,
            converting images to lightweight WebP, and organizing everything in
            one local step.
          </p>
        </div>
      </section>
    </ArticleIndex>
  );
}
