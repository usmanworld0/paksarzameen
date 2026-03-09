import type {
  Product,
  Category,
  Artist,
  ProductImage,
  Sale,
  CustomizationOption,
} from "@prisma/client";

export type ProductWithRelations = Product & {
  category: Category;
  artist: Artist | null;
  images: ProductImage[];
};

export type CategoryWithCount = Category & {
  _count: { products: number };
};

export type ArtistWithCount = Artist & {
  _count: { products: number };
};

export type ActiveSale = Sale & {
  isActive: boolean;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
  customizations?: Record<string, string>;
};

export type CustomizationField = CustomizationOption & {
  value?: string;
};

export type SortOption = "newest" | "price-asc" | "price-desc" | "name";

export type AdminStats = {
  totalProducts: number;
  totalCategories: number;
  totalArtists: number;
  totalSales: number;
  featuredProducts: number;
  lowStockProducts: number;
};
