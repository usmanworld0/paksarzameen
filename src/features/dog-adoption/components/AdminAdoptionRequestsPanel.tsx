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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fcf7_0%,_#eef6ef_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/10 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Admin · Adoption Requests</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Review incoming requests and approve or reject applications.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
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
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                  href={item.href}
                >
                  {item.label} →
                </a>
              ))}
          </div>
        </header>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="text-sm text-slate-600">Loading requests...</p> : null}

        {!loading && !rows.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No adoption requests yet.</div>
        ) : null}

        {!loading && rows.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Dog</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">User</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">WhatsApp</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Requested At</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.requestId} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        <p className="font-semibold text-slate-900">{row.dogName}</p>
                        <p className="text-xs text-slate-500">{row.dogBreed} • {row.dogColor}</p>
                        {row.petName ? <p className="text-xs text-indigo-700">Pet name: {row.petName}</p> : null}
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-slate-700">{row.userName ?? "Unknown user"}</p>
                        <p className="text-xs text-slate-500">{row.userEmail ?? row.userId}</p>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{row.whatsappNumber ?? "N/A"}</td>
                      <td className="px-3 py-2 text-slate-600">{new Date(row.requestedAt).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {STATUS_LABELS[row.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={savingId === row.requestId || row.status !== "pending"}
                            onClick={() => void reviewRequest(row.requestId, "approved")}
                            className="rounded-md border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={savingId === row.requestId || row.status !== "pending"}
                            onClick={() => void reviewRequest(row.requestId, "rejected")}
                            className="rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 disabled:opacity-40"
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
    </main>
  );
}
