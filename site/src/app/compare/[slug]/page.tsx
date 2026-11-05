import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticlePage, ArticleSkeleton } from "@/components/article-page";
import { byKind, getArticle } from "@/content/articles";

export function generateStaticParams() {
  return byKind("compare").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("compare", slug);
  if (!article) return {};
  return {
    title: `${article.title} | Pluckr`,
    description: article.description,
    robots: article.draft ? { index: false } : undefined,
  };
}

// Cache Components: await params inside a Suspense boundary, as the docs
// advise, so the page shell can still be prerendered.
async function Article({
  params,
}: {
  params: PageProps<"/compare/[slug]">["params"];
}) {
  const { slug } = await params;
  const article = getArticle("compare", slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}

export default function Page({ params }: PageProps<"/compare/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article params={params} />
    </Suspense>
  );
}
