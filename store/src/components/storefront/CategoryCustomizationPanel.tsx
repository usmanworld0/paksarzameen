"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type ValueOption = {
  value: string;
  label: string;
  image?: string | null;
};

type SubOptionGroup = {
  label: string;
  values: ValueOption[];
};

type CustomizationOption = {
  id: string;
  name: string;
  required: boolean;
  options: unknown;
};

interface CategoryCustomizationPanelProps {
  categoryName: string;
  options: CustomizationOption[];
}

function parseSubOptionGroups(raw: unknown): SubOptionGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const obj = item as Record<string, unknown>;
      const values = Array.isArray(obj.values) ? obj.values : [];
      return {
        label: typeof obj.label === "string" ? obj.label : "",
        values: values.map((v) => {
          const vo = v as Record<string, unknown>;
          return {
            value: String(vo.value ?? ""),
            label: String(vo.label ?? vo.value ?? ""),
            image: typeof vo.image === "string" ? vo.image : null,
          };
        }),
      };
    })
    .filter((g) => g.label && g.values.length > 0);
}

function findValueLabel(groups: SubOptionGroup[], value: string): string {
  for (const g of groups) {
    const found = g.values.find((v) => v.value === value);
    if (found) return found.label;
  }
  return value;
}

export function CategoryCustomizationPanel({
  categoryName,
  options,
}: CategoryCustomizationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});

  if (options.length === 0) return null;

  return (
    <section className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Customization
          </p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">
            Customize Your {categoryName}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Select your preferred options below.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 whitespace-nowrap"
        >
          {isOpen ? "Hide Options" : "Customize"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-8 space-y-10">
          {options.map((opt) => {
            const groups = parseSubOptionGroups(opt.options);
            const selected = selections[opt.id];

            return (
              <div key={opt.id}>
                {/* Option label */}
                <div className="mb-4 flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-800">
                    {opt.name}
                    <span className="ml-1 text-red-400">*</span>
                  </p>
                  {selected && (
                    <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {findValueLabel(groups, selected)}
                    </span>
                  )}
                </div>

                {/* Sub-option groups */}
                <div className="space-y-5">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {group.values.map((val) => {
                          const isSelected = selected === val.value;
                          const hasImage = !!val.image;

                          return (
                            <button
                              key={val.value}
                              type="button"
                              onClick={() =>
                                setSelections((prev) => ({
                                  ...prev,
                                  [opt.id]: isSelected ? "" : val.value,
                                }))
                              }
                              className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-all ${
                                isSelected
                                  ? "border-neutral-900 bg-white shadow-md"
                                  : "border-neutral-200 bg-white hover:border-neutral-400"
                              }`}
                              style={{ minWidth: hasImage ? "80px" : "auto" }}
                            >
                              {isSelected && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white shadow">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}

                              {hasImage && (
                                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-neutral-100">
                                  <Image
                                    src={val.image!}
                                    alt={val.label}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                </div>
                              )}

                              <span
                                className={`text-[11px] font-medium leading-tight text-center ${
                                  isSelected ? "text-neutral-900" : "text-neutral-600"
                                }`}
                                style={{ maxWidth: "72px" }}
                              >
                                {val.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          {Object.values(selections).some(Boolean) && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Your selections
              </p>
              <ul className="space-y-1">
                {options.map((opt) => {
                  const val = selections[opt.id];
                  if (!val) return null;
                  const groups = parseSubOptionGroups(opt.options);
                  const label = findValueLabel(groups, val);
                  return (
                    <li key={opt.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500">{opt.name}</span>
                      <span className="font-medium text-neutral-900">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}


