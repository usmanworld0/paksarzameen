import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { getFirstAdminError, safeAdminLoad } from "@/lib/admin-data";
import { getAllStoreRegions } from "@/lib/store-regions";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [categoriesResult, artistsResult, regions] = await Promise.all([
    safeAdminLoad(
      "product categories",
      () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      [] as Array<{ id: string; name: string }>
    ),
    safeAdminLoad(
      "product artists",
      () => prisma.artist.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      [] as Array<{ id: string; name: string }>
    ),
    getAllStoreRegions(),
  ]);
  const pageError = getFirstAdminError(categoriesResult.error, artistsResult.error);

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
      {pageError ? (
        <AdminDataNotice
          title="Unable to load product form"
          message={pageError}
        />
      ) : (
        <div className="admin-form-card">
          <ProductForm
            categories={categoriesResult.data}
            artists={artistsResult.data}
            regions={regions}
          />
        </div>
      )}
    </div>
  );
}
