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

  function updateCreatePermission(moduleName: string, key: keyof PermissionRow, value: boolean) {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.module === moduleName ? { ...permission, [key]: value } : permission
      )
    );
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

  const inputClass = "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="border-b border-[#E5E5E5] pb-4 mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <h1 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Manage Platform Users</h1>
          <p className="mt-1 text-sm text-[#707072]">
            View, edit, and create users from one workspace. Select a user to update email, role, CNIC, profile details, and tenant permissions.
          </p>
        </div>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p> : null}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

          {/* User list */}
          <section className="space-y-4 rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black tracking-tight text-[#111111]">All Users</h2>
                <p className="text-[10px] font-medium text-[#707072]">Search and select any account to edit it.</p>
              </div>
              <button
                type="button"
                onClick={() => void loadUsers()}
                className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search email, CNIC, city, blood group"
                className={inputClass}
              />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "all" | Role)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              >
                <option value="all">All roles</option>
                <option value="user">user</option>
                <option value="tenant">tenant</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="max-h-[68vh] space-y-1 overflow-y-auto pr-1">
              {isLoading ? (
                <p className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 text-sm text-[#707072]">Loading users...</p>
              ) : null}

              {!isLoading && !filteredUsers.length ? (
                <p className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 text-sm text-[#707072]">No users match the current filters.</p>
              ) : null}

              {filteredUsers.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <button
                    type="button"
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                      isSelected
                        ? "bg-[#111111] text-white"
                        : "hover:bg-[#f3f3ee]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-black tracking-tight ${isSelected ? "text-white" : "text-[#111111]"}`}>
                          {user.email}
                        </p>
                        <p className={`mt-0.5 text-[10px] font-medium ${isSelected ? "text-white/70" : "text-[#707072]"}`}>
                          {user.city || "No city"} · {user.bloodGroup || "—"} · CNIC {user.cnic || "n/a"}
                        </p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        isSelected ? "bg-white/10 text-white" : "bg-[#f3f3ee] text-[#707072]"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Editor */}
          <section className="space-y-5 rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E5E5] pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Edit User</p>
                <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">
                  {selectedUser ? selectedUser.email : "Select a user"}
                </h2>
                {selectedUser ? (
                  <p className="text-xs font-medium text-[#707072]">
                    Created {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(new Date(selectedUser.createdAt))}
                  </p>
                ) : null}
              </div>
              {selectedUser ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-[#f3f3ee] text-[#707072]">
                  {selectedUser.role}
                </span>
              ) : null}
            </div>

            {selectedUser ? (
              <form onSubmit={handleUpdateUser} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={editor.email}
                    onChange={(event) => setEditor((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    value={editor.role}
                    onChange={(event) =>
                      setEditor((prev) => ({
                        ...prev,
                        role: event.target.value as Role,
                      }))
                    }
                    className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  >
                    <option value="user">user</option>
                    <option value="tenant">tenant</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>CNIC</label>
                  <input
                    value={editor.cnic}
                    onChange={(event) => setEditor((prev) => ({ ...prev, cnic: event.target.value }))}
                    placeholder="12345-1234567-1"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    value={editor.phone}
                    onChange={(event) => setEditor((prev) => ({ ...prev, phone: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <input
                    value={editor.city}
                    onChange={(event) => setEditor((prev) => ({ ...prev, city: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Blood Group</label>
                  <input
                    value={editor.bloodGroup}
                    onChange={(event) => setEditor((prev) => ({ ...prev, bloodGroup: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Availability</label>
                  <select
                    value={editor.availabilityStatus}
                    onChange={(event) =>
                      setEditor((prev) => ({
                        ...prev,
                        availabilityStatus: event.target.value as "available" | "unavailable",
                      }))
                    }
                    className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  >
                    <option value="available">available</option>
                    <option value="unavailable">unavailable</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Last Donation Date</label>
                  <input
                    type="date"
                    value={editor.lastDonationDate}
                    onChange={(event) => setEditor((prev) => ({ ...prev, lastDonationDate: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    type="date"
                    value={editor.dateOfBirth}
                    onChange={(event) => setEditor((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Emergency Contact</label>
                  <input
                    value={editor.emergencyContact}
                    onChange={(event) => setEditor((prev) => ({ ...prev, emergencyContact: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <input
                    value={editor.gender}
                    onChange={(event) => setEditor((prev) => ({ ...prev, gender: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Address</label>
                  <input
                    value={editor.address}
                    onChange={(event) => setEditor((prev) => ({ ...prev, address: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Profile Image URL</label>
                  <input
                    value={editor.profileImage}
                    onChange={(event) => setEditor((prev) => ({ ...prev, profileImage: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Allergies</label>
                  <textarea
                    value={editor.allergies}
                    onChange={(event) => setEditor((prev) => ({ ...prev, allergies: event.target.value }))}
                    rows={2}
                    className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Medical History</label>
                  <textarea
                    value={editor.medicalHistory}
                    onChange={(event) => setEditor((prev) => ({ ...prev, medicalHistory: event.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  />
                </div>

                <div>
                  <label className={labelClass}>Occupation</label>
                  <input
                    value={editor.occupation}
                    onChange={(event) => setEditor((prev) => ({ ...prev, occupation: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Marital Status</label>
                  <input
                    value={editor.maritalStatus}
                    onChange={(event) => setEditor((prev) => ({ ...prev, maritalStatus: event.target.value }))}
                    className={inputClass}
                  />
                </div>

                {editor.role === "tenant" ? (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] mb-3">Tenant Permissions</p>
                    <div className="rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee] p-4 space-y-3">
                      {editor.permissions.map((permission) => (
                        <div key={permission.module} className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-3">
                          <p className="text-sm font-black tracking-tight text-[#111111]">{permission.module}</p>
                          <div className="mt-2 flex flex-wrap gap-4">
                            <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
                              <input
                                type="checkbox"
                                checked={permission.can_view}
                                onChange={(event) => updatePermission(permission.module, "can_view", event.target.checked)}
                              />
                              view
                            </label>
                            <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
                              <input
                                type="checkbox"
                                checked={permission.can_edit}
                                onChange={(event) => updatePermission(permission.module, "can_edit", event.target.checked)}
                              />
                              edit
                            </label>
                            <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
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
                    className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditor(createEditorState(selectedUser))}
                    disabled={isDeleting}
                    className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                  >
                    Reset Edits
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteUser()}
                    disabled={isDeleting || isSaving}
                    className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete User"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-[#f3f3ee] p-6 text-sm text-[#707072]">
                Choose a user from the list to edit their account and profile data.
              </div>
            )}
          </section>
        </div>

        {/* Create User */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
          <div className="border-b border-[#E5E5E5] pb-4 mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Create User</p>
            <h2 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Add New Platform Accounts</h2>
            <p className="mt-1 text-sm text-[#707072]">Use this when creating new admin, tenant, or user records.</p>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Role</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              >
                <option value="user">user</option>
                <option value="tenant">tenant</option>
                <option value="admin">admin</option>
              </select>
            </div>

            {role === "tenant" ? (
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] mb-3">Tenant Permissions</p>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.module} className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-3">
                      <p className="text-sm font-black tracking-tight text-[#111111]">{permission.module}</p>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
                          <input
                            type="checkbox"
                            checked={permission.can_view}
                            onChange={(event) => updateCreatePermission(permission.module, "can_view", event.target.checked)}
                          />
                          view
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
                          <input
                            type="checkbox"
                            checked={permission.can_edit}
                            onChange={(event) => updateCreatePermission(permission.module, "can_edit", event.target.checked)}
                          />
                          edit
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#707072]">
                          <input
                            type="checkbox"
                            checked={permission.can_manage}
                            onChange={(event) => updateCreatePermission(permission.module, "can_manage", event.target.checked)}
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
                className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </section>

      </section>
    </div>
  );
}
