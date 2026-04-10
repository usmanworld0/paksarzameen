import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryCustomizationConfigurator } from "@/components/storefront/CategoryCustomizationConfigurator";
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
    <CategoryCustomizationConfigurator
      categoryName={category.name}
      categorySlug={category.slug}
      categoryImage={category.image}
      categoryProductCount={category._count.products}
      options={category.customizationOptions}
    />
  );
}
