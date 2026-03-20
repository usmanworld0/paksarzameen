import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { HomeClient } from "@/features/home/components/HomeClient";

export const metadata: Metadata = {
  title: "NGO In Pakistan For Education, Health And Community Welfare",
  description:
    "PakSarZameen is a community development NGO in Pakistan working from Bahawalpur through volunteer programs, education support, health outreach, blood bank response, environmental action, and animal welfare.",
  keywords: [
    ...siteConfig.seo.keywords,
    "community development ngo pakistan",
    "bahawalpur ngo",
    "education health welfare pakistan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PakSarZameen | NGO In Pakistan For Community Development",
    description:
      "Explore PakSarZameen's work in education, health, blood support, environmental action, animal welfare, and volunteer-led community development across Pakistan.",
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
    title: "PakSarZameen | NGO In Pakistan For Community Development",
    description:
      "Explore PakSarZameen's work in education, health, blood support, environmental action, animal welfare, and volunteer-led community development across Pakistan.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
