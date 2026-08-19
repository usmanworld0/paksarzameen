"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Locate, RotateCcw, Search, X } from "lucide-react";

import { DogListingsMap } from "@/features/dog-adoption/components/DogListingsMap";
import { findDogLocationOption } from "@/features/dog-adoption/location-catalog";
import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type StatusFilter = "all" | "available" | "adopted";

type MarketplaceFilters = {
  status: StatusFilter;
  search: string;
  city: string;
  area: string;
  age: string;
};

type NearbyState = "idle" | "loading" | "active" | "denied";

const STORE_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const STATUS_LABELS: Record<"available" | "adopted", string> = {
  available: "Available",
  adopted: "Adopted",
};

function getPublicDogStatus(status: DogStatus): "available" | "adopted" {
  return status === "adopted" ? "adopted" : "available";
}

function sortTextValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

function sortAgeValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) => {
    const first = Number.parseFloat(a);
    const second = Number.parseFloat(b);

    if (Number.isFinite(first) && Number.isFinite(second) && first !== second) {
      return first - second;
    }

    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });
}

function getLocationLabel(dog: DogRecord) {
  if (dog.area && dog.city) return `${dog.area}, ${dog.city}`;
  if (dog.city) return dog.city;
  if (dog.area) return dog.area;
  return "Location to be confirmed";
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function resolveDogCoords(dog: DogRecord): { lat: number; lng: number } | null {
  if (typeof dog.latitude === "number" && typeof dog.longitude === "number") {
    return { lat: dog.latitude, lng: dog.longitude };
  }

  const location = findDogLocationOption(dog);
  if (!location) return null;

  return { lat: location.latitude, lng: location.longitude };
}

function matchesDog(
  dog: DogRecord,
  filters: MarketplaceFilters,
  ignore: Array<keyof MarketplaceFilters> = []
) {
  const ignored = new Set(ignore);
  const publicStatus = getPublicDogStatus(dog.status);

  if (!ignored.has("status") && filters.status !== "all" && publicStatus !== filters.status) {
    return false;
  }

  if (!ignored.has("search") && filters.search.trim()) {
    const query = filters.search.trim().toLowerCase();
    const haystack = [dog.name, dog.color, dog.age, dog.city ?? "", dog.area ?? "", dog.breed ?? ""]
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(query)) return false;
  }

  if (!ignored.has("city") && filters.city !== "all" && dog.city !== filters.city) return false;
  if (!ignored.has("area") && filters.area !== "all" && dog.area !== filters.area) return false;
  if (!ignored.has("age") && filters.age !== "all" && dog.age !== filters.age) return false;

  return true;
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
      {children}
    </p>
  );
}

function SelectControl({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-neutral-900 outline-none transition-all duration-300 focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.04)]"
    >
      {children}
    </select>
  );
}

