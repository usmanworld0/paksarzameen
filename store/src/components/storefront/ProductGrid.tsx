import { ProductCard } from "./ProductCard";
import type { StoreRegion } from "@/lib/pricing";
import type { ProductWithRelations } from "@/types";

interface ProductGridProps {
  products: ProductWithRelations[];
  discounts?: Record<string, number>;
  region?: StoreRegion;
}

export function ProductGrid({ products, discounts = {}, region = "PAK" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-400 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          region={region}
          discountPercent={discounts[product.id] || discounts["*"] || 0}
        />
      ))}
    </div>
  );
}
