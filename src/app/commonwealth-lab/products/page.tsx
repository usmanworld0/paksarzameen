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
        <section className="flex min-h-[60vh] items-center justify-center bg-white">
          <p className="text-neutral-400">Loading products…</p>
        </section>
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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Commonwealth Lab
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            All Products
          </h1>
        </header>

        {/* Controls */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <CategoryFilter selected={category} onSelect={(c) => { setCategory(c); setPage(1); }} />

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products…"
                className="h-10 w-60 rounded-full border border-neutral-300 bg-white pl-10 pr-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                aria-label="Search products"
              />
              <svg
                className="absolute left-3.5 top-2.5 h-5 w-5 text-neutral-400"
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
              className="h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-900"
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
              className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  n === currentPage
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
