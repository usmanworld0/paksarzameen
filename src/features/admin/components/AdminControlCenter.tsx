"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowDownUp,
  FileSpreadsheet,
  RefreshCcw,
  Search,
  Users,
} from "lucide-react";
import { useEffect } from "react";

type Role = "admin" | "tenant" | "user";

type PermissionRow = {
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

const DEFAULT_TENANT_PERMISSIONS: PermissionRow[] = [
  { module: "dog_adoption", can_view: true, can_edit: false, can_manage: false },
  { module: "blood_bank", can_view: true, can_edit: false, can_manage: false },
  { module: "healthcare", can_view: true, can_edit: false, can_manage: false },
];

const MODULE_LINKS = [
  {
    title: "HealthCare",
    description: "Manage doctors, schedules, and appointment workflows.",
    href: "/admin/healthcare",
  },
  {
    title: "Blood Donation Requests",
    description: "Track emergency requests and update status transitions.",
    href: "/admin/blood-requests",
  },
  {
    title: "Dogs Management",
    description: "Create and update dog profiles for adoption flow.",
    href: "/admin/dogs",
  },
  {
    title: "Adoption Requests",
    description: "Approve and reject adoption requests.",
    href: "/admin/adoption-requests",
  },
  {
    title: "Dog Post-Adoption Updates",
    description: "Upload post-adoption image updates and stories.",
    href: "/admin/dog-updates",
  },
  {
    title: "User Management",
    description: "Open full-screen user management workspace.",
    href: "/admin/users",
  },
];

type BloodRequestRow = {
  id: string;
  name: string;
  location: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  neededAt: string;
  createdAt: string;
};

type DogRow = {
  dogId: string;
  name: string;
  breed: string;
  status: "available" | "pending" | "adopted";
  city: string | null;
  createdAt: string;
};

type AdoptionRow = {
  requestId: string;
  dogName: string;
  userEmail: string | null;
  userName: string | null;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
};

type UserDirectoryRow = {
  id: string;
  email: string;
  role: "admin" | "tenant" | "user";
  city: string;
  bloodGroup: string;
  availabilityStatus: string;
  modules: Array<{ module: string; canView: boolean; canEdit: boolean; canManage: boolean }>;
  createdAt: string;
};

type OperationRow = {
  id: string;
  module: "blood" | "adoption" | "dogs";
  title: string;
  owner: string;
  location: string;
  status: string;
  createdAt: string;
};

type HealthcareAnalytics = {
  doctorsTotal: number;
  activePatientsTotal: number;
  appointmentsTotal: number;
  donorChatMessagesTotal: number;
  appointmentMessagesTotal: number;
  suspendedUsersTotal: number;
  appointmentsByStatus: Record<string, number>;
  appointmentCountsByDay: Record<string, number>;
  appointmentCountsByMonth: Record<string, number>;
  appointmentCountsByYear: Record<string, number>;
  appointmentsByDoctor: Record<string, number>;
};

type TimeSeriesPoint = {
  label: string;
  blood: number;
  adoption: number;
  users: number;
};

function toDateOnly(isoValue: string) {
  return new Date(isoValue).toISOString().slice(0, 10);
}

function makeLast7DaysLabels() {
  const labels: string[] = [];
  const now = new Date();
  for (let index = 6; index >= 0; index -= 1) {
    const next = new Date(now);
    next.setDate(now.getDate() - index);
    labels.push(next.toISOString().slice(0, 10));
  }
  return labels;
}

function buildPolyline(points: number[], maxValue: number) {
  return points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 90 - (value / Math.max(maxValue, 1)) * 80;
      return `${x},${y}`;
    })
    .join(" ");
}

function toMonthKey(isoValue: string) {
  return toDateOnly(isoValue).slice(0, 7);
}

function toYearKey(isoValue: string) {
  return toDateOnly(isoValue).slice(0, 4);
}

