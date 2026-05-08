import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { SaleForm } from "@/components/admin/SaleForm";
import { getFirstAdminError, safeAdminLoad } from "@/lib/admin-data";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewSalePage() {
  const [categoriesResult, productsResult] = await Promise.all([
    safeAdminLoad(
      "sale categories",
      () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      [] as Array<{ id: string; name: string }>
    ),
    safeAdminLoad(
      "sale products",
      () =>
        prisma.product.findMany({
          where: { active: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      [] as Array<{ id: string; name: string }>
    ),
  ]);
  const pageError = getFirstAdminError(categoriesResult.error, productsResult.error);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/sales"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sales
        </Link>
        <p className="admin-page-subtitle">Promotions</p>
        <h1 className="admin-page-title mt-1">Create Sale</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Set up a new discount or promotion</p>
      </div>
      <div className="h-px bg-neutral-100" />
      {pageError ? (
        <AdminDataNotice
          title="Unable to load sale form"
          message={pageError}
        />
      ) : (
        <div className="admin-form-card">
          <SaleForm
            categories={categoriesResult.data}
            products={productsResult.data}
          />
        </div>
      )}
    </div>
  );
}
