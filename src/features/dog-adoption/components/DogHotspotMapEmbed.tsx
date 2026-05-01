"use client";

import type { ReactNode } from "react";

import {
  createDogLocationEmbedUrl,
  createDogLocationExternalMapUrl,
  type DogLocationOption,
} from "@/features/dog-adoption/location-catalog";

type DogHotspotMapEmbedProps = {
  location: DogLocationOption;
  title: string;
  description: string;
  footer?: ReactNode;
};

export function DogHotspotMapEmbed({
  location,
  title,
  description,
  footer,
}: DogHotspotMapEmbedProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#e5e5e5] bg-white">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[1rem] font-medium uppercase tracking-[0.18em] text-[#707072]">
              {title}
            </p>
            <h3 className="mt-3 text-[2.2rem] font-semibold uppercase leading-[0.96] tracking-[-0.06em] text-[#111111]">
              {location.area}
            </h3>
            <p className="mt-3 text-[1.3rem] leading-[1.7] text-[#707072]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[0.95rem] font-medium uppercase tracking-[0.16em] text-[#707072]">
            <span className="rounded-full border border-[#cacacb] px-3 py-1">{location.city}</span>
            <span className="rounded-full border border-[#cacacb] px-3 py-1">{location.hotspotType}</span>
            <span className="rounded-full border border-[#111111] bg-[#111111] px-3 py-1 text-white">
              {location.riskLevel} Risk
            </span>
          </div>
        </div>
      </div>

      <div className="aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5] sm:aspect-[16/10]">
        <iframe
          title={`${location.label} map`}
          src={createDogLocationEmbedUrl(location)}
          width="100%"
          height="100%"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="border-t border-[#e5e5e5] bg-white p-5">
        <div className="site-toolbar__row">
          <div className="site-meta-row">
            <span>{location.estimatedDogPopulation} est. dogs</span>
            <span>{location.operationalRadiusM}m radius</span>
          </div>
          <a
            href={createDogLocationExternalMapUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="site-link"
          >
            Open Full Map
          </a>
        </div>

        <p className="mt-3 text-[1.25rem] leading-[1.7] text-[#707072]">
          {location.notes}
        </p>

        {footer ? <div className="mt-4 border-t border-[#e5e5e5] pt-4">{footer}</div> : null}
      </div>
    </div>
  );
}
