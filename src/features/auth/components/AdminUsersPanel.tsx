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
];

export function AdminUsersPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_TENANT_PERMISSIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        body: JSON.stringify({
          email,
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

      setSuccess(`Created ${payload.data.role} user: ${payload.data.email}`);
      setEmail("");
      setPassword("");
      setRole("user");
      setPermissions(DEFAULT_TENANT_PERMISSIONS);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6fbf7_0%,#ecf4ee_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-4xl rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_25px_70px_rgba(4,45,29,0.12)] sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin</p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">Create Platform Users</h1>
          <p className="text-sm text-emerald-900/75 sm:text-base">
            Create admin, tenant, or user accounts through Supabase Auth and map permissions for tenants.
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
              <option value="user">user</option>
              <option value="tenant">tenant</option>
              <option value="admin">admin</option>
            </select>
          </label>

          {role === "tenant" ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Tenant Permissions</h2>
              <div className="mt-4 space-y-3">
                {permissions.map((permission) => (
                  <div
                    key={permission.module}
                    className="rounded-xl border border-emerald-100 bg-white px-4 py-3"
                  >
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
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
            <a href="/admin" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              Back to control center
            </a>
          </div>

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p> : null}
        </form>
      </section>
    </main>
  );
}
