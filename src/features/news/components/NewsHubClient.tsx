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
      className="mx-auto w-full max-w-screen-xl px-[5%] pb-20"
      aria-labelledby="news-hub-controls-heading"
    >
      <h2 id="news-hub-controls-heading" className="sr-only">
        News filters and results
      </h2>
      <header className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 mt-10 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-green" htmlFor="news-search">
          Search News
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates, stories, and announcements"
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-psz-green/60 transition-colors"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all border ${
                  isActive
                    ? "bg-psz-green text-white border-psz-green"
                    : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400"
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
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-psz-green/30"
            >
              <div className="bg-neutral-50 p-6 border-b border-neutral-100">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green/80">
                  {article.category}
                </p>
                <p className="mt-4 font-heading text-xl font-semibold leading-tight text-neutral-900">
                  {article.title}
                </p>
              </div>
              <div className="space-y-4 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400">
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
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center text-sm text-neutral-400">
          No articles found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
