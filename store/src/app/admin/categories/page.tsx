import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { deleteCategory } from "@/actions/categories";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  products: string;
  customizable: string;
};

const columns: Column<CategoryRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
  { key: "products", label: "Products", sortable: true },
  {
    key: "customizable",
    label: "Customizable",
    kind: "badge",
    sortable: true,
    badgeVariantMap: { Yes: "success", No: "secondary" },
  },
];

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  const tableData: CategoryRow[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    products: String(category._count.products),
    customizable: category.customizable ? "Yes" : "No",
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Organization</p>
          <h1 className="admin-page-title mt-1">Categories</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Organize products into collections — {categories.length} total
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </Link>
      </div>

      <div className="h-px bg-neutral-100" />

      <AdminTable
        columns={columns}
        data={tableData}
        editPath="/admin/categories"
        deleteAction={async (id) => {
          "use server";
          await deleteCategory(id);
        }}
        searchPlaceholder="Search categories..."
        exportFilename="categories"
      />
    </div>
  );
}
