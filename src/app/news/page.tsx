import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { NewsHubClient } from "@/features/news/components/NewsHubClient";
import { getArticles } from "@/lib/services/getArticles";

export const metadata: Metadata = {
  title: "News",
  description:
    "Read the latest PakSarZameen impact stories, program announcements, and field updates.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "PSZ | News",
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
    title: "PSZ | News",
    description:
      "Explore categorized updates, search by topic, and discover related stories.",
    images: ["/images/placeholders/news-cover.svg"],
  },
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <header className="mx-auto w-full max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          News Hub
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight tracking-tight gradient-text sm:text-6xl">
          Stories, Resources, And Field Updates
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-psz-gray-400 sm:text-lg">
          Filter by category, search across updates, and follow the latest PSZ
          work through detailed reports and announcements.
        </p>
      </header>
      <NewsHubClient articles={articles} />
    </>
  );
}
