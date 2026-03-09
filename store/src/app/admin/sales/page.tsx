import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { deleteSale } from "@/actions/sales";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

type SaleRow = {
  id: string;
  name: string;
  type: string;
  discount: string;
  period: string;
  status: string;
};

const columns: Column<SaleRow>[] = [
  { key: "name", label: "Name", sortable: true },
  {
    key: "type",
    label: "Type",
    kind: "badge",
    sortable: true,
    badgeVariantMap: {
      STORE: "outline",
      CATEGORY: "secondary",
      PRODUCT: "gold",
    },
  },
  { key: "discount", label: "Discount", sortable: true },
  { key: "period", label: "Period", sortable: true },
  {
    key: "status",
    label: "Status",
    kind: "badge",
    sortable: true,
    badgeVariantMap: {
      Active: "success",
      Scheduled: "secondary",
      Inactive: "outline",
    },
  },
];

export default async function AdminSalesPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const tableData: SaleRow[] = sales.map((sale) => {
    const isRunning =
      sale.active &&
      new Date(sale.startDate) <= now &&
      new Date(sale.endDate) >= now;

    return {
      id: sale.id,
      name: sale.name,
      type: sale.type,
      discount: `${sale.discountPercent}%`,
      period: `${new Date(sale.startDate).toLocaleDateString()} – ${new Date(sale.endDate).toLocaleDateString()}`,
      status: isRunning ? "Active" : sale.active ? "Scheduled" : "Inactive",
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Promotions</p>
          <h1 className="admin-page-title mt-1">Sales &amp; Discounts</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Manage promotions and discount campaigns — {sales.length} total
          </p>
        </div>
        <Link
          href="/admin/sales/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Sale
        </Link>
      </div>

      <div className="h-px bg-neutral-100" />

      <AdminTable
        columns={columns}
        data={tableData}
        editPath="/admin/sales"
        deleteAction={async (id) => {
          "use server";
          await deleteSale(id);
        }}
        searchPlaceholder="Search sales by name, type..."
        exportFilename="sales"
      />
    </div>
  );
}
