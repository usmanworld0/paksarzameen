"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Heart, Search } from "lucide-react";

import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

type StatusFilter = "all" | DogStatus;

const ADOPTION_FEE_LABEL = "PKR 5,000";

const STATUS_LABELS: Record<DogStatus, string> = {
  available: "Available",
  pending: "Pending",
  adopted: "Adopted",
};

const STATUS_CONFIG: Record<DogStatus, { bg: string; text: string; dot: string }> = {
  available: { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  pending: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  adopted: { bg: "bg-indigo-100", text: "text-indigo-800", dot: "bg-indigo-500" },
};

export function DogMarketplace({ dogs }: { dogs: DogRecord[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredDogs = useMemo(() => {
    let result = dogs;
    if (statusFilter !== "all") result = result.filter((d) => d.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.breed.toLowerCase().includes(q) ||
          d.color.toLowerCase().includes(q) ||
          (d.city ?? "").toLowerCase().includes(q) ||
          (d.area ?? "").toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [dogs, statusFilter, searchQuery]);

  const counts: Record<StatusFilter, number> = {
    all: dogs.length,
    available: dogs.filter((d) => d.status === "available").length,
    pending: dogs.filter((d) => d.status === "pending").length,
    adopted: dogs.filter((d) => d.status === "adopted").length,
  };

  const toggleFavorite = (dogId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["available", "adopted", "all"] as StatusFilter[]).map((filter) => {
            const active = statusFilter === filter;
            const colorMap: Record<string, string> = {
              available: active
                ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50",
              adopted: active
                ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50",
              all: active
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
            };
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition ${colorMap[filter]}`}
              >
                {filter === "available" && <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-emerald-500"}`} />}
                {filter === "adopted" && <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-indigo-500"}`} />}
                {filter === "available" ? "Available" : filter === "adopted" ? "Adopted" : "All"}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {counts[filter]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, breed, location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <p className="text-xs font-medium text-slate-400">
        {filteredDogs.length === 0 ? "No results" : `${filteredDogs.length} dog${filteredDogs.length === 1 ? "" : "s"}`}
        {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
      </p>

      {filteredDogs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Heart className="h-7 w-7 text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No dogs found</p>
            <p className="mt-1 text-sm text-slate-400">
              {searchQuery ? "Try a different search term" : "Check back soon for new rescues!"}
            </p>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDogs.map((dog) => {
            const cfg = STATUS_CONFIG[dog.status];
            const isFav = favorites.has(dog.dogId);
            return (
              <div
                key={dog.dogId}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <Link href={`/dog/${dog.dogId}`} className="relative block overflow-hidden bg-slate-100">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={dog.imageUrl}
                      alt={dog.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>

                  {/* Status */}
                  <div className="absolute right-3 top-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {STATUS_LABELS[dog.status]}
                    </span>
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => toggleFavorite(dog.dogId, e)}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110 hover:bg-white"
                  >
                    <Heart className={`h-4 w-4 transition ${isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                  </button>

                  {/* Fee */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {ADOPTION_FEE_LABEL}
                    </span>
                  </div>
                </Link>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="truncate text-lg font-bold text-slate-900">{dog.name}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {[dog.breed, dog.age, dog.gender].filter(Boolean).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                      {dog.color && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          {dog.color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{getLocationLabel(dog)}</span>
                  </div>

                  <Link
                    href={`/dog/${dog.dogId}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition ${
                      dog.status === "available"
                        ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {dog.status === "available" ? (
                      <><Heart className="h-4 w-4" />Adopt Now</>
                    ) : (
                      "View Profile"
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getLocationLabel(dog: DogRecord) {
  if (dog.city && dog.area) return `${dog.area}, ${dog.city}`;
  if (dog.city) return dog.city;
  if (dog.area) return dog.area;
  return "Location to be confirmed";
}
