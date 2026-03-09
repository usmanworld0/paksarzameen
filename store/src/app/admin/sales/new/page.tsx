import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SaleForm } from "@/components/admin/SaleForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewSalePage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

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
      <div className="admin-form-card">
        <SaleForm categories={categories} products={products} />
      </div>
    </div>
  );
}
