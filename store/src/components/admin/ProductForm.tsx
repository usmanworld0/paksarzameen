"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Artist, Category } from "@prisma/client";
import type { StoreRegionRecord } from "@/lib/pricing";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./ImageUploader";
import { Model3DUploader } from "./Model3DUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type ProductFormProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  materials: string | null;
  careInstructions: string | null;
  heritageStory: string | null;
  model3DUrl?: string | null;
  modelOptimized?: boolean;
  modelSize?: number | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  categoryId: string;
  artistId: string | null;
  customizable: boolean;
  featured: boolean;
  active: boolean;
  images: { imageUrl: string }[];
  regionPrices?: Array<{
    price: number;
    compareAtPrice: number | null;
    region: {
      code: string;
    };
  }>;
};

interface ProductFormProps {
  product?: ProductFormProduct;
  categories: Array<Pick<Category, "id" | "name">>;
  artists: Array<Pick<Artist, "id" | "name">>;
  regions: StoreRegionRecord[];
}

export function ProductForm({ product, categories, artists, regions }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.imageUrl) || []
  );
  const activeRegions = regions.filter((region) => region.active);
  const defaultRegion = activeRegions.find((region) => region.isDefault) || activeRegions[0];
  const alternateRegions = activeRegions.filter((region) => !region.isDefault);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      materials: product?.materials || "",
      careInstructions: product?.careInstructions || "",
      heritageStory: product?.heritageStory || "",
      model3DUrl: product?.model3DUrl || "",
      modelOptimized: product?.modelOptimized || false,
      modelSize: product?.modelSize ?? null,
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice || null,
      availability: (product?.stock ?? 0) > 0,
      categoryId: product?.categoryId || "",
      artistId: product?.artistId || null,
      customizable: product?.customizable || false,
      featured: product?.featured || false,
      active: product?.active ?? true,
      regionPrices: alternateRegions.map((region) => {
        const existing = product?.regionPrices?.find(
          (entry) => entry.region.code === region.code
        );

        return {
          regionCode: region.code,
          price: existing?.price ?? 0,
          compareAtPrice: existing?.compareAtPrice ?? null,
        };
      }),
    },
  });

  const nameValue = watch("name");
  const availabilityValue = watch("availability");
  const regionPriceValues = watch("regionPrices");
  const model3DUrlValue = watch("model3DUrl") || "";
  const modelOptimizedValue = watch("modelOptimized");
  const modelSizeValue = watch("modelSize");

  function updateRegionalPrice(
    index: number,
    regionCode: StoreRegionRecord["code"],
    nextPrice: number,
    nextCompareAtPrice: number | null
  ) {
    const nextValues = [...(regionPriceValues || [])];
    nextValues[index] = {
      regionCode,
      price: nextPrice,
      compareAtPrice: nextCompareAtPrice,
    };

    setValue("regionPrices", nextValues, { shouldValidate: true });
  }

  async function onSubmit(data: ProductFormData) {
    setLoading(true);
    setSubmitError(null);
    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, images }),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
        return;
      }

      const payload = await res.json().catch(() => null);
      setSubmitError(
        payload?.error || payload?.message || "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register("name", {
                onChange: (e) => {
                  if (!product) setValue("slug", slugify(e.target.value));
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="materials">Materials &amp; Composition</Label>
          <Textarea id="materials" rows={3} {...register("materials")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="careInstructions">Care &amp; Usage</Label>
          <Textarea id="careInstructions" rows={3} {...register("careInstructions")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heritageStory">Heritage &amp; Story</Label>
          <Textarea id="heritageStory" rows={3} {...register("heritageStory")} />
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Pricing & Availability */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Pricing &amp; Availability</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-neutral-800">Regional Prices</h4>
              <p className="mt-1 text-xs text-neutral-500">
                Add pricing for every active region before saving this product.
              </p>
            </div>
            <div className="space-y-4">
              {activeRegions.map((region) => {
                const regionIndex = alternateRegions.findIndex(
                  (entry) => entry.code === region.code
                );
                const isDefaultRegion = region.isDefault || region.code === defaultRegion?.code;

                return (
                  <div
                    key={region.code}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900">{region.name}</p>
                        {isDefaultRegion && (
                          <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-brand-green">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        {region.currency} pricing for this region.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`region-price-${region.code}`}>Price ({region.currency})</Label>
                        {isDefaultRegion ? (
                          <>
                            <Input
                              id={`region-price-${region.code}`}
                              type="number"
                              step="1"
                              {...register("price")}
                            />
                            {errors.price && (
                              <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                          </>
                        ) : (
                          <Input
                            id={`region-price-${region.code}`}
                            type="number"
                            step="0.01"
                            value={regionIndex >= 0 ? regionPriceValues?.[regionIndex]?.price || "" : ""}
                            onChange={(event) => {
                              updateRegionalPrice(
                                regionIndex,
                                region.code,
                                Number(event.target.value || 0),
                                regionPriceValues?.[regionIndex]?.compareAtPrice ?? null
                              );
                            }}
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`region-compare-${region.code}`}>
                          Compare At ({region.currency})
                        </Label>
                        {isDefaultRegion ? (
                          <Input
                            id={`region-compare-${region.code}`}
                            type="number"
                            step="1"
                            {...register("compareAtPrice")}
                          />
                        ) : (
                          <Input
                            id={`region-compare-${region.code}`}
                            type="number"
                            step="0.01"
                            value={regionIndex >= 0 ? regionPriceValues?.[regionIndex]?.compareAtPrice || "" : ""}
                            onChange={(event) => {
                              updateRegionalPrice(
                                regionIndex,
                                region.code,
                                regionPriceValues?.[regionIndex]?.price ?? 0,
                                event.target.value ? Number(event.target.value) : null
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.regionPrices && (
              <p className="mt-3 text-sm text-red-500">Please add valid prices for each active region.</p>
            )}
          </div>
          <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="availability">Availability</Label>
                <p className="mt-1 text-xs text-neutral-500">
                  Mark unavailable products as sold out.
                </p>
              </div>
              <Switch
                id="availability"
                checked={availabilityValue}
                onCheckedChange={(val) => setValue("availability", val, { shouldValidate: true })}
              />
            </div>
            <p className={`mt-3 text-xs font-medium ${availabilityValue ? "text-green-700" : "text-red-500"}`}>
              {availabilityValue ? "Available" : "Sold Out"}
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Classification */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            defaultValue={product?.categoryId}
            onValueChange={(val) => setValue("categoryId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Artist</Label>
          <Select
            defaultValue={product?.artistId || ""}
            onValueChange={(val) =>
              setValue("artistId", val === "none" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select artist (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No artist</SelectItem>
              {artists.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Media */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Media</h3>
        <ImageUploader images={images} onChange={setImages} />
        <Model3DUploader
          model3DUrl={model3DUrlValue}
          modelSize={modelSizeValue ?? null}
          modelOptimized={modelOptimizedValue}
          onModelUrlChange={(value) =>
            setValue("model3DUrl", value, { shouldValidate: true, shouldDirty: true })
          }
          onModelSizeChange={(value) =>
            setValue("modelSize", value, { shouldValidate: true, shouldDirty: true })
          }
          onModelOptimizedChange={(value) =>
            setValue("modelOptimized", value, { shouldValidate: true, shouldDirty: true })
          }
        />
        {errors.model3DUrl && (
          <p className="text-sm text-red-500">{errors.model3DUrl.message}</p>
        )}
        {errors.modelSize && (
          <p className="text-sm text-red-500">{errors.modelSize.message}</p>
        )}
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Visibility */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Visibility</h3>
        <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            defaultChecked={product?.featured}
            onCheckedChange={(val) => setValue("featured", val)}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="customizable"
            defaultChecked={product?.customizable}
            onCheckedChange={(val) => setValue("customizable", val)}
          />
          <Label htmlFor="customizable">Customizable</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="active"
            defaultChecked={product?.active ?? true}
            onCheckedChange={(val) => setValue("active", val)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
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
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
