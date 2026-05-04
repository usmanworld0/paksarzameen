"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { DogRecord, DogStatus } from "@/lib/dog-adoption";
import { findDogLocationOption } from "@/features/dog-adoption/location-catalog";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const DEFAULT_CENTER: L.LatLngExpression = { lat: 29.3954, lng: 71.679 };

const STATUS_META: Record<DogStatus, { label: string; color: string; badge: string }> = {
  available: {
    label: "Available",
    color: "#16a34a",
    badge: "bg-emerald-100 text-emerald-700",
  },
  pending: {
    label: "Requested",
    color: "#facc15",
    badge: "bg-amber-100 text-amber-700",
  },
  adopted: {
    label: "Adopted",
    color: "#0284c7",
    badge: "bg-sky-100 text-sky-700",
  },
};

type DogWithCoords = DogRecord & { lat: number; lng: number };
type Props = { dogs: DogRecord[] };

function resolveCoords(dog: DogRecord): { lat: number; lng: number } | null {
  if (typeof dog.latitude === "number" && typeof dog.longitude === "number") {
    return { lat: dog.latitude, lng: dog.longitude };
  }

  const location = findDogLocationOption(dog);
  if (!location) return null;

  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}

function getLocationLabel(dog: DogRecord) {
  if (dog.area && dog.city) return `${dog.area}, ${dog.city}`;
  if (dog.city) return dog.city;
  if (dog.area) return dog.area;
  return "Location to be confirmed";
}

export function DogListingsMap({ dogs }: Props) {
  const dogsWithCoords = useMemo<DogWithCoords[]>(() => {
    const result: DogWithCoords[] = [];

    for (const dog of dogs) {
      const coords = resolveCoords(dog);
      if (!coords) continue;

      result.push({
        ...dog,
        lat: coords.lat,
        lng: coords.lng,
      });
    }

    return result;
  }, [dogs]);

  const center = useMemo<L.LatLngExpression>(() => {
    if (!dogsWithCoords.length) return DEFAULT_CENTER;

    const lat = dogsWithCoords.reduce((sum, dog) => sum + dog.lat, 0) / dogsWithCoords.length;
    const lng = dogsWithCoords.reduce((sum, dog) => sum + dog.lng, 0) / dogsWithCoords.length;

    return { lat, lng };
  }, [dogsWithCoords]);

  const bounds = useMemo(() => {
    if (dogsWithCoords.length < 2) return null;

    const points = dogsWithCoords.map((dog) => [dog.lat, dog.lng] as [number, number]);
    return L.latLngBounds(points);
  }, [dogsWithCoords]);

  const mapKey = useMemo(() => {
    if (!dogsWithCoords.length) return "empty-dog-map";
    return dogsWithCoords.map((dog) => `${dog.dogId}:${dog.lat}:${dog.lng}:${dog.status}`).join("|");
  }, [dogsWithCoords]);

  if (!dogsWithCoords.length) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f7f7f2] px-6 text-center text-sm text-slate-500">
        No dogs with known locations match these filters yet.
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <MapContainer
        key={mapKey}
        center={center}
        bounds={bounds ?? undefined}
        boundsOptions={{ padding: [36, 36] }}
        zoom={dogsWithCoords.length === 1 ? 13 : 11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {dogsWithCoords.map((dog) => {
          const status = STATUS_META[dog.status];

          return (
            <CircleMarker
              key={dog.dogId}
              center={{ lat: dog.lat, lng: dog.lng }}
              radius={10}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: status.color,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="w-56 space-y-3 py-1">
                  <div className="h-28 w-full overflow-hidden rounded-2xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dog.imageUrl}
                      alt={dog.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">{dog.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {[dog.breed, dog.age, dog.gender].filter(Boolean).join(" / ")}
                    </p>
                    <p className="text-xs text-slate-500">{getLocationLabel(dog)}</p>
                  </div>

                  <a
                    href={`/dog/${dog.dogId}`}
                    className="block rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    {dog.status === "available" ? "Open adoption profile" : "View dog details"}
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
