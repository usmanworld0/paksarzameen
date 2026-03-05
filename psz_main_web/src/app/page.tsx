import type { Metadata } from "next";
import { HomeClient } from "@/features/home/components/HomeClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover PakSarZameen's mission, core programs, impact metrics, and latest field updates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PakSarZameen | Building Community Wealth",
    description:
      "Explore the PSZ mission platform featuring programs, measurable impact, and community stories.",
    url: siteConfig.siteUrl,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen homepage hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSarZameen | Building Community Wealth",
    description:
      "Explore the PSZ mission platform featuring programs, measurable impact, and community stories.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
