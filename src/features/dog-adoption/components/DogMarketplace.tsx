"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { DogListingsMap } from "@/features/dog-adoption/components/DogListingsMap";
import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type StatusFilter = "all" | DogStatus;

type MarketplaceFilters = {
  status: StatusFilter;
  search: string;
  city: string;
  area: string;
  breed: string;
  age: string;
};

const STATUS_LABELS: Record<DogStatus, string> = {
  available: "Available",
  pending: "Requested",
  adopted: "Adopted",
};

const STATUS_SORT_ORDER: Record<DogStatus, number> = {
  available: 0,
  pending: 1,
  adopted: 2,
};

const STATUS_STYLE: Record<DogStatus, { badge: string; dot: string; border: string; text: string }> = {
  available: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  pending: {
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  adopted: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    border: "border-sky-200",
    text: "text-sky-700",
  },
};

function sortTextValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((left, right) =>
    left.localeCompare(right, undefined, { sensitivity: "base" })
  );
}

function sortAgeValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((left, right) => {
    const leftNumber = Number.parseFloat(left);
    const rightNumber = Number.parseFloat(right);

    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber !== rightNumber) {
      return leftNumber - rightNumber;
    }

    return left.localeCompare(right, undefined, { sensitivity: "base" });
  });
}

function getLocationLabel(dog: DogRecord) {
  if (dog.area && dog.city) return `${dog.area}, ${dog.city}`;
  if (dog.city) return dog.city;
  if (dog.area) return dog.area;
  return "Location to be confirmed";
}

