import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ArtistCard } from "@/components/storefront/ArtistCard";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getArtists } from "@/actions/artists";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ products: featured }, categories, artists] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
    getArtists(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Category Grid */}
        {categories.length > 0 && (
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
                {categories.slice(0, 8).map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Meet the Artisans */}
        {artists.length > 0 && (
          <section className="bg-neutral-50 py-16 sm:py-28">
            <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
              {/* Section header */}
              <div className="mb-16 border-b border-neutral-100 pb-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#0c2e1a]">
                  Stories & Heritage
                </p>
                <h2
                  className="mt-2 text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Meet the Artists
                </h2>
                <p className="mt-4 text-sm font-light text-neutral-600">
                  Discover the talented artisans behind Commonwealth Lab&apos;s finest collections.
                  Each piece represents decades of heritage, skill, and dedication to traditional craftsmanship.
                </p>
              </div>

              {/* Artist Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {artists.slice(0, 5).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>

              {artists.length > 5 && (
                <div className="mt-12 text-center">
                  <Link
                    href="/artists"
                    className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    View All Artisans →
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
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
                  href="/products"
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
        )}

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
                Commonwealth Lab
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
              When you shop at Commonwealth Lab, 100&nbsp;% of profits go directly
              to artisan communities and PakSarZameen social programmes.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/products"
                className="border border-neutral-900 px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-900 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
              >
                Explore Collection
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://paksarzameenwfo.com"}
                className="px-10 py-3.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 transition-colors duration-300 hover:text-neutral-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn About PSZ →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
