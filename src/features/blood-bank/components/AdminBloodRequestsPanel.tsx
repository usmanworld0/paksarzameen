"use client";

import { useEffect, useMemo, useState } from "react";
import type { BloodRequestStatus } from "@/lib/blood-bank";
import { createClient } from "@/utils/supabase/client";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type BloodRequestRecord = {
  id: string;
  name: string;
  neededAt: string;
  cnic: string;
  location: string;
  volumeMl: number;
  contactNumber: string;
  bloodGroup: string | null;
  notes: string | null;
  status: BloodRequestStatus;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<BloodRequestStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_OPTIONS: BloodRequestStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
];

export function AdminBloodRequestsPanel() {
  const supabase = createClient();
  const { session } = useAdminClientSession();
  const [rows, setRows] = useState<BloodRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BloodRequestStatus | "all">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const response = await adminFetch("/api/admin/blood-requests", {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        data?: BloodRequestRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load requests.");
      }

      setRows(payload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to fetch data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: BloodRequestStatus) {
    setSavingId(id);
    setError(null);
    try {
      const response = await adminFetch(`/api/admin/blood-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as {
        data?: BloodRequestRecord;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Failed to update status.");
      }

      setRows((prev) => prev.map((row) => (row.id === id ? payload.data! : row)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update status.");
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });

    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="border-b border-[#E5E5E5] pb-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Blood Bank Dashboard</h1>
              <p className="mt-1 text-sm text-[#707072]">
                Review emergency blood requests, track status changes, and keep response details organized.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  { href: "/admin", label: "Control Center" },
                  { href: "/admin/dogs", label: "Manage Dogs" },
                  { href: "/admin/adoption-requests", label: "Adoption Requests" },
                  { href: "/admin/dog-updates", label: "Dog Updates" },
                  { href: "/admin/users", label: "User Management" },
                ]
                  .filter((item) => canAccessAdminRoute(session, item.href))
                  .map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47] hover:text-[#1a9d5f] transition"
                    >
                      {item.label} →
                    </a>
                  ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as BloodRequestStatus | "all")}
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => void load()}
                className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {loading ? <p className="text-sm text-[#707072]">Loading requests...</p> : null}
        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {!loading && filteredRows.length === 0 ? (
          <p className="rounded-2xl border border-[#E5E5E5] bg-white px-5 py-4 text-sm text-[#707072]">No blood requests found for this status.</p>
        ) : null}

        {!loading && filteredRows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full border-collapse">
                <thead className="bg-[#f3f3ee] border-b border-[#E5E5E5]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Name</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Needed At</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">CNIC</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Location</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Volume</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Contact</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Status</th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-[#E5E5E5] last:border-0 transition hover:bg-[#f3f3ee]/60">
                      <td className="px-4 py-3.5 text-sm font-medium text-[#111111]">{row.name}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{new Date(row.neededAt).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.cnic}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.location}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.volumeMl} ml</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.contactNumber}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={row.status}
                          disabled={savingId === row.id}
                          onChange={(event) =>
                            void updateStatus(row.id, event.target.value as BloodRequestStatus)
                          }
                          className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#707072]">{row.notes || "-"}</td>
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
