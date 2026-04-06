import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Providers } from "@/components/providers";
// ThemeProvider removed: app is light-only now
import { siteConfig } from "@/config/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: "PakSarZameen | In Pakistan For Community Development",
    template: "%s | PakSarZameen",
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  icons: {
    icon: [
      { url: "/paksarzameen_logo.png", sizes: "512x512", type: "image/png" },
      { url: "/paksarzameen_logo.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: { url: "/paksarzameen_logo.png", sizes: "1024x1024", type: "image/png" },
  },
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "PakSarZameen" }],
  creator: "PakSarZameen",
  publisher: "PakSarZameen",
  openGraph: {
    title: "PakSarZameen | In Pakistan For Community Development",
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
        alt: "PakSarZameen volunteers working in community projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSarZameen | In Pakistan For Community Development",
    description: siteConfig.description,
    images: ["/images/hero-fallback.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationId = `${siteConfig.siteUrl}/#organization`;
  const websiteId = `${siteConfig.siteUrl}/#website`;

  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        logo: `${siteConfig.siteUrl}/paksarzameen_logo.png`,
        image: `${siteConfig.siteUrl}/images/hero-fallback.svg`,
        description: siteConfig.description,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        foundingDate: "2021",
        areaServed: "Pakistan",
        address: {
          "@type": "PostalAddress",
          streetAddress: `${siteConfig.contact.addressLines[0]}, ${siteConfig.contact.addressLines[1]}, ${siteConfig.contact.addressLines[2]}`,
          addressLocality: siteConfig.contact.addressLines[3],
          addressRegion: siteConfig.contact.addressLines[4],
          addressCountry: siteConfig.contact.addressLines[5],
        },
        sameAs: [
          siteConfig.social.instagram,
          siteConfig.social.facebook,
          siteConfig.social.linkedin,
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en-PK",
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external media domains for faster loading */}
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://platform.instagram.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://videos.pexels.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.instagram.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://platform.instagram.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://videos.pexels.com" crossOrigin="anonymous" />
        {/* Force light theme to avoid any theme toggling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme','light');var ready=function(){document.documentElement.classList.add('app-ready');};if(document.readyState==='interactive'||document.readyState==='complete'){requestAnimationFrame(ready);}else{document.addEventListener('DOMContentLoaded',ready,{once:true});window.addEventListener('load',ready,{once:true});}setTimeout(ready,2500);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        <Providers>
          <div className="app-boot-loader" aria-hidden="true">
            <div className="app-boot-loader__spinner" />
          </div>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
