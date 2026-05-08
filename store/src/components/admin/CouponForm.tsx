"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Coupon } from "@prisma/client";
import { couponSchema, type CouponFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface CouponFormProps {
  coupon?: Coupon;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: coupon?.name || "",
      code: coupon?.code || "",
      description: coupon?.description || "",
      discountPercent: coupon?.discountPercent || 10,
      minSubtotal: coupon?.minSubtotal || null,
      active: coupon?.active ?? true,
    },
  });

  const activeValue = watch("active");

  async function onSubmit(data: CouponFormData) {
    setLoading(true);
    setSubmitError(null);

    try {
      const url = coupon ? `/api/coupons/${coupon.id}` : "/api/coupons";
      const method = coupon ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/admin/coupons");
        router.refresh();
        return;
      }

      const payload = await response.json().catch(() => null);
      setSubmitError(payload?.error || "Unable to save coupon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Coupon Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Coupon Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g. Welcome Offer" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input id="code" {...register("code")} placeholder="WELCOME10" className="uppercase" />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} placeholder="Explain when this coupon should be used." />
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Discount Rules</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="discountPercent">Discount %</Label>
            <Input id="discountPercent" type="number" min={1} max={100} {...register("discountPercent")} />
            {errors.discountPercent && (
              <p className="text-sm text-red-500">{errors.discountPercent.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="minSubtotal">Minimum Subtotal</Label>
            <Input id="minSubtotal" type="number" min={1} step="1" {...register("minSubtotal")} />
            <p className="text-xs text-neutral-500">
              Optional. Applied against the shopper&apos;s regional checkout subtotal.
            </p>
            {errors.minSubtotal && (
              <p className="text-sm text-red-500">{errors.minSubtotal.message}</p>
            )}
          </div>
        </div>
      </section>

      <div className="h-px bg-neutral-100" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Status</h3>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="active">Active Coupon</Label>
              <p className="mt-1 text-xs text-neutral-500">
                Only active coupons can be applied during checkout.
              </p>
            </div>
            <Switch
              id="active"
              checked={activeValue}
              onCheckedChange={(value) => setValue("active", value)}
            />
          </div>
        </div>
      </section>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {coupon ? "Update Coupon" : "Create Coupon"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}