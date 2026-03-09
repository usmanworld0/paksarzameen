import { ProductCard } from "./ProductCard";
import type { ProductWithRelations } from "@/types";

interface ProductGridProps {
  products: ProductWithRelations[];
  discounts?: Record<string, number>;
}

export function ProductGrid({ products, discounts = {} }: ProductGridProps) {
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
          discountPercent={discounts[product.id] || discounts["*"] || 0}
        />
      ))}
    </div>
  );
}
