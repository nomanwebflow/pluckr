import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";

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

// Regular weight, used for long-form reading text (the privacy page).
const montrealRegular = localFont({
  src: "./fonts/PPNeueMontreal-Regular.ttf",
  weight: "400",
  variable: "--font-montreal-regular",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docpluckr.com"),
  title: "Pluckr: Extract and Download Images from Google Docs",
  description:
    "Extract every image from a Google Doc or Slides deck in one ZIP. Rename in bulk, convert to WebP or AVIF, keep alt text. Free for 50 images per account.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pangaia.variable} ${montreal.variable} ${montrealRegular.variable} ${mono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <Script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-NQ6J77D4"
          strategy="lazyOnload"
        />
        <Script id="google-tag-manager" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <SmoothScroll />
        {children}
        <Footer />
      </body>
    </html>
  );
}
