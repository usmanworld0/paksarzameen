import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { HomeClient } from "@/features/home/components/HomeClient";

export const metadata: Metadata = {
  title: "PSZ | Home",
  description:
    "Discover PakSarZameen's mission, core programs, impact metrics, and latest field updates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PSZ | Home",
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
    title: "PSZ | Home",
    description:
      "Explore the PSZ mission platform featuring programs, measurable impact, and community stories.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
