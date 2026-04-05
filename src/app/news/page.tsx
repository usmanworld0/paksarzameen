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
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(128deg,#e9f7ef_0%,#f8fcf9_45%,#e2f3e9_100%)]">
        <div className="pointer-events-none absolute left-[-7rem] top-[1rem] h-80 w-80 rounded-full bg-[#1f8f63]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-6rem] top-[2rem] h-80 w-80 rounded-full bg-[#2ea874]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[35%] h-72 w-72 rounded-full bg-[#6cc196]/16 blur-3xl" />

        <header className="relative z-10 mx-auto w-full max-w-screen-xl px-[5%] pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pt-36">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f8f63]">
            News Hub
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.02] tracking-tight text-[#173429] sm:text-5xl lg:text-6xl">
            PakSarZameen News And Resources
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#486257] sm:text-lg lg:max-w-3xl lg:text-xl">
            Follow the latest PSZ field updates, impact stories, announcements,
            and resource-led reporting from our work in education, health,
            environment, welfare, and community outreach.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#355246] shadow-[0_8px_20px_rgba(38,85,62,0.12)]">
              {articles.length} Total updates
            </span>
            <span className="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-[#355246] shadow-[0_8px_20px_rgba(38,85,62,0.12)]">
              {categoriesCount} Focus areas
            </span>
          </div>
        </header>
      </section>
      <NewsHubClient articles={articles} />
    </>
  );
}
