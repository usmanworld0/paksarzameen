import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { deleteCoupon } from "@/actions/coupons";
import { safeAdminLoad } from "@/lib/admin-data";

export const dynamic = 'force-dynamic';

type CouponRow = {
  id: string;
  name: string;
  code: string;
  discount: string;
  minimum: string;
  status: string;
};

const columns: Column<CouponRow>[] = [
  { key: "name", label: "Name", sortable: true },
  {
    key: "code",
    label: "Code",
    kind: "badge",
    sortable: true,
    badgeVariantMap: {
      default: "outline",
    },
  },
  { key: "discount", label: "Discount", sortable: true },
  { key: "minimum", label: "Minimum", sortable: true },
  {
    key: "status",
    label: "Status",
    kind: "badge",
    sortable: true,
    badgeVariantMap: {
      Active: "success",
      Inactive: "outline",
    },
  },
];

export default async function AdminCouponsPage() {
  const { data: coupons, error } = await safeAdminLoad(
    "admin coupons",
    () => prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    [] as Array<{
      id: string;
      name: string;
      code: string;
      discountPercent: number;
      minSubtotal: number | null;
      active: boolean;
    }>
  );

  const tableData: CouponRow[] = coupons.map((coupon) => ({
    id: coupon.id,
    name: coupon.name,
    code: coupon.code,
    discount: `${coupon.discountPercent}%`,
    minimum: coupon.minSubtotal ? coupon.minSubtotal.toLocaleString() : "No minimum",
    status: coupon.active ? "Active" : "Inactive",
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Promotions</p>
          <h1 className="admin-page-title mt-1">Coupons</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Create and manage checkout coupon codes — {coupons.length} total
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Coupon
        </Link>
      </div>

      <div className="h-px bg-neutral-100" />

      {error ? <AdminDataNotice message={error} /> : null}

      <AdminTable
        columns={columns}
        data={tableData}
        editPath="/admin/coupons"
        deleteAction={async (id) => {
          "use server";
          await deleteCoupon(id);
        }}
        searchPlaceholder="Search coupons by name or code..."
        exportFilename="coupons"
      />
    </div>
  );
}
