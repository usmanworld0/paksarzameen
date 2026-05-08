"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown, Loader2, Upload, X } from "lucide-react";
import type { CustomizationOption } from "@prisma/client";
import { formatRegionalPrice } from "@/lib/pricing";
import { parseCustomizationOptions } from "@/lib/customizations";
import { useStoreRegion } from "@/hooks/useStoreRegion";
import { useCartStore } from "@/store/cart";

interface CategoryCustomizationPanelProps {
  categoryName: string;
  categorySlug: string;
  options: CustomizationOption[];
  embedded?: boolean;
  baseImageFallback?: string;
  onBaseImageChange?: (src: string) => void;
  onLayerImagesChange?: (layers: Array<{ id: string; src: string; alt: string; order: number }>) => void;
  showBillingSummary?: boolean;
  proceedLabel?: string;
}

export function CategoryCustomizationPanel({
  categoryName,
  categorySlug,
  options,
  embedded = false,
  baseImageFallback = "/images/commonwealth_header.jpeg",
  onBaseImageChange,
  onLayerImagesChange,
  showBillingSummary = true,
  proceedLabel = "Proceed to Billing",
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
  const [uploadingByGroup, setUploadingByGroup] = useState<Record<string, boolean>>({});
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [referenceImageName, setReferenceImageName] = useState("");
  const [referenceNotes, setReferenceNotes] = useState("");
  const [uploadingReferenceImage, setUploadingReferenceImage] = useState(false);
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const referenceInputRef = useRef<HTMLInputElement | null>(null);

  const parsedOptions = useMemo(() => parseCustomizationOptions(options), [options]);

  const selectedOptionId = searchParams.get("option");
  const selectedOption = useMemo(
    () => parsedOptions.find((option) => option.id === selectedOptionId) ?? null,
    [parsedOptions, selectedOptionId]
  );
  const selectedOptionBaseImage = selectedOption?.baseImage ?? "";

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

  useEffect(() => {
    if (!selectedOption || selectedOption.fieldType !== "select") {
      setExpandedGroupKey(null);
      return;
    }

    const firstGroup = selectedOption.groups[0];
    setExpandedGroupKey(
      firstGroup ? `${selectedOption.id}::${firstGroup.label}` : null
    );
  }, [selectedOption]);

  useEffect(() => {
    if (!onBaseImageChange) return;

    const imageByGroupKey = new Map<string, string>();

    for (const option of parsedOptions) {
      for (const group of option.groups) {
        if (group.fieldType !== "select") continue;

        for (const value of group.values) {
          if (value.image) {
            imageByGroupKey.set(`${option.id}::${group.label}::${value.value}`, value.image);
          }
        }
      }
    }

    let nextBaseImage = selectedOptionBaseImage || baseImageFallback;

    for (const [groupKey, selection] of Object.entries(selections)) {
      const directValue = selection.value;

      if (directValue && /^(https?:\/\/|\/)/i.test(directValue)) {
        nextBaseImage = directValue;
        break;
      }

      const mappedImage = imageByGroupKey.get(`${groupKey}::${selection.value}`);
      if (mappedImage) {
        nextBaseImage = mappedImage;
        break;
      }
    }

    onBaseImageChange(nextBaseImage);
  }, [baseImageFallback, onBaseImageChange, parsedOptions, selectedOptionBaseImage, selections]);

  useEffect(() => {
    if (!onLayerImagesChange) return;

    const layers: Array<{ id: string; src: string; alt: string; order: number }> = [];

    for (const option of parsedOptions) {
      for (const group of option.groups) {
        const groupKey = `${option.id}::${group.label}`;
        const selectedValue = (selections[groupKey]?.value ?? "").trim();
        if (!selectedValue) continue;

        const parsedValue = group.values.find((value) => value.value === selectedValue);
        const layer = parsedValue?.layer;
        if (!layer?.src) continue;

        layers.push({
          id: `${groupKey}::${selectedValue}`,
          src: layer.src,
          alt: `${group.label} layer`,
          order: Number.isFinite(layer.order) ? Number(layer.order) : 100,
        });
      }
    }

    layers.sort((a, b) => a.order - b.order);
    onLayerImagesChange(layers);
  }, [onLayerImagesChange, parsedOptions, selections]);

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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      const url = typeof data?.url === "string" ? data.url : "";

      if (res.ok && url) {
        setSelections((previous) => ({
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

  async function uploadReferenceImage(file: File) {
    setUploadingReferenceImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);
      const url = typeof data?.url === "string" ? data.url : "";

      if (res.ok && url) {
        setReferenceImageUrl(url);
        setReferenceImageName(file.name || "Reference image");
      }
    } finally {
      setUploadingReferenceImage(false);
    }
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
    <section className={embedded ? "space-y-5 sm:space-y-6" : "mb-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:mb-12 sm:p-7 lg:p-10"}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Customization
          </p>
          <h2 className={embedded ? "mt-2 text-xl font-normal text-neutral-900 sm:text-2xl" : "mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl"}>
            Customize Your {categoryName}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Step 1: choose an option. Step 2: select values for that option.
          </p>
        </div>
      </div>

      {!selectedOption ? (
        <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
          <div className={embedded ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 gap-5 md:grid-cols-2"}>
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
                  className="rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[1.05rem] font-semibold text-neutral-900 sm:text-xl">{option.name}</p>
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

        </div>
      ) : (
        <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
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

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                  {selectedOption.required ? "Required" : "Optional"}
                </p>
                <h3 className="mt-2 text-[1.35rem] font-normal tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]">
                  {selectedOption.name}
                </h3>
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                {selectedOption.fieldType}
              </p>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
              {selectedOption.fieldType}
            </p>

            {selectedOption.fieldType === "select" ? (
              <div className="mt-6 space-y-6">
                {selectedOption.groups.map((group) => {
                  const groupKey = `${selectedOption.id}::${group.label}`;
                  const selected = selections[groupKey]?.value;
                  const isExpanded = expandedGroupKey === groupKey;

                  return (
                    <section key={groupKey} className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedGroupKey((previous) =>
                            previous === groupKey ? null : groupKey
                          )
                        }
                        className="flex w-full items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4 text-left"
                        aria-expanded={isExpanded}
                        aria-controls={`${groupKey}-panel`}
                      >
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                            {group.label}
                          </p>
                          <p className="mt-1 text-sm text-neutral-500">
                            {(group.required || selectedOption.required) ? "Required" : "Optional"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && group.fieldType === "select" ? (
                        <div className="space-y-3 p-4 sm:p-5">
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
                                className={`flex w-full flex-col items-stretch overflow-hidden rounded-[18px] border text-left transition-all duration-300 sm:flex-row ${
                                  isSelected
                                    ? "border-neutral-900 bg-white"
                                    : "border-neutral-200 bg-white hover:border-neutral-900"
                                }`}
                              >
                                <div className="relative h-40 w-full shrink-0 bg-neutral-100 sm:h-[96px] sm:w-[116px] lg:w-[124px]">
                                  {hasImage ? (
                                    <Image
                                      src={value.image!}
                                      alt={value.label}
                                      fill
                                      sizes="(max-width: 640px) 100vw, 132px"
                                      className="object-cover"
                                    />
                                  ) : null}
                                </div>

                                <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
                                  <div className="min-w-0 pr-1">
                                    <p className="text-[0.95rem] font-normal leading-tight tracking-[-0.02em] text-neutral-900 whitespace-normal break-words sm:truncate sm:text-[1rem]">
                                      {value.label}
                                    </p>
                                  </div>

                                  <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                                    <span className="whitespace-nowrap text-[0.74rem] uppercase tracking-[0.16em] text-neutral-500 sm:text-[0.78rem]">
                                      {value.priceAdjustment === 0
                                        ? formatRegionalPrice(0, region)
                                        : `+${formatRegionalPrice(value.priceAdjustment, region)}`}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : isExpanded && group.fieldType === "textarea" ? (
                        <textarea
                          value={selected ?? ""}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setSelections((previous) => {
                              if (
                                !nextValue.trim() &&
                                !(selectedOption.required || group.required)
                              ) {
                                const clone = { ...previous };
                                delete clone[groupKey];
                                return clone;
                              }

                              return {
                                ...previous,
                                [groupKey]: {
                                  optionName: selectedOption.name,
                                  groupLabel: group.label,
                                  value: nextValue,
                                  valueLabel: nextValue,
                                  priceAdjustment: 0,
                                },
                              };
                            });
                          }}
                          placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                          className="min-h-[120px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:px-4 sm:text-base"
                        />
                      ) : isExpanded && group.fieldType === "image" ? (
                        <div className="space-y-2">
                          {selected ? (
                            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                              <Image src={selected} alt={group.label} fill className="object-cover" />
                              <button
                                type="button"
                                onClick={() =>
                                  setSelections((previous) => {
                                    const clone = { ...previous };
                                    delete clone[groupKey];
                                    return clone;
                                  })
                                }
                                className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white hover:bg-black"
                                aria-label="Remove uploaded image"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[groupKey]?.click()}
                              className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                            >
                              {uploadingByGroup[groupKey] ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <span className="inline-flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
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
                                uploadGroupImage(
                                  groupKey,
                                  selectedOption.name,
                                  group.label,
                                  file
                                );
                              }
                              event.target.value = "";
                            }}
                          />
                        </div>
                      ) : isExpanded ? (
                        <input
                          type={group.fieldType === "number" ? "number" : "text"}
                          min={group.fieldType === "number" ? group.min : undefined}
                          max={group.fieldType === "number" ? group.max : undefined}
                          value={selected ?? ""}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setSelections((previous) => {
                              if (
                                !nextValue.trim() &&
                                !(selectedOption.required || group.required)
                              ) {
                                const clone = { ...previous };
                                delete clone[groupKey];
                                return clone;
                              }

                              return {
                                ...previous,
                                [groupKey]: {
                                  optionName: selectedOption.name,
                                  groupLabel: group.label,
                                  value: nextValue,
                                  valueLabel: nextValue,
                                  priceAdjustment: 0,
                                },
                              };
                            });
                          }}
                          placeholder={group.placeholder || `Enter ${group.label.toLowerCase()}`}
                          className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:h-12 sm:px-4 sm:text-base"
                        />
                      ) : null}
                    </section>
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
                        className="min-h-[120px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:px-4 sm:text-base"
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
                        className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:h-12 sm:px-4 sm:text-base"
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
                      className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[15px] text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:h-12 sm:px-4 sm:text-base"
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
            showBillingSummary={showBillingSummary}
            proceedLabel={proceedLabel}
          />

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Optional Reference
            </p>

            <div className="mt-3 space-y-3">
              {referenceImageUrl ? (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  <Image src={referenceImageUrl} alt="Reference image" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceImageUrl("");
                      setReferenceImageName("");
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white hover:bg-black"
                    aria-label="Remove reference image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => referenceInputRef.current?.click()}
                  className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                >
                  {uploadingReferenceImage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload reference image (optional)
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
                placeholder="Optional description/notes for this custom order"
                className="min-h-[120px] w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 outline-none transition-colors focus:border-neutral-900"
              />
            </div>
          </div>
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
  showBillingSummary,
  proceedLabel,
}: {
  missingRequiredCount: number;
  optionsTotal: number;
  region: "PAK" | "US" | "UK";
  submitting: boolean;
  onProceed: () => void;
  showBillingSummary: boolean;
  proceedLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      {showBillingSummary ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Options Total</span>
          <span className="text-base font-semibold text-neutral-900">
            {formatRegionalPrice(optionsTotal, region)}
          </span>
        </div>
      ) : null}
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
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : proceedLabel}
      </button>
    </div>
  );
}


