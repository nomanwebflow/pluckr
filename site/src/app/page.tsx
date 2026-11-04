import { Hero } from "@/components/hero";
import { ClosingCta } from "@/components/closing-cta";
import { Faq } from "@/components/faq";
import { MarkdownExport } from "@/components/markdown-export";
import { Price } from "@/components/price";
import { Process } from "@/components/process";
import { Size } from "@/components/size";

export default function Home() {
  return (
    <main>
      <Hero />
      <Process />
      <Size />
      <MarkdownExport />
      <Price />
      <Faq />
      <ClosingCta />
    </main>
  );
}
