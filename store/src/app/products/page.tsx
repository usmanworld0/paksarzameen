import type { Metadata } from "next";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryFilter } from "@/components/storefront/CategoryFilter";
import { SearchBar } from "@/components/storefront/SearchBar";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";

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
      <main className="container-wide py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? "product" : "products"} available
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center gap-3">
            <CategoryFilter categories={categories} />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/products?${new URLSearchParams({
                      ...searchParams,
                      page: String(p),
                    })}`}
                    className={`px-4 py-2 text-sm rounded-sm transition-colors ${
                      p === currentPage
                        ? "bg-brand-green text-white"
                        : "bg-white border hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
