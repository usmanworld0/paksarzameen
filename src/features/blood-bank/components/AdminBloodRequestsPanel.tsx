"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
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
  const [rows, setRows] = useState<BloodRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BloodRequestStatus | "all">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/blood-requests", {
        cache: "no-store",
      });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

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
      const response = await fetch(`/api/admin/blood-requests/${id}`, {
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
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  return (
    <section style={containerStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#111827" }}>
            Blood Bank Requests Admin
          </h1>
          <p style={{ marginTop: "0.5rem", color: "#4b5563", fontSize: "1.35rem" }}>
            Manage emergency blood requests and update statuses.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as BloodRequestStatus | "all")}
            style={selectStyle}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <button onClick={() => void load()} style={secondaryButtonStyle}>
            Refresh
          </button>
          <button onClick={() => void logout()} style={secondaryButtonStyle}>
            Logout
          </button>
        </div>
      </div>

      {loading ? <p style={messageStyle}>Loading requests...</p> : null}
      {error ? <p style={{ ...messageStyle, color: "#b91c1c" }}>{error}</p> : null}

      {!loading && filteredRows.length === 0 ? (
        <p style={messageStyle}>No blood requests found for this status.</p>
      ) : null}

      {!loading && filteredRows.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Needed At</th>
                <th style={thStyle}>CNIC</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Volume</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{new Date(row.neededAt).toLocaleString()}</td>
                  <td style={tdStyle}>{row.cnic}</td>
                  <td style={tdStyle}>{row.location}</td>
                  <td style={tdStyle}>{row.volumeMl} ml</td>
                  <td style={tdStyle}>{row.contactNumber}</td>
                  <td style={tdStyle}>
                    <select
                      value={row.status}
                      disabled={savingId === row.id}
                      onChange={(event) =>
                        void updateStatus(row.id, event.target.value as BloodRequestStatus)
                      }
                      style={selectStyle}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>{row.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

const containerStyle: CSSProperties = {
  width: "min(1240px, 94vw)",
  margin: "10rem auto 4rem",
  padding: "2rem",
  borderRadius: "1.2rem",
  background: "#ffffff",
  boxShadow: "0 20px 55px rgba(17, 24, 39, 0.1)",
  border: "1px solid #e5e7eb",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  flexWrap: "wrap",
  marginBottom: "1.2rem",
};

const messageStyle: CSSProperties = {
  fontSize: "1.3rem",
  color: "#374151",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "980px",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #d1d5db",
  padding: "0.9rem 0.65rem",
  fontSize: "1.15rem",
  color: "#111827",
};

const tdStyle: CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  padding: "0.8rem 0.65rem",
  color: "#111827",
  fontSize: "1.2rem",
  verticalAlign: "top",
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  padding: "0.55rem 0.9rem",
  borderRadius: "0.6rem",
  cursor: "pointer",
  color: "#111827",
  fontWeight: 600,
};

const selectStyle: CSSProperties = {
  borderRadius: "0.55rem",
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  padding: "0.5rem 0.65rem",
  fontSize: "1.1rem",
};
