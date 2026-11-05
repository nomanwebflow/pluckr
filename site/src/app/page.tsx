import type { Metadata } from "next";

import { Hero } from "@/components/hero";
import { ClosingCta } from "@/components/closing-cta";
import { Faq } from "@/components/faq";
import { Nav } from "@/components/nav";
import { MarkdownExport } from "@/components/markdown-export";
import { Price } from "@/components/price";
import { Process } from "@/components/process";
import { Size } from "@/components/size";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
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
    </>
  );
}
