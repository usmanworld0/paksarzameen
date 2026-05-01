"use client";

import { useEffect, useMemo, useState } from "react";

import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import type { BloodRequestStatus } from "@/lib/blood-bank";

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

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const quickLinks = [
    { href: "/admin", label: "Control Center" },
    { href: "/admin/dogs", label: "Manage Dogs" },
    { href: "/admin/adoption-requests", label: "Adoption Requests" },
    { href: "/admin/dog-updates", label: "Dog Updates" },
    { href: "/admin/users", label: "User Management" },
  ].filter((item) => canAccessAdminRoute(session, item.href));

  return (
    <main className="admin-page">
      <section className="site-shell site-stack--xl pb-20 pt-32">
        <header className="site-panel site-panel--rounded">
          <div className="site-panel__body">
            <p className="site-eyebrow">Blood operations</p>
            <div className="site-toolbar__row mt-3">
              <div>
                <h1 className="site-display">Emergency Request Desk</h1>
                <p className="site-copy mt-4 max-w-[72rem]">
                  Review active blood requests, track urgency, and move each case through response stages without leaving the admin system.
                </p>
              </div>
              <div className="site-form-actions">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as BloodRequestStatus | "all")}
                  className="site-select min-w-[18rem]"
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
                <button onClick={() => void load()} className="site-button-secondary">
                  Refresh
                </button>
              </div>
            </div>
            {quickLinks.length ? (
              <div className="site-form-actions mt-6">
                {quickLinks.map((item) => (
                  <a key={item.href} href={item.href} className="site-link">
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {loading ? <p className="site-copy">Loading requests...</p> : null}
        {error ? <div className="site-callout site-callout--error">{error}</div> : null}
        {!loading && filteredRows.length === 0 ? <div className="site-empty">No blood requests found for this filter.</div> : null}

        {!loading && filteredRows.length > 0 ? (
          <section className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="overflow-x-auto">
                <table className="min-w-[1120px] w-full text-left text-[1.25rem]">
                  <thead className="border-b border-[#e5e5e5] text-[1rem] uppercase tracking-[0.16em] text-[#707072]">
                    <tr>
                      <th className="px-3 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Needed at</th>
                      <th className="px-3 py-3 font-medium">CNIC</th>
                      <th className="px-3 py-3 font-medium">Location</th>
                      <th className="px-3 py-3 font-medium">Volume</th>
                      <th className="px-3 py-3 font-medium">Contact</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-b border-[#f1f1f1] align-top">
                        <td className="px-3 py-4 text-[#111111]">{row.name}</td>
                        <td className="px-3 py-4 text-[#707072]">{new Date(row.neededAt).toLocaleString()}</td>
                        <td className="px-3 py-4 text-[#111111]">{row.cnic}</td>
                        <td className="px-3 py-4 text-[#111111]">{row.location}</td>
                        <td className="px-3 py-4 text-[#111111]">{row.volumeMl} ml</td>
                        <td className="px-3 py-4 text-[#111111]">{row.contactNumber}</td>
                        <td className="px-3 py-4">
                          <select
                            value={row.status}
                            disabled={savingId === row.id}
                            onChange={(event) => void updateStatus(row.id, event.target.value as BloodRequestStatus)}
                            className="site-select min-w-[18rem]"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-4 text-[#707072]">{row.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
