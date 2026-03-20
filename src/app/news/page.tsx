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
            Follow the latest PSZ field updates, impact stories, announcements,
            and resource-led reporting from our work in education, health,
            environment, welfare, and community outreach.
          </p>
        </header>
      </div>
      <NewsHubClient articles={articles} />
    </>
  );
}
