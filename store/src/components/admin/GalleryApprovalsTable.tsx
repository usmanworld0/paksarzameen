"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type GalleryApprovalRow = {
  id: string;
  imageUrl: string;
  caption: string | null;
  approved: boolean;
  createdAtLabel: string;
  customerName: string;
  customerEmail: string;
};

type GalleryApprovalsTableProps = {
  rows: GalleryApprovalRow[];
};

export function GalleryApprovalsTable({ rows }: GalleryApprovalsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setApproval(id: string, approved: boolean) {
    setError(null);
    setLoadingId(id);
    try {
      const res = await fetch(`/api/gallery/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error ?? "Failed to update approval status");
        return;
      }

      window.location.reload();
    } catch {
      setError("Failed to update approval status");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-[920px] w-full border-collapse">
          <thead>
            <tr className="bg-neutral-900">
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Artwork</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Customer</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Submitted</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Status</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                      <Image src={row.imageUrl} alt="Gallery submission" fill className="object-cover" sizes="56px" unoptimized />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                        {row.caption?.trim() || "Untitled artwork"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900">{row.customerName}</p>
                  <p className="text-xs text-neutral-500">{row.customerEmail}</p>
                </td>

                <td className="px-4 py-3 text-sm text-neutral-600">{row.createdAtLabel}</td>

                <td className="px-4 py-3">
                  {row.approved ? (
                    <Badge variant="success">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock3 className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {!row.approved ? (
                      <Button
                        size="sm"
                        className="rounded-lg bg-brand-green px-3 text-[11px] uppercase tracking-[0.16em] text-white"
                        disabled={loadingId === row.id}
                        onClick={() => setApproval(row.id, true)}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg px-3 text-[11px] uppercase tracking-[0.16em]"
                        disabled={loadingId === row.id}
                        onClick={() => setApproval(row.id, false)}
                      >
                        Set Pending
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
