"use client";

import { useMemo, useRef, useState } from "react";
import { useCartStore } from "@/store/cart";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, Minus, Plus, Upload, X } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import { formatRegionalPrice, type StoreRegion } from "@/lib/pricing";
import { parseCustomizationOptions } from "@/lib/customizations";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    image: string;
    available: boolean;
    region: StoreRegion;
  };
  customizationOptions: CustomizationOption[];
}

export function AddToCartButton({
  product,
  customizationOptions,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedByGroup, setSelectedByGroup] = useState<
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
  const [added, setAdded] = useState(false);
  const [uploadingByGroup, setUploadingByGroup] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const parsedOptions = useMemo(
    () => parseCustomizationOptions(customizationOptions),
    [customizationOptions]
  );

  const requiredGroupKeys = useMemo(
    () =>
      parsedOptions.flatMap((option) => {
        const requiredGroups = option.groups.filter(
          (group) => option.required || group.required
        );
        if (requiredGroups.length === 0) return [];
        if (option.fieldType === "select") {
          return requiredGroups.map((group) => `${option.id}::${group.label}`);
        }
        return [`${option.id}::value`];
      }),
    [parsedOptions]
  );

  const missingRequiredCount = requiredGroupKeys.filter(
    (groupKey) => !(selectedByGroup[groupKey]?.value ?? "").trim()
  ).length;

  const customizationTotal = useMemo(
    () =>
      Object.values(selectedByGroup).reduce(
        (sum, selection) => sum + selection.priceAdjustment,
        0
      ),
    [selectedByGroup]
  );

  const unitPrice = (product.discountedPrice ?? product.price) + customizationTotal;

  async function uploadGroupImage(groupKey: string, optionName: string, groupLabel: string, file: File) {
    setUploadingByGroup((prev) => ({ ...prev, [groupKey]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      const url = typeof data?.url === "string" ? data.url : "";

      if (res.ok && url) {
        setSelectedByGroup((previous) => ({
          ...previous,
          [groupKey]: {
            optionName,
            groupLabel,
            value: url,
            valueLabel: file.name || "Uploaded image",
            priceAdjustment: 0,
          },
        }));
      }
    } finally {
      setUploadingByGroup((prev) => ({ ...prev, [groupKey]: false }));
    }
  }

  function handleAdd() {
    const customizations = Object.entries(selectedByGroup)
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
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.image,
      quantity,
      region: product.region,
      customizations: customizations.length > 0 ? customizations : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Customization fields */}
      {parsedOptions.map((option) => (
        <div key={option.id} className="space-y-4">
          <Label>
            {option.name}
            {option.required && <span className="ml-0.5 text-red-500">*</span>}
          </Label>

          {option.fieldType === "select" ? (
            <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              {option.groups.map((group) => {
                const groupKey = `${option.id}::${group.label}`;
                const selectedValue = selectedByGroup[groupKey]?.value;

                return (
                  <div key={groupKey} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                      {group.label}
                      {(group.required || option.required) && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </p>

                    {group.fieldType === "select" ? (
                      <div className="flex flex-wrap gap-2">
                        {group.values.map((value) => {
                          const isSelected = selectedValue === value.value;

                          return (
                            <button
                              key={value.value}
                              type="button"
                              onClick={() =>
                                setSelectedByGroup((previous) => ({
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
                                  ? formatRegionalPrice(0, product.region)
                                  : `+${formatRegionalPrice(value.priceAdjustment, product.region)}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : group.fieldType === "textarea" ? (
                      <textarea
                        value={selectedValue ?? ""}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setSelectedByGroup((previous) => {
                            if (
                              !nextValue.trim() &&
                              !(option.required || group.required)
                            ) {
                              const clone = { ...previous };
                              delete clone[groupKey];
                              return clone;
                            }

                            return {
                              ...previous,
                              [groupKey]: {
                                optionName: option.name,
                                groupLabel: group.label,
                                value: nextValue,
                                valueLabel: nextValue,
                                priceAdjustment: 0,
                              },
                            };
                          });
                        }}
                        placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                        className="min-h-[88px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                      />
                    ) : group.fieldType === "image" ? (
                      <div className="space-y-2">
                        {selectedValue ? (
                          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                            <Image src={selectedValue} alt={group.label} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedByGroup((previous) => {
                                  const clone = { ...previous };
                                  delete clone[groupKey];
                                  return clone;
                                })
                              }
                              className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white hover:bg-black"
                              aria-label="Remove uploaded image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[groupKey]?.click()}
                            className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white text-xs text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                          >
                            {uploadingByGroup[groupKey] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <span className="inline-flex items-center gap-1.5">
                                <Upload className="h-3.5 w-3.5" />
                                Upload image
                              </span>
                            )}
                          </button>
                        )}
                        <input
                          ref={(el) => {
                            fileInputRefs.current[groupKey] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              uploadGroupImage(groupKey, option.name, group.label, file);
                            }
                            event.target.value = "";
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        type={group.fieldType === "number" ? "number" : "text"}
                        min={group.fieldType === "number" ? group.min : undefined}
                        max={group.fieldType === "number" ? group.max : undefined}
                        value={selectedValue ?? ""}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setSelectedByGroup((previous) => {
                            if (
                              !nextValue.trim() &&
                              !(option.required || group.required)
                            ) {
                              const clone = { ...previous };
                              delete clone[groupKey];
                              return clone;
                            }

                            return {
                              ...previous,
                              [groupKey]: {
                                optionName: option.name,
                                groupLabel: group.label,
                                value: nextValue,
                                valueLabel: nextValue,
                                priceAdjustment: 0,
                              },
                            };
                          });
                        }}
                        placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              {(() => {
                const groupKey = `${option.id}::value`;
                const currentValue = selectedByGroup[groupKey]?.value ?? "";

                const updateValue = (nextValue: string) => {
                  setSelectedByGroup((previous) => {
                    const trimmed = nextValue.trim();
                    if (!trimmed && !option.required) {
                      const clone = { ...previous };
                      delete clone[groupKey];
                      return clone;
                    }

                    return {
                      ...previous,
                      [groupKey]: {
                        optionName: option.name,
                        groupLabel: option.name,
                        value: nextValue,
                        valueLabel: nextValue,
                        priceAdjustment: 0,
                      },
                    };
                  });
                };

                if (option.fieldType === "textarea") {
                  return (
                    <textarea
                      value={currentValue}
                      onChange={(event) => updateValue(event.target.value)}
                      placeholder={option.placeholder || `Enter ${option.name.toLowerCase()}`}
                      className="min-h-[88px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                    />
                  );
                }

                if (option.fieldType === "number") {
                  return (
                    <input
                      type="number"
                      min={option.min}
                      max={option.max}
                      value={currentValue}
                      onChange={(event) => updateValue(event.target.value)}
                      placeholder={option.placeholder || "Enter number"}
                      className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                    />
                  );
                }

                return (
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(event) => updateValue(event.target.value)}
                    placeholder={option.placeholder || `Enter ${option.name.toLowerCase()}`}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900"
                  />
                );
              })()}
            </div>
          )}
        </div>
      ))}

      {requiredGroupKeys.length > 0 && (
        <p className="text-xs text-neutral-500">
          {missingRequiredCount > 0
            ? `${missingRequiredCount} required selection${
                missingRequiredCount > 1 ? "s are" : " is"
              } still missing.`
            : "All required customization selections completed."}
        </p>
      )}

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
        <div className="flex items-center justify-between text-neutral-600">
          <span>Base Price</span>
          <span>{formatRegionalPrice(product.discountedPrice ?? product.price, product.region)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-neutral-600">
          <span>Options Total</span>
          <span>
            {customizationTotal === 0
              ? formatRegionalPrice(0, product.region)
              : `+${formatRegionalPrice(customizationTotal, product.region)}`}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 font-semibold text-neutral-900">
          <span>Unit Total</span>
          <span>{formatRegionalPrice(unitPrice, product.region)}</span>
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="space-y-3 pt-2">
        {/* Quantity selector — rounded pill style */}
        <div className="inline-flex items-center rounded-full border border-neutral-200">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
            type="button"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-4 text-sm min-w-[2.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(quantity + 1)
            }
            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Full-width CTA */}
        <button
          onClick={handleAdd}
          disabled={!product.available || missingRequiredCount > 0}
          className="w-full bg-neutral-900 text-white text-sm font-medium tracking-wider uppercase py-4 hover:bg-neutral-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          type="button"
        >
          {added ? "Added to Cart" : product.available ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
