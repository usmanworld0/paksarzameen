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
    <main className="site-page">
      <article className="site-detail">
        <div className="site-shell--narrow">
          <Link href="/news" className="site-back-link">
            Back To News Hub
          </Link>

          <header className="site-detail__hero mt-6">
            <p className="site-eyebrow">{article.category}</p>
            <h1 className="site-display mt-4 max-w-[13ch]">{article.title}</h1>
            <div className="site-meta-row mt-5">
              <span>
                {new Date(article.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="site-copy mt-4">{article.excerpt}</p>
          </header>

          <section className="site-panel mt-6">
            <div className="site-panel__body">
              <p className="site-card__eyebrow">Full article</p>
              <h2 className="site-heading site-heading--sm mt-3">Article</h2>
              <p className="site-copy mt-4">{article.fullContent}</p>
            </div>
          </section>

          <section className="site-panel mt-6">
            <div className="site-panel__body">
              <p className="site-card__eyebrow">Share</p>
              <h2 className="site-heading site-heading--sm mt-3">Share</h2>
              <div className="site-form-actions mt-5">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-button-secondary"
                >
                  Share on X
                </a>
                <a
                  href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-button-secondary"
                >
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </section>

          <section className="site-section">
            <div>
              <p className="site-eyebrow">Related</p>
              <h2 className="site-heading site-heading--sm mt-3">Related</h2>
            </div>

            {relatedArticles.length > 0 ? (
              <div className="site-grid site-grid--three mt-6">
                {relatedArticles.map((related) => (
                  <article key={related.id} className="site-card site-card--rounded">
                    <div className="site-card__body">
                      <p className="site-card__eyebrow">{related.category}</p>
                      <h3 className="site-card__title">{related.title}</h3>
                      <p className="site-card__text">{related.excerpt}</p>
                      <Link href={`/news/${related.slug}`} className="site-card-link mt-5">
                        Read Story
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="site-empty mt-6">
                More related stories will appear here as the resource library grows.
              </div>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}
