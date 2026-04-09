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
  const [{ products, pages, total }, categories] = await Promise.all([
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
      <main className="store-shell pt-[72px]">
        <section className="store-section bg-white">
          <div className="store-container max-w-[1320px]">
            <header className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.35fr)] lg:items-end">
              <div>
                <p className="store-kicker">Paksarzameen Store</p>
                <h1 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">
                  Curated products with more room to breathe.
                </h1>
              </div>
              <div className="space-y-3 lg:justify-self-end">
                <p className="store-subheading max-w-md">
                  Explore the full collection with quieter filters, improved
                  spacing, and product cards that focus attention on imagery and
                  price.
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  {total} piece{total !== 1 ? "s" : ""}
                </p>
              </div>
            </header>

            <div className="store-panel mb-12 rounded-[28px] p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <CategoryFilter categories={categories} />
                <SearchBar />
              </div>
            </div>

            {products.length === 0 ? (
              <div className="store-card flex min-h-[300px] items-center justify-center rounded-[28px]">
                <p className="text-lg text-neutral-400">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} region={region} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-16 flex items-center justify-center gap-2"
              >
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={`/products?${new URLSearchParams(
                      Object.entries({
                        category: searchParams.category,
                        search: searchParams.search,
                        sort: searchParams.sort,
                        page: String(n),
                      }).filter((entry): entry is [string, string] => Boolean(entry[1]))
                    )}`}
                    className={`flex h-11 min-w-[44px] items-center justify-center rounded-xl border px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                      n === currentPage
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-black/8 bg-white text-neutral-600 hover:border-black/20 hover:text-neutral-950"
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
