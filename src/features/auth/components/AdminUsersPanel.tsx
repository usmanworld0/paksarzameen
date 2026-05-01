"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Role = "admin" | "tenant" | "user";

type PermissionRow = {
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_manage: boolean;
};

type UserDirectoryRow = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  cnic: string;
  phone: string;
  city: string;
  bloodGroup: string;
  availabilityStatus: string;
  profileImage: string;
  lastDonationDate: string;
  emergencyContact: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  allergies: string;
  medicalHistory: string;
  occupation: string;
  maritalStatus: string;
  modules: Array<{ module: string; canView: boolean; canEdit: boolean; canManage: boolean }>;
};

type UserEditorState = {
  email: string;
  role: Role;
  cnic: string;
  phone: string;
  city: string;
  bloodGroup: string;
  availabilityStatus: "available" | "unavailable";
  lastDonationDate: string;
  emergencyContact: string;
  profileImage: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  allergies: string;
  medicalHistory: string;
  occupation: string;
  maritalStatus: string;
  permissions: PermissionRow[];
};

type UserPayload = UserDirectoryRow;

const DEFAULT_TENANT_PERMISSIONS: PermissionRow[] = [
  { module: "dog_adoption", can_view: true, can_edit: false, can_manage: false },
  { module: "blood_bank", can_view: true, can_edit: false, can_manage: false },
];

function createEditorState(row: UserDirectoryRow | null): UserEditorState {
  return {
    email: row?.email ?? "",
    role: row?.role ?? "user",
    cnic: row?.cnic ?? "",
    phone: row?.phone ?? "",
    city: row?.city ?? "",
    bloodGroup: row?.bloodGroup ?? "",
    availabilityStatus: row?.availabilityStatus === "available" ? "available" : "unavailable",
    lastDonationDate: row?.lastDonationDate ?? "",
    emergencyContact: row?.emergencyContact ?? "",
    profileImage: row?.profileImage ?? "",
    dateOfBirth: row?.dateOfBirth ?? "",
    gender: row?.gender ?? "",
    address: row?.address ?? "",
    allergies: row?.allergies ?? "",
    medicalHistory: row?.medicalHistory ?? "",
    occupation: row?.occupation ?? "",
    maritalStatus: row?.maritalStatus ?? "",
    permissions:
      row?.modules.length
        ? row.modules.map((permission) => ({
            module: permission.module,
            can_view: permission.canView,
            can_edit: permission.canEdit,
            can_manage: permission.canManage,
          }))
        : DEFAULT_TENANT_PERMISSIONS,
  };
}

