"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import L from "leaflet";
import { DOG_LOCATION_OPTIONS } from "@/features/dog-adoption/location-catalog";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false }) as any;

// Default marker icon configuration for react-leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function DogLocationMap() {
  // Calculate center point of all locations
  const center = useMemo((): L.LatLngExpression => {
    if (DOG_LOCATION_OPTIONS.length === 0) return { lat: 29.3954, lng: 71.679 };
    
    const avgLat = DOG_LOCATION_OPTIONS.reduce((sum, loc) => sum + loc.latitude, 0) / DOG_LOCATION_OPTIONS.length;
    const avgLng = DOG_LOCATION_OPTIONS.reduce((sum, loc) => sum + loc.longitude, 0) / DOG_LOCATION_OPTIONS.length;
    
    return { lat: avgLat, lng: avgLng };
  }, []);

  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
      <MapContainer 
        center={center}
        zoom={12} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {DOG_LOCATION_OPTIONS.map((location) => (
          <Marker 
            key={location.key} 
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={defaultIcon}
          >
            <Popup>
              <div className="space-y-2 min-w-max">
                <h3 className="font-semibold text-slate-900">{location.label}</h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold">Type:</span> {location.hotspotType}</p>
                  <p><span className="font-semibold">Risk:</span> {location.riskLevel}</p>
                  <p><span className="font-semibold">Dogs:</span> ~{location.estimatedDogPopulation}</p>
                  <p className="italic">{location.notes}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
