import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { HomeClient } from "@/features/home/components/HomeClient";

export const metadata: Metadata = {
  title: "PakSarzameen - Community Development Organization in Pakistan",
  description:
    "PakSarzameen is a community-driven organization working for social development, volunteer programs, and humanitarian initiatives across Pakistan.",
  keywords: siteConfig.seo.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PakSarzameen - Official Website",
    description:
      "PakSarzameen is a community-driven organization working for social development, volunteer programs, and humanitarian initiatives across Pakistan.",
    url: siteConfig.siteUrl,
    type: "website",
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
    title: "PakSarzameen - Official Website",
    description:
      "PakSarzameen is a community-driven organization working for social development, volunteer programs, and humanitarian initiatives across Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
