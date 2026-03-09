import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const [product, categories, artists] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

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
        <h1 className="admin-page-title mt-1">Edit Product</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Update &quot;{product.name}&quot;</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <ProductForm
          product={product}
          categories={categories}
          artists={artists}
        />
      </div>
    </div>
  );
}
