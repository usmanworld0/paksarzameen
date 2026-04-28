"use client";

import { useEffect, useMemo, useState } from "react";
import type { DogRecord, DogStatus, EarTagGlobalConfigRecord, EarTagImageOption } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

type DogFormState = {
  breed: string;
  color: string;
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
  breed: "",
  color: "",
  age: "",
  gender: "",
  city: "",
  area: "",
  description: "",
  status: "available",
  imageUrl: "",
  imageFile: null,
};

function parseOptionLines(value: string): EarTagImageOption[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titlePart, ...urlParts] = line.split("|");
      const imageUrl = urlParts.join("|").trim();
      const title = titlePart.trim();

      if (!imageUrl) {
        return null;
      }

      return {
        title: title || "Untitled",
        imageUrl,
      } satisfies EarTagImageOption;
    })
    .filter((item): item is EarTagImageOption => Boolean(item));
}

function formatOptionLines(values: EarTagImageOption[]) {
  return values.map((item) => `${item.title} | ${item.imageUrl}`).join("\n");
}

function inferTitleFromFilename(file: File) {
  const value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return value || "Untitled";
}

export function AdminDogsPanel() {
  const { session } = useAdminClientSession();
  const [dogs, setDogs] = useState<DogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [form, setForm] = useState<DogFormState>(INITIAL_FORM);
  const [earTagStyleOptions, setEarTagStyleOptions] = useState<EarTagImageOption[]>([]);
  const [earTagColorOptions, setEarTagColorOptions] = useState<string[]>([]);
  const [earTagBoundaryOptions, setEarTagBoundaryOptions] = useState<EarTagImageOption[]>([]);
  const [earTagStyleFiles, setEarTagStyleFiles] = useState<File[]>([]);
  const [earTagStyleUploadTitles, setEarTagStyleUploadTitles] = useState<string[]>([]);
  const [earTagBoundaryFiles, setEarTagBoundaryFiles] = useState<File[]>([]);
  const [earTagBoundaryUploadTitles, setEarTagBoundaryUploadTitles] = useState<string[]>([]);
  const [earTagSaving, setEarTagSaving] = useState(false);

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

  async function loadEarTagConfig() {
    try {
      const response = await adminFetch("/api/admin/dog-ear-tag-config", { cache: "no-store" });
      const payload = (await response.json()) as { data?: EarTagGlobalConfigRecord; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load ear tag configuration.");
      }

      setEarTagStyleOptions(payload.data?.styleOptions ?? []);
      setEarTagColorOptions(payload.data?.colorOptions ?? []);
      setEarTagBoundaryOptions(payload.data?.boundaryOptions ?? []);
    } catch (configError) {
      setError(configError instanceof Error ? configError.message : "Failed to load ear tag configuration.");
    }
  }

  useEffect(() => {
    void loadDogs();
    void loadEarTagConfig();
  }, []);

  async function saveEarTagConfig() {
    setEarTagSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("styleOptions", JSON.stringify(earTagStyleOptions));
      formData.set("colorOptions", JSON.stringify(earTagColorOptions));
      formData.set("boundaryOptions", JSON.stringify(earTagBoundaryOptions));
      formData.set("styleUploadTitles", JSON.stringify(earTagStyleUploadTitles));
      formData.set("boundaryUploadTitles", JSON.stringify(earTagBoundaryUploadTitles));

      for (const file of earTagStyleFiles) {
        formData.append("styleImageFiles", file);
      }
      for (const file of earTagBoundaryFiles) {
        formData.append("boundaryImageFiles", file);
      }

      const response = await adminFetch("/api/admin/dog-ear-tag-config", {
        method: "PUT",
        body: formData,
      });
      const payload = (await response.json()) as { data?: EarTagGlobalConfigRecord; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update ear tag configuration.");
      }

      setEarTagStyleOptions(payload.data?.styleOptions ?? []);
      setEarTagColorOptions(payload.data?.colorOptions ?? []);
      setEarTagBoundaryOptions(payload.data?.boundaryOptions ?? []);
      setEarTagStyleFiles([]);
      setEarTagStyleUploadTitles([]);
      setEarTagBoundaryFiles([]);
      setEarTagBoundaryUploadTitles([]);
    } catch (configError) {
      setError(configError instanceof Error ? configError.message : "Failed to update ear tag configuration.");
    } finally {
      setEarTagSaving(false);
    }
  }

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
      breed: editingDog.breed,
      color: editingDog.color,
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
      formData.set("breed", form.breed);
      formData.set("color", form.color);
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
            Add, edit, delete dog profiles, upload images, set dog color, and keep adoption status current.
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
            <p className="mt-2 text-xs text-slate-500">
              Rescue names are generated automatically. Pet naming is available to adopters only after approval.
            </p>
            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Breed"
                value={form.breed}
                onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Color"
                value={form.color}
                onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
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
                      <p className="text-xs text-slate-500">Rescue: {dog.rescueName}</p>
                      <p className="text-xs text-slate-600">{dog.breed} • {dog.color} • {dog.age} • {dog.gender}</p>
                      <p className="text-xs text-slate-600">{dog.city ?? ""}{dog.city && dog.area ? ", " : ""}{dog.area ?? ""}</p>
                      {dog.petName ? <p className="text-xs text-indigo-700">Pet name: {dog.petName}</p> : null}
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Customize Your Ear Tag</h2>
          <p className="mt-2 text-sm text-slate-600">
            Global settings used for every adopted dog. Admin-defined options are reused in all adopter workflows.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ear Tag Style Images (URLs)</span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={formatOptionLines(earTagStyleOptions)}
                onChange={(event) => setEarTagStyleOptions(parseOptionLines(event.target.value))}
                placeholder="One option per line: Title | https://..."
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reflective Boundary Images (URLs)</span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={formatOptionLines(earTagBoundaryOptions)}
                onChange={(event) => setEarTagBoundaryOptions(parseOptionLines(event.target.value))}
                placeholder="One option per line: Title | https://..."
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Color Options</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={earTagColorOptions.join("\n")}
                onChange={(event) =>
                  setEarTagColorOptions(
                    event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="One color per line"
              />
            </label>

            <div className="space-y-3">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upload Ear Tag Style Images</span>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEarTagStyleFiles(files);
                    setEarTagStyleUploadTitles(files.map((file) => inferTitleFromFilename(file)));
                  }}
                />
              </label>

              {earTagStyleFiles.length > 0 ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Style upload titles</p>
                  {earTagStyleFiles.map((file, index) => (
                    <label key={`${file.name}-${index}`} className="block space-y-1">
                      <span className="text-xs text-slate-500">{file.name}</span>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        value={earTagStyleUploadTitles[index] ?? ""}
                        onChange={(event) =>
                          setEarTagStyleUploadTitles((prev) => {
                            const next = [...prev];
                            next[index] = event.target.value;
                            return next;
                          })
                        }
                        placeholder="Option title"
                      />
                    </label>
                  ))}
                </div>
              ) : null}

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upload Reflective Boundaries</span>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEarTagBoundaryFiles(files);
                    setEarTagBoundaryUploadTitles(files.map((file) => inferTitleFromFilename(file)));
                  }}
                />
              </label>

              {earTagBoundaryFiles.length > 0 ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Boundary upload titles</p>
                  {earTagBoundaryFiles.map((file, index) => (
                    <label key={`${file.name}-${index}`} className="block space-y-1">
                      <span className="text-xs text-slate-500">{file.name}</span>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        value={earTagBoundaryUploadTitles[index] ?? ""}
                        onChange={(event) =>
                          setEarTagBoundaryUploadTitles((prev) => {
                            const next = [...prev];
                            next[index] = event.target.value;
                            return next;
                          })
                        }
                        placeholder="Option title"
                      />
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              disabled={earTagSaving}
              onClick={() => void saveEarTagConfig()}
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
            >
              {earTagSaving ? "Saving..." : "Save Ear Tag Configuration"}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
