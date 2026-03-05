"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

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
      <header className="rounded-3xl glass-strong p-5 sm:p-6 mt-10">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-green" htmlFor="news-search">
          Search News
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates, stories, and announcements"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-psz-gray-600 focus:border-psz-green/40 transition-colors"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                  isActive
                    ? "bg-psz-green text-white"
                    : "border border-white/10 bg-white/5 text-psz-gray-300 hover:bg-white/10 hover:text-white"
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
              className="group overflow-hidden rounded-3xl glass transition-all hover:border-psz-green/20"
            >
              <div className="h-40 bg-gradient-to-br from-psz-green/15 via-psz-green/5 to-transparent p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
                  {article.category}
                </p>
                <p className="mt-7 font-heading text-2xl font-semibold leading-tight text-white">
                  {article.title}
                </p>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-psz-gray-600">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm leading-relaxed text-psz-gray-400">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-psz-gray-600">
                  <span>{relatedCount(article)} related in this category</span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-psz-green transition-colors"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-psz-green transition-colors"
                  >
                    Share on WhatsApp
                  </a>
                </div>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-psz-green hover:text-psz-green-light transition-colors"
                >
                  Read Full Article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 glass px-5 py-8 text-center text-sm text-psz-gray-400">
          No articles found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
