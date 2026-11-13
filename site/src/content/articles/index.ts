import type { Article, ArticleKind } from "./types";
import { article as downloadAll } from "./guides/download-all-images-from-google-docs";
import { article as convertToWebp } from "./guides/convert-google-docs-images-to-webp";
import { article as extractFromSlides } from "./guides/extract-images-from-google-slides";
import { article as exportToMarkdown } from "./guides/export-google-docs-to-markdown-with-images";
import { article as googleDocsToWordpress } from "./guides/google-docs-to-wordpress-images";
import { article as saveToDrive } from "./guides/save-google-docs-images-to-google-drive";
import { article as compressImages } from "./guides/compress-images-in-google-docs";
import { article as pluckrVsBuiltIn } from "./compare/pluckr-vs-google-docs-built-in-downloads";

// Add a page: create a content file, import it here and add it to the list.
export const articles: readonly Article[] = [
  downloadAll,
  convertToWebp,
  extractFromSlides,
  exportToMarkdown,
  googleDocsToWordpress,
  saveToDrive,
  compressImages,
  pluckrVsBuiltIn,
];

export const byKind = (kind: ArticleKind) =>
  articles.filter((a) => a.kind === kind);

export const getArticle = (kind: ArticleKind, slug: string) =>
  articles.find((a) => a.kind === kind && a.slug === slug);

export const findBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const sectionOf = (kind: ArticleKind) =>
  kind === "guide" ? "guides" : "compare";
