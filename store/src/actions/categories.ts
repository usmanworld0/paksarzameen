"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: true } },
      customizationOptions: true,
    },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  customizable?: boolean;
}) {
  const category = await prisma.category.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return category;
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string | null;
    customizable?: boolean;
  }
) {
  const category = await prisma.category.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath(`/categories/${category.slug}`);
  revalidatePath("/admin/categories");
  return category;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}
