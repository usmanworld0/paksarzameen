"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Sale, Category, Product } from "@prisma/client";
import { saleSchema, type SaleFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface SaleFormProps {
  sale?: Sale;
  categories: Category[];
  products: Product[];
}

export function SaleForm({ sale, categories, products }: SaleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      name: sale?.name || "",
      type: sale?.type || "STORE",
      targetId: sale?.targetId || null,
      discountPercent: sale?.discountPercent || 10,
      startDate: sale?.startDate || new Date(),
      endDate: sale?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      active: sale?.active ?? true,
    },
  });

  const saleType = watch("type");

  async function onSubmit(data: SaleFormData) {
    setLoading(true);
    try {
      const url = sale ? `/api/sales/${sale.id}` : "/api/sales";
      const method = sale ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/sales");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Sale Details</h3>
        <div className="space-y-2">
        <Label htmlFor="name">Sale Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g. Winter Sale 2026" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sale Type</Label>
          <Select
            defaultValue={sale?.type || "STORE"}
            onValueChange={(val) =>
              setValue("type", val as "STORE" | "CATEGORY" | "PRODUCT")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STORE">Store-wide</SelectItem>
              <SelectItem value="CATEGORY">Category</SelectItem>
              <SelectItem value="PRODUCT">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercent">Discount %</Label>
          <Input
            id="discountPercent"
            type="number"
            min={1}
            max={100}
            {...register("discountPercent")}
          />
          {errors.discountPercent && (
            <p className="text-sm text-red-500">
              {errors.discountPercent.message}
            </p>
          )}
        </div>
      </div>
      </section>

      {saleType === "CATEGORY" && (
        <div className="space-y-2">
          <Label>Target Category</Label>
          <Select
            defaultValue={sale?.targetId || ""}
            onValueChange={(val) => setValue("targetId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {saleType === "PRODUCT" && (
        <div className="space-y-2">
          <Label>Target Product</Label>
          <Select
            defaultValue={sale?.targetId || ""}
            onValueChange={(val) => setValue("targetId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="h-px bg-neutral-100" />

      {/* Schedule */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="datetime-local" {...register("startDate")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="datetime-local" {...register("endDate")} />
          </div>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Status</h3>
        <div className="flex items-center gap-2">
        <Switch
          id="active"
          defaultChecked={sale?.active ?? true}
          onCheckedChange={(val) => setValue("active", val)}
        />
        <Label htmlFor="active">Active</Label>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {sale ? "Update Sale" : "Create Sale"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
