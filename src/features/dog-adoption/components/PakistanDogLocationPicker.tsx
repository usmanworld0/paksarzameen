"use client";

import { useMemo } from "react";

import {
  DOG_LOCATION_OPTIONS,
  type DogLocationOption,
  groupDogLocationOptionsByCity,
} from "@/features/dog-adoption/location-catalog";
import { PakistanLocationMap } from "@/features/dog-adoption/components/PakistanLocationMap";

type PakistanDogLocationPickerProps = {
  value: DogLocationOption | null;
  onChange: (value: DogLocationOption) => void;
};

export function PakistanDogLocationPicker({
  value,
  onChange,
}: PakistanDogLocationPickerProps) {
  const locationGroups = useMemo(() => groupDogLocationOptionsByCity(), []);

  const markers = useMemo(
    () =>
      DOG_LOCATION_OPTIONS.map((option) => ({
        id: option.key,
        label: option.city,
        sublabel: option.area,
        x: option.mapX,
        y: option.mapY,
        active: value?.key === option.key,
        onSelect: () => onChange(option),
      })),
    [onChange, value]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
      <PakistanLocationMap
        markers={markers}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">
                Selected pickup zone
              </p>
              <p className="mt-2 text-[1.5rem] font-medium leading-[1.6] text-[#111111]">
                {value ? value.label : "Choose a map pin to assign the dog's rescue area."}
              </p>
            </div>
            {value ? (
              <div className="flex flex-wrap gap-2 text-[1rem] font-medium uppercase tracking-[0.14em] text-[#707072]">
                <span className="rounded-full border border-[#cacacb] px-3 py-1">{value.city}</span>
                <span className="rounded-full border border-[#cacacb] px-3 py-1">{value.area}</span>
                <span className="rounded-full border border-[#111111] bg-[#111111] px-3 py-1 text-white">
                  {value.province}
                </span>
              </div>
            ) : null}
          </div>
        }
      />

      <div className="rounded-[2rem] border border-[#e5e5e5] bg-white p-5">
        <div className="border-b border-[#e5e5e5] pb-4">
          <p className="text-[1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">
            Area library
          </p>
          <h3 className="mt-3 text-[2.2rem] font-semibold uppercase leading-[0.96] tracking-[-0.06em] text-[#111111]">
            Rescue Areas
          </h3>
          <p className="mt-3 text-[1.3rem] leading-[1.7] text-[#707072]">
            If a marker feels too small on mobile, use the matching area card here.
          </p>
        </div>

        <div className="mt-4 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
          {locationGroups.map((group) => (
            <section key={group.city}>
              <p className="text-[1rem] font-medium uppercase tracking-[0.16em] text-[#707072]">
                {group.city}
              </p>
              <div className="mt-2 space-y-2">
                {group.options.map((option) => {
                  const active = value?.key === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => onChange(option)}
                      className={`flex w-full items-start justify-between gap-3 rounded-[1.4rem] border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "border-[#e5e5e5] bg-[#fafafa] text-[#111111] hover:border-[#111111]"
                      }`}
                    >
                      <div>
                        <p className="text-[1.25rem] font-medium uppercase tracking-[0.12em]">
                          {option.area}
                        </p>
                        <p className={`mt-2 text-[1.15rem] leading-[1.6] ${active ? "text-white/74" : "text-[#707072]"}`}>
                          {option.province}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[0.95rem] font-medium uppercase tracking-[0.16em] ${active ? "border-white/25 text-white" : "border-[#cacacb] text-[#707072]"}`}>
                        Pin
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
