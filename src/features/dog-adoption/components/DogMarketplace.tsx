"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

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
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name A-Z", value: "name" },
  { label: "Available First", value: "available-first" },
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
    <div className="site-stack--xl">
      <section className="site-toolbar">
        <div className="site-toolbar__row">
          <div>
            <p className="site-eyebrow">Directory filters</p>
            <h2 className="site-heading site-heading--sm mt-3">Find Your Match</h2>
          </div>
          <span className="site-badge site-badge--muted">
            {filteredDogs.length} results
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`site-pill-button ${statusFilter === "all" ? "site-pill-button--active" : ""}`}
          >
            All ({dogs.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("available")}
            className={`site-pill-button ${statusFilter === "available" ? "site-pill-button--active" : ""}`}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("adopted")}
            className={`site-pill-button ${statusFilter === "adopted" ? "site-pill-button--active" : ""}`}
          >
            Adopted ({adoptedCount})
          </button>
        </div>

        <div className="site-toolbar__grid md:grid-cols-2 xl:grid-cols-5">
          <div className="site-toolbar__search xl:col-span-2">
            <Search className="site-toolbar__icon" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, breed, or city"
              className="site-input"
            />
          </div>

          <select
            value={breedFilter}
            onChange={(event) => setBreedFilter(event.target.value)}
            className="site-select"
          >
            <option value="all">All Breeds</option>
            {breedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="site-select"
          >
            <option value="all">All Cities</option>
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(event) => setGenderFilter(event.target.value)}
            className="site-select"
          >
            <option value="all">All Genders</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="site-toolbar__row border-t border-[#e5e5e5] pt-4">
          <div className="site-meta-row">
            <span>{filteredDogs.length} matching dogs</span>
            <span>Adoption fee {ADOPTION_FEE_LABEL}</span>
          </div>

          <div className="site-form-actions">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="site-select min-w-[20rem]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={resetFilters} className="site-button-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {filteredDogs.length === 0 ? (
        <div className="site-empty">
          No dogs fit these filters. Clear them to see all listings.
        </div>
      ) : (
        <div className="site-grid site-grid--three xl:grid-cols-4">
          {filteredDogs.map((dog) => (
            <article key={dog.dogId} className="site-card site-card--rounded overflow-hidden">
              <div className="site-detail__media site-detail__media--square">
                <Image
                  src={dog.imageUrl}
                  alt={dog.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="site-card__body">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="site-card__eyebrow">{dog.city ?? "Pakistan"}</p>
                    <h3 className="site-card__title">{dog.name}</h3>
                  </div>
                  <span
                    className={`site-badge ${
                      dog.status === "available" ? "site-badge--dark" : "site-badge--muted"
                    }`}
                  >
                    {dog.status}
                  </span>
                </div>

                <p className="site-card__text mt-4">
                  {dog.breed} / {dog.age} / {dog.gender}
                </p>
                {dog.area || dog.color ? (
                  <div className="site-meta-row mt-4">
                    {dog.area ? <span>{dog.area}</span> : null}
                    {dog.color ? <span>{dog.color}</span> : null}
                  </div>
                ) : null}
                <p className="site-copy site-copy--sm mt-4 line-clamp-3">{dog.description}</p>

                <div className="site-toolbar__row border-t border-[#e5e5e5] pt-5 mt-5">
                  <div>
                    <p className="site-card__eyebrow">Fee</p>
                    <p className="site-copy site-copy--sm mt-2 text-[#111111]">{ADOPTION_FEE_LABEL}</p>
                  </div>
                  <Link href={`/dog/${dog.dogId}`} className="site-button">
                    Details
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
  formatter: (val: string) => string = (val) => val,
): FilterOption[] {
  const unique = new Set<string>();

  for (const value of values) {
    if (value) {
      unique.add(normalizeValue(value));
    }
  }

  return Array.from(unique)
    .sort()
    .map((value) => ({
      value,
      label: value === "unknown" ? "Unknown" : formatter(value),
    }));
}

function toTitleCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
