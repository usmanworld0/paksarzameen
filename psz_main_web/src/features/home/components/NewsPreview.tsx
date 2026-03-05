import Link from "next/link";

import type { Article } from "@/lib/models/Article";

type NewsPreviewProps = {
  articles: Article[];
};

export function NewsPreview({ articles }: NewsPreviewProps) {
  return (
    <section className="border-t border-psz-forest/10 bg-white/50 py-20" aria-labelledby="news-preview-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-psz-olive">
              News And Resources
            </p>
            <h2
              id="news-preview-heading"
              className="mt-3 font-heading text-4xl leading-tight text-psz-forest sm:text-5xl"
            >
              Latest Updates From The Field
            </h2>
          </div>
          <Link
            href="/news"
            className="rounded-full border border-psz-forest/20 px-5 py-2 text-sm font-semibold text-psz-forest transition-colors hover:bg-psz-forest hover:text-psz-cream"
          >
            Browse All News
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="overflow-hidden rounded-3xl border border-psz-forest/10 bg-white shadow-panel"
            >
              <div className="h-44 bg-[linear-gradient(140deg,#223f2f,#3f5f4c)] p-5 text-psz-cream">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-sand">
                  {article.category}
                </p>
                <p className="mt-8 font-heading text-3xl leading-none text-psz-cream/85">
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-psz-olive/80">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-3 font-heading text-2xl text-psz-forest">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-psz-charcoal/80">
                  {article.excerpt}
                </p>
                <Link
                  href={`/news/${article.slug}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-psz-forest hover:text-psz-olive"
                >
                  Read Story
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
