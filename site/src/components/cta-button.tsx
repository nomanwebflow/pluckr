"use client";

import { Button } from "@/components/ui/button";
import { MARKETPLACE_URL } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

// The one "Add to Google Docs" button. Source of truth for button styling.
// `location` says which section the click came from (GA event install_click).
export function CtaButton({ location }: { location: string }) {
  return (
    <Button
      asChild
      className="h-auto rounded-[16px] border-0 bg-[#0062fb] px-8 py-3 text-base leading-[normal] text-white transition-colors hover:bg-[#0062fb]/85 active:translate-y-0"
    >
      <a
        href={MARKETPLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("install_click", { location, link_url: MARKETPLACE_URL })}
      >
        Add to Google Docs
      </a>
    </Button>
  );
}
