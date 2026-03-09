"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts(opts?: {
  categorySlug?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}) {
  const {
    categorySlug,
    search,
    sort = "newest",
    featured,
    page = 1,
    limit = 12,
  } = opts || {};

  const where: Record<string, unknown> = { active: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (featured) {
    where.featured = true;
  }

  const orderBy: Record<string, string> =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, artist: true, images: { orderBy: { position: "asc" } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: { include: { customizationOptions: true } },
      artist: true,
      images: { orderBy: { position: "asc" } },
    },
  });
}

export async function createProduct(data: Record<string, unknown>) {
  const { images, ...productData } = data;
  const product = await prisma.product.create({
    data: {
      ...(productData as {
        name: string;
        slug: string;
        description?: string;
        price: number;
        compareAtPrice?: number;
        stock: number;
        categoryId: string;
        artistId?: string;
        customizable: boolean;
        featured: boolean;
        active: boolean;
      }),
      images: {
        create: ((images as string[]) || []).map((url, i) => ({
          imageUrl: url,
          position: i,
        })),
      },
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return product;
}

export async function updateProduct(
  id: string,
  data: Record<string, unknown>
) {
  const { images, ...productData } = data;

  // Delete existing images and re-create
  await prisma.productImage.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(productData as {
        name?: string;
        slug?: string;
        description?: string;
        price?: number;
        compareAtPrice?: number;
        stock?: number;
        categoryId?: string;
        artistId?: string;
        customizable?: boolean;
        featured?: boolean;
        active?: boolean;
      }),
      images: {
        create: ((images as string[]) || []).map((url, i) => ({
          imageUrl: url,
          position: i,
        })),
      },
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
