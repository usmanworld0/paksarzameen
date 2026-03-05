import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ThemeProvider } from "@/lib/theme";
import { siteConfig } from "@/config/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: "PakSarZameen | Mission Platform",
    template: "%s | PakSarZameen",
  },
  description: siteConfig.description,
  keywords: [
    "PakSarZameen",
    "community development",
    "NGO Pakistan",
    "social impact",
    "ethical enterprise",
  ],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "PakSarZameen" }],
  creator: "PakSarZameen",
  publisher: "PakSarZameen",
  openGraph: {
    title: "PakSarZameen | Mission Platform",
    description: siteConfig.description,
    type: "website",
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "en_PK",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen mission platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSarZameen | Mission Platform",
    description: siteConfig.description,
    images: ["/images/hero-fallback.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force light theme on initial paint to avoid flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
