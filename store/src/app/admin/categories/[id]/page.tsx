import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getFirstAdminError, safeAdminLoad } from "@/lib/admin-data";
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
  const categoryResult = await safeAdminLoad(
    `category ${params.id} with customizations`,
    () =>
      prisma.category.findUnique({
        where: { id: params.id },
        include: {
          customizationOptions: {
            orderBy: [{ position: "asc" }, { name: "asc" }],
          },
        },
      }),
    null as CategoryWithCustomizations | null
  );

  const fallbackCategoryResult = categoryResult.error
    ? await safeAdminLoad(
        `category ${params.id}`,
        () =>
          prisma.category.findUnique({
            where: { id: params.id },
          }),
        null as Prisma.CategoryGetPayload<Record<string, never>> | null
      )
    : { data: null, error: null };

  const pageError = getFirstAdminError(
    categoryResult.error,
    fallbackCategoryResult.error
  );

  const category = categoryResult.data
    ?? (fallbackCategoryResult.data
      ? { ...fallbackCategoryResult.data, customizationOptions: [] }
      : null);

  if (!pageError && !category) notFound();

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
        <p className="mt-1.5 text-sm text-neutral-400">
          {category ? `Update "${category.name}"` : "Category details"}
        </p>
      </div>
      <div className="h-px bg-neutral-100" />
      {pageError || !category ? (
        <AdminDataNotice
          title="Unable to load category"
          message={pageError || "This category could not be loaded right now."}
        />
      ) : (
        <div className="admin-form-card">
          <CategoryForm category={category} />
        </div>
      )}
    </div>
  );
}
