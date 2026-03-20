import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarketplaceHero } from "@/features/commonwealth-lab/components/MarketplaceHero";
import { ProductCard } from "@/features/commonwealth-lab/components/ProductCard";
import { MeetTheArtistsSection } from "@/features/commonwealth-lab/components/MeetTheArtistsSection";
import { dummyProducts } from "@/data/products";
import { PRODUCT_CATEGORIES } from "@/lib/models/Product";

const featured = dummyProducts.filter((p) => p.featured);

// Map each category to a representative product image
const PRODUCT_IMAGE_NAMES = [
  "Commisioned_Art.jpeg",
  "Crockery.jpeg",
  "Gemstones.png",
  "Jewellery.png",
  "Lamps.jpeg",
  "Leather.jpeg",
  "Musical_Instrunments.jpeg",
  "Textiles.jpeg",
] as const;

const PRODUCT_IMAGES = PRODUCT_IMAGE_NAMES.map(
  (name) => `/images/products/${encodeURIComponent(name)}`
);

const CATEGORY_IMAGES: Record<string, string> = {
  "Commissioned Art": PRODUCT_IMAGES[0],
  "Crockery": PRODUCT_IMAGES[1],
  "Gemstones": PRODUCT_IMAGES[2],
  "Jewellery": PRODUCT_IMAGES[3],
  "Lamps": PRODUCT_IMAGES[4],
  "Leather": PRODUCT_IMAGES[5],
  "Musical Instruments": PRODUCT_IMAGES[6],
  "Textiles": PRODUCT_IMAGES[7],
};

export const metadata: Metadata = {
  title: "Paksarzameen Store: Ethical Artisan Marketplace",
  description:
    "Discover the Paksarzameen Store, an ethical artisan marketplace where every purchase supports local communities and PakSarZameen social programs.",
  keywords: [
    ...siteConfig.seo.keywords,
    "ethical artisan marketplace pakistan",
    "social impact shopping pakistan",
    "paksarzameen store",
  ],
  alternates: {
    canonical: "/commonwealth-lab",
  },
  openGraph: {
    title: "Paksarzameen Store | Ethical Artisan Marketplace",
    description:
      "Shop artisan products that support local makers and PakSarZameen community development work.",
    url: `${siteConfig.siteUrl}/commonwealth-lab`,
    type: "website",
    images: [
      {
        url: "/images/hero-fallback.svg",
        width: 1600,
        height: 1000,
        alt: "PakSarZameen humanitarian activities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paksarzameen Store | Ethical Artisan Marketplace",
    description:
      "Shop artisan products that support local makers and PakSarZameen community development work.",
    images: ["/images/hero-fallback.svg"],
  },
};

export default function PaksarzameenStorePage() {
  return (
    <>
      {/* Hero */}
      <MarketplaceHero />

      {/* Category Grid */}
      <section className="bg-white py-16 sm:py-28">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
          <div className="mb-16 border-b border-neutral-100 pb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
              Browse By
            </p>
            <h2
              className="mt-2 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Shop Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/commonwealth-lab/products?category=${encodeURIComponent(category)}`}
                className="group relative flex aspect-[3/4] items-end overflow-hidden bg-neutral-900"
              >
                <Image
                  src={CATEGORY_IMAGES[category]}
                  alt={category}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative z-10 p-6 w-full">
                  <h3
                    className="text-lg font-light text-white"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {category}
                  </h3>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
                    Explore →
                  </p>
                </div>
                {/* Bottom border accent on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#0c2e1a] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Artists */}
      <MeetTheArtistsSection />

      {/* Featured Products */}
      <section id="featured" className="bg-white py-16 sm:py-28">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
          {/* Section header */}
          <div className="mb-16 flex flex-col items-start gap-4 border-b border-neutral-100 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
                Curated Selection
              </p>
              <h2
                className="mt-2 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              href="/commonwealth-lab/products"
              className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-neutral-900"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-12 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider strip — PSZ green accent */}
      <div className="bg-[#0c2e1a] py-10">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-16">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80">
            100% of profits support artisan communities &amp; PSZ social programmes
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-white py-20 sm:py-32 border-t border-neutral-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-neutral-200" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-neutral-400">
              Paksarzameen Store
            </p>
            <span className="h-px w-12 bg-neutral-200" />
          </div>
          <h2
            className="text-3xl font-light tracking-tight text-neutral-900 sm:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Every Purchase Makes an Impact
          </h2>
          <div className="mx-auto my-8 h-px w-16 bg-neutral-200" />
          <p className="text-sm font-light leading-relaxed tracking-wide text-neutral-500">
            When you shop at Paksarzameen Store, 100&nbsp;% of profits go directly
            to artisan communities and PakSarZameen social programmes.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-neutral-500">
            Instagram: <a href={siteConfig.social.commonwealthInstagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0c2e1a] hover:underline">@commonwealthlab.psz</a>
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/commonwealth-lab/products"
              className="border border-neutral-900 px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
            >
              Explore Collection
            </Link>
            <Link
              href="/"
              className="px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 transition-colors duration-300 hover:text-neutral-900"
            >
              Learn About PSZ →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
