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
    <article className="mx-auto w-full max-w-screen-xl px-[5%] py-24 sm:py-28 lg:py-32">
      <Link
        href="/news"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-psz-green hover:text-psz-green-light transition-colors"
      >
        &larr; Back To News Hub
      </Link>

      <header className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
          {article.category}
        </p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-neutral-400">
          {new Date(article.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base lg:max-w-3xl lg:text-lg">
          {article.excerpt}
        </p>
      </header>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-3xl font-semibold text-neutral-900">Full Article</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500 sm:text-base">
          {article.fullContent}
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-3xl font-semibold text-neutral-900">Share This Story</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-600 hover:bg-psz-green hover:text-white hover:border-psz-green transition-all"
          >
            Share on X
          </a>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-600 hover:bg-psz-green hover:text-white hover:border-psz-green transition-all"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="related-articles-heading">
        <h2 id="related-articles-heading" className="font-heading text-3xl font-semibold text-neutral-900">
          Related Articles
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.length > 0 ? (
            relatedArticles.map((related) => (
              <article
                key={related.id}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-psz-green/30"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
                  {related.category}
                </p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-neutral-900 group-hover:text-psz-green transition-colors">
                  {related.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {related.excerpt}
                </p>
                <Link
                  href={`/news/${related.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-psz-green hover:text-psz-green-light transition-colors"
                >
                  Read Related Story
                </Link>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm text-neutral-400">
              More related articles will appear as the resource library grows.
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
