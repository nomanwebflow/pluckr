import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pangaia = localFont({
  src: "./fonts/PPPangaia-Medium.woff2",
  weight: "500",
  variable: "--font-pangaia",
});

const montreal = localFont({
  src: "./fonts/PPNeueMontreal-Medium.ttf",
  weight: "500",
  variable: "--font-montreal",
});

export const metadata: Metadata = {
  title: "Pluckr: download every image from a Google Doc",
  description:
    "Pull every image out of a Doc or Slides deck. Rename in bulk, convert to WebP or AVIF, keep the alt text.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pangaia.variable} ${montreal.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
