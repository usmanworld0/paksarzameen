"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
      className="px-[5%] pb-20 pt-10"
      aria-labelledby="news-hub-controls-heading"
    >
      <h2 id="news-hub-controls-heading" className="sr-only">
        News filters and results
      </h2>
      <div className="mx-auto max-w-screen-xl">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
          <label
            className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5"
            htmlFor="news-search"
          >
            Search News
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search updates, stories, and announcements"
              className="w-full rounded-xl border border-[#E5E5E5] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "border-[#0f7a47] bg-[#0f7a47] text-white"
                      : "border-[#E5E5E5] bg-white text-[#707072] hover:border-[#0f7a47] hover:text-[#0f7a47]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const url = `${articleBaseUrl}${article.slug}`;
            const encodedUrl = encodeURIComponent(url);
            const encodedTitle = encodeURIComponent(article.title);

            return (
              <article
                key={article.id}
                className="group overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">
                    {article.category}
                  </p>
                  <h2 className="mt-1.5 text-lg font-black tracking-tighter text-[#111111]">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-[#707072] line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold text-[#707072]">
                    <span className="rounded-full bg-[#f3f3ee] px-2.5 py-1 uppercase tracking-[0.06em] text-[#0f7a47]">
                      {relatedCount(article)} related
                    </span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0f7a47]"
                    >
                      Share on X
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0f7a47]"
                    >
                      WhatsApp
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-3">
                    <span className="text-[10px] font-semibold text-[#707072]">
                      {new Date(article.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-[10px] font-black uppercase tracking-[0.1em] text-[#111111] transition hover:text-[#0f7a47]"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-5 py-10 text-center text-sm font-medium text-[#707072]">
            No articles found for this filter. Try another category or search term.
          </div>
        ) : null}
      </div>
    </section>
  );
}
