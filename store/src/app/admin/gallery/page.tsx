import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { GalleryApprovalsTable } from "@/components/admin/GalleryApprovalsTable";
import { safeAdminLoad } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string } | undefined)?.role !== "admin") {
    redirect("/admin/login");
  }

  const { data: images, error } = await safeAdminLoad(
    "admin gallery submissions",
    () =>
      prisma.image.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 300,
      }),
    [] as Array<{
      id: string;
      imageUrl: string;
      thumbnailUrl: string | null;
      caption: string | null;
      approved: boolean;
      createdAt: Date;
      user: { name: string | null; email: string | null };
    }>
  );

  const tableRows = images.map((image) => ({
    id: image.id,
    imageUrl: image.thumbnailUrl ?? image.imageUrl,
    caption: image.caption,
    approved: image.approved,
    createdAtLabel: new Intl.DateTimeFormat("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(image.createdAt),
    customerName: image.user.name?.trim() || "Customer",
    customerEmail: image.user.email?.trim() || "No email",
  }));

  const pendingCount = tableRows.filter((row) => !row.approved).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Customer Art Gallery</p>
          <h1 className="admin-page-title mt-1">Gallery Approvals</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            {pendingCount} pending submissions out of {tableRows.length} total uploads.
          </p>
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {error ? <AdminDataNotice message={error} /> : null}

      <GalleryApprovalsTable rows={tableRows} />
    </div>
  );
}
