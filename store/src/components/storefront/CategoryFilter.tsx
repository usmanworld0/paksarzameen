"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@prisma/client";

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  function handleFilter(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleFilter("")}
        className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border transition-colors ${
          !currentCategory
            ? "bg-brand-charcoal text-white border-brand-charcoal"
            : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-charcoal"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleFilter(cat.slug)}
          className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm border transition-colors ${
            currentCategory === cat.slug
              ? "bg-brand-charcoal text-white border-brand-charcoal"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-charcoal"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
