"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { siteConfig } from "@/config/site";
import type { Article } from "@/lib/models/Article";

type NewsHubClientProps = {
  articles: Article[];
};

const articleBaseUrl = `${siteConfig.siteUrl}/news/`;

export function NewsHubClient({ articles }: NewsHubClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const sortedArticles = useMemo(
    () =>
      [...articles].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [articles],
  );

  const categories = useMemo(
    () => ["All", ...new Set(sortedArticles.map((article) => article.category))],
    [sortedArticles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortedArticles.filter((article) => {
      const matchCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchSearch =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, query, sortedArticles]);

  const relatedCount = (source: Article) =>
    sortedArticles.filter(
      (candidate) =>
        candidate.id !== source.id && candidate.category === source.category,
    ).length;

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      aria-labelledby="news-hub-controls-heading"
    >
      <h2 id="news-hub-controls-heading" className="sr-only">
        News filters and results
      </h2>
      <header className="rounded-3xl border border-psz-forest/10 bg-white/85 p-5 shadow-panel sm:p-6">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-olive" htmlFor="news-search">
          Search News
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates, stories, and announcements"
          className="mt-2 w-full rounded-2xl border border-psz-forest/15 bg-white px-4 py-3 text-sm text-psz-charcoal outline-none ring-0 placeholder:text-psz-charcoal/45 focus:border-psz-olive"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "bg-psz-forest text-psz-cream"
                    : "border border-psz-forest/20 bg-white text-psz-forest hover:bg-psz-forest/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {filteredArticles.map((article) => {
          const url = `${articleBaseUrl}${article.slug}`;
          const encodedUrl = encodeURIComponent(url);
          const encodedTitle = encodeURIComponent(article.title);

          return (
            <article
              key={article.id}
              className="overflow-hidden rounded-3xl border border-psz-forest/10 bg-white shadow-panel"
            >
              <div className="h-40 bg-[linear-gradient(135deg,#203a2b,#496955)] p-5 text-psz-cream">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-sand">
                  {article.category}
                </p>
                <p className="mt-7 font-heading text-2xl leading-tight">
                  {article.title}
                </p>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-psz-olive/80">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm leading-relaxed text-psz-charcoal/80">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-psz-charcoal/70">
                  <span>{relatedCount(article)} related in this category</span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-psz-forest"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-psz-forest"
                  >
                    Share on WhatsApp
                  </a>
                </div>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-psz-forest hover:text-psz-olive"
                >
                  Read Full Article
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-psz-forest/20 bg-white/80 px-5 py-8 text-center text-sm text-psz-charcoal/70">
          No articles found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
