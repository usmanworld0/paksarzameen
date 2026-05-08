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
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-all duration-300 ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_14px_28px_rgba(17,17,17,0.08)]"
                      : "border-black/10 bg-white text-neutral-600 hover:border-black/25 hover:text-neutral-950"
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

      <section className="relative z-0 isolate overflow-hidden rounded-[28px] border border-black/8 bg-white/94 shadow-[0_14px_36px_rgba(17,17,17,0.035)]">
        <div className="flex flex-col gap-3 border-b border-black/8 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-[9px] font-normal uppercase tracking-[0.28em] text-neutral-500">
              Live Map
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
              Dog locations
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["available", "adopted"] as const).map((status) => (
              <span
                key={status}
                className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-600"
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

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-normal uppercase tracking-[0.28em] text-neutral-500">
              Listings
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
              Browse dogs
            </h2>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
            {displayedDogs.length} result{displayedDogs.length === 1 ? "" : "s"}
          </p>
        </div>

        {displayedDogs.length === 0 ? (
          <div className="rounded-[28px] border border-black/8 bg-white/94 px-6 py-16 text-center shadow-[0_14px_36px_rgba(17,17,17,0.035)]">
            <p className="text-xl tracking-[-0.03em] text-neutral-950">No dogs match the current filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-4">
            {displayedDogs.map((dog) => {
              const publicStatus = getPublicDogStatus(dog.status);
              const secondaryLine = [dog.breed, dog.age].filter(Boolean).join(" / ") || dog.age;

              return (
                <article key={dog.dogId} className="group flex h-full flex-col">
                  <Link href={`/dog/${dog.dogId}`} className="relative block overflow-hidden">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#f4f0ea]">
                      <Image
                        src={dog.imageUrl}
                        alt={dog.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full border border-white/35 bg-white/86 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-neutral-950 backdrop-blur-md">
                          {STATUS_LABELS[publicStatus]}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Link href={`/dog/${dog.dogId}`} className="mt-4 block text-center">
                    <h3 className="line-clamp-1 text-[1.02rem] leading-tight tracking-[-0.02em] text-neutral-900 sm:text-[1.05rem]">
                      {dog.name}
                    </h3>
                    <p className="line-clamp-1 mt-1 text-[0.88rem] tracking-[-0.01em] text-neutral-700 sm:text-[0.92rem]">
                      {secondaryLine}
                    </p>
                    <p className="line-clamp-1 mt-1 text-[0.78rem] uppercase tracking-[0.16em] text-neutral-400">
                      {getLocationLabel(dog)}
                    </p>
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
