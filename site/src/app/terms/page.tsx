import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/terms";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use | Pluckr",
  description:
    "The terms that govern your use of the Pluckr add-on for Google Docs and Slides and the docpluckr.com website.",
};

export default function TermsPage() {
  return <LegalPage title="Terms of use" doc={terms} />;
}
