"use client";

import { useEffect, useState } from "react";

import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import type { AdoptionRequestRecord, AdoptionRequestStatus } from "@/lib/dog-adoption";

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

  const quickLinks = [
    { href: "/admin", label: "Control Center" },
    { href: "/admin/dogs", label: "Manage Dogs" },
    { href: "/admin/dog-updates", label: "Dog Updates" },
    { href: "/admin/blood-requests", label: "Blood Requests" },
  ].filter((item) => canAccessAdminRoute(session, item.href));

  return (
    <main className="admin-page">
      <section className="site-shell site-stack--xl pb-20 pt-32">
        <header className="site-panel site-panel--rounded">
          <div className="site-panel__body">
            <p className="site-eyebrow">Adoption queue</p>
            <div className="site-toolbar__row mt-3">
              <div>
                <h1 className="site-display">Request Review Desk</h1>
                <p className="site-copy mt-4 max-w-[70rem]">
                  Review incoming applications, verify the adopter details, and decide whether the dog moves forward to a home.
                </p>
              </div>
              <span className="site-badge site-badge--muted">{rows.length} requests</span>
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

        {error ? <div className="site-callout site-callout--error">{error}</div> : null}
        {loading ? <p className="site-copy">Loading requests...</p> : null}

        {!loading && !rows.length ? <div className="site-empty">No adoption requests yet.</div> : null}

        {!loading && rows.length ? (
          <section className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-left text-[1.3rem]">
                  <thead className="border-b border-[#e5e5e5] text-[1rem] uppercase tracking-[0.16em] text-[#707072]">
                    <tr>
                      <th className="px-3 py-3 font-medium">Dog</th>
                      <th className="px-3 py-3 font-medium">Applicant</th>
                      <th className="px-3 py-3 font-medium">WhatsApp</th>
                      <th className="px-3 py-3 font-medium">Requested</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.requestId} className="border-b border-[#f1f1f1] align-top">
                        <td className="px-3 py-4">
                          <p className="text-[1.45rem] font-medium uppercase tracking-[-0.03em] text-[#111111]">{row.dogName}</p>
                          <p className="mt-2 text-[1.1rem] uppercase tracking-[0.14em] text-[#707072]">
                            {row.dogBreed} / {row.dogColor}
                          </p>
                          {row.petName ? <p className="mt-2 text-[1.15rem] text-[#707072]">Pet name: {row.petName}</p> : null}
                        </td>
                        <td className="px-3 py-4">
                          <p className="text-[1.2rem] text-[#111111]">{row.userName ?? "Unknown user"}</p>
                          <p className="mt-2 text-[1.1rem] text-[#707072]">{row.userEmail ?? row.userId}</p>
                        </td>
                        <td className="px-3 py-4 text-[#111111]">{row.whatsappNumber ?? "N/A"}</td>
                        <td className="px-3 py-4 text-[#707072]">{new Date(row.requestedAt).toLocaleString()}</td>
                        <td className="px-3 py-4">
                          <span className={`site-badge ${row.status === "pending" ? "site-badge--dark" : "site-badge--muted"}`}>
                            {STATUS_LABELS[row.status]}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="site-form-actions">
                            <button
                              type="button"
                              disabled={savingId === row.requestId || row.status !== "pending"}
                              onClick={() => void reviewRequest(row.requestId, "approved")}
                              className="site-button"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={savingId === row.requestId || row.status !== "pending"}
                              onClick={() => void reviewRequest(row.requestId, "rejected")}
                              className="site-button-secondary"
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
          </section>
        ) : null}
      </section>
    </main>
  );
}
