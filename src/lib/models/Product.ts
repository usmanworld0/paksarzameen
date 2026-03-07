/**
 * Product model for Commonwealth Lab Marketplace.
 * Currently uses dummy data; will migrate to Supabase.
 */

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: ProductCategory;
  description: string;
  images: string[];
  featured: boolean;
}

export type ProductCategory =
  | "Traditional Clothing"
  | "Handicrafts"
  | "Cultural Goods"
  | "PSZ Merchandise";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Traditional Clothing",
  "Handicrafts",
  "Cultural Goods",
  "PSZ Merchandise",
];

export interface CartItem {
  product: Product;
  quantity: number;
}
