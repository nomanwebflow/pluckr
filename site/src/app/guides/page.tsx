import type { Metadata } from "next";

import { ArticleIndex } from "@/components/article-page";
import { byKind } from "@/content/articles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  alternates: { canonical: "/guides" },
  title: "Google Docs & Slides Image Guides | Pluckr",
  description:
    "Step-by-step guides for extracting, converting to WebP, renaming, and exporting images from Google Docs and Google Slides.",
};

const guideFaqs = [
  {
    q: "Does Google Docs lower image quality when you upload pictures?",
    a: "Google Docs stores your uploaded image file at its original resolution behind the scenes. However, Docs scales the visual display in your web browser to fit the page margin. When you copy or screenshot an image from your document, you capture only the lower-resolution screen preview rather than the high-resolution original file.",
  },
  {
    q: "How can I download all images from a Google Doc at once?",
    a: "You can download the document as a zipped web page by choosing File > Download > Web Page (.html, zipped) to get an unpacked images folder. Alternatively, you can use the Pluckr add-on to preview, rename, convert formats, and download all pictures in one clean ZIP archive.",
  },
  {
    q: "Can I extract pictures from Google Slides presentations?",
    a: "Yes. You can download presentations as zipped web pages, export individual slides as vector or raster graphics, or use Pluckr inside Google Slides to extract every slide picture and grouped shape into a single ZIP archive without taking manual screenshots.",
  },
  {
    q: "Why should I convert Google Docs images to WebP or AVIF?",
    a: "WebP images are typically 25 to 35 percent smaller than equivalent JPEGs and up to 80 percent smaller than uncompressed PNGs at identical visual quality. Converting images before uploading them to your website accelerates page load times and improves your Core Web Vitals score.",
  },
];

export default function Page() {
  return (
    <ArticleIndex
      title="Guides"
      intro="Step-by-step guides to extract, rename, convert, and publish images from Google Docs and Google Slides."
      items={byKind("guide")}
      listHeading="Featured Guides"
    >
      <section className="relative flex w-full max-w-[1180px] flex-col items-center gap-[72px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[720px] text-[clamp(32px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Practical Workflows for Google Workspace Images
          </h2>
          <p className="w-full max-w-[520px] text-base leading-normal text-balance text-white/80">
            Tested, reliable solutions to extract original graphics, convert
            formats, and publish content without broken links.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                Full-Resolution Bulk Extraction
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Extract every embedded graphic from Google Docs and Google Slides
                at original uploaded resolution. Avoid low-resolution screen
                captures and save all images simultaneously in a single
                structured archive.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                Modern WebP &amp; AVIF Conversion
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Transform bloated PNG and JPEG files into next-generation web
                formats directly within your browser. Configure custom quality
                thresholds and maximum dimension caps to accelerate your Largest
                Contentful Paint (LCP).
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                WordPress &amp; CMS Publishing
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Prevent broken image links caused by temporary Google server
                URLs. Bulk rename your files using SEO-friendly keyword slugs
                before uploading them directly into your WordPress Media
                Library.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#0d0d0d] p-2">
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/5 bg-black p-6 md:p-8">
              <h3 className="font-display text-lg leading-normal text-white capitalize">
                Clean Markdown Bundling
              </h3>
              <p className="font-reading text-sm leading-relaxed text-white/70">
                Replace messy base64 data URLs with clean Markdown syntax.
                Export a tidy content.md file alongside an images asset directory
                ready for static site generators, Hugo, Astro, or Obsidian.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex w-full max-w-[1180px] flex-col items-center gap-[72px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display w-full max-w-[18ch] text-center text-[clamp(34px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
            Frequently&nbsp;asked questions
          </h2>
          <p className="w-full max-w-[488px] text-base leading-normal text-balance text-white/80">
            Answers to common questions about extracting, converting, and
            exporting images from Google Docs and Slides.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="w-full max-w-[600px]"
        >
          {guideFaqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>
                <div className="rounded-2xl border border-white/5 bg-black p-6 md:p-8">
                  <p className="font-reading text-base leading-normal text-white/80">
                    {faq.a}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </ArticleIndex>
  );
}
