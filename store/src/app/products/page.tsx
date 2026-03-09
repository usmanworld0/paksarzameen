import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { SearchBar } from "@/components/storefront/SearchBar";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";

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
        {/* Page header */}
        <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
              Collection
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight mb-2">
              All Products
            </h1>
            <p className="text-sm text-neutral-400">
              {total} {total === 1 ? "product" : "products"} available
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          {/* Filters */}
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <CategoryFilter categories={categories} />
            </div>
            <SearchBar />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/products?${new URLSearchParams({
                        ...searchParams,
                        page: String(p),
                      })}`}
                      className={`w-10 h-10 flex items-center justify-center text-xs tracking-wide transition-all ${
                        p === currentPage
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 text-neutral-500 hover:border-neutral-900"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
