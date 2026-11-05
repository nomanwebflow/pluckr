import { PRICE } from "@/content/site";

// Our own static copy, so inline markup (strong, a, code) is rendered as is.
// {{price}} is replaced with the one site-wide price.
export function Rich({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html.replaceAll("{{price}}", PRICE) }}
    />
  );
}

// Long-form reading text: legal pages and articles.
export const prose =
  "font-reading text-lg leading-[1.7] [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_strong]:font-medium";

// Lists with a bold lead-in on their own line (legal pages).
export const leadList =
  "[&_li:has(strong)]:text-white/80 [&_li_strong]:mb-1 [&_li_strong]:block [&_li_strong]:text-white";