export function AdminUsersPanel() {
  const [users, setUsers] = useState<UserDirectoryRow[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editor, setEditor] = useState<UserEditorState>(() => createEditorState(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [permissions, setPermissions] = useState<PermissionRow[]>(DEFAULT_TENANT_PERMISSIONS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadUsers() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users?limit=500", { credentials: "include" });
      const payload = (await response.json()) as { data?: UserPayload[]; error?: string };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Unable to load users.");
      }

      const nextUsers = payload.data.map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        cnic: row.cnic,
        phone: row.phone,
        city: row.city,
        bloodGroup: row.bloodGroup,
        availabilityStatus: row.availabilityStatus,
        profileImage: row.profileImage,
        lastDonationDate: row.lastDonationDate,
        emergencyContact: row.emergencyContact,
        dateOfBirth: row.dateOfBirth,
        gender: row.gender,
        address: row.address,
        allergies: row.allergies,
        medicalHistory: row.medicalHistory,
        occupation: row.occupation,
        maritalStatus: row.maritalStatus,
        modules: row.modules,
      }));

      setUsers(nextUsers);
      setSelectedUserId((currentSelectedId) => {
        if (currentSelectedId && nextUsers.some((user) => user.id === currentSelectedId)) {
          return currentSelectedId;
        }
        return nextUsers[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  useEffect(() => {
    setEditor(createEditorState(selectedUser));
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [user.email, user.city, user.bloodGroup, user.cnic].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [users, search, roleFilter]);

  function updatePermission(moduleName: string, key: keyof PermissionRow, value: boolean) {
    setEditor((prev) => ({
      ...prev,
      permissions: prev.permissions.map((permission) =>
        permission.module === moduleName ? { ...permission, [key]: value } : permission
      ),
    }));
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          role,
          permissions: role === "tenant" ? permissions : [],
        }),
      });

      const payload = (await response.json()) as { error?: string; data?: { id: string; email: string; role: string } };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Unable to create user.");
      }

      setSuccess(`Created ${payload.data.role} user: ${payload.data.email}`);
      setEmail("");
      setPassword("");
      setRole("user");
      setPermissions(DEFAULT_TENANT_PERMISSIONS);
      await loadUsers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create user.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editor),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update user.");
      }

      setSuccess(payload.message ?? "User updated successfully.");
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update user.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete user ${selectedUser.email}? This action cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to delete user.");
      }

      setSuccess(payload.message ?? "User deleted successfully.");
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete user.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6fbf7_0%,#ecf4ee_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_25px_70px_rgba(4,45,29,0.12)] sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin</p>
            <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">Manage Platform Users</h1>
            <p className="text-sm text-emerald-900/75 sm:text-base">
              View, edit, and create users from one workspace. Select a user to update email, role, CNIC, profile details, and tenant permissions.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-4 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-emerald-950">All Users</h2>
                  <p className="text-sm text-emerald-900/70">Search and select any account to edit it.</p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadUsers()}
                  className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  Refresh
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search email, CNIC, city, blood group"
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as "all" | Role)}
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="all">All roles</option>
                  <option value="user">user</option>
                  <option value="tenant">tenant</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="max-h-[68vh] space-y-3 overflow-y-auto pr-1">
                {isLoading ? (
                  <p className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800">Loading users...</p>
                ) : null}

                {!isLoading && !filteredUsers.length ? (
                  <p className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800">No users match the current filters.</p>
                ) : null}

                {filteredUsers.map((user) => {
                  const isSelected = user.id === selectedUserId;
                  return (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-50 shadow-sm"
                          : "border-emerald-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-emerald-950">{user.email}</p>
                          <p className="mt-1 text-xs text-emerald-900/70">
                            {user.city || "No city"} · {user.bloodGroup || "No blood group"} · CNIC {user.cnic || "n/a"}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          {user.role}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_20px_60px_rgba(8,39,24,0.08)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Edit User</p>
                  <h2 className="text-2xl font-semibold text-emerald-950">
                    {selectedUser ? selectedUser.email : "Select a user"}
                  </h2>
                  {selectedUser ? (
                    <p className="text-sm text-emerald-900/70">
                      Created {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(new Date(selectedUser.createdAt))}
                    </p>
                  ) : null}
                </div>
                {selectedUser ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    {selectedUser.role}
                  </span>
                ) : null}
              </div>

              {selectedUser ? (
                <form onSubmit={handleUpdateUser} className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-emerald-950">Email</span>
                    <input
                      type="email"
                      value={editor.email}
                      onChange={(event) => setEditor((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Role</span>
                    <select
                      value={editor.role}
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          role: event.target.value as Role,
                        }))
                      }
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="user">user</option>
                      <option value="tenant">tenant</option>
                      <option value="admin">admin</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">CNIC</span>
                    <input
                      value={editor.cnic}
                      onChange={(event) => setEditor((prev) => ({ ...prev, cnic: event.target.value }))}
                      placeholder="12345-1234567-1"
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Phone</span>
                    <input
                      value={editor.phone}
                      onChange={(event) => setEditor((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">City</span>
                    <input
                      value={editor.city}
                      onChange={(event) => setEditor((prev) => ({ ...prev, city: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Blood group</span>
                    <input
                      value={editor.bloodGroup}
                      onChange={(event) => setEditor((prev) => ({ ...prev, bloodGroup: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Availability</span>
                    <select
                      value={editor.availabilityStatus}
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          availabilityStatus: event.target.value as "available" | "unavailable",
                        }))
                      }
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="available">available</option>
                      <option value="unavailable">unavailable</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Last donation date</span>
                    <input
                      type="date"
                      value={editor.lastDonationDate}
                      onChange={(event) => setEditor((prev) => ({ ...prev, lastDonationDate: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Date of birth</span>
                    <input
                      type="date"
                      value={editor.dateOfBirth}
                      onChange={(event) => setEditor((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Emergency contact</span>
                    <input
                      value={editor.emergencyContact}
                      onChange={(event) => setEditor((prev) => ({ ...prev, emergencyContact: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Gender</span>
                    <input
                      value={editor.gender}
                      onChange={(event) => setEditor((prev) => ({ ...prev, gender: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-emerald-950">Address</span>
                    <input
                      value={editor.address}
                      onChange={(event) => setEditor((prev) => ({ ...prev, address: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-emerald-950">Profile image URL</span>
                    <input
                      value={editor.profileImage}
                      onChange={(event) => setEditor((prev) => ({ ...prev, profileImage: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-emerald-950">Allergies</span>
                    <textarea
                      value={editor.allergies}
                      onChange={(event) => setEditor((prev) => ({ ...prev, allergies: event.target.value }))}
                      rows={2}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-emerald-950">Medical history</span>
                    <textarea
                      value={editor.medicalHistory}
                      onChange={(event) => setEditor((prev) => ({ ...prev, medicalHistory: event.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Occupation</span>
                    <input
                      value={editor.occupation}
                      onChange={(event) => setEditor((prev) => ({ ...prev, occupation: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-emerald-950">Marital status</span>
                    <input
                      value={editor.maritalStatus}
                      onChange={(event) => setEditor((prev) => ({ ...prev, maritalStatus: event.target.value }))}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </label>

                  {editor.role === "tenant" ? (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Tenant Permissions</p>
                      <div className="mt-3 space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                        {editor.permissions.map((permission) => (
                          <div key={permission.module} className="rounded-xl border border-emerald-100 bg-white px-4 py-3">
                            <p className="text-sm font-semibold text-emerald-950">{permission.module}</p>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-emerald-900">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={permission.can_view}
                                  onChange={(event) => updatePermission(permission.module, "can_view", event.target.checked)}
                                />
                                view
                              </label>
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={permission.can_edit}
                                  onChange={(event) => updatePermission(permission.module, "can_edit", event.target.checked)}
                                />
                                edit
                              </label>
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={permission.can_manage}
                                  onChange={(event) => updatePermission(permission.module, "can_manage", event.target.checked)}
                                />
                                manage
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditor(createEditorState(selectedUser))}
                      disabled={isDeleting}
                      className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Reset edits
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteUser()}
                      disabled={isDeleting || isSaving}
                      className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Delete user"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-sm text-emerald-900">
                  Choose a user from the list to edit their account and profile data.
                </div>
              )}
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(8,39,24,0.08)] sm:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Create User</p>
                <h2 className="text-2xl font-semibold text-emerald-950">Add new platform accounts</h2>
              </div>
              <p className="text-sm text-emerald-900/70">Use this when creating new admin, tenant, or user records.</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
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
                      <div key={permission.module} className="rounded-xl border border-emerald-100 bg-white px-4 py-3">
                        <p className="text-sm font-semibold text-emerald-950">{permission.module}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-emerald-900">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permission.can_view}
                              onChange={(event) => updatePermission(permission.module, "can_view", event.target.checked)}
                            />
                            view
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permission.can_edit}
                              onChange={(event) => updatePermission(permission.module, "can_edit", event.target.checked)}
                            />
                            edit
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permission.can_manage}
                              onChange={(event) => updatePermission(permission.module, "can_manage", event.target.checked)}
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
                  disabled={isCreating}
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </section>

          {error ? <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p> : null}
        </div>
      </section>
    </main>
  );
}