function matchesDog(dog: DogRecord, filters: MarketplaceFilters, ignore: Array<keyof MarketplaceFilters> = []) {
  const ignored = new Set(ignore);

  if (!ignored.has("status") && filters.status !== "all" && dog.status !== filters.status) {
    return false;
  }

  if (!ignored.has("search") && filters.search.trim()) {
    const query = filters.search.trim().toLowerCase();
    const haystack = [dog.name, dog.breed, dog.color, dog.age, dog.city ?? "", dog.area ?? ""].join(" ").toLowerCase();

    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (!ignored.has("city") && filters.city !== "all" && dog.city !== filters.city) {
    return false;
  }

  if (!ignored.has("area") && filters.area !== "all" && dog.area !== filters.area) {
    return false;
  }

  if (!ignored.has("breed") && filters.breed !== "all" && dog.breed !== filters.breed) {
    return false;
  }

  if (!ignored.has("age") && filters.age !== "all" && dog.age !== filters.age) {
    return false;
  }

  return true;
}

export function DogMarketplace({
  dogs,
  initialCounts,
}: {
  dogs: DogRecord[];
  initialCounts?: { available: number; pending: number; adopted: number };
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");

  const filters = {
    status: statusFilter,
    search: searchQuery,
    city: selectedCity,
    area: selectedArea,
    breed: selectedBreed,
    age: selectedAge,
  } satisfies MarketplaceFilters;

  const filteredDogs = useMemo(() => {
    return dogs
      .filter((dog) => matchesDog(dog, filters))
      .sort((left, right) => {
        const statusDelta = STATUS_SORT_ORDER[left.status] - STATUS_SORT_ORDER[right.status];
        if (statusDelta !== 0) return statusDelta;
        return Date.parse(right.createdAt) - Date.parse(left.createdAt);
      });
  }, [dogs, filters]);

  const cityOptions = useMemo(() => {
    return sortTextValues(
      dogs
        .filter((dog) => matchesDog(dog, filters, ["city"]))
        .map((dog) => dog.city ?? "")
    );
  }, [dogs, filters]);

  const areaOptions = useMemo(() => {
    return sortTextValues(
      dogs
        .filter((dog) => matchesDog(dog, filters, ["area"]))
        .map((dog) => dog.area ?? "")
    );
  }, [dogs, filters]);

  const breedOptions = useMemo(() => {
    return sortTextValues(
      dogs
        .filter((dog) => matchesDog(dog, filters, ["breed"]))
        .map((dog) => dog.breed)
    );
  }, [dogs, filters]);

  const ageOptions = useMemo(() => {
    return sortAgeValues(
      dogs
        .filter((dog) => matchesDog(dog, filters, ["age"]))
        .map((dog) => dog.age)
    );
  }, [dogs, filters]);

  useEffect(() => {
    if (selectedCity !== "all" && !cityOptions.includes(selectedCity)) {
      setSelectedCity("all");
    }
  }, [cityOptions, selectedCity]);

  useEffect(() => {
    if (selectedArea !== "all" && !areaOptions.includes(selectedArea)) {
      setSelectedArea("all");
    }
  }, [areaOptions, selectedArea]);

  useEffect(() => {
    if (selectedBreed !== "all" && !breedOptions.includes(selectedBreed)) {
      setSelectedBreed("all");
    }
  }, [breedOptions, selectedBreed]);

  useEffect(() => {
    if (selectedAge !== "all" && !ageOptions.includes(selectedAge)) {
      setSelectedAge("all");
    }
  }, [ageOptions, selectedAge]);

  const counts = useMemo(
    () => ({
      all: dogs.length,
      available: initialCounts?.available ?? dogs.filter((dog) => dog.status === "available").length,
      pending: initialCounts?.pending ?? dogs.filter((dog) => dog.status === "pending").length,
      adopted: initialCounts?.adopted ?? dogs.filter((dog) => dog.status === "adopted").length,
    }),
    [dogs, initialCounts]
  );

  const activeFilters = [
    statusFilter !== "all" ? STATUS_LABELS[statusFilter] : null,
    searchQuery.trim() ? `Search: ${searchQuery.trim()}` : null,
    selectedCity !== "all" ? selectedCity : null,
    selectedArea !== "all" ? selectedArea : null,
    selectedBreed !== "all" ? selectedBreed : null,
    selectedAge !== "all" ? selectedAge : null,
  ].filter(Boolean) as string[];

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedArea("all");
    setSelectedBreed("all");
    setSelectedAge("all");
  };

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[920px] gap-6 grid-cols-[320px,minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-[#dde6da] bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur xl:sticky xl:top-28 xl:self-start">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Filters</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Find the right dog</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Narrow by location, breed, age, or adoption stage and watch the map update instantly.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <SlidersHorizontal className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 p-5 pt-5 sm:p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                <div className="grid gap-2">
                  {([
                    { key: "all", label: "All dogs", count: counts.all, dot: "bg-slate-500" },
                    { key: "available", label: "Available", count: counts.available, dot: STATUS_STYLE.available.dot },
                    { key: "pending", label: "Requested", count: counts.pending, dot: STATUS_STYLE.pending.dot },
                    { key: "adopted", label: "Adopted", count: counts.adopted, dot: STATUS_STYLE.adopted.dot },
                  ] as Array<{ key: StatusFilter; label: string; count: number; dot: string }>).map((option) => {
                    const isActive = statusFilter === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setStatusFilter(option.key)}
                        className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-white" : option.dot}`} />
                          {option.label}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? "bg-white/15 text-white" : "bg-white text-slate-500"}`}>
                          {option.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Search</span>
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Name, breed, city, area"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">City</span>
                  <select
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">All cities</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Area</span>
                  <select
                    value={selectedArea}
                    onChange={(event) => setSelectedArea(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">All areas</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Breed</span>
                  <select
                    value={selectedBreed}
                    onChange={(event) => setSelectedBreed(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">All breeds</option>
                    {breedOptions.map((breed) => (
                      <option key={breed} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Age</span>
                  <select
                    value={selectedAge}
                    onChange={(event) => setSelectedAge(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">All ages</option>
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

            <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Active filters</p>
                <p className="text-xs text-slate-500">
                  {activeFilters.length === 0 ? "Showing every listed dog." : `${activeFilters.length} filters applied`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="overflow-hidden rounded-[32px] border border-[#dde6da] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Live map</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dog status by location</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Green markers are available dogs, yellow markers are requested, and blue markers are already adopted.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["available", "pending", "adopted"] as DogStatus[]).map((status) => (
                  <div
                    key={status}
                    className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-semibold ${STATUS_STYLE[status].border} ${STATUS_STYLE[status].text}`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[status].dot}`} />
                    {STATUS_LABELS[status]}
                  </div>
                ))}
              </div>
            </div>

            <div className="-mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1">
              <div className="min-w-[140px] flex-1 rounded-3xl bg-emerald-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Available</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">{counts.available}</p>
              </div>
              <div className="min-w-[140px] flex-1 rounded-3xl bg-amber-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Requested</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-amber-950">{counts.pending}</p>
              </div>
              <div className="min-w-[140px] flex-1 rounded-3xl bg-sky-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Adopted</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-sky-950">{counts.adopted}</p>
              </div>
            </div>
          </div>

          <div className="h-[320px] sm:h-[420px] xl:h-[540px]">
            <DogListingsMap dogs={filteredDogs} />
          </div>
        </section>
        </div>
      </div>

      <section className="rounded-[32px] border border-[#dde6da] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Listings</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">All dog cards</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {filteredDogs.length === 0
                ? "No dogs match the current filters."
                : `Showing ${filteredDogs.length} dog${filteredDogs.length === 1 ? "" : "s"} that match the current view.`}
            </p>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>

        {filteredDogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">No dogs found</p>
              <p className="text-sm text-slate-500">Try clearing a filter or broadening the search terms.</p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 2xl:grid-cols-3">
            {filteredDogs.map((dog) => {
              const statusStyle = STATUS_STYLE[dog.status];

              return (
                <article
                  key={dog.dogId}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-[#fcfcf9] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <Link href={`/dog/${dog.dogId}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={dog.imageUrl}
                        alt={dog.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                      <div className="absolute left-4 top-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.badge}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
                          {STATUS_LABELS[dog.status]}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold tracking-tight text-slate-900">{dog.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">{dog.breed}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                            {dog.age}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {[dog.gender, dog.color].filter(Boolean).map((tag) => (
                            <span
                              key={`${dog.dogId}-${tag}`}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{getLocationLabel(dog)}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-sm font-medium text-slate-500">
                          {dog.status === "available" ? "Ready for adoption" : STATUS_LABELS[dog.status]}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {dog.status === "available" ? "View profile" : "See details"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
