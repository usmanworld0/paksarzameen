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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
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
