"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

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
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => handleFilter("")}
        className={cn("store-choice shrink-0", !currentCategory && "store-choice-active")}
      >
        All Pieces
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => handleFilter(cat.slug)}
          className={cn(
            "store-choice shrink-0",
            currentCategory === cat.slug && "store-choice-active"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
