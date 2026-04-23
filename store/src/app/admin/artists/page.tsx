import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { deleteArtist } from "@/actions/artists";
import { safeAdminLoad } from "@/lib/admin-data";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

type ArtistRow = {
  id: string;
  name: string;
  slug: string;
  location: string;
  products: string;
};

const columns: Column<ArtistRow>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "products", label: "Products", sortable: true },
];

export default async function AdminArtistsPage() {
  const { data: artists, error } = await safeAdminLoad(
    "admin artists",
    () =>
      prisma.artist.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
    [] as Array<{
      id: string;
      name: string;
      slug: string;
      location: string | null;
      _count: { products: number };
    }>
  );

  const tableData: ArtistRow[] = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    slug: artist.slug,
    location: artist.location || "—",
    products: String(artist._count.products),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Community</p>
          <h1 className="admin-page-title mt-1">Artisans</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Manage artisans and craftspeople — {artists.length} total
          </p>
        </div>
        <Link
          href="/admin/artists/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Artisan
        </Link>
      </div>

      <div className="h-px bg-neutral-100" />

      {error ? <AdminDataNotice message={error} /> : null}

      <AdminTable
        columns={columns}
        data={tableData}
        editPath="/admin/artists"
        deleteAction={async (id) => {
          "use server";
          await deleteArtist(id);
        }}
        searchPlaceholder="Search artists by name, location..."
        exportFilename="artists"
      />
    </div>
  );
}
