import type { Article, ArticleKind } from "./types";
import { article as downloadAll } from "./guides/download-all-images-from-google-docs";
import { article as pluckrVsBuiltIn } from "./compare/pluckr-vs-google-docs-built-in-downloads";

// Add a page: create a content file, import it here and add it to the list.
export const articles: readonly Article[] = [downloadAll, pluckrVsBuiltIn];

export const byKind = (kind: ArticleKind) =>
  articles.filter((a) => a.kind === kind);

export const getArticle = (kind: ArticleKind, slug: string) =>
  articles.find((a) => a.kind === kind && a.slug === slug);

export const findBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const sectionOf = (kind: ArticleKind) =>
  kind === "guide" ? "guides" : "compare";
