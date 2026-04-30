import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { NewsHubClient } from "@/features/news/components/NewsHubClient";
import { getArticles } from "@/lib/services/getArticles";

export const metadata: Metadata = {
  title: "News, Resources And Impact Stories",
  description:
    "Read PakSarZameen impact stories, updates, field reports, program announcements, and community development resources from Pakistan.",
  keywords: [
    ...siteConfig.seo.keywords,
    "news pakistan",
    "impact stories pakistan",
    "community development updates pakistan",
  ],
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News, Resources And Impact Stories | PakSarZameen",
    description:
      "Explore field updates, program announcements, and impact stories from PakSarZameen's work across Pakistan.",
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
    title: "News, Resources And Impact Stories | PakSarZameen",
    description:
      "Explore field updates, program announcements, and impact stories from PakSarZameen's work across Pakistan.",
    images: ["/images/placeholders/news-cover.svg"],
  },
};

export default async function NewsPage() {
  const articles = await getArticles();
  const categoriesCount = new Set(articles.map((article) => article.category)).size;

  return (
    <main className="site-page">
      <section className="site-hero">
        <div className="site-hero__noise" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--left" aria-hidden="true" />
        <div className="site-hero__orb site-hero__orb--right" aria-hidden="true" />

        <header className="site-hero__inner">
          <p className="site-hero__eyebrow">News Hub</p>
          <h1 className="site-hero__title">PakSarZameen News And Resources</h1>
          <p className="site-hero__body">
            Follow the latest PSZ field updates, impact stories, announcements,
            and resource-led reporting from our work in education, health,
            environment, welfare, and community outreach.
          </p>

          <div className="site-hero__chips">
            <span className="site-chip">
              {articles.length} Total updates
            </span>
            <span className="site-chip">
              {categoriesCount} Focus areas
            </span>
          </div>
        </header>
      </section>
      <NewsHubClient articles={articles} />
    </main>
  );
}
