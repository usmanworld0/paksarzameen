import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryCustomizationPanel } from "@/components/storefront/CategoryCustomizationPanel";
import { getCategoryBySlug } from "@/actions/categories";
import { getProducts } from "@/actions/products";
import { getRequestRegion } from "@/lib/pricing-server";

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string; sort?: string; option?: string };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description:
      category.description || `Browse ${category.name} products at Paksarzameen Store.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const hasCustomizationFlow =
    category.customizable && category.customizationOptions.length > 0;

  const region = hasCustomizationFlow ? null : await getRequestRegion();

  const { products, total, pages } = hasCustomizationFlow
    ? { products: [], total: 0, pages: 0 }
    : await getProducts({
        categorySlug: params.slug,
        sort: searchParams.sort,
        page: searchParams.page ? parseInt(searchParams.page) : 1,
      });

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fffaf6]">
          <div className="store-container max-w-[1320px]">
            <div className="mb-12 border-b border-[#e6d9cf] pb-8 sm:mb-16 sm:pb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                Category
              </p>
              <h1 className="store-heading mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="store-subheading max-w-xl">
                  {category.description}
                </p>
              )}
              {!hasCustomizationFlow && (
                <p className="text-xs text-neutral-400 mt-3">
                  {total} {total === 1 ? "product" : "products"}
                </p>
              )}
            </div>

            {hasCustomizationFlow && (
              <CategoryCustomizationPanel
                categoryName={category.name}
                categorySlug={category.slug}
                options={category.customizationOptions}
              />
            )}

            {!hasCustomizationFlow &&
              (products.length === 0 ? (
                <div className="store-card rounded-[22px] py-20 text-center">
                  <p className="text-neutral-400 text-sm">
                    No products in this category yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} region={region!} />
                    ))}
                  </div>

                  {pages > 1 && (
                    <div className="flex justify-center gap-2 mt-16">
                      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <a
                          key={p}
                          href={`/categories/${params.slug}?page=${p}`}
                          className={`rounded-full h-9 w-9 flex items-center justify-center text-xs font-semibold transition-all ${
                            p === currentPage
                              ? "bg-[#2c3d31] text-white"
                              : "border border-neutral-300 text-neutral-500 hover:border-[#2c3d31] hover:text-[#2c3d31]"
                          }`}
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
