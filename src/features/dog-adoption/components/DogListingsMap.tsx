"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { findDogLocationOption } from "@/features/dog-adoption/location-catalog";
import type { DogRecord, DogStatus } from "@/lib/dog-adoption";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const DEFAULT_CENTER: L.LatLngExpression = { lat: 29.3954, lng: 71.679 };

const STATUS_META: Record<"available" | "adopted", { label: string; color: string }> = {
  available: {
    label: "Available",
    color: "#111111",
  },
  adopted: {
    label: "Adopted",
    color: "#8c8c8c",
  },
};

type DogWithCoords = DogRecord & { lat: number; lng: number };

type Props = {
  dogs: DogRecord[];
  userLocation?: { lat: number; lng: number } | null;
};

function getPublicDogStatus(status: DogStatus): "available" | "adopted" {
  return status === "adopted" ? "adopted" : "available";
}

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

export function DogListingsMap({ dogs, userLocation }: Props) {
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
    if (userLocation) {
      return { lat: userLocation.lat, lng: userLocation.lng };
    }

    if (!dogsWithCoords.length) return DEFAULT_CENTER;

    const lat = dogsWithCoords.reduce((sum, dog) => sum + dog.lat, 0) / dogsWithCoords.length;
    const lng = dogsWithCoords.reduce((sum, dog) => sum + dog.lng, 0) / dogsWithCoords.length;

    return { lat, lng };
  }, [dogsWithCoords, userLocation]);

  const bounds = useMemo(() => {
    if (userLocation || dogsWithCoords.length < 2) return null;

    const points = dogsWithCoords.map((dog) => [dog.lat, dog.lng] as [number, number]);
    return L.latLngBounds(points);
  }, [dogsWithCoords, userLocation]);

  const zoom = userLocation ? 13 : dogsWithCoords.length === 1 ? 13 : 11;

  const mapKey = useMemo(() => {
    const userKey = userLocation ? `user:${userLocation.lat}:${userLocation.lng}` : "no-user";
    if (!dogsWithCoords.length) return `empty-dog-map:${userKey}`;

    return dogsWithCoords
      .map((dog) => `${dog.dogId}:${dog.lat}:${dog.lng}:${dog.status}`)
      .join("|")
      .concat(`|${userKey}`);
  }, [dogsWithCoords, userLocation]);

  if (!dogsWithCoords.length) {
    return (
      <div className="flex h-full items-center justify-center bg-[#f8f6f2] px-6 text-center text-sm text-neutral-500">
        No dogs with known locations match these filters yet.
      </div>
    );
  }

  return (
    <div className="dog-listings-map-root relative z-0 isolate h-full w-full overflow-hidden">
      <MapContainer
        key={mapKey}
        className="dog-listings-map-leaflet"
        center={center}
        bounds={bounds ?? undefined}
        boundsOptions={{ padding: [32, 32] }}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {userLocation ? (
          <>
            <Circle
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              radius={5000}
              pathOptions={{
                color: "#111111",
                weight: 1.2,
                fillColor: "#111111",
                fillOpacity: 0.04,
                dashArray: "6 5",
              }}
            />
            <CircleMarker
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              radius={8}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#111111",
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="py-1 text-center text-[11px] uppercase tracking-[0.16em] text-neutral-700">
                  Your location
                </div>
              </Popup>
            </CircleMarker>
          </>
        ) : null}

        {dogsWithCoords.map((dog) => {
          const status = STATUS_META[getPublicDogStatus(dog.status)];

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
                <div className="w-56 space-y-3 py-1 text-neutral-950">
                  <div className="overflow-hidden rounded-[20px] border border-black/8 bg-[#f5f2ed]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dog.imageUrl} alt={dog.name} className="aspect-[4/5] w-full object-cover" />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-base tracking-[-0.02em] text-neutral-950">{dog.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                      {status.label}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {[dog.age, dog.gender, dog.color].filter(Boolean).join(" / ")}
                    </p>
                    <p className="text-sm text-neutral-600">{getLocationLabel(dog)}</p>
                  </div>

                  <a
                    href={`/dog/${dog.dogId}`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
                  >
                    Open profile
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
