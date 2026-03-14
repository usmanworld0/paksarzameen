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
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0c2e1a]">
            Product Configurator
          </p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-900">
            Build Your Piece Before Checkout
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
            Professional stores keep customization simple: required option groups,
            visible add-on prices, and a clear total before payment. Our flow now
            follows that structure end-to-end.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Step 1
              </p>
              <h2 className="mt-2 text-base font-semibold text-neutral-900">
                Select Every Sub-Option
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Each required group must be selected before adding to cart.
              </p>
            </article>

            <article className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Step 2
              </p>
              <h2 className="mt-2 text-base font-semibold text-neutral-900">
                See Add-On Price Per Value
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Every value displays its price tag, including zero-cost options.
              </p>
            </article>

            <article className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Step 3
              </p>
              <h2 className="mt-2 text-base font-semibold text-neutral-900">
                Confirm In Cart And Billing
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Selected options and surcharges stay visible through payment.
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Customizable Categories
            </h2>
            {customizableCategories.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                No configurable categories are available right now.
              </p>
            ) : (
              <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {customizableCategories.map((category) => (
                  <li
                    key={category.id}
                    className="rounded-xl border border-neutral-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="mt-1 text-sm text-neutral-600">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                      >
                        Configure
                      </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.customizationOptions.map((option) => (
                        <span
                          key={option.id}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600"
                        >
                          {option.name}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
