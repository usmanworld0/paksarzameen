"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, Upload, X } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import { Label } from "@/components/ui/label";
import {
  buildLayeredSelectionsFromState,
  parseCustomizationOptions,
  resolveLayeredRendererConfig,
  type LayeredSelection,
} from "@/lib/customizations";
import { formatRegionalPrice, type StoreRegion } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

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
  onLayeredPreviewChange?: (state: LayeredPreviewState) => void;
}

type SelectionMap = Record<
  string,
  {
    optionName: string;
    groupLabel: string;
    value: string;
    valueLabel: string;
    priceAdjustment: number;
    layer?: {
      part: string;
      src?: string;
      asset?: string;
      order?: number;
      view?: string;
    } | null;
  }
>;

type LayeredPreviewState = {
  layers: LayeredSelection[];
  highlightPart?: string;
  fallbackImage?: string;
  defaultView: string;
};

const optionPanelClassName = "rounded-[24px] border border-black/8 bg-white p-4 sm:p-5";
const uploadButtonClassName =
  "flex h-28 w-full items-center justify-center rounded-[20px] border border-dashed border-black/12 bg-white text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 transition-colors duration-300 hover:border-black/25 hover:text-neutral-950";

export function AddToCartButton({
  product,
  customizationOptions,
  onLayeredPreviewChange,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedByGroup, setSelectedByGroup] = useState<SelectionMap>({});
  const [added, setAdded] = useState(false);
  const [uploadingByGroup, setUploadingByGroup] = useState<Record<string, boolean>>({});
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [referenceImageName, setReferenceImageName] = useState("");
  const [referenceNotes, setReferenceNotes] = useState("");
  const [uploadingReferenceImage, setUploadingReferenceImage] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const referenceInputRef = useRef<HTMLInputElement | null>(null);

  const parsedOptions = useMemo(
    () => parseCustomizationOptions(customizationOptions),
    [customizationOptions]
  );
  const rendererConfig = useMemo(
    () => resolveLayeredRendererConfig(customizationOptions),
    [customizationOptions]
  );
  const [highlightPart, setHighlightPart] = useState<string>();

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

  function clearSelection(groupKey: string) {
    setSelectedByGroup((previous) => {
      const clone = { ...previous };
      delete clone[groupKey];
      return clone;
    });
  }

  function upsertSelection(
    groupKey: string,
    optionName: string,
    groupLabel: string,
    value: string,
    valueLabel = value,
    priceAdjustment = 0,
    layer?: SelectionMap[string]["layer"]
  ) {
    setSelectedByGroup((previous) => ({
      ...previous,
      [groupKey]: {
        optionName,
        groupLabel,
        value,
        valueLabel,
        priceAdjustment,
        layer,
      },
    }));
  }

  function updateFreeformValue(
    groupKey: string,
    optionName: string,
    groupLabel: string,
    nextValue: string,
    required: boolean
  ) {
    if (!nextValue.trim() && !required) {
      clearSelection(groupKey);
      return;
    }

    upsertSelection(groupKey, optionName, groupLabel, nextValue, nextValue, 0);
  }

  async function uploadGroupImage(
    groupKey: string,
    optionName: string,
    groupLabel: string,
    file: File
  ) {
    setUploadingByGroup((prev) => ({ ...prev, [groupKey]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => null);
      const url = typeof data?.url === "string" ? data.url : "";

      if (response.ok && url) {
        upsertSelection(groupKey, optionName, groupLabel, url, file.name || "Uploaded image", 0);
      }
    } finally {
      setUploadingByGroup((prev) => ({ ...prev, [groupKey]: false }));
    }
  }

  async function uploadReferenceImage(file: File) {
    setUploadingReferenceImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => null);
      const url = typeof data?.url === "string" ? data.url : "";

      if (response.ok && url) {
        setReferenceImageUrl(url);
        setReferenceImageName(file.name || "Reference image");
      }
    } finally {
      setUploadingReferenceImage(false);
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

    if (referenceImageUrl) {
      customizations.push({
        key: "__optional_reference_image",
        optionName: "Customization Notes",
        groupLabel: "Reference Image",
        value: referenceImageUrl,
        valueLabel: referenceImageName || "Reference image",
        priceAdjustment: 0,
      });
    }

    if (referenceNotes.trim()) {
      customizations.push({
        key: "__optional_notes",
        optionName: "Customization Notes",
        groupLabel: "Description / Notes",
        value: referenceNotes.trim(),
        valueLabel: referenceNotes.trim(),
        priceAdjustment: 0,
      });
    }

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

  useEffect(() => {
    if (!onLayeredPreviewChange) return;

    const layers = buildLayeredSelectionsFromState(
      parsedOptions,
      selectedByGroup,
      product.id,
      rendererConfig
    );

    onLayeredPreviewChange({
      layers,
      highlightPart,
      fallbackImage: rendererConfig.fallbackImage,
      defaultView: rendererConfig.defaultView,
    });
  }, [
    highlightPart,
    onLayeredPreviewChange,
    parsedOptions,
    product.id,
    rendererConfig,
    selectedByGroup,
  ]);

  return (
    <div className="space-y-5">
      {parsedOptions.map((option) => (
        <div key={option.id} className="space-y-3">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            {option.name}
            {option.required && <span className="ml-1 text-red-500">*</span>}
          </Label>

          {option.fieldType === "select" ? (
            <div className={optionPanelClassName}>
              <div className="space-y-5">
                {option.groups.map((group) => {
                  const groupKey = `${option.id}::${group.label}`;
                  const selectedValue = selectedByGroup[groupKey]?.value ?? "";
                  const isRequired = option.required || group.required;

                  return (
                    <div key={groupKey} className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        {group.label}
                        {isRequired && <span className="ml-1 text-red-500">*</span>}
                      </p>

                      {group.fieldType === "select" ? (
                        <div className="flex flex-wrap gap-2">
                          {group.values.map((value) => {
                            const isSelected = selectedValue === value.value;

                            return (
                              <button
                                key={value.value}
                                type="button"
                                onClick={() => {
                                  upsertSelection(
                                    groupKey,
                                    option.name,
                                    group.label,
                                    value.value,
                                    value.label,
                                    value.priceAdjustment,
                                    value.layer
                                  );
                                  setHighlightPart(value.layer?.part);
                                }}
                                className={cn(
                                  "store-choice",
                                  isSelected && "store-choice-active"
                                )}
                              >
                                <span className="whitespace-normal break-words">{value.label}</span>
                                <span className="ml-1.5">
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
                          value={selectedValue}
                          onChange={(event) =>
                            updateFreeformValue(
                              groupKey,
                              option.name,
                              group.label,
                              event.target.value,
                              isRequired
                            )
                          }
                          placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                          className="store-textarea min-h-[96px]"
                        />
                      ) : group.fieldType === "image" ? (
                        <div className="space-y-3">
                          {selectedValue ? (
                            <div className="relative h-40 w-full overflow-hidden rounded-[22px] border border-black/8 bg-white">
                              <Image
                                src={selectedValue}
                                alt={group.label}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => clearSelection(groupKey)}
                                className="absolute right-3 top-3 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-black"
                                aria-label="Remove uploaded image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[groupKey]?.click()}
                              className={uploadButtonClassName}
                            >
                              {uploadingByGroup[groupKey] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <span className="inline-flex items-center gap-2">
                                  <Upload className="h-3.5 w-3.5" />
                                  Upload image
                                </span>
                              )}
                            </button>
                          )}

                          <input
                            ref={(element) => {
                              fileInputRefs.current[groupKey] = element;
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
                          value={selectedValue}
                          onChange={(event) =>
                            updateFreeformValue(
                              groupKey,
                              option.name,
                              group.label,
                              event.target.value,
                              isRequired
                            )
                          }
                          placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                          className="store-control"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={optionPanelClassName}>
              {(() => {
                const groupKey = `${option.id}::value`;
                const currentValue = selectedByGroup[groupKey]?.value ?? "";

                if (option.fieldType === "textarea") {
                  return (
                    <textarea
                      value={currentValue}
                      onChange={(event) =>
                        updateFreeformValue(
                          groupKey,
                          option.name,
                          option.name,
                          event.target.value,
                          option.required
                        )
                      }
                      placeholder={option.placeholder || `Enter ${option.name.toLowerCase()}`}
                      className="store-textarea min-h-[96px]"
                    />
                  );
                }

                return (
                  <input
                    type={option.fieldType === "number" ? "number" : "text"}
                    min={option.fieldType === "number" ? option.min : undefined}
                    max={option.fieldType === "number" ? option.max : undefined}
                    value={currentValue}
                    onChange={(event) =>
                      updateFreeformValue(
                        groupKey,
                        option.name,
                        option.name,
                        event.target.value,
                        option.required
                      )
                    }
                    placeholder={
                      option.placeholder ||
                      (option.fieldType === "number"
                        ? "Enter number"
                        : `Enter ${option.name.toLowerCase()}`)
                    }
                    className="store-control"
                  />
                );
              })()}
            </div>
          )}
        </div>
      ))}

      {requiredGroupKeys.length > 0 && (
        <p className="text-sm text-neutral-500">
          {missingRequiredCount > 0
            ? `${missingRequiredCount} required selection${
                missingRequiredCount > 1 ? "s are" : " is"
              } still missing.`
            : "All required customization selections are complete."}
        </p>
      )}

      <div className="rounded-[24px] border border-black/8 bg-white p-5 text-sm">
        <div className="flex items-center justify-between text-neutral-600">
          <span>Base Price</span>
          <span>{formatRegionalPrice(product.discountedPrice ?? product.price, product.region)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-neutral-600">
          <span>Customization Total</span>
          <span>
            {customizationTotal === 0
              ? formatRegionalPrice(0, product.region)
              : `+${formatRegionalPrice(customizationTotal, product.region)}`}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-4 font-semibold text-neutral-950">
          <span>Unit Total</span>
          <span>{formatRegionalPrice(unitPrice, product.region)}</span>
        </div>
      </div>

      <div className="space-y-3 rounded-[24px] border border-black/8 bg-white p-5">
        <Label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
          Optional Reference
        </Label>

        {referenceImageUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-[22px] border border-black/8 bg-white">
            <Image src={referenceImageUrl} alt="Reference image" fill className="object-cover" />
            <button
              type="button"
              onClick={() => {
                setReferenceImageUrl("");
                setReferenceImageName("");
              }}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-black"
              aria-label="Remove reference image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => referenceInputRef.current?.click()}
            className={uploadButtonClassName}
          >
            {uploadingReferenceImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-2">
                <Upload className="h-3.5 w-3.5" />
                Upload reference image
              </span>
            )}
          </button>
        )}

        <input
          ref={referenceInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              uploadReferenceImage(file);
            }
            event.target.value = "";
          }}
        />

        <textarea
          value={referenceNotes}
          onChange={(event) => setReferenceNotes(event.target.value)}
          placeholder="Notes for your customization request"
          className="store-textarea min-h-[110px]"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex h-14 items-center rounded-xl border border-black/10 bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-14 w-12 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[3rem] px-3 text-center text-sm font-medium text-neutral-950">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-14 w-12 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.available || missingRequiredCount > 0}
            className="store-button-primary h-14 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? "Added to Cart" : product.available ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        <p className="text-sm leading-7 text-neutral-500">
          Card details are entered later at checkout. You can still review your
          selections in the cart before paying.
        </p>
      </div>
    </div>
  );
}
