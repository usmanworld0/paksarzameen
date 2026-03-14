import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { SearchBar } from "@/components/storefront/SearchBar";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getRequestRegion } from "@/lib/pricing-server";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our curated collection of premium artisan products from Pakistan.",
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const region = await getRequestRegion();
  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts({
      categorySlug: searchParams.category,
      search: searchParams.search,
      sort: searchParams.sort,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
    }),
    getCategories(),
  ]);

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="bg-white py-24">
          <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
            {/* Header */}
            <header className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                Paksarzameen Store
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                All Products
              </h1>
            </header>

            {/* Controls */}
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <CategoryFilter categories={categories} />
              <SearchBar />
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-lg text-neutral-400">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} region={region} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-14 flex items-center justify-center gap-2"
              >
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={`/products?${new URLSearchParams({
                      ...searchParams,
                      page: String(n),
                    })}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      n === currentPage
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {n}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
