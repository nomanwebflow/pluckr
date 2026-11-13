import { Hero } from "@/components/hero";
import { ClosingCta } from "@/components/closing-cta";
import { Faq, faqs } from "@/components/faq";
import { Nav } from "@/components/nav";
import { MarkdownExport } from "@/components/markdown-export";
import { Price } from "@/components/price";
import { Process } from "@/components/process";
import { Size } from "@/components/size";
import { MARKETPLACE_URL, PRICE } from "@/content/site";

// SoftwareApplication + FAQPage, per docs/seo-plan.md section 4 item 2.
// The FAQPage only lists questions that are visible on this page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Pluckr",
      url: "https://docpluckr.com/",
      applicationCategory: "BrowserApplication",
      operatingSystem: "Web",
      description:
        "A Google Docs and Google Slides add-on that extracts every image in one ZIP, renames them in bulk, converts them to WebP or AVIF and keeps the alt text.",
      installUrl: MARKETPLACE_URL,
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: PRICE.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Written by hand: Next.js metadata drops the trailing slash on the
          root URL, and Google read that as a different URL from the sitemap's. */}
      <link rel="canonical" href="https://docpluckr.com/" />
      <Nav />
      <main>
        <Hero />
        <Process />
        <Size />
        <MarkdownExport />
        <Price />
        <Faq />
        <ClosingCta />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
