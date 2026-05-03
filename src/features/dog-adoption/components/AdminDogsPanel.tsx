"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColorOption, DogRecord, DogStatus, EarTagGlobalConfigRecord, EarTagImageOption } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import { DogQRCode } from "@/features/dog-adoption/components/DogQRCode";

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
  const [earTagColorOptions, setEarTagColorOptions] = useState<ColorOption[]>([]);
  const [earTagBoundaryOptions, setEarTagBoundaryOptions] = useState<EarTagImageOption[]>([]);
  const [earTagStyleFiles, setEarTagStyleFiles] = useState<File[]>([]);
  const [earTagStyleUploadTitles, setEarTagStyleUploadTitles] = useState<string[]>([]);
  const [earTagColorFiles, setEarTagColorFiles] = useState<File[]>([]);
  const [earTagColorUploadTitles, setEarTagColorUploadTitles] = useState<string[]>([]);
  const [earTagColorUploadTextColors, setEarTagColorUploadTextColors] = useState<string[]>([]);
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
      formData.set("colorUploadTitles", JSON.stringify(earTagColorUploadTitles));
      formData.set("colorUploadTextColors", JSON.stringify(earTagColorUploadTextColors));
      formData.set("boundaryUploadTitles", JSON.stringify(earTagBoundaryUploadTitles));

      for (const file of earTagStyleFiles) {
        formData.append("styleImageFiles", file);
      }
      for (const file of earTagColorFiles) {
        formData.append("colorImageFiles", file);
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
      setEarTagColorFiles([]);
      setEarTagColorUploadTitles([]);
      setEarTagColorUploadTextColors([]);
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
              {dogs.map((dog) => {
                const statusColor =
                  dog.status === "available"
                    ? "bg-emerald-100 text-emerald-700"
                    : dog.status === "adopted"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-amber-100 text-amber-700";
                return (
                  <article key={dog.dogId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 truncate">{dog.name}</h3>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                            {dog.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">Rescue: {dog.rescueName}</p>
                        <p className="text-xs text-slate-500">
                          {[dog.breed, dog.color, dog.age, dog.gender].filter(Boolean).join(" · ")}
                        </p>
                        {(dog.city || dog.area) && (
                          <p className="text-xs text-slate-400">{[dog.area, dog.city].filter(Boolean).join(", ")}</p>
                        )}
                        {dog.petName && <p className="text-xs font-semibold text-indigo-600">Pet: {dog.petName}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => setEditingDogId(dog.dogId)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeDog(dog.dogId)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <DogQRCode
                      dogId={dog.dogId}
                      dogName={dog.name}
                      rescueName={dog.rescueName}
                      breed={dog.breed}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Customize Your Ear Tag</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload images for each category. Adopters will see these as selectable options during the adoption flow.
            Click <span className="font-semibold text-rose-600">×</span> on any saved option to remove it, then save.
          </p>

          <div className="mt-6 space-y-10">

            {/* ── Ear Tag Styles ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Ear Tag Styles</h3>
                {earTagStyleOptions.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {earTagStyleOptions.length} saved
                  </span>
                )}
                {earTagStyleFiles.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {earTagStyleFiles.length} pending
                  </span>
                )}
              </div>

              {earTagStyleOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagStyleOptions.map((opt, i) => (
                    <div key={`saved-style-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-slate-600">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagStyleOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400">No styles saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-5 transition hover:border-emerald-300 hover:bg-emerald-50">
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-semibold text-slate-600">Upload style images</span>
                <span className="text-xs text-slate-400">Multiple files allowed · PNG, JPG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEarTagStyleFiles((prev) => [...prev, ...files]);
                    setEarTagStyleUploadTitles((prev) => [...prev, ...files.map(inferTitleFromFilename)]);
                    event.target.value = "";
                  }}
                />
              </label>

              {earTagStyleFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagStyleFiles.map((file, i) => (
                    <div key={`pending-style-${i}`} className="group relative space-y-1">
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-[11px]"
                        value={earTagStyleUploadTitles[i] ?? ""}
                        onChange={(event) =>
                          setEarTagStyleUploadTitles((prev) => {
                            const next = [...prev];
                            next[i] = event.target.value;
                            return next;
                          })
                        }
                        placeholder="Title"
                      />
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => {
                          setEarTagStyleFiles((prev) => prev.filter((_, idx) => idx !== i));
                          setEarTagStyleUploadTitles((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Colors ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Colors</h3>
                {earTagColorOptions.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {earTagColorOptions.length} saved
                  </span>
                )}
                {earTagColorFiles.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {earTagColorFiles.length} pending
                  </span>
                )}
              </div>

              {earTagColorOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagColorOptions.map((opt, i) => (
                    <div key={`saved-color-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-slate-600">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagColorOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400">No colors saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-5 transition hover:border-emerald-300 hover:bg-emerald-50">
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-semibold text-slate-600">Upload color images</span>
                <span className="text-xs text-slate-400">Multiple files allowed · PNG, JPG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEarTagColorFiles((prev) => [...prev, ...files]);
                    setEarTagColorUploadTitles((prev) => [...prev, ...files.map(inferTitleFromFilename)]);
                    setEarTagColorUploadTextColors((prev) => [...prev, ...files.map(() => "#000000")]);
                    event.target.value = "";
                  }}
                />
              </label>

              {earTagColorFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                  {earTagColorFiles.map((file, i) => (
                    <div key={`pending-color-${i}`} className="group relative space-y-1">
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-[11px]"
                        value={earTagColorUploadTitles[i] ?? ""}
                        onChange={(event) =>
                          setEarTagColorUploadTitles((prev) => {
                            const next = [...prev];
                            next[i] = event.target.value;
                            return next;
                          })
                        }
                        placeholder="Color name"
                      />
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => {
                          setEarTagColorFiles((prev) => prev.filter((_, idx) => idx !== i));
                          setEarTagColorUploadTitles((prev) => prev.filter((_, idx) => idx !== i));
                          setEarTagColorUploadTextColors((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Reflective Boundaries ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Reflective Boundaries</h3>
                {earTagBoundaryOptions.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {earTagBoundaryOptions.length} saved
                  </span>
                )}
                {earTagBoundaryFiles.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {earTagBoundaryFiles.length} pending
                  </span>
                )}
              </div>

              {earTagBoundaryOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagBoundaryOptions.map((opt, i) => (
                    <div key={`saved-boundary-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-slate-600">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagBoundaryOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400">No boundaries saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-5 transition hover:border-emerald-300 hover:bg-emerald-50">
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-semibold text-slate-600">Upload boundary images</span>
                <span className="text-xs text-slate-400">Multiple files allowed · PNG, JPG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setEarTagBoundaryFiles((prev) => [...prev, ...files]);
                    setEarTagBoundaryUploadTitles((prev) => [...prev, ...files.map(inferTitleFromFilename)]);
                    event.target.value = "";
                  }}
                />
              </label>

              {earTagBoundaryFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagBoundaryFiles.map((file, i) => (
                    <div key={`pending-boundary-${i}`} className="group relative space-y-1">
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-[11px]"
                        value={earTagBoundaryUploadTitles[i] ?? ""}
                        onChange={(event) =>
                          setEarTagBoundaryUploadTitles((prev) => {
                            const next = [...prev];
                            next[i] = event.target.value;
                            return next;
                          })
                        }
                        placeholder="Title"
                      />
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => {
                          setEarTagBoundaryFiles((prev) => prev.filter((_, idx) => idx !== i));
                          setEarTagBoundaryUploadTitles((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 border-t border-slate-100 pt-5">
            <button
              type="button"
              disabled={earTagSaving}
              onClick={() => void saveEarTagConfig()}
              className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {earTagSaving ? "Saving..." : "Save Ear Tag Configuration"}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
