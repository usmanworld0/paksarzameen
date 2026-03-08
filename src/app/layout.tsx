import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
// ThemeProvider removed: app is light-only now
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
    default: "PSZ",
    template: "PSZ | %s",
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/paksarzameen_logo.png", sizes: "512x512", type: "image/png" },
      { url: "/paksarzameen_logo.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: { url: "/paksarzameen_logo.png", sizes: "1024x1024", type: "image/png" },
  },
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
    title: "PSZ",
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
    title: "PSZ",
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
        {/* Force light theme to avoid any theme toggling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
