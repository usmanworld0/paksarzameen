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
    <div className="bg-[#f3f3ee]">
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">News Hub</p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            News &amp; Resources
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Follow the latest PSZ field updates, impact stories, announcements,
            and resource-led reporting from our work in education, health,
            environment, welfare, and community outreach.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#E5E5E5] bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#111111]">
              {articles.length} Total updates
            </span>
            <span className="rounded-full border border-[#E5E5E5] bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#111111]">
              {categoriesCount} Focus areas
            </span>
          </div>
        </div>
      </header>
      <NewsHubClient articles={articles} />
    </div>
  );
}
