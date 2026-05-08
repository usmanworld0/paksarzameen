import Link from "next/link";
import { getCustomizableCategoriesWithProductCovers } from "@/actions/categories";
import type { CustomizableCategoryShowcase } from "@/actions/categories";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { CategoryProductCoverCarousel } from "@/components/storefront/CategoryProductCoverCarousel";

export const dynamic = "force-dynamic";

interface CustomizationsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const CATEGORY_IMAGE_FALLBACK = "/images/store_header.png";

export default async function CustomizationsPage({
  searchParams,
}: CustomizationsPageProps) {
  let customizableCategories: CustomizableCategoryShowcase[] = [];

  try {
    customizableCategories = await getCustomizableCategoriesWithProductCovers();
  } catch {
    customizableCategories = [];
  }

  const categoryParam = searchParams?.category;
  const requestedCategorySlug = (
    Array.isArray(categoryParam) ? categoryParam[0] : categoryParam
  )?.trim();
  const selectedCategory =
    customizableCategories.find((category) => category.slug === requestedCategorySlug) ??
    customizableCategories[0] ??
    null;

  const selectedCategoryOptionNames: string[] = selectedCategory
    ? Array.from(new Set(selectedCategory.customizationOptions.map((option) => option.name)))
    : [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section">
          <div className="store-container">
            <div className="mb-6 border-b border-[#e6d9cf] pb-5 sm:mb-8 sm:pb-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/80">
                Bespoke Orders
              </p>
              <h1 className="store-heading mt-2">Customizable Categories</h1>
              <p className="store-subheading mt-3 max-w-2xl">
                Pick a category, review its details, and continue to the customization options in one smooth flow.
              </p>
            </div>

            {customizableCategories.length === 0 ? (
              <div className="store-card rounded-[22px] p-8 text-center">
                <p className="text-sm text-neutral-500">
                  No customizable categories are available right now.
                </p>
              </div>
            ) : (
              <>
                <nav className="mb-6 overflow-x-auto border-b border-[#e8dbd0] sm:mb-8">
                  <div className="flex justify-center">
                    <ul className="min-w-max flex items-center gap-5 px-3 whitespace-nowrap sm:gap-8 sm:px-4">
                    {customizableCategories.map((category) => {
                      const isActive = selectedCategory?.slug === category.slug;

                      return (
                        <li key={category.id}>
                          <Link
                            href={`/customizations?category=${category.slug}`}
                            className={`relative inline-flex py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 sm:py-4 sm:text-sm ${
                              isActive
                                ? "text-neutral-900"
                                : "text-neutral-500 hover:text-neutral-800"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {category.name}
                            <span
                              className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-neutral-900 transition-transform duration-250 ${
                                isActive ? "scale-x-100" : "scale-x-0"
                              }`}
                            />
                          </Link>
                        </li>
                      );
                    })}
                    </ul>
                  </div>
                </nav>

                {selectedCategory ? (
                  <div className="">
                    <div className="p-6 sm:p-8 lg:p-10">
                      {(() => {
                        const optionSlides = (selectedCategory.customizationOptions || [])
                          .map((option) => ({
                            id: option.id,
                            name: option.name,
                            imageUrl: option.coverImage || null,
                          }))
                          .filter((option) => Boolean(option.imageUrl));

                        return (
                      <CategoryProductCoverCarousel
                        categoryName={selectedCategory.name}
                        categoryImage={selectedCategory.image}
                        fallbackImage={CATEGORY_IMAGE_FALLBACK}
                        products={
                          optionSlides.map((option) => ({
                            id: option.id,
                            name: option.name,
                            slug: option.id,
                            images: [{ imageUrl: option.imageUrl as string }],
                          }))
                        }
                      />
                        );
                      })()}

                      <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center px-2 text-center sm:mt-8 sm:w-[75%] sm:px-0">
                        {selectedCategory.description ? (
                          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                            {selectedCategory.description}
                          </p>
                        ) : (
                          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                            Personalize this category with your preferred materials, finishes, and handcrafted details.
                          </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                          {selectedCategoryOptionNames.map((name) => (
                            <span
                              key={`${selectedCategory.id}-${name}`}
                              className="rounded-full border border-[#ece2d9] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700"
                            >
                              {name}
                            </span>
                          ))}
                        </div>

                        <div className="mt-7 flex w-full justify-center sm:mt-8">
                          <Link
                            href={`/customizations/${selectedCategory.slug}`}
                            className="store-button-primary inline-flex min-h-11 w-full max-w-[320px] items-center justify-center px-7"
                          >
                            <span className="btn-label">Customize</span>
                            <span className="btn-icon" aria-hidden>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14" />
                                <path d="M13 6l6 6-6 6" />
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
