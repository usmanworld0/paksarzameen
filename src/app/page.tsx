import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

const HomeClient = dynamic(
  () =>
    import("@/features/home/components/HomeClient").then((mod) => mod.HomeClient),
  {
    loading: () => (
      <div className="loading-skeleton" aria-label="Loading homepage">
        <div className="skeleton-hero">
          <div className="skeleton-pulse skeleton-hero-bg" />
          <div className="skeleton-hero-content">
            <div className="skeleton-pulse skeleton-line skeleton-line-sm" />
            <div className="skeleton-pulse skeleton-line skeleton-line-lg" />
            <div className="skeleton-pulse skeleton-line skeleton-line-md" />
          </div>
        </div>
      </div>
    ),
  }
);

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
