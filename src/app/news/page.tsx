import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { NewsHubClient } from "@/features/news/components/NewsHubClient";
import { getArticles } from "@/lib/services/getArticles";

export const metadata: Metadata = {
  title: "PakSarzameen News and Resources",
  description:
    "Read the latest PakSarZameen impact stories, program announcements, and field updates.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "PakSarzameen News and Resources",
    description:
      "Explore categorized updates, search by topic, and discover related stories.",
    url: `${siteConfig.siteUrl}/news`,
    type: "website",
    images: [
      {
        url: "/images/placeholders/news-cover.svg",
        width: 1200,
        height: 800,
        alt: "News and resources hub preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PakSarzameen News and Resources",
    description:
      "Explore categorized updates, search by topic, and discover related stories.",
    images: ["/images/placeholders/news-cover.svg"],
  },
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <div className="news-hero-section">
        <div className="news-hero-overlay" />
        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pt-36">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
            News Hub
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            PakSarZameen News And Resources
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-100 sm:text-base lg:max-w-3xl lg:text-lg">
            Filter by category, search across updates, and follow the latest PSZ
            work through detailed reports and announcements.
          </p>
        </header>
      </div>
      <NewsHubClient articles={articles} />
    </>
  );
}
