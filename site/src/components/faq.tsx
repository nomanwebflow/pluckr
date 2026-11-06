import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Answers follow docs/site-copy.md. The first answer is the Figma copy.
// Exported so the homepage FAQPage JSON-LD mirrors the visible questions.
export const faqs = [
  {
    q: "What is Pluckr?",
    a: "Pluckr is a Google Docs and Google Slides add-on that extracts every image into one ZIP file. It renames images in bulk, converts them to WebP or AVIF, and exports a Doc as Markdown with an images folder. Conversion runs in your browser, so no image is uploaded.",
  },
  {
    q: "How do I download all images from a Google Doc?",
    a: "Open the Doc, choose Extensions, Pluckr, Extract images, then press Download originals to get every image in one ZIP. Google Docs has no built-in button for this.",
  },
  {
    q: "Does Pluckr work with Google Slides?",
    a: "Yes. Pluckr lists every picture on every slide, and the pictures inside groups. It does not read images that are shape fills, backgrounds or part of a layout.",
  },
  {
    q: "Can I convert Google Docs images to WebP or AVIF?",
    a: "Yes, with the paid version. Choose WebP, AVIF, JPEG or PNG. Set the quality, the aspect ratio and the maximum width. Pluckr does not make small images bigger.",
  },
  {
    q: "Are my images uploaded anywhere?",
    a: "No. Conversion runs in your browser. Pluckr sends a Google sign-in token to its licence service to check your licence. It sends no image and no text.",
  },
  {
    q: "How much does Pluckr cost? Is there a subscription?",
    a: "Pluckr is free for up to 50 images for each Google account, in total. The paid version is a single payment with no subscription, and you can get a refund within 14 days.",
  },
];

export function Faq() {
  return (
    <section id="faqs" className="relative flex flex-col items-center gap-[72px] bg-gradient-to-t from-black to-[#0d0d0d] px-6 py-24 text-white md:px-16 md:py-32">
      <h2 className="font-display w-full max-w-[18ch] text-center text-[clamp(34px,5vw,56px)] leading-none text-balance capitalize [text-box:trim-both_cap_alphabetic]">
        Frequently&nbsp;asked questions
      </h2>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="max-w-[600px]"
      >
        {faqs.map((faq, i) => (
          <AccordionItem key={faq.q} value={`item-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>
              <div className="rounded-2xl border border-white/5 bg-black p-8">
                <p className="text-base leading-normal">{faq.a}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
