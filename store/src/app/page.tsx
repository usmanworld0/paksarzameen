import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ products: featured }, categories] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Categories */}
        {categories.length > 0 && (
          <section className="container-wide py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-semibold">Shop by Category</h2>
                <p className="text-muted-foreground mt-2">
                  Discover artisan craftsmanship across traditions
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section className="bg-white py-20">
            <div className="container-wide">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-semibold">Featured Collection</h2>
                  <p className="text-muted-foreground mt-2">
                    Hand-selected pieces from our finest artisans
                  </p>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                >
                  Shop All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="container-wide py-20">
          <div className="bg-brand-charcoal rounded-sm p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Empower Pakistani Artisans
            </h2>
            <p className="text-neutral-300 max-w-xl mx-auto mb-8">
              Every purchase supports local craftspeople and preserves centuries-old
              traditions. Shop with purpose.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-brand-gold text-brand-charcoal font-medium rounded-sm hover:bg-brand-gold/90 transition-colors text-sm"
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
