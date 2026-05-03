"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { DogRecord } from "@/lib/dog-adoption";
import { DOG_LOCATION_OPTIONS } from "@/features/dog-adoption/location-catalog";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer   = dynamic(() => import("react-leaflet").then((m) => m.TileLayer),    { ssr: false });
const Marker      = dynamic(() => import("react-leaflet").then((m) => m.Marker),       { ssr: false });
const Popup       = dynamic(() => import("react-leaflet").then((m) => m.Popup),        { ssr: false });

// Default Bahawalpur centre
const DEFAULT_CENTER: L.LatLngExpression = { lat: 29.3954, lng: 71.679 };

type DogWithCoords = DogRecord & { lat: number; lng: number };

function resolveCoords(dog: DogRecord): { lat: number; lng: number } | null {
  if (dog.latitude && dog.longitude) return { lat: dog.latitude, lng: dog.longitude };

  if (dog.locationKey) {
    const entry = DOG_LOCATION_OPTIONS.find((o) => o.key === dog.locationKey);
    if (entry) return { lat: entry.latitude, lng: entry.longitude };
  }

  // Fuzzy fallback: match by city + area
  const entry = DOG_LOCATION_OPTIONS.find(
    (o) =>
      (dog.city && o.city.toLowerCase().includes(dog.city.toLowerCase())) ||
      (dog.area && o.area.toLowerCase().includes(dog.area.toLowerCase()))
  );
  if (entry) return { lat: entry.latitude, lng: entry.longitude };

  return null;
}

function makeIcon(status: DogRecord["status"]) {
  const color = status === "available" ? "#059669" : status === "adopted" ? "#4f46e5" : "#d97706";
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.77 16.2 25.07 17.1 25.74a1.5 1.5 0 0 0 1.8 0C19.8 43.07 36 30.77 36 18 36 8.06 27.94 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="17" r="9" fill="white"/>
      <text x="18" y="21" text-anchor="middle" font-size="11" font-weight="bold" fill="${color}" font-family="sans-serif">🐕</text>
    </svg>`);

  return L.divIcon({
    html: `<img src="data:image/svg+xml,${svg}" width="36" height="44" />`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
    className: "",
  });
}

type Props = { dogs: DogRecord[] };

export function DogListingsMap({ dogs }: Props) {
  const dogsWithCoords = useMemo<DogWithCoords[]>(() => {
    const result: DogWithCoords[] = [];
    for (const dog of dogs) {
      const coords = resolveCoords(dog);
      if (coords) result.push({ ...dog, lat: coords.lat, lng: coords.lng });
    }
    return result;
  }, [dogs]);

  const center = useMemo<L.LatLngExpression>(() => {
    if (!dogsWithCoords.length) return DEFAULT_CENTER;
    const lat = dogsWithCoords.reduce((s, d) => s + d.lat, 0) / dogsWithCoords.length;
    const lng = dogsWithCoords.reduce((s, d) => s + d.lng, 0) / dogsWithCoords.length;
    return { lat, lng };
  }, [dogsWithCoords]);

  if (!dogsWithCoords.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
        No dogs with known locations to show
      </div>
    );
  }

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-md sm:h-[500px]">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {dogsWithCoords.map((dog) => (
          <Marker
            key={dog.dogId}
            position={{ lat: dog.lat, lng: dog.lng }}
            icon={makeIcon(dog.status)}
          >
            <Popup>
              <div className="w-52 space-y-2 py-1">
                {/* Dog image */}
                <div className="h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dog.imageUrl}
                    alt={dog.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div>
                  <p className="font-bold text-slate-900">{dog.name}</p>
                  <p className="text-xs text-slate-500">{dog.breed} · {dog.color} · {dog.age}</p>
                  {(dog.city || dog.area) && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      📍 {[dog.area, dog.city].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    dog.status === "available"
                      ? "bg-emerald-100 text-emerald-700"
                      : dog.status === "adopted"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {dog.status === "available" ? "Available" : dog.status === "adopted" ? "Adopted" : "Pending"}
                </span>

                {/* Link */}
                <a
                  href={`/dog/${dog.dogId}`}
                  className="mt-1 block w-full rounded-xl bg-emerald-600 py-2 text-center text-xs font-bold text-white hover:bg-emerald-500"
                >
                  {dog.status === "available" ? "Adopt This Dog →" : "View Profile →"}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
