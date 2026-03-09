"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, Category, Artist } from "@prisma/client";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  product?: Product & { images: { imageUrl: string }[] };
  categories: Category[];
  artists: Artist[];
}

export function ProductForm({ product, categories, artists }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.imageUrl) || []
  );

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
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice || null,
      stock: product?.stock || 0,
      categoryId: product?.categoryId || "",
      artistId: product?.artistId || null,
      customizable: product?.customizable || false,
      featured: product?.featured || false,
      active: product?.active ?? true,
    },
  });

  const nameValue = watch("name");

  async function onSubmit(data: ProductFormData) {
    setLoading(true);
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
      }
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
      </section>

      <div className="h-px bg-neutral-100" />

      {/* Pricing & Inventory */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Pricing &amp; Inventory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (PKR)</Label>
          <Input id="price" type="number" step="1" {...register("price")} />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare At Price</Label>
          <Input
            id="compareAtPrice"
            type="number"
            step="1"
            {...register("compareAtPrice")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
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
