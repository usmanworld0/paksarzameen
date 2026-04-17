"use client";

import { FormEvent, useState } from "react";

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

export function AdminControlCenter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("tenant");
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_TENANT_PERMISSIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
            <button
              type="button"
              onClick={() => void logout()}
              disabled={isLoggingOut}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </header>

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
