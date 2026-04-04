import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export const dynamic = "force-dynamic";

export default async function CustomizationsPage() {
  let customizableCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    customizationOptions: Array<{ id: string; name: string }>;
  }> = [];

  try {
    customizableCategories = await prisma.category.findMany({
      where: {
        customizable: true,
        customizationOptions: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        customizationOptions: {
          select: {
            id: true,
            name: true,
          },
          orderBy: [{ position: "asc" }, { name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    customizableCategories = [];
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="store-section bg-[#fff8f2]">
          <div className="store-container">
            <div className="mb-10 border-b border-[#e6d9cf] pb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2c3d31]/80">
                Bespoke Orders
              </p>
              <h1 className="store-heading mt-2">Customizable Categories</h1>
              <p className="store-subheading mt-3 max-w-2xl">
                Choose a category to configure your preferred options and proceed directly to billing.
              </p>
            </div>

            {customizableCategories.length === 0 ? (
              <div className="store-card rounded-[22px] p-8 text-center">
                <p className="text-sm text-neutral-500">
                  No customizable categories are available right now.
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {customizableCategories.map((category) => {
                  const uniqueOptionNames = Array.from(
                    new Set(category.customizationOptions.map((option) => option.name))
                  );

                  return (
                    <li
                      key={category.id}
                      className="store-card rounded-[22px] p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-3xl leading-tight text-neutral-900">
                            {category.name}
                          </h2>
                          {category.description && (
                            <p className="mt-2 text-sm text-neutral-600">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <Link
                          href={`/customizations/${category.slug}`}
                          className="store-button-secondary whitespace-nowrap"
                        >
                          View Customizations
                        </Link>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {uniqueOptionNames.map((name) => (
                          <span
                            key={`${category.id}-${name}`}
                            className="rounded-full border border-[#ece2d9] bg-[#fcf8f4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
