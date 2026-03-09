import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getArtists } from "@/actions/artists";
import { ArtistCard } from "@/components/storefront/ArtistCard";
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
        <HeroSection />

        {/* Categories Grid */}
        {categories.length > 0 && (
          <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
                  Browse
                </p>
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  Shop by Category
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {categories.slice(0, 8).map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Meet the Artisans */}
        {artists.length > 0 && (
          <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-10 bg-[#f5f4f2]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
                  Craftsmanship
                </p>
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  Meet the Artisans
                </h2>
                <p className="text-sm text-neutral-500 mt-3 max-w-md mx-auto">
                  Each artisan brings generations of tradition to their craft.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {artists.slice(0, 5).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
              {artists.length > 5 && (
                <div className="text-center mt-10">
                  <Link
                    href="/artists"
                    className="inline-block border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.25em] uppercase px-8 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                  >
                    View All Artisans
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
                  Curated
                </p>
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  Featured Collection
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-block border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.25em] uppercase px-8 py-3 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Green Divider Strip */}
        <div className="h-1 bg-[#0c2e1a]" />

        {/* CTA Section */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-[#0c2e1a] text-white text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">
              PakSarZameen
            </p>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight mb-4">
              Empower Pakistani Artisans
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10">
              Every purchase supports local craftspeople and preserves
              centuries-old traditions. Shop with purpose.
            </p>
            <Link
              href="/products"
              className="inline-block border border-white/60 text-white text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-white hover:text-[#0c2e1a] transition-all duration-300"
            >
              Explore the Collection
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