export function DogMarketplace({ dogs }: { dogs: DogRecord[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [nearbyState, setNearbyState] = useState<NearbyState>("idle");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const filters = {
    status: statusFilter,
    search: searchQuery,
    city: selectedCity,
    area: selectedArea,
    age: selectedAge,
  } satisfies MarketplaceFilters;

  const filteredDogs = useMemo(
    () =>
      dogs
        .filter((dog) => matchesDog(dog, filters))
        .sort((first, second) => {
          const firstStatus = getPublicDogStatus(first.status);
          const secondStatus = getPublicDogStatus(second.status);

          if (firstStatus !== secondStatus) {
            return firstStatus === "available" ? -1 : 1;
          }

          return Date.parse(second.createdAt) - Date.parse(first.createdAt);
        }),
    [dogs, filters]
  );

  const cityOptions = useMemo(
    () => sortTextValues(dogs.filter((dog) => matchesDog(dog, filters, ["city"])).map((dog) => dog.city ?? "")),
    [dogs, filters]
  );

  const areaOptions = useMemo(
    () => sortTextValues(dogs.filter((dog) => matchesDog(dog, filters, ["area"])).map((dog) => dog.area ?? "")),
    [dogs, filters]
  );

  const ageOptions = useMemo(
    () => sortAgeValues(dogs.filter((dog) => matchesDog(dog, filters, ["age"])).map((dog) => dog.age)),
    [dogs, filters]
  );

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
    if (selectedAge !== "all" && !ageOptions.includes(selectedAge)) {
      setSelectedAge("all");
    }
  }, [ageOptions, selectedAge]);

  const counts = useMemo(
    () => ({
      all: dogs.length,
      available: dogs.filter((dog) => getPublicDogStatus(dog.status) === "available").length,
      adopted: dogs.filter((dog) => dog.status === "adopted").length,
    }),
    [dogs]
  );

  const activeFilters = [
    statusFilter !== "all" ? STATUS_LABELS[statusFilter] : null,
    searchQuery.trim() ? `"${searchQuery.trim()}"` : null,
    selectedCity !== "all" ? selectedCity : null,
    selectedArea !== "all" ? selectedArea : null,
    selectedAge !== "all" ? selectedAge : null,
  ].filter(Boolean) as string[];

  const nearbyDogIds = useMemo(() => {
    if (!userLocation) return new Set<string>();

    const ids = new Set<string>();

    for (const dog of dogs) {
      const coords = resolveDogCoords(dog);
      if (!coords) continue;

      if (haversineKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng) <= 5) {
        ids.add(dog.dogId);
      }
    }

    return ids;
  }, [dogs, userLocation]);

  const displayedDogs =
    nearbyState === "active"
      ? filteredDogs.filter((dog) => nearbyDogIds.has(dog.dogId))
      : filteredDogs;

  function resetFilters() {
    setStatusFilter("all");
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedArea("all");
    setSelectedAge("all");
    setNearbyState("idle");
    setUserLocation(null);
  }

  function findNearby() {
    if (!navigator.geolocation) {
      setNearbyState("denied");
      return;
    }

    setNearbyState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNearbyState("active");
      },
      () => {
        setNearbyState("denied");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  function clearNearby() {
    setNearbyState("idle");
    setUserLocation(null);
  }

  return (
    <div className="space-y-10" style={{ fontFamily: STORE_FONT_FAMILY }}>
      <section className="rounded-[28px] border border-black/8 bg-white/95 p-5 shadow-[0_14px_36px_rgba(17,17,17,0.035)] sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.66fr))]">
          <div className="space-y-2">
            <FilterLabel>Search</FilterLabel>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Name, breed, city, color"
                className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.04)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FilterLabel>City</FilterLabel>
            <SelectControl value={selectedCity} onChange={setSelectedCity}>
              <option value="all">All cities</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectControl>
          </div>

          <div className="space-y-2">
            <FilterLabel>Area</FilterLabel>
            <SelectControl value={selectedArea} onChange={setSelectedArea}>
              <option value="all">All areas</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </SelectControl>
          </div>

          <div className="space-y-2">
            <FilterLabel>Age</FilterLabel>
            <SelectControl value={selectedAge} onChange={setSelectedAge}>
              <option value="all">All ages</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </SelectControl>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-black/8 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all" as StatusFilter, label: "All Dogs", count: counts.all },
              { key: "available" as StatusFilter, label: "Available", count: counts.available },
              { key: "adopted" as StatusFilter, label: "Adopted", count: counts.adopted },
            ].map((option) => {
              const active = statusFilter === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setStatusFilter(option.key)}
                  className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-all duration-300 ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-black/10 bg-white text-neutral-600 hover:border-black/25"
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {nearbyState === "active" ? (
              <button
                type="button"
                onClick={clearNearby}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
              >
                <Locate className="h-3.5 w-3.5" />
                Nearby active
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={findNearby}
                disabled={nearbyState === "loading"}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-neutral-700 transition hover:border-black/25 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Locate className="h-3.5 w-3.5" />
                {nearbyState === "loading" ? "Locating..." : "Find nearby"}
              </button>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-neutral-700 transition hover:border-black/25 hover:text-neutral-950"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {activeFilters.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-full border border-black/8 bg-[#fcfbf8] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500"
              >
                {filter}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="store-panel relative z-0 isolate overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-black/8 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="store-kicker">
              Live Map
            </p>
            <h2 className="store-heading mt-3">
              Dog locations
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["available", "adopted"] as const).map((status) => (
              <span
                key={status}
                className="store-pill-label"
              >
                {STATUS_LABELS[status]}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-0 isolate h-[300px] sm:h-[360px] lg:h-[420px]">
          <DogListingsMap dogs={displayedDogs} userLocation={userLocation} />
        </div>
      </section>

      {nearbyState === "denied" ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Location access was blocked in the browser, so nearby filtering could not be enabled.
        </div>
      ) : null}

      <section className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 pb-6">
          <div>
            <p className="store-kicker">
              Listings
            </p>
            <h2 className="store-heading mt-3">
              Browse dogs
            </h2>
          </div>

          <p className="text-[11px] font-normal uppercase tracking-[0.24em] text-neutral-400">
            {displayedDogs.length} result{displayedDogs.length === 1 ? "" : "s"}
          </p>
        </div>

        {displayedDogs.length === 0 ? (
          <div className="store-panel px-6 py-20 text-center">
            <p className="text-xl font-normal tracking-[-0.03em] text-neutral-950">No dogs match the current filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 store-button-primary"
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedDogs.map((dog) => {
              const publicStatus = getPublicDogStatus(dog.status);
              const isAvailable = publicStatus === "available";

              return (
                <article
                  key={dog.dogId}
                  className="group flex flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-black/10 hover:shadow-[0_22px_48px_rgba(17,17,17,0.06)]"
                >
                  <Link href={`/dog/${dog.dogId}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />

                    {/* Glassmorphic Status Pill with Pulse */}
                    <div className="absolute left-4 top-4 z-10">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md transition-all duration-300 ${
                          isAvailable
                            ? "border-emerald-500/20 bg-emerald-50/80 text-emerald-700"
                            : "border-black/5 bg-white/80 text-neutral-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isAvailable ? "bg-emerald-600 animate-pulse" : "bg-neutral-500"
                          }`}
                        />
                        {STATUS_LABELS[publicStatus]}
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    {/* Location Kicker */}
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                      <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate max-w-[200px]">
                        {getLocationLabel(dog)}
                      </span>
                    </div>

                    <Link href={`/dog/${dog.dogId}`} className="mt-2.5 block">
                      <h3 className="line-clamp-1 text-[1.12rem] font-semibold leading-tight tracking-[-0.03em] text-neutral-900 transition-colors group-hover:text-emerald-700">
                        {dog.name}
                      </h3>
                    </Link>

                    {/* Specs Tags Container */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {dog.breed && (
                        <span className="rounded-xl bg-neutral-50 border border-black/5 px-2.5 py-1 text-[10px] font-medium text-neutral-600 truncate max-w-[120px]">
                          {dog.breed}
                        </span>
                      )}
                      {dog.age && (
                        <span className="rounded-xl bg-neutral-50 border border-black/5 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                          {dog.age}
                        </span>
                      )}
                      {dog.gender && (
                        <span className="rounded-xl bg-neutral-50 border border-black/5 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                          {dog.gender}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 border-t border-black/5 pt-4">
                      <Link
                        href={`/dog/${dog.dogId}`}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-emerald-700 group-hover:shadow-[0_10px_20px_rgba(15,122,71,0.08)]"
                      >
                        {isAvailable ? "Personalize & Adopt" : "View Profile"} &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
