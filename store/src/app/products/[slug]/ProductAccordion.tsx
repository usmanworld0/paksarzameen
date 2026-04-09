"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const sections = SECTIONS.map((section) => ({
    ...section,
    content:
      section.key === "description"
        ? description
        : section.key === "materials"
          ? materials
          : section.key === "care"
            ? careInstructions
            : heritageStory,
  })).filter((section) => Boolean(section.content?.trim()));

  const resolvedSections =
    sections.length > 0
      ? sections
      : [
          {
            key: "details",
            label: "Product Details",
            content: "Additional product information is available on request.",
          },
        ];

  const [openSection, setOpenSection] = useState<string | null>(resolvedSections[0]?.key ?? null);

  function toggle(key: string) {
    setOpenSection((prev) => (prev === key ? null : key));
  }

  return (
    <section className="store-section-soft">
      <div className="store-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:gap-16">
          <div className="max-w-md">
            <p className="store-kicker">Product Information</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">
              Materials, care, and the story behind the piece.
            </h2>
            <p className="mt-5 text-sm leading-7 text-neutral-600">
              The detail view is intentionally quiet and spacious, so the
              craftsmanship remains the focus while essential information stays
              easy to scan.
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-black/8 bg-white">
            {resolvedSections.map((section) => (
              <div key={section.key} className="border-b border-black/8 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(section.key)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-300 hover:bg-[#faf8f4] sm:px-7"
              >
                <span className="text-[15px] font-medium tracking-[-0.02em] text-neutral-950">
                  {section.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 ${
                    openSection === section.key ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === section.key && (
                <div className="px-6 pb-6 text-sm leading-7 text-neutral-600 sm:px-7">
                  {section.content}
                </div>
              )}
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
