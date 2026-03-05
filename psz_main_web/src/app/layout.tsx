import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/header/Navbar";
import { siteConfig } from "@/config/site";

import "./globals.css";

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://psz-main-web.example.com"),
  title: {
    default: "PakSarZameen | Mission Platform",
    template: "%s | PakSarZameen",
  },
  description: siteConfig.description,
  openGraph: {
    title: "PakSarZameen | Mission Platform",
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-psz-cream text-psz-charcoal antialiased`}>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(95,122,84,0.16),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(211,180,131,0.25),transparent_45%)]" />
        <Navbar />
        <main id="main-content" className="min-h-[65vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
