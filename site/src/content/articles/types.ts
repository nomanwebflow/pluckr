// Block types an article can use. Add a page by adding one content file and
// listing it in index.ts. Inline markup (strong, a, code) is allowed in html
// strings. {{price}} becomes the site-wide price.
export type ArticleBlock =
  | { readonly type: "p"; readonly html: string }
  | { readonly type: "h3"; readonly text: string }
  | { readonly type: "ul" | "ol"; readonly items: readonly string[] }
  | { readonly type: "callout"; readonly title: string; readonly html: string }
  | {
      // Comparison table. First column names the row. A cell is true (tick),
      // false (dash) or text. `highlight` is the column index to emphasize.
      readonly type: "table";
      readonly columns: readonly string[];
      readonly rows: readonly (readonly (string | boolean)[])[];
      readonly highlight?: number;
    }
  | {
      readonly type: "image";
      readonly src: string;
      readonly alt: string;
      readonly width: number;
      readonly height: number;
      readonly caption?: string;
    }
  | { readonly type: "code"; readonly code: string };

export type ArticleKind = "guide" | "compare";

export type Article = {
  readonly kind: ArticleKind;
  readonly slug: string;
  readonly title: string;
  // Used for the page description and the index card.
  readonly description: string;
  readonly updated: string; // ISO date, for example 2026-11-05
  readonly readingMinutes: number;
  // "The short version" card at the top.
  readonly summary: readonly string[];
  readonly sections: readonly {
    readonly id: string;
    readonly title: string;
    readonly blocks: readonly ArticleBlock[];
  }[];
  // Optional. Rendered as an accordion and as FAQPage structured data.
  readonly faq?: readonly { readonly q: string; readonly a: string }[];
  // Optional picture for the index and "Keep reading" cards. Without one the
  // card shows the description in large type.
  readonly cover?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  // Slugs of other articles to link at the end.
  readonly related?: readonly string[];
  // Draft pages build but are marked noindex.
  readonly draft?: boolean;
};
