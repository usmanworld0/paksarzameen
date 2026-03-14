import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { SearchBar } from "@/components/storefront/SearchBar";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getRequestRegion } from "@/lib/pricing-server";

export const dynamic = "force-dynamic";

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
  const [{ products, pages }, categories] = await Promise.all([
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
        <section className="store-section bg-[#fffaf6]">
          <div className="store-container max-w-[1320px]">
            <header className="mb-10 sm:mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/80">
                Paksarzameen Store
              </p>
              <h1 className="store-heading mt-2">All Products</h1>
            </header>

            <div className="store-card mb-10 rounded-[22px] p-5 sm:p-6 lg:mb-12">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <CategoryFilter categories={categories} />
                <SearchBar />
              </div>
            </div>

            {products.length === 0 ? (
              <div className="store-card flex min-h-[300px] items-center justify-center rounded-[22px]">
                <p className="text-lg text-neutral-400">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} region={region} />
                ))}
              </div>
            )}

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
                        ? "bg-[#2c3d31] text-white"
                        : "text-neutral-600 hover:bg-[#efe3d9]"
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
