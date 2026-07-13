import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DatabaseConfigNotice } from "@/components/storefront/DatabaseConfigNotice";
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
  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  if (!dbConfigured) {
    return (
      <>
        <Navbar />
        <main className="pt-[72px]">
          <section className="store-section bg-[#fffaf6]">
            <div className="store-container max-w-[1320px]">
              <DatabaseConfigNotice />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const hasCustomizationFlow =
    category.customizable && category.customizationOptions.length > 0;

  const region = await getRequestRegion();

  const { products, total, pages } = await getProducts({
    categorySlug: params.slug,
    sort: searchParams.sort,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  return (
    <>
      <Navbar />

      {/* Slim customise-order banner */}
      <div className="fixed inset-x-0 top-[76px] z-40 flex items-center justify-center gap-3 border-b border-black/8 bg-[#f7f5f2]/95 px-4 py-2 backdrop-blur-sm">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Customize your order
        </span>
        <span className="h-3 w-px bg-neutral-300" />
        {hasCustomizationFlow ? (
          <Link
            href={`/customizations/${category.slug}`}
            className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-900 underline-offset-2 hover:underline"
          >
            Start Customizing →
          </Link>
        ) : (
          <Link
            href="/contact"
            className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-900 underline-offset-2 hover:underline"
          >
            Request Custom Design →
          </Link>
        )}
      </div>

      <main className="pt-[108px]">
        <section className="bg-[#fffaf6] pb-16 pt-8 lg:pt-12">
          <div className="store-container max-w-[1320px]">
            {/* Category title only */}
            <div className="mb-6 border-b border-[#e6d9cf] pb-5">
              <h1 className="store-heading">{category.name}</h1>
              <p className="text-xs text-neutral-400 mt-2">
                {total} {total === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Product grid */}
            <section className="mb-14 sm:mb-16">
              {products.length === 0 ? (
                <div className="store-card rounded-[22px] py-20 text-center">
                  <p className="text-neutral-400 text-sm">
                    No products in this category yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} region={region} />
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
              )}
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
