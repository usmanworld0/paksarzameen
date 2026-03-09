import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const [categories, artists] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <p className="admin-page-subtitle">Catalog</p>
        <h1 className="admin-page-title mt-1">New Product</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Add a new product to your catalog</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <ProductForm categories={categories} artists={artists} />
      </div>
    </div>
  );
}
