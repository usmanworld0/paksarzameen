"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  buildProductRegionPriceCreateData,
  normalizeProductRegionPrices,
  type ProductRegionPriceInput,
} from "@/lib/product-region-prices";
import { getAllStoreRegions } from "@/lib/store-regions";

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
      include: {
        category: true,
        artist: true,
        images: { orderBy: { position: "asc" } },
        regionPrices: { include: { region: true } },
      },
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
      regionPrices: { include: { region: true } },
    },
  });
}

export async function createProduct(data: Record<string, unknown>) {
  const { images, availability, regionPrices = [], ...productData } = data;
  const storeRegions = await getAllStoreRegions();
  const normalizedRegionPrices = normalizeProductRegionPrices(
    regionPrices as ProductRegionPriceInput[],
    storeRegions
  );
  const product = await prisma.product.create({
    data: {
      ...(productData as {
        name: string;
        slug: string;
        description?: string;
        price: number;
        compareAtPrice?: number;
        availability?: boolean;
        categoryId: string;
        artistId?: string;
        customizable: boolean;
        featured: boolean;
        active: boolean;
      }),
      stock: availability === false ? 0 : 1,
      artistId: (productData as { artistId?: string | null }).artistId || null,
      compareAtPrice:
        (productData as { compareAtPrice?: number | null }).compareAtPrice || null,
      images: {
        create: ((images as string[]) || []).map((url, i) => ({
          imageUrl: url,
          position: i,
        })),
      },
      regionPrices: {
        create: buildProductRegionPriceCreateData(normalizedRegionPrices),
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
  const { images, availability, regionPrices = [], ...productData } = data;
  const storeRegions = await getAllStoreRegions();
  const normalizedRegionPrices = normalizeProductRegionPrices(
    regionPrices as ProductRegionPriceInput[],
    storeRegions
  );

  // Delete existing images and re-create
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.productRegionPrice.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(productData as {
        name?: string;
        slug?: string;
        description?: string;
        price?: number;
        compareAtPrice?: number;
        availability?: boolean;
        categoryId?: string;
        artistId?: string;
        customizable?: boolean;
        featured?: boolean;
        active?: boolean;
      }),
      artistId: (productData as { artistId?: string | null }).artistId || null,
      compareAtPrice:
        (productData as { compareAtPrice?: number | null }).compareAtPrice || null,
      stock: availability === false ? 0 : 1,
      images: {
        create: ((images as string[]) || []).map((url, i) => ({
          imageUrl: url,
          position: i,
        })),
      },
      regionPrices: {
        create: buildProductRegionPriceCreateData(normalizedRegionPrices),
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
