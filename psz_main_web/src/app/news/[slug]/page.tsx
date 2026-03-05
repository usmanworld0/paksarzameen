import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getArticleBySlug } from "@/lib/services/getArticleBySlug";
import { getArticles } from "@/lib/services/getArticles";

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
    <article className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/news"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-psz-olive hover:text-psz-forest"
      >
        Back To News Hub
      </Link>

      <header className="mt-4 rounded-[2rem] border border-psz-forest/10 bg-[linear-gradient(140deg,#1d3528,#3d5c49)] p-8 text-psz-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-psz-sand">
          {article.category}
        </p>
        <h1 className="mt-3 max-w-4xl font-heading text-5xl leading-tight sm:text-6xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-psz-cream/85">
          {new Date(article.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-psz-cream/90 sm:text-lg">
          {article.excerpt}
        </p>
      </header>

      <section className="mt-10 rounded-3xl border border-psz-forest/10 bg-white p-7 shadow-panel">
        <h2 className="font-heading text-3xl text-psz-forest">Full Article</h2>
        <p className="mt-4 text-sm leading-relaxed text-psz-charcoal/80 sm:text-base">
          {article.fullContent}
        </p>
      </section>

      <section className="mt-10 rounded-3xl border border-psz-forest/10 bg-white p-7 shadow-panel">
        <h2 className="font-heading text-3xl text-psz-forest">Share This Story</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-psz-forest/20 px-4 py-2 text-psz-forest hover:bg-psz-forest hover:text-psz-cream"
          >
            Share on X
          </a>
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-psz-forest/20 px-4 py-2 text-psz-forest hover:bg-psz-forest hover:text-psz-cream"
          >
            Share on WhatsApp
          </a>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="related-articles-heading">
        <h2 id="related-articles-heading" className="font-heading text-3xl text-psz-forest">
          Related Articles
        </h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.length > 0 ? (
            relatedArticles.map((related) => (
              <article
                key={related.id}
                className="rounded-2xl border border-psz-forest/10 bg-white p-5 shadow-panel"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-psz-olive">
                  {related.category}
                </p>
                <h3 className="mt-3 font-heading text-2xl text-psz-forest">
                  {related.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-psz-charcoal/80">
                  {related.excerpt}
                </p>
                <Link
                  href={`/news/${related.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-psz-forest hover:text-psz-olive"
                >
                  Read Related Story
                </Link>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-psz-forest/20 bg-white p-5 text-sm text-psz-charcoal/70">
              More related articles will appear as the resource library grows.
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
