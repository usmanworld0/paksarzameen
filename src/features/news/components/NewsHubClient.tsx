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
      className="site-section"
      aria-labelledby="news-hub-controls-heading"
    >
      <h2 id="news-hub-controls-heading" className="sr-only">News filters and results</h2>
      <header className="site-form-shell site-form-shell--soft p-5 sm:p-6">
        <label className="site-form-label site-form-label--caps" htmlFor="news-search">
          Search News
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates, stories, and announcements"
          className="site-input mt-3"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2.5 text-[1.2rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#cacacb] bg-white text-[#111111] hover:border-[#111111] hover:bg-[#f5f5f5]"
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
              className="group overflow-hidden border border-[#e5e5e5] bg-white transition-colors hover:border-[#111111]"
            >
              <div className="border-b border-[#e5e5e5] bg-[#fafafa] p-6">
                <p className="text-[1.1rem] font-medium uppercase tracking-[0.2em] text-[#707072]">
                  {article.category}
                </p>
                <p className="mt-4 font-['Arial_Narrow'] text-[2.8rem] font-bold uppercase leading-[0.95] tracking-[-0.05em] text-[#111111]">
                  {article.title}
                </p>
              </div>
              <div className="space-y-4 p-6">
                <p className="text-[1.1rem] uppercase tracking-[0.14em] text-[#707072]">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[1.5rem] leading-[1.8] text-[#707072]">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.2rem] text-[#707072]">
                  <span className="rounded-full border border-[#e5e5e5] bg-[#fafafa] px-3 py-1.5 text-[1rem] font-medium uppercase tracking-[0.08em] text-[#111111]">
                    {relatedCount(article)} related in this category
                  </span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#111111]"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#111111]"
                  >
                    Share on WhatsApp
                  </a>
                </div>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-2 text-[1.25rem] font-medium uppercase tracking-[0.12em] text-[#111111] transition-colors hover:text-[#707072]"
                >
                  Read Full Article
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="site-status mt-8 border-dashed px-5 py-10 text-center">
          No articles found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
