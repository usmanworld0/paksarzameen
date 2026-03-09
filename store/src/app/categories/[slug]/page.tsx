import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCategoryBySlug } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string; sort?: string };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description:
      category.description || `Browse ${category.name} products at Commonwealth Lab.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { products, total, pages } = await getProducts({
    categorySlug: params.slug,
    sort: searchParams.sort,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Page header */}
        <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#0c2e1a]/50 mb-3">
              Category
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-3">
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm">
                No products in this category yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/categories/${params.slug}?page=${p}`}
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
