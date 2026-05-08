import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/CouponForm";

export const dynamic = 'force-dynamic';

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/coupons"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 transition-colors hover:text-brand-green"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Coupons
        </Link>
        <p className="admin-page-subtitle">Promotions</p>
        <h1 className="admin-page-title mt-1">Create Coupon</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Add a coupon customers can enter manually at checkout</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <CouponForm />
      </div>
    </div>
  );
}