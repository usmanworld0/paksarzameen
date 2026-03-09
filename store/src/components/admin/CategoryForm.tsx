"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@prisma/client";
import { categorySchema, type CategoryFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./ImageUploader";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    category?.image ? [category.image] : []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      image: category?.image || "",
      customizable: category?.customizable || false,
    },
  });

  async function onSubmit(data: CategoryFormData) {
    setLoading(true);
    try {
      const url = category
        ? `/api/categories/${category.id}`
        : "/api/categories";
      const method = category ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: images[0] || null }),
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            {...register("name", {
              onChange: (e) => {
                if (!category) setValue("slug", slugify(e.target.value));
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
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Media</h3>
        <ImageUploader images={images} onChange={setImages} maxImages={1} />
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Options</h3>
        <div className="flex items-center gap-2">
        <Switch
          id="customizable"
          defaultChecked={category?.customizable}
          onCheckedChange={(val) => setValue("customizable", val)}
        />
        <Label htmlFor="customizable">Enable Customization Options</Label>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {category ? "Update Category" : "Create Category"}
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
