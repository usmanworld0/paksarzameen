import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ArrowLeft } from "lucide-react";

interface EditCategoryPageProps {
  params: { id: string };
}

type CategoryWithCustomizations = Prisma.CategoryGetPayload<{
  include: {
    customizationOptions: true;
  };
}>;

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  let category: CategoryWithCustomizations | null = null;

  try {
    category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        customizationOptions: {
          orderBy: [{ position: "asc" }, { name: "asc" }],
        },
      },
    });
  } catch {
    const baseCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    category = baseCategory
      ? { ...baseCategory, customizationOptions: [] }
      : null;
  }

  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
        </Link>
        <p className="admin-page-subtitle">Organization</p>
        <h1 className="admin-page-title mt-1">Edit Category</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Update &quot;{category.name}&quot;</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
