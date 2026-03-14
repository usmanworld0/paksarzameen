"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

  const requiredGroupKeys = useMemo(
    () =>
      parsedOptions.flatMap((option) =>
        option.groups.map((group) => `${option.id}::${group.label}`)
      ),
    [parsedOptions]
  );

  const missingRequiredCount = requiredGroupKeys.filter(
    (groupKey) => !selections[groupKey]
  ).length;

  const optionsTotal = useMemo(
    () =>
      Object.values(selections).reduce(
        (sum, selection) => sum + selection.priceAdjustment,
        0
      ),
    [selections]
  );

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
    <section className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Customization
          </p>
          <h2 className="mt-2 text-xl font-semibold text-neutral-900">
            Customize Your {categoryName}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Select options and proceed directly to billing.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {parsedOptions.map((option) => (
          <div key={option.id}>
            <div className="mb-4 flex items-center gap-2">
              <p className="text-sm font-semibold text-neutral-800">
                {option.name}
                <span className="ml-1 text-red-400">*</span>
              </p>
            </div>

            <div className="space-y-5">
              {option.groups.map((group) => {
                const groupKey = `${option.id}::${group.label}`;
                const selected = selections[groupKey]?.value;

                return (
                  <div key={groupKey}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {group.values.map((value) => {
                        const isSelected = selected === value.value;

                        return (
                          <button
                            key={value.value}
                            type="button"
                            onClick={() =>
                              setSelections((previous) => ({
                                ...previous,
                                [groupKey]: {
                                  optionName: option.name,
                                  groupLabel: group.label,
                                  value: value.value,
                                  valueLabel: value.label,
                                  priceAdjustment: value.priceAdjustment,
                                },
                              }))
                            }
                            className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
                            }`}
                          >
                            <span>{value.label}</span>
                            <span className="ml-1.5 font-semibold">
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
          </div>
        ))}

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Options Total</span>
            <span className="font-semibold text-neutral-900">
              {formatRegionalPrice(optionsTotal, region)}
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {missingRequiredCount > 0
              ? `${missingRequiredCount} required selection${missingRequiredCount > 1 ? "s are" : " is"} missing.`
              : "All required options selected."}
          </p>

          <button
            type="button"
            onClick={proceedToBilling}
            disabled={missingRequiredCount > 0 || submitting}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proceed to Billing"}
          </button>
        </div>
      </div>
    </section>
  );
}


