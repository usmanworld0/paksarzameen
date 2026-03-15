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

type CustomFieldType = "select" | "text" | "number" | "textarea";

type ValueOptionDraft = {
  id: string;
  value: string;
  label: string;
  image: string | null;
  priceAdjustment: number;
  uploading?: boolean;
};

type SubOptionDraft = {
  id: string;
  label: string;
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
        valueOptions: values.map((v) => {
          const vo = v as Record<string, unknown>;
          return {
            id: uid(),
            value: String(vo.value ?? ""),
            label: String(vo.label ?? vo.value ?? ""),
            image: typeof vo.image === "string" ? vo.image : null,
            priceAdjustment:
              typeof vo.priceAdjustment === "number" && Number.isFinite(vo.priceAdjustment)
                ? vo.priceAdjustment
                : 0,
          };
        }),
      };
    });
}

function asFieldType(value: unknown): CustomFieldType {
  if (value === "text" || value === "number" || value === "textarea") {
    return value;
  }
  return "select";
}

function toOptionDraft(option: CustomizationOption): OptionDraft {
  let placeholder = "";
  let min = "";
  let max = "";
  let subOptions: SubOptionDraft[] = [];

  if (Array.isArray(option.options)) {
    subOptions = parseSubOptions(option.options);
  } else if (
    option.options &&
    typeof option.options === "object" &&
    !Array.isArray(option.options)
  ) {
    const config = option.options as Record<string, unknown>;
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
  };
}

function newValueOption(): ValueOptionDraft {
  return {
    id: `val-${uid()}`,
    value: "",
    label: "",
    image: null,
    priceAdjustment: 0,
  };
}

function newSubOption(): SubOptionDraft {
  return { id: `sub-${uid()}`, label: "", valueOptions: [newValueOption()] };
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
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(category?.image ? [category.image] : []);
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
            groups: o.subOptions
              .filter((s) => s.label.trim())
              .map((s) => ({
                label: s.label.trim(),
                values: s.valueOptions
                  .filter((v) => v.value.trim() && v.label.trim())
                  .map((v) => ({
                    value: v.value.trim(),
                    label: v.label.trim(),
                    image: v.image || null,
                    priceAdjustment: Number(v.priceAdjustment) || 0,
                  })),
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
        <ImageUploader images={images} onChange={setImages} maxImages={1} />
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
                    <Label className="text-xs">Option Name</Label>
                    <Input
                      value={opt.name}
                      onChange={(e) => updateOption(opt.id, { name: e.target.value })}
                      placeholder="e.g. Color, Material, Size"
                    />
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
                          <button
                            type="button"
                            onClick={() => removeSubOption(opt.id, sub.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors shrink-0"
                            title="Remove sub-option"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Value options */}
                        <div className="space-y-1.5 pl-6">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Values</p>
                          {sub.valueOptions.map((val) => (
                            <div key={val.id} className="flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-1.5">
                              {/* Image */}
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
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
                                    title="Upload image"
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

                              <Input
                                value={val.label}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  updateValueOption(opt.id, sub.id, val.id, {
                                    label: v,
                                    value: val.value || slugify(v),
                                  });
                                }}
                                placeholder="Label (e.g. Light Cotton)"
                                className="h-7 text-xs flex-1"
                              />

                              <Input
                                value={val.value}
                                onChange={(e) =>
                                  updateValueOption(opt.id, sub.id, val.id, { value: e.target.value })
                                }
                                placeholder="Value (e.g. light-cotton)"
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
