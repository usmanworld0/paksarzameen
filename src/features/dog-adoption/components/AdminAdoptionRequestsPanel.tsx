"use client";

import { useEffect, useState } from "react";
import type { AdoptionRequestRecord, AdoptionRequestStatus } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

const STATUS_LABELS: Record<AdoptionRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export function AdminAdoptionRequestsPanel() {
  const { session } = useAdminClientSession();
  const [rows, setRows] = useState<AdoptionRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadRows() {
    setLoading(true);
    setError(null);

    try {
      const response = await adminFetch("/api/admin/adoption-requests", { cache: "no-store" });
      const payload = (await response.json()) as { data?: AdoptionRequestRecord[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load requests.");
      }

      setRows(payload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRows();
  }, []);

  async function reviewRequest(requestId: string, status: AdoptionRequestStatus) {
    if (status === "pending") return;

    setSavingId(requestId);
    setError(null);

    try {
      const response = await adminFetch(`/api/admin/adoption-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update request.");
      }

      await loadRows();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Failed to update request.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="border-b border-[#E5E5E5] pb-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <h1 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Adoption Requests</h1>
          <p className="mt-1 text-sm text-[#707072]">
            Review incoming requests and approve or reject applications.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { href: "/admin", label: "Control Center" },
              { href: "/admin/dogs", label: "Manage Dogs" },
              { href: "/admin/dog-updates", label: "Dog Updates" },
              { href: "/admin/blood-requests", label: "Blood Requests" },
            ]
              .filter((item) => canAccessAdminRoute(session, item.href))
              .map((item) => (
                <a
                  key={item.href}
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47] hover:text-[#1a9d5f] transition"
                  href={item.href}
                >
                  {item.label} →
                </a>
              ))}
          </div>
        </header>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="text-sm text-[#707072]">Loading requests...</p> : null}

        {!loading && !rows.length ? (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 text-sm text-[#707072]">No adoption requests yet.</div>
        ) : null}

        {!loading && rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse">
                <thead className="bg-[#f3f3ee] border-b border-[#E5E5E5]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Dog</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">User</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">WhatsApp</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Requested At</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Status</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.requestId} className="border-b border-[#E5E5E5] last:border-0 transition hover:bg-[#f3f3ee]/60">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-black tracking-tight text-[#111111]">{row.dogName}</p>
                        <p className="text-[10px] font-medium text-[#707072]">{row.dogColor}</p>
                        {row.petName ? <p className="text-[10px] font-semibold text-sky-700">Pet name: {row.petName}</p> : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-[#111111]">{row.applicantName ?? row.userName ?? "Unknown"}</p>
                        <p className="text-[10px] font-medium text-[#707072]">{row.applicantPhone ?? row.userEmail ?? row.userId ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.applicantPhone ?? row.whatsappNumber ?? "N/A"}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{new Date(row.requestedAt).toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                          row.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : row.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {STATUS_LABELS[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={savingId === row.requestId || row.status !== "pending"}
                            onClick={() => void reviewRequest(row.requestId, "approved")}
                            className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={savingId === row.requestId || row.status !== "pending"}
                            onClick={() => void reviewRequest(row.requestId, "rejected")}
                            className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
