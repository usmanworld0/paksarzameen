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
          className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            selected === cat
              ? "border-[#111111] bg-[#111111] text-white"
              : "border-[#E5E5E5] bg-white text-[#707072] hover:border-[#111111]/30 hover:text-[#111111]"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
