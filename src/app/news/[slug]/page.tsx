import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getArticleBySlug } from "@/lib/services/getArticleBySlug";
import { getArticles } from "@/lib/services/getArticles";

export const revalidate = 3600;

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const articleBaseUrl = `${siteConfig.siteUrl}/news/`;

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [
      ...siteConfig.seo.keywords,
      article.category.toLowerCase(),
      article.title,
      "news pakistan",
    ],
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | PakSarZameen`,
      description: article.excerpt,
      url: `${siteConfig.siteUrl}/news/${article.slug}`,
      type: "article",
      images: [
        {
          url: "/images/placeholders/news-cover.svg",
          width: 1200,
          height: 800,
          alt: `${article.title} article cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | PakSarZameen`,
      description: article.excerpt,
      images: ["/images/placeholders/news-cover.svg"],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter(
      (candidate) =>
        candidate.id !== article.id && candidate.category === article.category,
    )
    .slice(0, 3);

  const shareUrl = `${articleBaseUrl}${article.slug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <div className="bg-[#f3f3ee]">
      <div className="px-[5%] pb-20 pt-10">
        <div className="mx-auto max-w-screen-xl">
          <Link
            href="/news"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47] transition hover:text-[#1a9d5f]"
          >
            &larr; Back To News Hub
          </Link>

          <header className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 lg:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              {article.category}
            </p>
            <h1 className="mt-3 max-w-4xl text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl lg:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#707072]">
              {new Date(article.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[#707072] lg:max-w-3xl">
              {article.excerpt}
            </p>
          </header>

          <section className="mt-5 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Full Article</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[#707072]">
              {article.fullContent}
            </p>
          </section>

          <section className="mt-5 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Share This Story</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#111111] transition hover:bg-[#0f7a47] hover:text-white hover:border-[#0f7a47]"
              >
                Share on X
              </a>
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#111111] transition hover:bg-[#0f7a47] hover:text-white hover:border-[#0f7a47]"
              >
                Share on WhatsApp
              </a>
            </div>
          </section>

          <section className="mt-5" aria-labelledby="related-articles-heading">
            <h2
              id="related-articles-heading"
              className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl"
            >
              Related Articles
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((related) => (
                  <article
                    key={related.id}
                    className="group overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
                  >
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">
                        {related.category}
                      </p>
                      <h3 className="mt-1.5 text-base font-black tracking-tighter text-[#111111]">
                        {related.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm font-medium text-[#707072]">
                        {related.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-3">
                        <span className="text-[10px] font-semibold text-[#707072]">
                          {new Date(related.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <Link
                          href={`/news/${related.slug}`}
                          className="text-[10px] font-black uppercase tracking-[0.1em] text-[#111111] transition hover:text-[#0f7a47]"
                        >
                          Read &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-white p-5 text-sm font-medium text-[#707072]">
                  More related articles will appear as the resource library grows.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
