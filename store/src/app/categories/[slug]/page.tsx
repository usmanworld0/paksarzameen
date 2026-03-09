import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ProductCard } from "@/components/storefront/ProductCard";
import { getCategoryBySlug } from "@/actions/categories";
import { getProducts } from "@/actions/products";

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
      <main className="container-wide py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No products in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/categories/${params.slug}?page=${p}`}
                    className={`px-4 py-2 text-sm rounded-sm transition-colors ${
                      p === currentPage
                        ? "bg-brand-green text-white"
                        : "bg-white border hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
