"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProductAccordionProps {
  description?: string | null;
  materials?: string | null;
  careInstructions?: string | null;
  heritageStory?: string | null;
  variant?: "section" | "compact";
}

const SECTIONS = [
  { key: "description", label: "Description" },
  { key: "materials", label: "Size & Fit" },
  { key: "care", label: "Shipping & Returns" },
  { key: "heritage", label: "FAQs" },
] as const;

export function ProductAccordion({
  description,
  materials,
  careInstructions,
  heritageStory,
  variant = "section",
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

  const resolvedSections = sections.length > 0
    ? sections
    : [{ key: "details", label: "Product Details", content: "Additional product information is available on request." }];
  const [openSection, setOpenSection] = useState<string | null>(null);

  const disclosures = (
    <div className={variant === "compact" ? "border-y border-black/10" : "overflow-hidden rounded-[30px] border border-black/8 bg-white"}>
      {resolvedSections.map((section) => (
        <div key={section.key} className="border-b border-black/10 last:border-b-0">
          <button
            type="button"
            onClick={() => setOpenSection((current) => current === section.key ? null : section.key)}
            className={`flex w-full items-center justify-between gap-3 text-left text-[11px] font-medium uppercase tracking-[0.13em] text-neutral-900 transition-colors hover:bg-neutral-50 ${
              variant === "compact" ? "px-1 py-4 sm:px-0" : "px-6 py-5 sm:px-7"
            }`}
            aria-expanded={openSection === section.key}
          >
            <span>{section.label}</span>
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openSection === section.key ? "rotate-180" : ""}`} />
          </button>
          {openSection === section.key ? (
            <div className={`text-sm leading-7 text-neutral-600 ${variant === "compact" ? "px-1 pb-5 sm:px-0" : "px-6 pb-6 sm:px-7"}`}>
              {section.content}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  if (variant === "compact") return disclosures;

  return (
    <section className="store-section-soft">
      <div className="store-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:gap-16">
          <div className="max-w-md">
            <p className="store-kicker">Product Information</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">Materials, care, and the story behind the piece.</h2>
          </div>
          {disclosures}
        </div>
      </div>
    </section>
  );
}