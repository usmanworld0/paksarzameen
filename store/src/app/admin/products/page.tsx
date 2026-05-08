import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { formatPrice } from "@/lib/utils";
import { deleteProduct } from "@/actions/products";
import { safeAdminLoad } from "@/lib/admin-data";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

type ProductRow = {
  id: string;
  imageUrl: string;
  name: string;
  price: string;
  availability: string;
  category: string;
  status: string;
};

const columns: Column<ProductRow>[] = [
  { key: "imageUrl", label: "Image", kind: "image", sortable: false, searchable: false },
  { key: "name", label: "Name", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "availability", label: "Availability", sortable: true },
  { key: "category", label: "Category", sortable: true },
  {
    key: "status",
    label: "Status",
    kind: "badge",
    sortable: true,
    badgeVariantMap: {
      Active: "success",
      Draft: "secondary",
      "Active • Featured": "neutral",
    },
  },
];

export default async function AdminProductsPage() {
  const { data: products, error } = await safeAdminLoad(
    "admin products",
    () =>
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stock: true,
          active: true,
          featured: true,
          category: {
            select: {
              name: true,
            },
          },
          images: {
            select: {
              imageUrl: true,
            },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    [] as Array<{
      id: string;
      name: string;
      price: number;
      stock: number;
      active: boolean;
      featured: boolean;
      category: { name: string };
      images: Array<{ imageUrl: string }>;
    }>
  );

  const tableData: ProductRow[] = products.map((product) => ({
    id: product.id,
    imageUrl: product.images[0]?.imageUrl ?? "",
    name: product.name,
    price: formatPrice(product.price),
    availability: product.stock > 0 ? "Yes" : "No • Sold Out",
    category: product.category.name,
    status: product.active
      ? product.featured
        ? "Active • Featured"
        : "Active"
      : "Draft",
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Catalog</p>
          <h1 className="admin-page-title mt-1">Products</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Manage your product catalog — {products.length} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </div>

      <div className="h-px bg-neutral-100" />

      {error ? <AdminDataNotice message={error} /> : null}

      <AdminTable
        columns={columns}
        data={tableData}
        editPath="/admin/products"
        deleteAction={async (id) => {
          "use server";
          await deleteProduct(id);
        }}
        searchPlaceholder="Search products by name, category, status..."
        exportFilename="products"
      />
    </div>
  );
}
