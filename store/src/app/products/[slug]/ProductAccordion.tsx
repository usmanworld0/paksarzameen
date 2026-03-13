"use client";

import { useState } from "react";

interface ProductAccordionProps {
  description?: string | null;
  materials?: string | null;
  careInstructions?: string | null;
  heritageStory?: string | null;
}

const SECTIONS = [
  { key: "description", label: "Description & Details" },
  { key: "materials", label: "Materials & Composition" },
  { key: "care", label: "Care & Usage" },
  { key: "heritage", label: "Heritage & Story" },
] as const;

export function ProductAccordion({
  description,
  materials,
  careInstructions,
  heritageStory,
}: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("description");

  function toggle(key: string) {
    setOpenSection((prev) => (prev === key ? null : key));
  }

  function getContent(key: string): string {
    switch (key) {
      case "description":
        return description || "No description available.";
      case "materials":
        return materials || "No materials information available.";
      case "care":
        return careInstructions || "No care instructions available.";
      case "heritage":
        return heritageStory || "No heritage story available.";
      default:
        return "";
    }
  }

  return (
    <section className="bg-neutral-50 py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-lg font-serif font-bold text-neutral-900 mb-8">
          Product Information
        </h2>
        <div className="border border-neutral-300 bg-white divide-y divide-neutral-300 rounded-sm">
          {SECTIONS.map((section) => (
            <div key={section.key}>
              <button
                onClick={() => toggle(section.key)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-neutral-50 transition-colors"
                type="button"
              >
                <span className="text-sm font-medium text-neutral-900">
                  {section.label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
                    openSection === section.key ? "rotate-180" : ""
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === section.key && (
                <div className="px-6 pb-6 text-sm text-neutral-600 leading-relaxed">
                  {getContent(section.key)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
