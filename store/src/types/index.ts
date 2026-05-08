import type {
  Product,
  Category,
  Artist,
  ProductImage,
  ProductRegionPrice,
  Sale,
  CustomizationOption,
  StoreRegion as PrismaStoreRegion,
} from "@prisma/client";
import type { StoreRegion } from "@/lib/pricing";

export type ProductWithRelations = Product & {
  category: Category;
  artist: Artist | null;
  images: ProductImage[];
  regionPrices: (ProductRegionPrice & { region: PrismaStoreRegion })[];
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
  region?: StoreRegion;
  customizations?: Array<{
    key: string;
    optionName: string;
    groupLabel: string;
    value: string;
    valueLabel: string;
    priceAdjustment: number;
  }>;
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
  soldOutProducts: number;
};
