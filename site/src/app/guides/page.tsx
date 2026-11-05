import type { Metadata } from "next";

import { ArticleIndex } from "@/components/article-page";
import { byKind } from "@/content/articles";

export const metadata: Metadata = {
  title: "Guides | Pluckr",
  description:
    "Step-by-step ways to get the images out of Google Docs and Slides, and what to do with them.",
};

export default function Page() {
  return (
    <ArticleIndex
      title="Guides"
      intro="Step-by-step ways to get the images out of Google Docs and Slides, and what to do with them."
      items={byKind("guide")}
    />
  );
}
