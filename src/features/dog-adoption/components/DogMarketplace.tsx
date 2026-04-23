"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useDeferredValue, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  FilterX,
  MapPin,
  Search,
} from "lucide-react";

import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type SortOption = "newest" | "oldest" | "name" | "available-first";
type StatusFilter = "all" | DogStatus;
type FilterOption = {
  label: string;
  value: string;
};

const ADOPTION_FEE_LABEL = "PKR 3,500";
const LISTING_DATE_FORMATTER = new Intl.DateTimeFormat("en-PK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const STATUS_LABELS: Record<DogStatus, string> = {
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
};

const STATUS_PRIORITY: Record<DogStatus, number> = {
  available: 0,
  pending: 1,
  adopted: 2,
};

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name A-Z", value: "name" },
  { label: "Available first", value: "available-first" },
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
    if (statusFilter !== "all" && dog.status !== statusFilter) {
      return false;
    }

    if (breedFilter !== "all" && normalizeValue(dog.breed) !== breedFilter) {
      return false;
    }

    if (genderFilter !== "all" && normalizeValue(dog.gender) !== genderFilter) {
      return false;
    }

    if (cityFilter !== "all" && normalizeValue(dog.city) !== cityFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      dog.name,
      dog.breed,
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

  const availableCount = dogs.filter((dog) => dog.status === "available").length;
  const adoptedCount = dogs.filter((dog) => dog.status === "adopted").length;
  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (breedFilter !== "all" ? 1 : 0) +
    (genderFilter !== "all" ? 1 : 0) +
    (cityFilter !== "all" ? 1 : 0);

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setBreedFilter("all");
    setGenderFilter("all");
    setCityFilter("all");
    setSortBy("newest");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_22px_70px_-55px_rgba(15,23,42,0.65)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="pt-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                Filters
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950"
              >
                <FilterX className="h-4 w-4" />
                Clear
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Search
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name, breed, city, age..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    aria-label="Search rescue dogs"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort by
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  aria-label="Sort dogs"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Breed
                </span>
                <select
                  value={breedFilter}
                  onChange={(event) => setBreedFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  aria-label="Filter by breed"
                >
                  <option value="all">All breeds</option>
                  {breedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  City
                </span>
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  aria-label="Filter by city"
                >
                  <option value="all">All cities</option>
                  {cityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Gender
                </span>
                <select
                  value={genderFilter}
                  onChange={(event) => setGenderFilter(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                  aria-label="Filter by gender"
                >
                  <option value="all">All genders</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.6)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Listings
              </p>

              <div className="flex flex-wrap gap-2">
                <StatusChip
                  active={statusFilter === "all"}
                  label={`All (${dogs.length})`}
                  onClick={() => setStatusFilter("all")}
                />
                <StatusChip
                  active={statusFilter === "available"}
                  label={`Available (${availableCount})`}
                  onClick={() => setStatusFilter("available")}
                />
                <StatusChip
                  active={statusFilter === "adopted"}
                  label={`Adopted (${adoptedCount})`}
                  onClick={() => setStatusFilter("adopted")}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                {filteredDogs.length} match{filteredDogs.length === 1 ? "" : "es"}
              </span>
              <span>Active filters: {activeFilterCount}</span>
              {query.trim() ? (
                <span>
                  Searching for <span className="font-medium text-slate-800">{`"${query.trim()}"`}</span>
                </span>
              ) : null}
            </div>
          </div>

          {filteredDogs.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_20px_70px_-60px_rgba(15,23,42,0.6)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                No matches
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                No dogs fit the current filters
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Try clearing one or two filters or searching with a broader keyword like a city or breed.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reset marketplace filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDogs.map((dog) => (
                <article
                  key={dog.dogId}
                  className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_22px_80px_-58px_rgba(15,23,42,0.75)] transition hover:border-emerald-200 hover:shadow-[0_28px_90px_-60px_rgba(16,185,129,0.5)]"
                >
                  <div className="grid lg:grid-cols-[260px_minmax(0,1fr)_220px]">
                    <Link
                      href={`/dog/${dog.dogId}`}
                      className="relative block min-h-[230px] overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={dog.imageUrl}
                        alt={dog.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 260px"
                        className="object-cover transition duration-500 hover:scale-[1.03]"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(dog.status)}`}>
                          {STATUS_LABELS[dog.status]}
                        </span>
                      </div>
                    </Link>

                    <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                            {dog.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">
                            {dog.breed} | {dog.age} | {toTitleCase(dog.gender)}
                          </p>
                        </div>

                        <div className="w-full max-w-[180px] rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                            Adoption fee
                          </p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight">{ADOPTION_FEE_LABEL}</p>
                        </div>
                      </div>

                      <p className="max-w-3xl text-sm leading-7 text-slate-600">
                        {truncateText(dog.description, 220)}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <ListingFact
                          icon={<MapPin className="h-4 w-4 text-emerald-700" />}
                          label="Location"
                          value={getLocationLabel(dog)}
                        />
                        <ListingFact
                          icon={<CalendarDays className="h-4 w-4 text-emerald-700" />}
                          label="Listed"
                          value={LISTING_DATE_FORMATTER.format(new Date(dog.createdAt))}
                        />
                        <ListingFact
                          icon={<CalendarDays className="h-4 w-4 text-emerald-700" />}
                          label="Status"
                          value={getStatusMessage(dog.status)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-5 border-t border-slate-200 bg-slate-50/80 p-5 sm:p-6 lg:border-l lg:border-t-0">
                      <div>
                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {dog.status === "available" ? "Ready for adoption" : "See full profile"}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {dog.status === "available"
                            ? "Open the profile to review details and send your adoption request."
                            : "Open the profile to read the full story and latest adoption status."}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href={`/dog/${dog.dogId}`}
                          className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                          {dog.status === "available" ? "View and adopt" : "View details"}
                        </Link>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          Ref: {dog.dogId.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-900 hover:text-slate-950"
      }`}
    >
      {label}
    </button>
  );
}

function ListingFact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function statusClass(status: DogStatus) {
  if (status === "available") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "adopted") {
    return "bg-indigo-100 text-indigo-700";
  }

  return "bg-amber-100 text-amber-700";
}

function getStatusMessage(status: DogStatus) {
  if (status === "available") {
    return "Open for requests";
  }

  if (status === "adopted") {
    return "Already placed";
  }

  return "Review in progress";
}

function getLocationLabel(dog: DogRecord) {
  if (dog.city && dog.area) {
    return `${dog.area}, ${dog.city}`;
  }

  if (dog.city) {
    return dog.city;
  }

  if (dog.area) {
    return dog.area;
  }

  return "Location to be confirmed";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function collectOptions(
  values: Array<string | null | undefined>,
  formatLabel: (value: string) => string = (value) => value
): FilterOption[] {
  const options = new Map<string, string>();

  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed) {
      continue;
    }

    const normalized = trimmed.toLowerCase();
    if (!options.has(normalized)) {
      options.set(normalized, formatLabel(trimmed));
    }
  }

  return Array.from(options.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function normalizeValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}
