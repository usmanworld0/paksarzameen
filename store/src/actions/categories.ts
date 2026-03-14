"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
        customizationOptions: {
          orderBy: [{ position: "asc" }, { name: "asc" }],
        },
      },
    });
  } catch {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: { select: { products: true } },
        },
      });

      return category ? { ...category, customizationOptions: [] } : null;
    } catch {
      return null;
    }
  }
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
