"use client";

import Image from "next/image";
import Link from "next/link";
import { MarketplaceHero } from "@/features/commonwealth-lab/components/MarketplaceHero";
import { ProductCard } from "@/features/commonwealth-lab/components/ProductCard";
import { dummyProducts } from "@/data/products";
import { PRODUCT_CATEGORIES } from "@/lib/models/Product";

const featured = dummyProducts.filter((p) => p.featured);

const CATEGORY_IMAGES: Record<string, string> = {
  "Traditional Clothing":
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
  Handicrafts:
    "https://images.unsplash.com/photo-1612196808214-b7e239e5f6dc?w=600&h=800&fit=crop",
  "Cultural Goods":
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=800&fit=crop",
  "PSZ Merchandise":
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=800&fit=crop",
};

export default function CommonwealthLabPage() {
  return (
    <>
      {/* Hero */}
      <MarketplaceHero />

      {/* Featured Products */}
      <section id="featured" className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section header */}
          <div className="mb-16 flex flex-col items-start gap-4 border-b border-neutral-100 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#009040]">
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

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider strip — PSZ green accent */}
      <div className="bg-[#009040] py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80">
            100% of profits support artisan communities &amp; PSZ social programmes
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 border-b border-neutral-100 pb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#009040]">
              Browse By
            </p>
            <h2
              className="mt-2 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Shop Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-50 group-hover:scale-105"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative z-10 p-7">
                  <h3
                    className="text-xl font-light text-white"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {category}
                  </h3>
                  <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
                    Explore Collection →
                  </p>
                </div>
                {/* Bottom border accent on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#009040] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/20" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/40">
              Commonwealth Lab
            </p>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2
            className="text-3xl font-light tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Every Purchase Makes an Impact
          </h2>
          <div className="mx-auto my-8 h-px w-16 bg-white/15" />
          <p className="text-sm font-light leading-relaxed tracking-wide text-white/50">
            When you shop at Commonwealth Lab, 100&nbsp;% of profits go directly
            to artisan communities and PakSarZameen social programmes.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/commonwealth-lab/products"
              className="border border-white/70 px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-neutral-900"
            >
              Explore Collection
            </Link>
            <Link
              href="/"
              className="px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors duration-300 hover:text-white"
            >
              Learn About PSZ →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
