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
        <section className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold text-neutral-900">Customizable Categories</h1>

          {customizableCategories.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              No customizable categories are available right now.
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {customizableCategories.map((category) => {
                const uniqueOptionNames = Array.from(
                  new Set(category.customizationOptions.map((option) => option.name))
                );

                return (
                  <li
                    key={category.id}
                    className="rounded-xl border border-neutral-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-neutral-900">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="mt-2 text-sm text-neutral-600">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/categories/${category.slug}`}
                        className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
                      >
                        View Customizations
                      </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {uniqueOptionNames.map((name) => (
                        <span
                          key={`${category.id}-${name}`}
                          className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600"
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
        </section>
      </main>
      <Footer />
    </>
  );
}
