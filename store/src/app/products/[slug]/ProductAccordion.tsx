"use client";

import { useState } from "react";

interface ProductAccordionProps {
  description?: string | null;
}

const SECTIONS = [
  { key: "description", label: "Description" },
  { key: "materials", label: "Materials & Care" },
  { key: "heritage", label: "Heritage" },
] as const;

export function ProductAccordion({ description }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("description");

  function toggle(key: string) {
    setOpenSection((prev) => (prev === key ? null : key));
  }

  function getContent(key: string): string {
    switch (key) {
      case "description":
        return description || "No description available.";
      case "materials":
        return "Handcrafted with locally sourced materials. Handle with care. Avoid prolonged exposure to direct sunlight or moisture.";
      case "heritage":
        return "Each piece is crafted by skilled artisans preserving centuries-old Pakistani craft traditions, supported by the PakSarZameen Commonwealth initiative.";
      default:
        return "";
    }
  }

  return (
    <div className="border-t border-neutral-200 mt-6">
      {SECTIONS.map((section) => (
        <div key={section.key} className="border-b border-neutral-200">
          <button
            onClick={() => toggle(section.key)}
            className="w-full flex items-center justify-between py-4 text-left"
            type="button"
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-700">
              {section.label}
            </span>
            <span className="text-neutral-400 text-lg leading-none">
              {openSection === section.key ? "−" : "+"}
            </span>
          </button>
          {openSection === section.key && (
            <div className="pb-4 text-sm text-neutral-500 leading-relaxed">
              {getContent(section.key)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
