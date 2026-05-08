"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { dummyProducts } from "@/data/products";
import type { ProductCategory } from "@/lib/models/Product";
import { CategoryFilter } from "@/features/commonwealth-lab/components/CategoryFilter";
import { ProductGrid } from "@/features/commonwealth-lab/components/ProductGrid";

const ITEMS_PER_PAGE = 8;

type SortOption = "default" | "price-asc" | "price-desc" | "name";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f3f3ee]">
          <p className="text-sm font-medium text-[#707072]">Loading products…</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as ProductCategory | null;

  const [category, setCategory] = useState<ProductCategory | "All">(
    initialCategory ?? "All"
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...dummyProducts];

    // Category
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return list;
  }, [category, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-[#f3f3ee]">
      {/* Page Header */}
      <header className="border-b border-[#E5E5E5] bg-white px-[5%] pb-8 pt-24 md:pb-12 md:pt-28">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
            Commonwealth Lab
          </p>
          <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
            Shop
          </h1>
          <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
            Ethically sourced, artisan crafted. Every purchase supports local communities and preserves traditional craftsmanship.
          </p>
        </div>
      </header>

      <div className="px-[5%] pb-20 pt-8">
        <div className="mx-auto max-w-screen-xl">
          {/* Controls */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CategoryFilter
              selected={category}
              onSelect={(c) => { setCategory(c); setPage(1); }}
            />

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products…"
                  className="h-10 w-60 rounded-xl border border-[#E5E5E5] bg-white pl-10 pr-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#707072] focus:border-[#111111]/30"
                  aria-label="Search products"
                />
                <svg
                  className="absolute left-3.5 top-2.5 h-5 w-5 text-[#707072]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-xl border border-[#E5E5E5] bg-white px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#707072] outline-none transition focus:border-[#111111]/30"
                aria-label="Sort products"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid products={paginated} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-14 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111] disabled:opacity-30"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition ${
                    n === currentPage
                      ? "border border-[#111111] bg-[#111111] text-white"
                      : "border border-[#E5E5E5] bg-white text-[#707072] hover:border-[#111111]/30 hover:text-[#111111]"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111] disabled:opacity-30"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
