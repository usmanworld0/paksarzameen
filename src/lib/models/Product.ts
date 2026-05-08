/**
 * Product model for Paksarzameen Store Marketplace.
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
  ingredients?: string[];
  application?: string;
  details?: string;
  heritage?: string;
}

export type ProductCategory =
  | "Commissioned Art"
  | "Crockery"
  | "Gemstones"
  | "Jewellery"
  | "Lamps"
  | "Leather"
  | "Musical Instruments"
  | "Textiles";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Commissioned Art",
  "Crockery",
  "Gemstones",
  "Jewellery",
  "Lamps",
  "Leather",
  "Musical Instruments",
  "Textiles",
];

export interface CartItem {
  product: Product;
  quantity: number;
}
