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

export type CustomizableCategoryShowcase = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  customizationOptions: Array<{
    id: string;
    name: string;
    coverImage?: string | null;
    baseImage?: string | null;
  }>;
};

export async function getCustomizableCategoriesWithProductCovers(): Promise<
  CustomizableCategoryShowcase[]
> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const results = await prisma.category.findMany({
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
        image: true,
        customizationOptions: {
          select: {
            id: true,
            name: true,
            options: true,
          },
          orderBy: [{ position: "asc" }, { name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform results to expose only per-option cover images for the frontend
    return results.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      customizationOptions: (cat.customizationOptions || []).map((opt) => {
        let cover: string | null | undefined = undefined;
        let base: string | null | undefined = undefined;
        try {
          const cfg = opt.options as any;
          if (cfg && typeof cfg === "object") {
            cover = cfg.coverImage ?? cfg.cover ?? null;
            base = cfg.baseImage ?? null;
          }
        } catch {
          cover = undefined;
          base = undefined;
        }
        return { id: opt.id, name: opt.name, coverImage: cover, baseImage: base };
      }),
    }));
    } catch {
      return [];
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
