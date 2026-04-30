"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type SortOption = "newest" | "oldest" | "name" | "available-first";
type StatusFilter = "all" | DogStatus;
type FilterOption = {
  label: string;
  value: string;
};

const ADOPTION_FEE_LABEL = "PKR 3,500";

const STATUS_PRIORITY: Record<DogStatus, number> = {
  available: 0,
  pending: 1,
  adopted: 2,
};

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "NEWEST FIRST", value: "newest" },
  { label: "OLDEST FIRST", value: "oldest" },
  { label: "NAME A-Z", value: "name" },
  { label: "AVAILABLE FIRST", value: "available-first" },
];

export function DogMarketplace({ dogs }: { dogs: DogRecord[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [breedFilter, setBreedFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const breedOptions = collectOptions(dogs.map((dog) => dog.breed));
  const genderOptions = collectOptions(dogs.map((dog) => dog.gender), toTitleCase);
  const cityOptions = collectOptions(dogs.map((dog) => dog.city));

  const filteredDogs = dogs.filter((dog) => {
    if (statusFilter !== "all" && dog.status !== statusFilter) return false;
    if (breedFilter !== "all" && normalizeValue(dog.breed) !== breedFilter) return false;
    if (genderFilter !== "all" && normalizeValue(dog.gender) !== genderFilter) return false;
    if (cityFilter !== "all" && normalizeValue(dog.city) !== cityFilter) return false;

    if (!normalizedQuery) return true;

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
  });

  filteredDogs.sort((left, right) => {
    if (sortBy === "oldest") return Date.parse(left.createdAt) - Date.parse(right.createdAt);
    if (sortBy === "name") return left.name.localeCompare(right.name);
    if (sortBy === "available-first") {
      const priorityDelta = STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status];
      if (priorityDelta !== 0) return priorityDelta;
    }
    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });

  const availableCount = dogs.filter((dog) => dog.status === "available").length;
  const adoptedCount = dogs.filter((dog) => dog.status === "adopted").length;

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setBreedFilter("all");
    setGenderFilter("all");
    setCityFilter("all");
    setSortBy("newest");
  }

  return (
    <div className="space-y-8">
      {/* FILTER SECTION */}
      <section className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Text Summary & Top filters */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
              FILTER DIRECTORY
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
               <button
                 onClick={() => setStatusFilter("all")}
                 className={`border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${statusFilter === "all" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-[#111111] border-[#CACACB] hover:border-[#111111]"}`}
               >
                 ALL ({dogs.length})
               </button>
               <button
                 onClick={() => setStatusFilter("available")}
                 className={`border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${statusFilter === "available" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-[#111111] border-[#CACACB] hover:border-[#111111]"}`}
               >
                 AVAILABLE ({availableCount})
               </button>
               <button
                 onClick={() => setStatusFilter("adopted")}
                 className={`border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${statusFilter === "adopted" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-[#111111] border-[#CACACB] hover:border-[#111111]"}`}
               >
                 ADOPTED ({adoptedCount})
               </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#707072]" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="NAME, BREED..."
                    className="h-12 w-full bg-white border border-[#CACACB] pl-10 pr-4 text-xs font-medium text-[#111111] uppercase tracking-wide focus:border-[#111111] outline-none rounded-none"
                  />
                </div>
                
                <select
                  value={breedFilter}
                  onChange={(event) => setBreedFilter(event.target.value)}
                  className="h-12 w-full bg-white border border-[#CACACB] px-4 text-xs font-medium text-[#111111] uppercase tracking-wide focus:border-[#111111] outline-none rounded-none"
                >
                  <option value="all">ALL BREEDS</option>
                  {breedOptions.map((o) => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
                </select>

                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  className="h-12 w-full bg-white border border-[#CACACB] px-4 text-xs font-medium text-[#111111] uppercase tracking-wide focus:border-[#111111] outline-none rounded-none"
                >
                  <option value="all">ALL CITIES</option>
                  {cityOptions.map((o) => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
                </select>

                <select
                  value={genderFilter}
                  onChange={(event) => setGenderFilter(event.target.value)}
                  className="h-12 w-full bg-white border border-[#CACACB] px-4 text-xs font-medium text-[#111111] uppercase tracking-wide focus:border-[#111111] outline-none rounded-none"
                >
                  <option value="all">ALL GENDERS</option>
                  {genderOptions.map((o) => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
                </select>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-6 border-t border-[#CACACB]">
               <div className="text-xs font-bold text-[#707072] uppercase tracking-widest mb-4 sm:mb-0">
                  {filteredDogs.length} MATCH{filteredDogs.length === 1 ? "" : "ES"}
               </div>
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="h-10 bg-transparent border-b border-[#CACACB] px-0 text-xs font-bold text-[#111111] uppercase tracking-widest focus:border-[#111111] outline-none"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                 </select>
                 <button
                    onClick={resetFilters}
                    className="h-10 border border-[#111111] bg-white px-6 text-xs font-bold text-[#111111] uppercase tracking-widest transition hover:bg-[#111111] hover:text-white"
                 >
                    CLEAR
                 </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      {filteredDogs.length === 0 ? (
        <div className="border border-[#E5E5E5] p-12 text-center">
             <h3 className="text-2xl font-bold uppercase tracking-tight text-[#111111] mb-2">
               NO DOGS FIT THE CRITERIA
             </h3>
             <p className="text-sm font-medium text-[#707072] uppercase tracking-wide mb-6">
               Adjust your filters to see more results.
             </p>
             <button
                onClick={resetFilters}
                className="bg-[#111111] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[#707072]"
             >
                RESET FILTERS
             </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDogs.map((dog) => (
            <article
              key={dog.dogId}
              className="group flex flex-col justify-between border border-[#E5E5E5] bg-white transition hover:border-[#111111]"
            >
              <div>
                 <div className="relative aspect-square w-full bg-[#F5F5F5] overflow-hidden">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {dog.status !== "available" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/80 backdrop-blur-sm">
                        <span className="text-2xl font-black uppercase text-white tracking-widest rotate-[-10deg]">
                          {dog.status}
                        </span>
                      </div>
                    )}
                 </div>
                 <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                        {dog.name}
                      </h3>
                      {dog.status === "available" && (
                         <span className="bg-[#E5E5E5] text-[#111111] text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                           AVAILABLE
                         </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#707072] mb-3">
                      {dog.breed} / {dog.age} / {dog.gender}
                    </p>
                    {dog.city && (
                      <p className="text-sm font-medium text-[#111111] uppercase tracking-wide">
                        {dog.city}{dog.area ? `, ${dog.area}` : ""}
                      </p>
                    )}
                    <p className="text-xs font-medium text-[#707072] mt-4 line-clamp-2">
                       {dog.description}
                    </p>
                 </div>
              </div>
              
              <div className="p-5 pt-0 mt-4 border-t border-[#E5E5E5] flex justify-between items-center bg-white">
                 <div className="pt-4">
                    <p className="text-[10px] uppercase font-bold text-[#707072] tracking-widest">FEE</p>
                     <p className="text-sm font-bold text-[#111111] uppercase">{ADOPTION_FEE_LABEL}</p>
                 </div>
                 <div className="pt-4">
                    <Link
                      href={`/dog/${dog.dogId}`}
                      className="inline-block rounded-full bg-[#111111] px-5 py-2 text-xs font-bold text-white uppercase tracking-widest transition hover:bg-[#707072]"
                    >
                      DETAILS
                    </Link>
                 </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function normalizeValue(value: string | null | undefined): string {
  if (!value) return "unknown";
  return value.trim().toLowerCase();
}

function collectOptions(
  values: Array<string | null | undefined>,
  formatter: (val: string) => string = (val) => val
): FilterOption[] {
  const unique = new Set<string>();

  for (const val of values) {
    if (val) {
      unique.add(normalizeValue(val));
    }
  }

  return Array.from(unique)
    .sort()
    .map((val) => ({
      value: val,
      label: val === "unknown" ? "Unknown" : formatter(val),
    }));
}

function toTitleCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
