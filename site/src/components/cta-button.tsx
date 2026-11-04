import { Button } from "@/components/ui/button";

export const MARKETPLACE_URL =
  "https://workspace.google.com/marketplace/app/pluckr/315157378382";

// The one "Add to Google Docs" button. Source of truth for button styling.
export function CtaButton() {
  return (
    <Button
      asChild
      className="h-auto rounded-[16px] border-0 bg-[#0062fb] px-8 py-3 text-base leading-[normal] text-white transition-colors hover:bg-[#0062fb]/85 active:translate-y-0"
    >
      <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
        Add to Google Docs
      </a>
    </Button>
  );
}
