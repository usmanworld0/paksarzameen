"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Heart } from "lucide-react";

import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type StatusFilter = "all" | DogStatus;

const ADOPTION_FEE_LABEL = "PKR 5,000";

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

export function DogMarketplace({ dogs }: { dogs: DogRecord[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("available");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredDogs = useMemo(() => {
    let result = dogs;

    if (statusFilter !== "all") {
      result = result.filter((dog) => dog.status === statusFilter);
    }

    // Sort by newest first
    result.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return result;
  }, [dogs, statusFilter]);

  const availableCount = dogs.filter((dog) => dog.status === "available").length;
  const adoptedCount = dogs.filter((dog) => dog.status === "adopted").length;

  const toggleFavorite = (dogId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dogId)) {
      newFavorites.delete(dogId);
    } else {
      newFavorites.add(dogId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="space-y-8">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("available")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            statusFilter === "available"
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Available ({availableCount})
        </button>
        <button
          onClick={() => setStatusFilter("adopted")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            statusFilter === "adopted"
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Adopted ({adoptedCount})
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            statusFilter === "all"
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All ({dogs.length})
        </button>
      </div>

      {/* Results Count */}
      <p className="text-sm font-medium text-slate-600">
        Showing {filteredDogs.length} dog{filteredDogs.length === 1 ? "" : "s"}
      </p>

      {/* Empty State */}
      {filteredDogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">No dogs available</p>
          <p className="mt-2 text-slate-600">Check back soon for new rescues!</p>
        </div>
      ) : (
        /* Card Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDogs.map((dog) => (
            <div
              key={dog.dogId}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg hover:border-slate-300"
            >
              {/* Image Container */}
              <Link href={`/dog/${dog.dogId}`} className="relative block overflow-hidden bg-slate-200">
                <div className="relative aspect-square">
                  <Image
                    src={dog.imageUrl}
                    alt={dog.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Status Badge */}
                <div className="absolute right-3 top-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClass(dog.status)}`}>
                    {STATUS_LABELS[dog.status]}
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(dog.dogId);
                  }}
                  className="absolute left-3 top-3 rounded-full bg-white/90 p-2 transition hover:bg-white"
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      favorites.has(dog.dogId)
                        ? "fill-rose-600 text-rose-600"
                        : "text-slate-400"
                    }`}
                  />
                </button>
              </Link>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Dog Name */}
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                  {dog.name}
                </h3>

                {/* Dog Details */}
                <p className="text-xs text-slate-500 line-clamp-2">
                  {dog.breed} • {dog.color} • {dog.age}
                </p>

                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {getLocationLabel(dog)}
                  </p>
                </div>

                {/* Fee */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Adoption Fee</p>
                  <p className="text-sm font-semibold text-slate-900">{ADOPTION_FEE_LABEL}</p>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/dog/${dog.dogId}`}
                  className="block w-full mt-4 py-2 rounded-full bg-emerald-600 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {dog.status === "available" ? "Adopt Now" : "View Profile"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
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
