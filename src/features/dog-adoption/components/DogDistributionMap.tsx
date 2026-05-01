"use client";

import { useMemo, useState } from "react";

import type { DogRecord } from "@/lib/dog-adoption";
import {
  findDogLocationOption,
  type DogLocationOption,
} from "@/features/dog-adoption/location-catalog";
import { DogHotspotMapEmbed } from "@/features/dog-adoption/components/DogHotspotMapEmbed";

type GroupedDogLocation = {
  key: string;
  location: DogLocationOption;
  dogs: DogRecord[];
};

export function DogDistributionMap({ dogs }: { dogs: DogRecord[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const { groups, unmappedCount } = useMemo(() => {
    const grouped = new Map<string, GroupedDogLocation>();
    let skipped = 0;

    for (const dog of dogs) {
      const location = findDogLocationOption({
        locationKey: dog.locationKey,
        city: dog.city,
        area: dog.area,
        locationLabel: dog.locationLabel,
        latitude: dog.latitude,
        longitude: dog.longitude,
      });

      if (!location) {
        skipped += 1;
        continue;
      }

      const current = grouped.get(location.key) ?? {
        key: location.key,
        location,
        dogs: [],
      };
      current.dogs.push(dog);
      grouped.set(location.key, current);
    }

    const ordered = Array.from(grouped.values()).sort(
      (left, right) => right.dogs.length - left.dogs.length || left.location.label.localeCompare(right.location.label)
    );

    return {
      groups: ordered,
      unmappedCount: skipped,
    };
  }, [dogs]);

  const selectedKey = activeKey ?? groups[0]?.key ?? null;
  const selectedGroup = groups.find((group) => group.key === selectedKey) ?? null;

  return (
    <section className="site-panel site-panel--rounded">
      <div className="site-panel__body">
        <div className="site-toolbar__row">
          <div>
            <p className="site-eyebrow">Live hotspot map</p>
            <h3 className="site-heading site-heading--sm mt-3">Dogs Across Approved Rescue Areas</h3>
          </div>
          <div className="site-meta-row">
            <span>{groups.length} mapped areas</span>
            <span>{dogs.length} visible dogs</span>
            {unmappedCount ? <span>{unmappedCount} without map data</span> : null}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          {selectedGroup ? (
            <DogHotspotMapEmbed
              location={selectedGroup.location}
              title="Selected hotspot"
              description="This live map is centered on the same admin-approved rescue hotspot used when dogs are created or edited."
              footer={
                <div className="space-y-3">
                  <div className="site-toolbar__row">
                    <div>
                      <p className="site-eyebrow">{selectedGroup.location.province}</p>
                      <p className="site-copy mt-3 text-[#111111]">
                        {selectedGroup.location.label}
                      </p>
                    </div>
                    <span className="site-badge site-badge--dark">
                      {selectedGroup.dogs.length} dog{selectedGroup.dogs.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="site-copy site-copy--sm">
                    Search and filter controls update this map and the hotspot counts together.
                  </p>
                </div>
              }
            />
          ) : (
            <div className="site-empty">No mapped dogs match the current filters.</div>
          )}

          <div className="rounded-[2rem] border border-[#e5e5e5] bg-[#fafafa] p-5">
            <div className="border-b border-[#e5e5e5] pb-4">
              <p className="site-eyebrow">Area snapshot</p>
              <p className="site-copy mt-3">
                Approved hotspots are ordered by how many dogs currently match your active filters.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {groups.length === 0 ? (
                <div className="site-empty">No mapped dogs match the current filters.</div>
              ) : (
                groups.map((group) => (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => setActiveKey(group.key)}
                    className={`w-full rounded-[1.6rem] border px-4 py-4 text-left transition-colors ${
                      selectedKey === group.key
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#e5e5e5] bg-white text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[1.2rem] font-medium uppercase tracking-[0.14em]">
                          {group.location.label}
                        </p>
                        <p className={`mt-2 text-[1.15rem] leading-[1.6] ${selectedKey === group.key ? "text-white/72" : "text-[#707072]"}`}>
                          {group.dogs
                            .slice(0, 3)
                            .map((dog) => dog.name)
                            .join(" / ")}
                          {group.dogs.length > 3 ? ` / +${group.dogs.length - 3} more` : ""}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[0.95rem] font-medium uppercase tracking-[0.16em] ${selectedKey === group.key ? "border-white/25 text-white" : "border-[#cacacb] text-[#707072]"}`}>
                        {group.dogs.length}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
