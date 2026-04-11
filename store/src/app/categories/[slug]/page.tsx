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
              <p className="text-xs text-neutral-400 mt-3">
                {total} {total === 1 ? "product" : "products"}
              </p>
            </div>

            <section className="mb-10 rounded-3xl border border-[#e3d6cb] bg-gradient-to-r from-[#fff9f3] via-[#fdf8f4] to-[#faf6f2] p-6 shadow-[0_14px_45px_rgba(26,20,15,0.06)] sm:mb-14 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                Make Your Own
              </p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl leading-tight text-[#1f2d24] sm:text-3xl">
                    Build your own {category.name} piece
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
                    {hasCustomizationFlow
                      ? `Start a tailored order for ${category.name} with your preferred options, finish, and details.`
                      : `Customization for ${category.name} is opening soon. Share your requirements and we will help you create your own design.`}
                  </p>
                </div>
                {hasCustomizationFlow ? (
                  <Link
                    href={`/customizations/${category.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#2c3d31] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#1f2d24]"
                  >
                    Start Customizing
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-[#2c3d31]/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2c3d31] transition-all hover:-translate-y-0.5 hover:border-[#2c3d31]"
                  >
                    Request Custom Design
                  </Link>
                )}
              </div>
            </section>

            <section className="mb-14 sm:mb-16">
              <div className="mb-6 sm:mb-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                  Launch Series
                </p>
                <h2 className="mt-2 text-3xl leading-tight text-neutral-900 sm:text-4xl">
                  Ready-to-order collection
                </h2>
                <p className="mt-2 text-sm text-neutral-500 sm:text-base">
                  Explore all currently available products in the {category.name} launch series.
                </p>
              </div>

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

            <section className="rounded-3xl border border-[#e7ddd5] bg-white/85 p-6 shadow-[0_12px_36px_rgba(24,18,12,0.05)] sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                Designers & Collaborations
              </p>
              <h2 className="mt-2 text-2xl leading-tight text-neutral-900 sm:text-3xl">
                A future space for your original designs
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                We are preparing a creator-first section where designers can submit and showcase their own designs, collaborate with artisans, and launch limited editions through PakSarZameen Store.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#e6dbd2] bg-[#faf7f4] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                  Coming Soon
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-[#2c3d31]/20 bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2c3d31] transition-colors hover:border-[#2c3d31]"
                >
                  Join Waitlist
                </Link>
              </div>
            </section>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
