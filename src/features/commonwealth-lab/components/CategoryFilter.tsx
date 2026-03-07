"use client";

import type { ProductCategory } from "@/lib/models/Product";
import { PRODUCT_CATEGORIES } from "@/lib/models/Product";

interface CategoryFilterProps {
  selected: ProductCategory | "All";
  onSelect: (category: ProductCategory | "All") => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const categories: (ProductCategory | "All")[] = ["All", ...PRODUCT_CATEGORIES];

  return (
    <nav aria-label="Product categories" className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
            selected === cat
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
