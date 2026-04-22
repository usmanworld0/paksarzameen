"use client";

import { useEffect, useMemo, useState } from "react";
import type { DogRecord, DogStatus } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type DogFormState = {
  name: string;
  breed: string;
  age: string;
  gender: string;
  city: string;
  area: string;
  description: string;
  status: DogStatus;
  imageUrl: string;
  imageFile: File | null;
};

const INITIAL_FORM: DogFormState = {
  name: "",
  breed: "",
  age: "",
  gender: "",
  city: "",
  area: "",
  description: "",
  status: "available",
  imageUrl: "",
  imageFile: null,
};

export function AdminDogsPanel() {
  const { session } = useAdminClientSession();
  const [dogs, setDogs] = useState<DogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [form, setForm] = useState<DogFormState>(INITIAL_FORM);

  async function loadDogs() {
    setLoading(true);
    setError(null);

    try {
      const response = await adminFetch("/api/admin/dogs", { cache: "no-store" });
      const payload = (await response.json()) as { data?: DogRecord[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load dogs.");
      }

      setDogs(payload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load dogs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDogs();
  }, []);

  const quickLinks = useMemo(
    () =>
      [
        { href: "/admin", label: "Control Center" },
        { href: "/admin/adoption-requests", label: "Adoption Requests" },
        { href: "/admin/dog-updates", label: "Dog Updates" },
        { href: "/admin/blood-requests", label: "Blood Requests" },
      ].filter((item) => canAccessAdminRoute(session, item.href)),
    [session]
  );

  const editingDog = useMemo(
    () => dogs.find((dog) => dog.dogId === editingDogId) ?? null,
    [dogs, editingDogId]
  );

  useEffect(() => {
    if (!editingDog) return;
    setForm({
      name: editingDog.name,
      breed: editingDog.breed,
      age: editingDog.age,
      gender: editingDog.gender,
      description: editingDog.description,
      status: editingDog.status,
      city: editingDog.city ?? "",
      area: editingDog.area ?? "",
      imageUrl: editingDog.imageUrl,
      imageFile: null,
    });
  }, [editingDog]);

  function resetForm() {
    setEditingDogId(null);
    setForm(INITIAL_FORM);
  }

  async function saveDog() {
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("breed", form.breed);
      formData.set("age", form.age);
      formData.set("gender", form.gender);
      formData.set("description", form.description);
      formData.set("status", form.status);
      formData.set("city", form.city);
      formData.set("area", form.area);
      formData.set("imageUrl", form.imageUrl);
      if (form.imageFile) {
        formData.set("image", form.imageFile);
      }

      const target = editingDogId ? `/api/admin/dogs/${editingDogId}` : "/api/admin/dogs";
      const method = editingDogId ? "PATCH" : "POST";

      const response = await adminFetch(target, {
        method,
        body: formData,
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save dog.");
      }

      await loadDogs();
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save dog.");
    } finally {
      setSaving(false);
    }
  }

  async function removeDog(dogId: string) {
    const proceed = window.confirm("Delete this dog? This also removes related requests and updates.");
    if (!proceed) return;

    setError(null);

    try {
      const response = await adminFetch(`/api/admin/dogs/${dogId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete dog.");
      }

      await loadDogs();
      if (editingDogId === dogId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete dog.");
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fcf7_0%,_#eef6ef_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/10 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Admin · Manage Dogs</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Add, edit, delete dog profiles, upload images, and keep adoption status current.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {quickLinks.map((item) => (
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

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{editingDogId ? "Edit Dog" : "Add New Dog"}</h2>
            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Breed"
                value={form.breed}
                onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Age"
                  value={form.age}
                  onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                />
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Gender"
                  value={form.gender}
                  onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="City"
                  value={form.city}
                  onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                />
                <input
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Area"
                  value={form.area}
                  onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value }))}
                />
              </div>
              <textarea
                className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Description"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as DogStatus }))}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Image URL (optional, otherwise a default placeholder is used)"
                value={form.imageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    imageFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveDog()}
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
              >
                {saving ? "Saving..." : editingDogId ? "Update Dog" : "Add Dog"}
              </button>
              {editingDogId ? (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Dogs</h2>
            {loading ? <p className="mt-3 text-sm text-slate-600">Loading dogs...</p> : null}
            {!loading && !dogs.length ? (
              <p className="mt-3 text-sm text-slate-600">No dogs found.</p>
            ) : null}
            <div className="mt-4 space-y-3">
              {dogs.map((dog) => (
                <article key={dog.dogId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{dog.name}</h3>
                      <p className="text-xs text-slate-600">{dog.breed} • {dog.age} • {dog.gender}</p>
                      <p className="text-xs text-slate-600">{dog.city ?? ""}{dog.city && dog.area ? ", " : ""}{dog.area ?? ""}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-emerald-700">{dog.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingDogId(dog.dogId)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeDog(dog.dogId)}
                        className="rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
