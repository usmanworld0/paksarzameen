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
      <header className="mt-10 rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(245,251,247,0.94))] p-5 shadow-[0_16px_38px_rgba(35,98,72,0.12)] sm:p-6">
        <label className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f8f63]" htmlFor="news-search">
          Search News
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates, stories, and announcements"
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 border ${
                  isActive
                    ? "border-transparent bg-[linear-gradient(120deg,#1f8f63_0%,#2ea874_55%,#58b88a_100%)] text-white shadow-[0_8px_18px_rgba(31,116,78,0.3)]"
                    : "border-[#d0e1d8] bg-white text-[#4e665a] hover:-translate-y-0.5 hover:border-[#afceb8] hover:bg-[#f4fbf7]"
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
              className="group overflow-hidden rounded-3xl border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(247,252,249,0.95))] shadow-[0_14px_34px_rgba(35,98,72,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9cc9b0] hover:shadow-[0_18px_40px_rgba(35,98,72,0.18)]"
            >
              <div className="border-b border-[#deeee5] bg-[linear-gradient(160deg,rgba(242,250,246,0.92),rgba(255,255,255,0.95))] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f8f63]">
                  {article.category}
                </p>
                <p className="mt-4 font-heading text-2xl font-semibold leading-tight text-[#19342a] transition-colors duration-300 group-hover:text-[#1f8f63]">
                  {article.title}
                </p>
              </div>
              <div className="space-y-4 p-6">
                <p className="text-sm uppercase tracking-[0.14em] text-[#6f887c]">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-base leading-relaxed text-[#4a6357]">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#668274]">
                  <span className="rounded-full bg-[#ecf8f1] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#1f8f63]">
                    {relatedCount(article)} related in this category
                  </span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#1f8f63]"
                  >
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#1b7a54]"
                  >
                    Share on WhatsApp
                  </a>
                </div>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#1f8f63] transition-all duration-300 hover:gap-3 hover:text-[#1b7a54]"
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
        <div className="mt-8 rounded-2xl border border-dashed border-[#cde0d5] bg-[linear-gradient(165deg,rgba(247,252,249,0.98),rgba(255,255,255,0.95))] px-5 py-10 text-center text-sm text-[#668274]">
          No articles found for this filter. Try another category or search term.
        </div>
      ) : null}
    </section>
  );
}