function aggregateCountsByPeriod(
  rows: Array<{ date: string; status: string }>,
  keySelector: (isoDate: string) => string
) {
  const counters = new Map<string, { total: number; pending: number; approved: number; completed: number; rejected: number; cancelled: number; inProgress: number }>();

  for (const row of rows) {
    const key = keySelector(row.date);
    const current = counters.get(key) ?? {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
      inProgress: 0,
    };

    current.total += 1;
    const status = row.status.toLowerCase();
    if (status === "pending") current.pending += 1;
    if (status === "approved") current.approved += 1;
    if (status === "completed") current.completed += 1;
    if (status === "rejected") current.rejected += 1;
    if (status === "cancelled") current.cancelled += 1;
    if (status === "in_progress") current.inProgress += 1;
    counters.set(key, current);
  }

  return Array.from(counters.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([period, values]) => ({ period, ...values }));
}

function StatusBar({ label, value, total, colorClass }: { label: string; value: number; total: number; colorClass: string }) {
  const width = total > 0 ? Math.max(6, Math.round((value / total) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function ActivityChart({ data }: { data: TimeSeriesPoint[] }) {
  const blood = data.map((point) => point.blood);
  const adoption = data.map((point) => point.adoption);
  const users = data.map((point) => point.users);
  const maxValue = Math.max(1, ...blood, ...adoption, ...users);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">7 Day Activity</h3>
        <span className="text-xs text-slate-500">Blood, Adoption, Users</span>
      </div>

      <svg viewBox="0 0 100 100" className="mt-4 h-48 w-full rounded-xl bg-slate-50 p-2" role="img" aria-label="Activity trend chart">
        <polyline fill="none" stroke="#ef4444" strokeWidth="1.8" points={buildPolyline(blood, maxValue)} />
        <polyline fill="none" stroke="#3b82f6" strokeWidth="1.8" points={buildPolyline(adoption, maxValue)} />
        <polyline fill="none" stroke="#059669" strokeWidth="1.8" points={buildPolyline(users, maxValue)} />
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
        <div className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />Blood</div>
        <div className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" />Adoption</div>
        <div className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600" />Users</div>
      </div>
    </div>
  );
}

export function AdminControlCenter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("tenant");
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_TENANT_PERMISSIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bloodRequests, setBloodRequests] = useState<BloodRequestRow[]>([]);
  const [dogs, setDogs] = useState<DogRow[]>([]);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRow[]>([]);
  const [healthcareAnalytics, setHealthcareAnalytics] = useState<HealthcareAnalytics | null>(null);
  const [users, setUsers] = useState<UserDirectoryRow[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [opsSearch, setOpsSearch] = useState("");
  const [opsStatus, setOpsStatus] = useState("all");
  const [opsModule, setOpsModule] = useState<"all" | "blood" | "adoption" | "dogs">("all");
  const [opsSort, setOpsSort] = useState<"latest" | "oldest" | "status">("latest");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "admin" | "tenant" | "user">("all");
  const [userSort, setUserSort] = useState<"latest" | "oldest" | "email">("latest");

  async function loadDashboardAnalytics() {
    setIsLoadingAnalytics(true);
    setAnalyticsError(null);

    try {
      const [bloodRes, dogsRes, adoptionRes, usersRes, healthcareRes] = await Promise.all([
        fetch("/api/admin/blood-requests", { credentials: "include" }),
        fetch("/api/admin/dogs", { credentials: "include" }),
        fetch("/api/admin/adoption-requests", { credentials: "include" }),
        fetch("/api/admin/users?limit=500", { credentials: "include" }),
        fetch("/api/admin/healthcare/analytics", { credentials: "include" }),
      ]);

      const [bloodPayload, dogsPayload, adoptionPayload, usersPayload, healthcarePayload] = await Promise.all([
        bloodRes.json() as Promise<{ data?: BloodRequestRow[]; error?: string }>,
        dogsRes.json() as Promise<{ data?: DogRow[]; error?: string }>,
        adoptionRes.json() as Promise<{ data?: AdoptionRow[]; error?: string }>,
        usersRes.json() as Promise<{ data?: UserDirectoryRow[]; error?: string }>,
        healthcareRes.json() as Promise<{ data?: HealthcareAnalytics; error?: string }>,
      ]);

      if (!bloodRes.ok || !dogsRes.ok || !adoptionRes.ok || !usersRes.ok || !healthcareRes.ok) {
        throw new Error(
          bloodPayload.error ??
            dogsPayload.error ??
            adoptionPayload.error ??
            usersPayload.error ??
            healthcarePayload.error ??
            "Failed to load admin analytics."
        );
      }

      setBloodRequests(bloodPayload.data ?? []);
      setDogs(dogsPayload.data ?? []);
      setAdoptionRequests(adoptionPayload.data ?? []);
      setUsers(usersPayload.data ?? []);
      setHealthcareAnalytics(healthcarePayload.data ?? null);
    } catch (loadError) {
      setAnalyticsError(loadError instanceof Error ? loadError.message : "Failed to load dashboard insights.");
    } finally {
      setIsLoadingAnalytics(false);
    }
  }

  useEffect(() => {
    void loadDashboardAnalytics();
  }, []);

  const operationRows = useMemo<OperationRow[]>(() => {
    const bloodOps: OperationRow[] = bloodRequests.map((row) => ({
      id: row.id,
      module: "blood",
      title: `${row.name} request`,
      owner: row.name,
      location: row.location,
      status: row.status,
      createdAt: row.createdAt,
    }));

    const adoptionOps: OperationRow[] = adoptionRequests.map((row) => ({
      id: row.requestId,
      module: "adoption",
      title: `${row.dogName} adoption`,
      owner: row.userEmail ?? row.userName ?? "Unknown",
      location: "-",
      status: row.status,
      createdAt: row.requestedAt,
    }));

    const dogOps: OperationRow[] = dogs.map((row) => ({
      id: row.dogId,
      module: "dogs",
      title: row.name,
      owner: row.breed,
      location: row.city ?? "-",
      status: row.status,
      createdAt: row.createdAt,
    }));

    return [...bloodOps, ...adoptionOps, ...dogOps];
  }, [bloodRequests, adoptionRequests, dogs]);

  const filteredOperationRows = useMemo(() => {
    const query = opsSearch.trim().toLowerCase();
    const rows = operationRows.filter((row) => {
      if (opsModule !== "all" && row.module !== opsModule) return false;
      if (opsStatus !== "all" && row.status !== opsStatus) return false;
      if (!query) return true;
      return (
        row.title.toLowerCase().includes(query) ||
        row.owner.toLowerCase().includes(query) ||
        row.location.toLowerCase().includes(query)
      );
    });

    return rows.sort((left, right) => {
      if (opsSort === "status") {
        return left.status.localeCompare(right.status);
      }

      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return opsSort === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [operationRows, opsModule, opsSearch, opsSort, opsStatus]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    const rows = users.filter((row) => {
      if (userRoleFilter !== "all" && row.role !== userRoleFilter) return false;
      if (!query) return true;
      return (
        row.email.toLowerCase().includes(query) ||
        row.city.toLowerCase().includes(query) ||
        row.bloodGroup.toLowerCase().includes(query)
      );
    });

    return rows.sort((left, right) => {
      if (userSort === "email") return left.email.localeCompare(right.email);
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return userSort === "oldest" ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [users, userRoleFilter, userSearch, userSort]);

  const statusSummary = useMemo(() => {
    const blood = {
      pending: bloodRequests.filter((item) => item.status === "pending").length,
      inProgress: bloodRequests.filter((item) => item.status === "in_progress").length,
      completed: bloodRequests.filter((item) => item.status === "completed").length,
      cancelled: bloodRequests.filter((item) => item.status === "cancelled").length,
    };

    const adoption = {
      pending: adoptionRequests.filter((item) => item.status === "pending").length,
      approved: adoptionRequests.filter((item) => item.status === "approved").length,
      rejected: adoptionRequests.filter((item) => item.status === "rejected").length,
    };

    const dogsStatus = {
      available: dogs.filter((item) => item.status === "available").length,
      pending: dogs.filter((item) => item.status === "pending").length,
      adopted: dogs.filter((item) => item.status === "adopted").length,
    };

    return { blood, adoption, dogsStatus };
  }, [bloodRequests, adoptionRequests, dogs]);

  const metrics = useMemo(() => {
    const pendingOps = filteredOperationRows.filter((row) => row.status.includes("pending")).length;
    return {
      totalUsers: users.length,
      activeUsers: users.filter((row) => row.availabilityStatus === "available").length,
      bloodRequests: bloodRequests.length,
      adoptionRequests: adoptionRequests.length,
      availableDogs: dogs.filter((row) => row.status === "available").length,
      pendingOps,
    };
  }, [users, bloodRequests, adoptionRequests, dogs, filteredOperationRows]);

  const timeSeries = useMemo<TimeSeriesPoint[]>(() => {
    const labels = makeLast7DaysLabels();
    const bloodByDay = new Map<string, number>();
    const adoptionByDay = new Map<string, number>();
    const usersByDay = new Map<string, number>();

    for (const row of bloodRequests) {
      const key = toDateOnly(row.createdAt);
      bloodByDay.set(key, (bloodByDay.get(key) ?? 0) + 1);
    }

    for (const row of adoptionRequests) {
      const key = toDateOnly(row.requestedAt);
      adoptionByDay.set(key, (adoptionByDay.get(key) ?? 0) + 1);
    }

    for (const row of users) {
      const key = toDateOnly(row.createdAt);
      usersByDay.set(key, (usersByDay.get(key) ?? 0) + 1);
    }

    return labels.map((label) => ({
      label,
      blood: bloodByDay.get(label) ?? 0,
      adoption: adoptionByDay.get(label) ?? 0,
      users: usersByDay.get(label) ?? 0,
    }));
  }, [bloodRequests, adoptionRequests, users]);

  function updatePermission(moduleName: string, key: keyof PermissionRow, value: boolean) {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.module === moduleName ? { ...permission, [key]: value } : permission
      )
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role,
          permissions: role === "tenant" ? permissions : [],
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        data?: {
          id: string;
          email: string;
          role: string;
        };
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Unable to create user.");
      }

      setSuccess(`Created ${payload.data.role} account: ${payload.data.email}`);
      setEmail("");
      setPassword("");
      setRole("tenant");
      setPermissions(DEFAULT_TENANT_PERMISSIONS);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/admin/login";
    }
  }

  async function exportStatsAsExcel() {
    setError(null);
    setSuccess(null);
    setIsExporting(true);

    try {
      const [{ utils, writeFile }] = await Promise.all([import("xlsx")]);

      const bloodRows = bloodRequests.map((row) => ({ date: row.createdAt, status: row.status }));
      const adoptionRows = adoptionRequests.map((row) => ({ date: row.requestedAt, status: row.status }));

      const bloodDaily = aggregateCountsByPeriod(bloodRows, toDateOnly);
      const bloodMonthly = aggregateCountsByPeriod(bloodRows, toMonthKey);
      const bloodYearly = aggregateCountsByPeriod(bloodRows, toYearKey);

      const adoptionDaily = aggregateCountsByPeriod(adoptionRows, toDateOnly);
      const adoptionMonthly = aggregateCountsByPeriod(adoptionRows, toMonthKey);
      const adoptionYearly = aggregateCountsByPeriod(adoptionRows, toYearKey);

      const healthcareDaily = Object.entries(healthcareAnalytics?.appointmentCountsByDay ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([period, total]) => ({ period, total }));
      const healthcareMonthly = Object.entries(healthcareAnalytics?.appointmentCountsByMonth ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([period, total]) => ({ period, total }));
      const healthcareYearly = Object.entries(healthcareAnalytics?.appointmentCountsByYear ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([period, total]) => ({ period, total }));
      const healthcareByDoctor = Object.entries(healthcareAnalytics?.appointmentsByDoctor ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([doctorId, totalAppointments]) => ({ doctorId, totalAppointments }));

      const healthcareByStatus = Object.entries(healthcareAnalytics?.appointmentsByStatus ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([status, total]) => ({ status, total }));

      const summarySheet = utils.json_to_sheet([
        {
          generatedAt: new Date().toISOString(),
          bloodRequestsTotal: bloodRequests.length,
          adoptionRequestsTotal: adoptionRequests.length,
          healthcareAppointmentsTotal: healthcareAnalytics?.appointmentsTotal ?? 0,
          healthcareDoctorsTotal: healthcareAnalytics?.doctorsTotal ?? 0,
          healthcareActivePatientsTotal: healthcareAnalytics?.activePatientsTotal ?? 0,
          healthcareSuspendedUsersTotal: healthcareAnalytics?.suspendedUsersTotal ?? 0,
        },
      ]);

      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, summarySheet, "Summary");
      utils.book_append_sheet(workbook, utils.json_to_sheet(bloodDaily), "Blood Daily");
      utils.book_append_sheet(workbook, utils.json_to_sheet(bloodMonthly), "Blood Monthly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(bloodYearly), "Blood Yearly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(adoptionDaily), "Adoption Daily");
      utils.book_append_sheet(workbook, utils.json_to_sheet(adoptionMonthly), "Adoption Monthly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(adoptionYearly), "Adoption Yearly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(healthcareDaily), "Appointments Daily");
      utils.book_append_sheet(workbook, utils.json_to_sheet(healthcareMonthly), "Appointments Monthly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(healthcareYearly), "Appointments Yearly");
      utils.book_append_sheet(workbook, utils.json_to_sheet(healthcareByStatus), "Appointments Status");
      utils.book_append_sheet(workbook, utils.json_to_sheet(healthcareByDoctor), "Appointments Doctor");

      const fileDate = new Date().toISOString().slice(0, 10);
      writeFile(workbook, `psz-admin-stats-${fileDate}.xlsx`);
      setSuccess("Excel export generated successfully.");
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Failed to export stats Excel.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4faf5_0%,#eaf3ec_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_25px_70px_rgba(4,45,29,0.12)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin Panel</p>
              <h1 className="mt-2 text-3xl font-semibold text-emerald-950 sm:text-4xl">Control Center</h1>
              <p className="mt-2 max-w-3xl text-sm text-emerald-900/80 sm:text-base">
                Manage tenant onboarding, assign module permissions, and operate dogs adoption and blood donation modules from one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void exportStatsAsExcel()}
                disabled={isExporting || isLoadingAnalytics}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export Stats (Excel)"}
              </button>
              <button
                type="button"
                onClick={() => void logout()}
                disabled={isLoggingOut}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total Platform Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.totalUsers}</p>
            <p className="mt-1 text-sm text-emerald-700">Available donors: {metrics.activeUsers}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Blood & Adoption Queue</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.bloodRequests + metrics.adoptionRequests}</p>
            <p className="mt-1 text-sm text-amber-700">Pending operations: {metrics.pendingOps}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Dog Inventory</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{dogs.length}</p>
            <p className="mt-1 text-sm text-blue-700">Available dogs: {metrics.availableDogs}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ActivityChart data={timeSeries} />

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Status Distribution</h3>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-700">Blood Requests</p>
                <div className="space-y-2">
                  <StatusBar label="Pending" value={statusSummary.blood.pending} total={Math.max(1, bloodRequests.length)} colorClass="bg-red-500" />
                  <StatusBar label="In Progress" value={statusSummary.blood.inProgress} total={Math.max(1, bloodRequests.length)} colorClass="bg-amber-500" />
                  <StatusBar label="Completed" value={statusSummary.blood.completed} total={Math.max(1, bloodRequests.length)} colorClass="bg-emerald-600" />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Adoption Requests</p>
                <div className="space-y-2">
                  <StatusBar label="Pending" value={statusSummary.adoption.pending} total={Math.max(1, adoptionRequests.length)} colorClass="bg-blue-400" />
                  <StatusBar label="Approved" value={statusSummary.adoption.approved} total={Math.max(1, adoptionRequests.length)} colorClass="bg-emerald-600" />
                  <StatusBar label="Rejected" value={statusSummary.adoption.rejected} total={Math.max(1, adoptionRequests.length)} colorClass="bg-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operations Workspace</p>
              <h2 className="text-xl font-semibold text-slate-900">Live queue with filters and sorting</h2>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboardAnalytics()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={opsSearch}
                onChange={(event) => setOpsSearch(event.target.value)}
                placeholder="Search title, owner, location"
                className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <select
              value={opsModule}
              onChange={(event) => setOpsModule(event.target.value as "all" | "blood" | "adoption" | "dogs")}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All modules</option>
              <option value="blood">Blood</option>
              <option value="adoption">Adoption</option>
              <option value="dogs">Dogs</option>
            </select>

            <select
              value={opsStatus}
              onChange={(event) => setOpsStatus(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All statuses</option>
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="available">available</option>
              <option value="adopted">adopted</option>
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{filteredOperationRows.length} records</span>
            <label className="inline-flex items-center gap-2">
              <ArrowDownUp className="h-3.5 w-3.5" />
              <select
                value={opsSort}
                onChange={(event) => setOpsSort(event.target.value as "latest" | "oldest" | "status")}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              >
                <option value="latest">Latest first</option>
                <option value="oldest">Oldest first</option>
                <option value="status">Status A-Z</option>
              </select>
            </label>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Module</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperationRows.slice(0, 14).map((row) => (
                  <tr key={`${row.module}-${row.id}`} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-700">{row.module}</td>
                    <td className="px-3 py-2 text-slate-900">{row.title}</td>
                    <td className="px-3 py-2 text-slate-700">{row.owner}</td>
                    <td className="px-3 py-2 text-slate-600">{row.location}</td>
                    <td className="px-3 py-2"><span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs">{row.status}</span></td>
                    <td className="px-3 py-2 text-slate-500">{new Date(row.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Users className="h-4 w-4 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-900">User Directory</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{filteredUsers.length}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search users by email, city, blood group"
                className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <select
              value={userRoleFilter}
              onChange={(event) => setUserRoleFilter(event.target.value as "all" | "admin" | "tenant" | "user")}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All roles</option>
              <option value="admin">admin</option>
              <option value="tenant">tenant</option>
              <option value="user">user</option>
            </select>

            <select
              value={userSort}
              onChange={(event) => setUserSort(event.target.value as "latest" | "oldest" | "email")}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="latest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="email">Email A-Z</option>
            </select>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Blood</th>
                  <th className="px-3 py-2">Modules</th>
                  <th className="px-3 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.slice(0, 12).map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-900">{row.email}</td>
                    <td className="px-3 py-2"><span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs">{row.role}</span></td>
                    <td className="px-3 py-2 text-slate-700">{row.city || "-"}</td>
                    <td className="px-3 py-2 text-slate-700">{row.bloodGroup || "-"}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {row.modules.length ? row.modules.map((module) => module.module).join(", ") : "-"}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {isLoadingAnalytics ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading professional dashboard insights...</section>
        ) : null}
        {analyticsError ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{analyticsError}</section>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULE_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <p className="mt-4 text-sm font-semibold text-emerald-700">Open module →</p>
            </a>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Tenant Access</p>
            <h2 className="mt-2 text-2xl font-semibold text-emerald-950">Create Admin, Tenant, and User Accounts</h2>
            <p className="mt-2 text-sm text-emerald-900/80">
              Use this form to onboard new accounts and assign tenant-level module permissions.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-emerald-950">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="user@example.com"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-emerald-950">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Minimum 8 characters"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-emerald-950">Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              >
                <option value="tenant">tenant</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </label>

            {role === "tenant" ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Tenant Permissions</h3>
                <div className="mt-4 space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.module} className="rounded-xl border border-emerald-100 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-emerald-950">{permission.module}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-emerald-900">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={permission.can_view}
                            onChange={(event) =>
                              updatePermission(permission.module, "can_view", event.target.checked)
                            }
                          />
                          view
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={permission.can_edit}
                            onChange={(event) =>
                              updatePermission(permission.module, "can_edit", event.target.checked)
                            }
                          />
                          edit
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={permission.can_manage}
                            onChange={(event) =>
                              updatePermission(permission.module, "can_manage", event.target.checked)
                            }
                          />
                          manage
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
              <a href="/admin/users" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                Open full user workspace
              </a>
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>
            ) : null}
          </form>
        </section>
      </section>
    </main>
  );
}
