import { Hero } from "@/components/hero";
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
    </main>
  );
}
