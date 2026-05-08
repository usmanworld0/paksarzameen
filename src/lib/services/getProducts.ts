import { dummyProducts } from "@/data/products";
import type { Product } from "@/lib/models/Product";

/**
 * Fetch all products.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getProducts(): Promise<Product[]> {
  return dummyProducts.map((p) => ({ ...p }));
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  return dummyProducts.find((p) => p.slug === slug);
}

/**
 * Fetch featured products.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return dummyProducts.filter((p) => p.featured).map((p) => ({ ...p }));
}
