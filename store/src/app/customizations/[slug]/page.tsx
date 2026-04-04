import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CategoryCustomizationPanel } from "@/components/storefront/CategoryCustomizationPanel";
import { getCategoryBySlug } from "@/actions/categories";

export const dynamic = "force-dynamic";

interface CategoryCustomizationPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CategoryCustomizationPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return { title: "Customization Not Found" };
  }

  return {
    title: `Customize ${category.name}`,
    description: `Configure your custom ${category.name} order with tailored options and proceed to checkout.`,
  };
}

export default async function CategoryCustomizationPage({
  params,
}: CategoryCustomizationPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (
    !category ||
    !category.customizable ||
    category.customizationOptions.length === 0
  ) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fffaf6]">
          <div className="store-container max-w-[1240px]">
            <div className="mb-10 border-b border-[#e6d9cf] pb-8 sm:mb-14 sm:pb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/70">
                Category Customization
              </p>
              <h1 className="store-heading mb-2">Customize {category.name}</h1>
              <p className="store-subheading max-w-2xl">
                Choose your preferred options and proceed directly to checkout.
              </p>
              <div className="mt-5">
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center rounded-full border border-[#d8c8bb] bg-white px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700 transition-colors hover:border-[#2c3d31] hover:text-[#2c3d31]"
                >
                  Back to Category Products
                </Link>
              </div>
            </div>

            <CategoryCustomizationPanel
              categoryName={category.name}
              categorySlug={category.slug}
              options={category.customizationOptions}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
