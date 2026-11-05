import type { Metadata } from "next";

import { ArticleIndex } from "@/components/article-page";
import { byKind } from "@/content/articles";

export const metadata: Metadata = {
  title: "Comparisons | Pluckr",
  description:
    "How Pluckr stacks up against the other ways to extract and convert Google Docs images.",
};

export default function Page() {
  return (
    <ArticleIndex
      title="Comparisons"
      intro="How Pluckr stacks up against the other ways to extract and convert Google Docs images."
      items={byKind("compare")}
    />
  );
}
