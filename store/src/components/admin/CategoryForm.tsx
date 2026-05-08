"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import type { Category, CustomizationOption } from "@prisma/client";
import { categorySchema, type CategoryFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { Loader2, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";

interface CategoryFormProps {
  category?: Category & { customizationOptions?: CustomizationOption[] };
}

type CustomFieldType = "select" | "text" | "number" | "textarea" | "image";

type ValueOptionDraft = {
  id: string;
  value: string;
  label: string;
  image: string | null;
  layerImage: string | null;
  priceAdjustment: number;
  uploading?: boolean;
};

type SubOptionDraft = {
  id: string;
  label: string;
  required: boolean;
  fieldType: CustomFieldType;
  placeholder: string;
  min: string;
  max: string;
  valueOptions: ValueOptionDraft[];
};

type OptionDraft = {
  id: string;
  name: string;
  required: boolean;
  placeholder: string;
  min: string;
  max: string;
  subOptions: SubOptionDraft[];
  coverImage?: string | null;
  baseImage?: string | null;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function parseSubOptions(raw: unknown): SubOptionDraft[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const obj = item as Record<string, unknown>;
      const values = Array.isArray(obj.values) ? obj.values : [];
      return {
        id: uid(),
        label: typeof obj.label === "string" ? obj.label : "",
        required: Boolean(obj.required),
        fieldType: asFieldType(obj.fieldType),
        placeholder: typeof obj.placeholder === "string" ? obj.placeholder : "",
        min: obj.min !== undefined && obj.min !== null ? String(obj.min) : "",
        max: obj.max !== undefined && obj.max !== null ? String(obj.max) : "",
        valueOptions: values.map((v) => {
          const vo = v as Record<string, unknown>;
          const layerRecord =
            vo.layer && typeof vo.layer === "object" && !Array.isArray(vo.layer)
              ? (vo.layer as Record<string, unknown>)
              : null;

          return {
            id: uid(),
            value: String(vo.value ?? ""),
            label: String(vo.label ?? vo.value ?? ""),
            image: typeof vo.image === "string" ? vo.image : null,
            layerImage:
              typeof layerRecord?.src === "string"
                ? layerRecord.src
                : typeof vo.layerSrc === "string"
                ? vo.layerSrc
                : null,
            priceAdjustment:
              typeof vo.priceAdjustment === "number" && Number.isFinite(vo.priceAdjustment)
                ? vo.priceAdjustment
                : 0,
          };
        }),
      };
    });
}

function getRendererFallbackImage(options: CustomizationOption[] | undefined) {
  if (!options) return "";

  for (const option of options) {
    const config = option.options;
    if (!config || typeof config !== "object" || Array.isArray(config)) continue;

    const renderer = (config as Record<string, unknown>).renderer;
    if (!renderer || typeof renderer !== "object" || Array.isArray(renderer)) continue;

    const fallback = (renderer as Record<string, unknown>).fallbackImage;
    if (typeof fallback === "string" && fallback.trim()) {
      return fallback.trim();
    }
  }

  return "";
}

function asFieldType(value: unknown): CustomFieldType {
  if (value === "text" || value === "number" || value === "textarea" || value === "image") {
    return value;
  }
  return "select";
}

function toOptionDraft(option: CustomizationOption): OptionDraft {
  let placeholder = "";
  let min = "";
  let max = "";
  let subOptions: SubOptionDraft[] = [];
  let coverImage: string | null | undefined = undefined;
  let baseImage: string | null | undefined = undefined;

  if (Array.isArray(option.options)) {
    subOptions = parseSubOptions(option.options);
  } else if (
    option.options &&
    typeof option.options === "object" &&
    !Array.isArray(option.options)
  ) {
    const config = option.options as Record<string, unknown>;
    coverImage = typeof config.coverImage === "string" ? config.coverImage : undefined;
    baseImage = typeof config.baseImage === "string" ? config.baseImage : undefined;
    placeholder = typeof config.placeholder === "string" ? config.placeholder : "";
    min = config.min !== undefined && config.min !== null ? String(config.min) : "";
    max = config.max !== undefined && config.max !== null ? String(config.max) : "";

    const rawGroups = Array.isArray(config.groups)
      ? config.groups
      : Array.isArray(config.options)
      ? config.options
      : [];
    subOptions = parseSubOptions(rawGroups);
  }

  return {
    id: option.id,
    name: option.name,
    required: option.required,
    placeholder,
    min,
    max,
    subOptions,
    coverImage: coverImage ?? null,
    baseImage: baseImage ?? null,
  };
}

function newValueOption(): ValueOptionDraft {
  return {
    id: `val-${uid()}`,
    value: "",
    label: "",
    image: null,
    layerImage: null,
    priceAdjustment: 0,
  };
}

function newSubOption(): SubOptionDraft {
  return {
    id: `sub-${uid()}`,
    label: "",
    required: false,
    fieldType: "select",
    placeholder: "",
    min: "",
    max: "",
    valueOptions: [newValueOption()],
  };
}

function newOption(): OptionDraft {
  return {
    id: `new-${uid()}`,
    name: "",
    required: false,
    placeholder: "",
    min: "",
    max: "",
    subOptions: [newSubOption()],
    coverImage: null,
    baseImage: null,
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(category?.image ? [category.image] : []);
  // Per-option fallback images will be derived from option value thumbnails
  const [options, setOptions] = useState<OptionDraft[]>(
    category?.customizationOptions?.map(toOptionDraft) || []
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      image: category?.image || "",
      customizable: category?.customizable || false,
    },
  });

  // ── Option helpers ───────────────────────────────────────────────
  function updateOption(id: string, patch: Partial<OptionDraft>) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  function addSubOption(optId: string) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId ? { ...o, subOptions: [...o.subOptions, newSubOption()] } : o
      )
    );
  }

  function updateSubOption(optId: string, subId: string, patch: Partial<SubOptionDraft>) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? { ...o, subOptions: o.subOptions.map((s) => (s.id === subId ? { ...s, ...patch } : s)) }
          : o
      )
    );
  }

  function removeSubOption(optId: string, subId: string) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId ? { ...o, subOptions: o.subOptions.filter((s) => s.id !== subId) } : o
      )
    );
  }

  function addValueOption(optId: string, subId: string) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? {
              ...o,
              subOptions: o.subOptions.map((s) =>
                s.id === subId
                  ? { ...s, valueOptions: [...s.valueOptions, newValueOption()] }
                  : s
              ),
            }
          : o
      )
    );
  }

  function updateValueOption(
    optId: string,
    subId: string,
    valId: string,
    patch: Partial<ValueOptionDraft>
  ) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? {
              ...o,
              subOptions: o.subOptions.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      valueOptions: s.valueOptions.map((v) =>
                        v.id === valId ? { ...v, ...patch } : v
                      ),
                    }
                  : s
              ),
            }
          : o
      )
    );
  }

  function removeValueOption(optId: string, subId: string, valId: string) {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? {
              ...o,
              subOptions: o.subOptions.map((s) =>
                s.id === subId
                  ? { ...s, valueOptions: s.valueOptions.filter((v) => v.id !== valId) }
                  : s
              ),
            }
          : o
      )
    );
  }

  async function uploadValueOptionImage(
    optId: string,
    subId: string,
    valId: string,
    file: File
  ) {
    updateValueOption(optId, subId, valId, { uploading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        updateValueOption(optId, subId, valId, { image: data.url, uploading: false });
      } else {
        updateValueOption(optId, subId, valId, { uploading: false });
      }
    } catch {
      updateValueOption(optId, subId, valId, { uploading: false });
    }
  }

  async function uploadValueOptionLayerImage(
    optId: string,
    subId: string,
    valId: string,
    file: File
  ) {
    updateValueOption(optId, subId, valId, { uploading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        updateValueOption(optId, subId, valId, { layerImage: data.url, uploading: false });
      } else {
        updateValueOption(optId, subId, valId, { uploading: false });
      }
    } catch {
      updateValueOption(optId, subId, valId, { uploading: false });
    }
  }

  async function uploadOptionCoverImage(optId: string, file: File) {
    updateOption(optId, { coverImage: undefined });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        updateOption(optId, { coverImage: data.url });
      }
    } catch {
      // ignore
    }
  }

  async function uploadOptionBaseImage(optId: string, file: File) {
    updateOption(optId, { baseImage: undefined });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        updateOption(optId, { baseImage: data.url });
      }
    } catch {
      // ignore
    }
  }

  // ── Submit ───────────────────────────────────────────────────────
  async function onSubmit(data: CategoryFormData) {
    setLoading(true);
    setSubmitError(null);
    try {
      const cleanedOptions = options
        .filter((o) => o.name.trim())
        .map((o, index) => ({
          name: o.name.trim(),
          required: o.required,
          position: index,
          options: {
            fieldType: "select",
                // Persist a per-option renderer configuration. The `fallbackImage`
                // is taken from the first value option thumbnail (if present).
                renderer: {
                  enabled: true,
                  defaultView: "front",
                  fallbackImage:
                    (o.subOptions || [])
                      .flatMap((s) => s.valueOptions || [])
                      .find((v) => v.image && v.image.trim())?.image || undefined,
                },
            coverImage: o.coverImage || undefined,
            baseImage: o.baseImage || undefined,
            groups: o.subOptions
              .filter((s) => s.label.trim())
              .map((s, subIdx) => ({
                label: s.label.trim(),
                required: s.required,
                fieldType: s.fieldType,
                placeholder: s.placeholder.trim() || undefined,
                min: s.fieldType === "number" && s.min.trim() ? Number(s.min) : undefined,
                max: s.fieldType === "number" && s.max.trim() ? Number(s.max) : undefined,
                values:
                  s.fieldType === "select"
                    ? s.valueOptions
                        .filter((v) => v.label.trim())
                        .map((v) => ({
                          value: slugify(v.label.trim()),
                          label: v.label.trim(),
                          image: v.image || null,
                          layer: v.layerImage
                            ? {
                                part: s.label.trim() || "overlay",
                                src: v.layerImage,
                                order: 100 + subIdx,
                                view: "front",
                              }
                            : null,
                          priceAdjustment: Number(v.priceAdjustment) || 0,
                        }))
                    : [],
              })),
          },
        }));

      const url = category ? `/api/categories/${category.id}` : "/api/categories";
      const method = category ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          customizable: cleanedOptions.length > 0,
          image: images[0] ?? undefined,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setSubmitError(payload?.error || payload?.message || "Unable to save category.");
        return;
      }

      const savedCategory = (await res.json()) as { id: string };
      const customizationRes = await fetch(
        `/api/categories/${savedCategory.id}/customizations`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ options: cleanedOptions }),
        }
      );

      if (!customizationRes.ok) {
        const payload = await customizationRes.json().catch(() => null);
        setSubmitError(payload?.error || payload?.message || "Category saved but customization options failed to save.");
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── Details ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register("name", {
                onChange: (e) => { if (!category) setValue("slug", slugify(e.target.value)); },
              })}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {/* ── Media ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Media</h3>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Category Image
          </p>
          <p className="mb-3 text-xs text-neutral-500">
            Used for category cards and default fallback visuals.
          </p>
          <ImageUploader images={images} onChange={setImages} maxImages={1} />
        </div>

        {/* Per-option base images are managed on each option via their value thumbnails. */}
      </section>

      <div className="h-px bg-neutral-100" />

      {/* ── Customization ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Customization Options</h3>

        <p className="text-sm text-neutral-500">
          Add options and define their sub-options. Mark each option as required or optional. The category becomes customizable automatically once at least one option is saved.
        </p>

        <div className="space-y-4">
          {options.length === 0 && (
            <p className="text-sm text-neutral-400">No options yet. Add one below.</p>
          )}

          {options.map((opt, optIdx) => (
            <div key={opt.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-4">
                {/* Option header */}
                <div className="flex items-start gap-3">
                  <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-600">
                    {optIdx + 1}
                  </span>

                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Product Name</Label>
                    <Input
                      value={opt.name}
                      onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                      placeholder="e.g. Shirt, Cushion, Necklace"
                    />
                  </div>

                  <div className="ml-3 flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Cover
                      </span>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-white">
                      {opt.coverImage ? (
                        <>
                          <Image src={opt.coverImage} alt={`${opt.name} cover`} fill className="object-cover" sizes="40px" />
                          <button
                            type="button"
                            onClick={() => updateOption(opt.id, { coverImage: null })}
                            className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[`cover-${opt.id}`]?.click()}
                            className="flex h-full w-full items-center justify-center text-neutral-400 hover:text-neutral-600"
                            title="Upload cover photo for this product"
                          >
                            <ImageIcon className="h-3 w-3" />
                          </button>
                          <input
                            ref={(el) => { fileInputRefs.current[`cover-${opt.id}`] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadOptionCoverImage(opt.id, file);
                              e.target.value = "";
                            }}
                          />
                        </>
                      )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Base
                      </span>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-white">
                        {opt.baseImage ? (
                          <>
                            <Image src={opt.baseImage} alt={`${opt.name} base`} fill className="object-cover" sizes="40px" />
                            <button
                              type="button"
                              onClick={() => updateOption(opt.id, { baseImage: null })}
                              className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[`base-${opt.id}`]?.click()}
                              className="flex h-full w-full items-center justify-center text-neutral-400 hover:text-neutral-600"
                              title="Upload base photo for this product"
                            >
                              <ImageIcon className="h-3 w-3" />
                            </button>
                            <input
                              ref={(el) => { fileInputRefs.current[`base-${opt.id}`] = el; }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadOptionBaseImage(opt.id, file);
                                e.target.value = "";
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <label className="mt-7 inline-flex items-center gap-2 text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      checked={opt.required}
                      onChange={(e) => updateOption(opt.id, { required: e.target.checked })}
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeOption(opt.id)}
                    className="mt-7 shrink-0 text-neutral-400 transition-colors hover:text-red-500"
                    title="Remove option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Sub-options */}
                <div className="space-y-3 pl-8">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Sub-options — each group contains selectable values with images
                  </p>

                  {opt.subOptions.length === 0 && (
                    <p className="text-xs text-neutral-400">No sub-options yet.</p>
                  )}

                  <div className="space-y-3">
                    {opt.subOptions.map((sub, subIdx) => (
                      <div key={sub.id} className="rounded-lg border border-neutral-200 bg-white p-3 space-y-3">
                        {/* Sub-option header */}
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[9px] font-bold text-neutral-500">
                            {subIdx + 1}
                          </span>
                          <Input
                            value={sub.label}
                            onChange={(e) => updateSubOption(opt.id, sub.id, { label: e.target.value })}
                            placeholder="Sub-option label (e.g. Cotton, Floral, Royal Blue)"
                            className="h-8 text-xs flex-1"
                          />
                          <select
                            value={sub.fieldType}
                            onChange={(e) => {
                              const nextType = e.target.value as CustomFieldType;
                              updateSubOption(opt.id, sub.id, {
                                fieldType: nextType,
                                valueOptions:
                                  nextType === "select" && sub.valueOptions.length === 0
                                    ? [newValueOption()]
                                    : sub.valueOptions,
                              });
                            }}
                            className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-xs text-neutral-700"
                          >
                            <option value="select">Select</option>
                            <option value="text">Text</option>
                            <option value="textarea">Textarea</option>
                            <option value="number">Number</option>
                            <option value="image">Image</option>
                          </select>
                          <label className="inline-flex items-center gap-1 text-[11px] text-neutral-600">
                            <input
                              type="checkbox"
                              checked={sub.required}
                              onChange={(e) =>
                                updateSubOption(opt.id, sub.id, {
                                  required: e.target.checked,
                                })
                              }
                            />
                            Required
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSubOption(opt.id, sub.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                            title="Remove sub-option"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {sub.fieldType === "select" ? (
                          <div className="space-y-1.5 pl-6">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Values</p>
                            <p className="text-[10px] text-neutral-400">Left image = option thumbnail, right image = optional layer overlay (PNG/WebP).</p>
                            {sub.valueOptions.map((val) => (
                              <div key={val.id} className="flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-1.5">
                                <div className="flex shrink-0 gap-1.5">
                                  {/* Thumbnail image */}
                                  <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-white">
                                    {val.uploading ? (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <Loader2 className="h-3 w-3 animate-spin text-neutral-400" />
                                      </div>
                                    ) : val.image ? (
                                      <>
                                        <Image src={val.image} alt={val.label} fill className="object-cover" sizes="40px" />
                                        <button
                                          type="button"
                                          onClick={() => updateValueOption(opt.id, sub.id, val.id, { image: null })}
                                          className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => fileInputRefs.current[val.id]?.click()}
                                        className="flex h-full w-full items-center justify-center text-neutral-400 hover:text-neutral-600"
                                        title="Upload thumbnail"
                                      >
                                        <ImageIcon className="h-3 w-3" />
                                      </button>
                                    )}
                                    <input
                                      ref={(el) => { fileInputRefs.current[val.id] = el; }}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadValueOptionImage(opt.id, sub.id, val.id, file);
                                        e.target.value = "";
                                      }}
                                    />
                                  </div>

                                  {/* Layer overlay image */}
                                  <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 bg-white">
                                    {val.layerImage ? (
                                      <>
                                        <Image src={val.layerImage} alt={`${val.label} layer`} fill className="object-cover" sizes="40px" />
                                        <button
                                          type="button"
                                          onClick={() => updateValueOption(opt.id, sub.id, val.id, { layerImage: null })}
                                          className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => fileInputRefs.current[`${val.id}-layer`]?.click()}
                                        className="flex h-full w-full items-center justify-center text-neutral-400 hover:text-neutral-600"
                                        title="Upload layer overlay"
                                      >
                                        <ImageIcon className="h-3 w-3" />
                                      </button>
                                    )}
                                    <input
                                      ref={(el) => { fileInputRefs.current[`${val.id}-layer`] = el; }}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadValueOptionLayerImage(opt.id, sub.id, val.id, file);
                                        e.target.value = "";
                                      }}
                                    />
                                  </div>
                                </div>

                                <Input
                                  value={val.label}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    updateValueOption(opt.id, sub.id, val.id, {
                                      label: v,
                                      value: slugify(v),
                                    });
                                  }}
                                  placeholder="Label (e.g. Light Cotton)"
                                  className="h-7 text-xs flex-1"
                                />

                                <Input
                                  type="number"
                                  step="1"
                                  value={val.priceAdjustment}
                                  onChange={(e) =>
                                    updateValueOption(opt.id, sub.id, val.id, {
                                      priceAdjustment: Number(e.target.value) || 0,
                                    })
                                  }
                                  placeholder="Price"
                                  className="h-7 text-xs w-24"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeValueOption(opt.id, sub.id, val.id)}
                                  className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => addValueOption(opt.id, sub.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              Add value
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 pl-6">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Input Settings</p>
                            <Input
                              value={sub.placeholder}
                              onChange={(e) => updateSubOption(opt.id, sub.id, { placeholder: e.target.value })}
                              placeholder="Placeholder text"
                              className="h-8 text-xs"
                            />
                            {sub.fieldType === "number" && (
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="number"
                                  value={sub.min}
                                  onChange={(e) => updateSubOption(opt.id, sub.id, { min: e.target.value })}
                                  placeholder="Min"
                                  className="h-8 text-xs"
                                />
                                <Input
                                  type="number"
                                  value={sub.max}
                                  onChange={(e) => updateSubOption(opt.id, sub.id, { max: e.target.value })}
                                  placeholder="Max"
                                  className="h-8 text-xs"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addSubOption(opt.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add sub-option
                  </button>
                </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => setOptions((prev) => [...prev, newOption()])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
