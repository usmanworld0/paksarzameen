"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import { formatRegionalPrice } from "@/lib/pricing";
import { parseCustomizationOptions } from "@/lib/customizations";
import { useStoreRegion } from "@/hooks/useStoreRegion";
import { useCartStore } from "@/store/cart";

interface CategoryCustomizationPanelProps {
  categoryName: string;
  categorySlug: string;
  options: CustomizationOption[];
}

export function CategoryCustomizationPanel({
  categoryName,
  categorySlug,
  options,
}: CategoryCustomizationPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const region = useStoreRegion();
  const addItem = useCartStore((state) => state.addItem);

  const [selections, setSelections] = useState<
    Record<
      string,
      {
        optionName: string;
        groupLabel: string;
        value: string;
        valueLabel: string;
        priceAdjustment: number;
      }
    >
  >({});
  const [submitting, setSubmitting] = useState(false);

  const parsedOptions = useMemo(() => parseCustomizationOptions(options), [options]);

  const selectedOptionId = searchParams.get("option");
  const selectedOption = useMemo(
    () => parsedOptions.find((option) => option.id === selectedOptionId) ?? null,
    [parsedOptions, selectedOptionId]
  );

  const requiredGroupKeys = useMemo(
    () =>
      parsedOptions.flatMap((option) => {
        if (!option.required) return [];
        if (option.fieldType === "select") {
          return option.groups.map((group) => `${option.id}::${group.label}`);
        }
        return [`${option.id}::value`];
      }),
    [parsedOptions]
  );

  const missingRequiredCount = requiredGroupKeys.filter(
    (groupKey) => !(selections[groupKey]?.value ?? "").trim()
  ).length;

  const optionsTotal = useMemo(
    () =>
      Object.values(selections).reduce(
        (sum, selection) => sum + selection.priceAdjustment,
        0
      ),
    [selections]
  );

  function openOption(optionId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("option", optionId);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function backToOptions() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("option");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  async function proceedToBilling() {
    if (missingRequiredCount > 0) return;

    setSubmitting(true);

    const customizations = Object.entries(selections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, selection]) => ({
        key,
        optionName: selection.optionName,
        groupLabel: selection.groupLabel,
        value: selection.value,
        valueLabel: selection.valueLabel,
        priceAdjustment: selection.priceAdjustment,
      }));

    addItem({
      productId: `custom-order-${categorySlug}`,
      name: `${categoryName} Custom Order`,
      slug: `categories/${categorySlug}`,
      price: optionsTotal,
      discountedPrice: undefined,
      image: "",
      quantity: 1,
      region,
      customizations,
    });

    router.push("/checkout");
  }

  if (parsedOptions.length === 0) return null;

  return (
    <section className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-7 sm:p-10">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Customization
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Customize Your {categoryName}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Step 1: choose an option. Step 2: select values for that option.
          </p>
        </div>
      </div>

      {!selectedOption ? (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {parsedOptions.map((option) => {
              const optionKeyPrefix = `${option.id}::`;
              const isComplete =
                option.fieldType === "select"
                  ? option.groups.every(
                      (group) =>
                        !!selections[`${option.id}::${group.label}`]?.value.trim()
                    )
                  : !!selections[`${option.id}::value`]?.value.trim();

              const selectedCount = Object.keys(selections).filter((key) =>
                key.startsWith(optionKeyPrefix)
              ).length;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => openOption(option.id)}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-neutral-900 sm:text-xl">{option.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                        {option.fieldType}
                        {option.required ? " • Required" : " • Optional"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        isComplete
                          ? "bg-[#2c3d31] text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {isComplete ? "Done" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-neutral-500">
                    {option.fieldType === "select"
                      ? `${selectedCount}/${option.groups.length} groups selected`
                      : selectedCount > 0
                      ? "Value entered"
                      : "No value entered"}
                  </p>
                </button>
              );
            })}
          </div>

          <SummaryCard
            missingRequiredCount={missingRequiredCount}
            optionsTotal={optionsTotal}
            region={region}
            submitting={submitting}
            onProceed={proceedToBilling}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={backToOptions}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Options
            </button>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              {selectedOption.required ? "Required" : "Optional"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-neutral-900 sm:text-2xl">{selectedOption.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">
              {selectedOption.fieldType}
            </p>

            {selectedOption.fieldType === "select" ? (
              <div className="mt-5 space-y-5">
                {selectedOption.groups.map((group) => {
                  const groupKey = `${selectedOption.id}::${group.label}`;
                  const selected = selections[groupKey]?.value;

                  return (
                    <div key={groupKey}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-3.5">
                        {group.values.map((value) => {
                          const isSelected = selected === value.value;
                          const hasImage = Boolean(value.image);

                          return (
                            <button
                              key={value.value}
                              type="button"
                              onClick={() =>
                                setSelections((previous) => ({
                                  ...previous,
                                  [groupKey]: {
                                    optionName: selectedOption.name,
                                    groupLabel: group.label,
                                    value: value.value,
                                    valueLabel: value.label,
                                    priceAdjustment: value.priceAdjustment,
                                  },
                                }))
                              }
                              className={`flex min-h-[56px] min-w-[200px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
                              }`}
                            >
                              {hasImage && (
                                <span className="relative h-10 w-10 overflow-hidden rounded-full border border-black/10">
                                  <Image
                                    src={value.image!}
                                    alt={value.label}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </span>
                              )}
                              <span className="font-medium">{value.label}</span>
                              <span className="ml-auto font-semibold">
                                {value.priceAdjustment === 0
                                  ? formatRegionalPrice(0, region)
                                  : `+${formatRegionalPrice(value.priceAdjustment, region)}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                {(() => {
                  const groupKey = `${selectedOption.id}::value`;
                  const currentValue = selections[groupKey]?.value ?? "";

                  const updateValue = (nextValue: string) => {
                    setSelections((previous) => {
                      const trimmed = nextValue.trim();
                      if (!trimmed && !selectedOption.required) {
                        const clone = { ...previous };
                        delete clone[groupKey];
                        return clone;
                      }

                      return {
                        ...previous,
                        [groupKey]: {
                          optionName: selectedOption.name,
                          groupLabel: selectedOption.name,
                          value: nextValue,
                          valueLabel: nextValue,
                          priceAdjustment: 0,
                        },
                      };
                    });
                  };

                  if (selectedOption.fieldType === "textarea") {
                    return (
                      <textarea
                        value={currentValue}
                        onChange={(event) => updateValue(event.target.value)}
                        placeholder={
                          selectedOption.placeholder ||
                          `Enter ${selectedOption.name.toLowerCase()}`
                        }
                        className="min-h-[120px] w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                      />
                    );
                  }

                  if (selectedOption.fieldType === "number") {
                    return (
                      <input
                        type="number"
                        min={selectedOption.min}
                        max={selectedOption.max}
                        value={currentValue}
                        onChange={(event) => updateValue(event.target.value)}
                        placeholder={selectedOption.placeholder || "Enter number"}
                        className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                      />
                    );
                  }

                  return (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(event) => updateValue(event.target.value)}
                      placeholder={
                        selectedOption.placeholder ||
                        `Enter ${selectedOption.name.toLowerCase()}`
                      }
                      className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-base text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                    />
                  );
                })()}
              </div>
            )}
          </div>

          <SummaryCard
            missingRequiredCount={missingRequiredCount}
            optionsTotal={optionsTotal}
            region={region}
            submitting={submitting}
            onProceed={proceedToBilling}
          />
        </div>
      )}
    </section>
  );
}

function SummaryCard({
  missingRequiredCount,
  optionsTotal,
  region,
  submitting,
  onProceed,
}: {
  missingRequiredCount: number;
  optionsTotal: number;
  region: "PAK" | "US" | "UK";
  submitting: boolean;
  onProceed: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-600">Options Total</span>
        <span className="text-base font-semibold text-neutral-900">
          {formatRegionalPrice(optionsTotal, region)}
        </span>
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        {missingRequiredCount > 0
          ? `${missingRequiredCount} required selection${
              missingRequiredCount > 1 ? "s are" : " is"
            } missing.`
          : "All required options selected."}
      </p>

      <button
        type="button"
        onClick={onProceed}
        disabled={missingRequiredCount > 0 || submitting}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proceed to Billing"}
      </button>
    </div>
  );
}


