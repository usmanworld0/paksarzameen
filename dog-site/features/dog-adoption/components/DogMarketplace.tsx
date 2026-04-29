"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useDeferredValue, useMemo, useState } from "react";
import { ArrowUpDown, FilterX, Search } from "lucide-react";

import { DogLikeButton } from "../../../components/DogLikeButton";

export type DogRecord = {
  dogId: string;
  name: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  city: string | null;
  area: string | null;
  description: string;
  imageUrl: string;
  status: "available" | "pending" | "adopted";
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "name" | "available-first";
type StatusFilter = "all" | DogRecord["status"];

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name A-Z", value: "name" },
  { label: "Available first", value: "available-first" },
];

const STATUS_LABELS: Record<DogRecord["status"], string> = {
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
};

const STATUS_PRIORITY: Record<DogRecord["status"], number> = {
  available: 0,
  pending: 1,
  adopted: 2,
};

export function DogMarketplace({ dogs }: { dogs: DogRecord[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const stats = useMemo(
    () => [
      { label: "Total dogs", value: dogs.length },
      { label: "Available", value: dogs.filter((dog) => dog.status === "available").length },
      { label: "Adopted", value: dogs.filter((dog) => dog.status === "adopted").length },
    ],
    [dogs]
  );

  const filteredDogs = dogs
    .filter((dog) => {
      if (statusFilter !== "all" && dog.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        dog.name,
        dog.breed,
        dog.color,
        dog.age,
        dog.gender,
        dog.description,
        dog.city ?? "",
        dog.area ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortBy === "oldest") {
        return Date.parse(left.createdAt) - Date.parse(right.createdAt);
      }

      if (sortBy === "name") {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === "available-first") {
        const priorityDelta = STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status];
        if (priorityDelta !== 0) {
          return priorityDelta;
        }
      }

      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    });

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setSortBy("newest");
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-black/8 bg-white px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-normal tracking-[-0.04em] text-neutral-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <div className="border border-black/8 bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-black/8 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-500">Filters</p>
                <h3 className="mt-2 text-xl font-normal tracking-[-0.03em] text-neutral-950">Refine the list</h3>
              </div>

              <button type="button" onClick={resetFilters} className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-black hover:text-white">
                <FilterX className="h-4 w-4" />
                Clear
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Search</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name, breed, city, age..."
                    className="h-12 w-full border border-black/10 bg-neutral-50 pl-11 pr-4 text-sm text-neutral-950 outline-none transition focus:border-black focus:bg-white"
                    aria-label="Search rescue dogs"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="h-12 w-full border border-black/10 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none transition focus:border-black focus:bg-white"
                  aria-label="Sort dogs"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Status</span>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={statusFilter === "all"} label={`All (${dogs.length})`} onClick={() => setStatusFilter("all")} />
                  <FilterPill active={statusFilter === "available"} label="Available" onClick={() => setStatusFilter("available")} />
                  <FilterPill active={statusFilter === "pending"} label="Pending" onClick={() => setStatusFilter("pending")} />
                  <FilterPill active={statusFilter === "adopted"} label="Adopted" onClick={() => setStatusFilter("adopted")} />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black/8 bg-neutral-950 p-5 text-white">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Editorial note</p>
            <p className="mt-3 text-sm leading-7 text-white/82">
              The list below is intentionally quiet. Images do the heavy lifting, while text and controls stay minimal.
            </p>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="border border-black/8 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Listings</p>
                <h3 className="mt-2 text-2xl font-normal tracking-[-0.03em] text-neutral-950">Rescue dogs in the adoption catalogue</h3>
              </div>
              <p className="text-sm text-neutral-500">{filteredDogs.length} results</p>
            </div>
          </div>

          {filteredDogs.length === 0 ? (
            <div className="border border-dashed border-black/10 bg-white p-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">No matches</p>
              <h4 className="mt-3 text-2xl font-normal tracking-[-0.03em] text-neutral-950">No dogs fit the current filters</h4>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">
                Try clearing filters or search more broadly.
              </p>
              <button type="button" onClick={resetFilters} className="mt-6 rounded-full bg-black px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDogs.map((dog) => (
                <article key={dog.dogId} className="border border-black/8 bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <Link href={`/dog/${dog.dogId}`} className="absolute inset-0 block group">
                      <Image
                        src={dog.imageUrl}
                        alt={dog.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="absolute left-4 top-4 inline-flex rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white">
                      {STATUS_LABELS[dog.status]}
                    </div>
                    <div className="absolute right-4 top-4 z-10">
                      <DogLikeButton dogId={dog.dogId} compact />
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/dog/${dog.dogId}`} className="block">
                        <h4 className="text-xl font-normal tracking-[-0.03em] text-neutral-950">{dog.name}</h4>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                          {dog.breed} · {dog.age}
                        </p>
                      </Link>
                      <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                        {toTitleCase(dog.gender)}
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-neutral-600">{truncateText(dog.description, 160)}</p>

                    <div className="flex items-center justify-between border-t border-black/8 pt-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      <span>{getLocationLabel(dog)}</span>
                      <span>Ref {dog.dogId.slice(0, 6).toUpperCase()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition ${active ? "bg-black text-white" : "border border-black/12 bg-white text-neutral-700 hover:bg-neutral-950 hover:text-white"}`}
    >
      {label}
    </button>
  );
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getLocationLabel(dog: DogRecord) {
  if (dog.city && dog.area) return `${dog.area}, ${dog.city}`;
  if (dog.city) return dog.city;
  if (dog.area) return dog.area;
  return "Location to be confirmed";
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}
