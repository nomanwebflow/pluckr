import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Pluckr",
  description:
    "How Pluckr handles the images and account details it accesses in Google Docs and Slides.",
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" doc={privacy} />;
}
