"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColorOption, DogRecord, DogStatus, EarTagGlobalConfigRecord, EarTagImageOption } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import { DogQRCode } from "@/features/dog-adoption/components/DogQRCode";

type DogFormState = {
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

  const inputClass = "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="border-b border-[#E5E5E5] pb-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <h1 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Manage Dogs</h1>
          <p className="mt-1 text-sm text-[#707072]">
            Add, edit, delete dog profiles, upload images, set dog color, and keep adoption status current.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {quickLinks.map((item) => (
              <a
                key={item.href}
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47] hover:text-[#1a9d5f] transition"
                href={item.href}
              >
                {item.label} →
              </a>
            ))}
          </div>
        </header>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

          {/* Form */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <div className="border-b border-[#E5E5E5] pb-3 mb-4">
              <h2 className="text-xl font-black tracking-tighter text-[#111111]">{editingDogId ? "Edit Dog" : "Add New Dog"}</h2>
              <p className="mt-1 text-[10px] font-medium text-[#707072]">
                Rescue names are generated automatically. Pet naming is available to adopters only after approval.
              </p>
            </div>
            <div className="grid gap-3">
              <div>
                <label className={labelClass}>Color</label>
                <input
                  className={inputClass}
                  placeholder="Color"
                  value={form.color}
                  onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    className={inputClass}
                    placeholder="Age"
                    value={form.age}
                    onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <input
                    className={inputClass}
                    placeholder="Gender"
                    value={form.gender}
                    onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    className={inputClass}
                    placeholder="City"
                    value={form.city}
                    onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Area</label>
                  <input
                    className={inputClass}
                    placeholder="Area"
                    value={form.area}
                    onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className="w-full min-h-28 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as DogStatus }))}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Image URL (optional)</label>
                <input
                  className={inputClass}
                  placeholder="Image URL (optional, otherwise a default placeholder is used)"
                  value={form.imageUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Upload Image</label>
                <input
                  className={inputClass}
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
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveDog()}
                className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
              >
                {saving ? "Saving..." : editingDogId ? "Update Dog" : "Add Dog"}
              </button>
              {editingDogId ? (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </div>

          {/* Dogs list */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <div className="border-b border-[#E5E5E5] pb-3 mb-4">
              <h2 className="text-xl font-black tracking-tighter text-[#111111]">Dogs</h2>
            </div>
            {loading ? <p className="text-sm text-[#707072]">Loading dogs...</p> : null}
            {!loading && !dogs.length ? (
              <p className="text-sm text-[#707072]">No dogs found.</p>
            ) : null}
            <div className="space-y-3">
              {dogs.map((dog) => {
                const statusColor =
                  dog.status === "available"
                    ? "bg-emerald-100 text-emerald-700"
                    : dog.status === "adopted"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-amber-100 text-amber-700";
                return (
                  <article key={dog.dogId} className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black tracking-tight text-[#111111] truncate">{dog.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${statusColor}`}>
                            {dog.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] font-medium text-[#707072]">Rescue: {dog.rescueName}</p>
                        <p className="text-[10px] font-medium text-[#707072]">{[dog.color, dog.age, dog.gender].filter(Boolean).join(" · ")}</p>
                        {(dog.city || dog.area) && (
                          <p className="text-[10px] font-medium text-[#707072]">{[dog.area, dog.city].filter(Boolean).join(", ")}</p>
                        )}
                        {dog.petName && <p className="text-xs font-semibold text-sky-700">Pet: {dog.petName}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={() => setEditingDogId(dog.dogId)}
                          className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] transition hover:border-[#111111]/30"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeDog(dog.dogId)}
                          className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <DogQRCode
                      dogId={dog.dogId}
                      dogName={dog.name}
                      rescueName={dog.rescueName}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ear Tag Config */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
          <div className="border-b border-[#E5E5E5] pb-4 mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Configuration</p>
            <h2 className="mt-2 text-xl font-black tracking-tighter text-[#111111]">Customize Your Ear Tag</h2>
            <p className="mt-1 text-sm text-[#707072]">
              Upload images for each category. Adopters will see these as selectable options during the adoption flow.
              Click <span className="font-semibold text-red-600">×</span> on any saved option to remove it, then save.
            </p>
          </div>

          <div className="space-y-10">

            {/* Ear Tag Styles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#111111]">Ear Tag Styles</h3>
                {earTagStyleOptions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-emerald-100 text-emerald-700">
                    {earTagStyleOptions.length} saved
                  </span>
                )}
                {earTagStyleFiles.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-amber-100 text-amber-700">
                    {earTagStyleFiles.length} pending
                  </span>
                )}
              </div>

              {earTagStyleOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagStyleOptions.map((opt, i) => (
                    <div key={`saved-style-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-[#707072]">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagStyleOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-[#707072]">No styles saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E5E5E5] bg-[#f3f3ee] py-5 transition hover:border-[#0f7a47] hover:bg-[#0f7a47]/5">
                <svg className="h-6 w-6 text-[#707072]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Upload style images</span>
                <span className="text-[10px] text-[#707072]">Multiple files allowed · PNG, JPG, WEBP</span>
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
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#0f7a47]/40 bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-[#E5E5E5] bg-white px-2 py-1 text-[11px]"
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
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#111111]">Colors</h3>
                {earTagColorOptions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-emerald-100 text-emerald-700">
                    {earTagColorOptions.length} saved
                  </span>
                )}
                {earTagColorFiles.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-amber-100 text-amber-700">
                    {earTagColorFiles.length} pending
                  </span>
                )}
              </div>

              {earTagColorOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagColorOptions.map((opt, i) => (
                    <div key={`saved-color-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-[#707072]">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagColorOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-[#707072]">No colors saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E5E5E5] bg-[#f3f3ee] py-5 transition hover:border-[#0f7a47] hover:bg-[#0f7a47]/5">
                <svg className="h-6 w-6 text-[#707072]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Upload color images</span>
                <span className="text-[10px] text-[#707072]">Multiple files allowed · PNG, JPG, WEBP</span>
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
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#0f7a47]/40 bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-[#E5E5E5] bg-white px-2 py-1 text-[11px]"
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
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reflective Boundaries */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#111111]">Reflective Boundaries</h3>
                {earTagBoundaryOptions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-emerald-100 text-emerald-700">
                    {earTagBoundaryOptions.length} saved
                  </span>
                )}
                {earTagBoundaryFiles.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-amber-100 text-amber-700">
                    {earTagBoundaryFiles.length} pending
                  </span>
                )}
              </div>

              {earTagBoundaryOptions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {earTagBoundaryOptions.map((opt, i) => (
                    <div key={`saved-boundary-${i}`} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt={opt.title} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-1 truncate text-center text-[11px] font-medium text-[#707072]">{opt.title}</p>
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => setEarTagBoundaryOptions((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-[#707072]">No boundaries saved yet — upload below to add the first one.</p>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E5E5E5] bg-[#f3f3ee] py-5 transition hover:border-[#0f7a47] hover:bg-[#0f7a47]/5">
                <svg className="h-6 w-6 text-[#707072]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#707072]">Upload boundary images</span>
                <span className="text-[10px] text-[#707072]">Multiple files allowed · PNG, JPG, WEBP</span>
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
                      <div className="aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#0f7a47]/40 bg-[#f3f3ee]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      </div>
                      <input
                        className="w-full rounded-lg border border-[#E5E5E5] bg-white px-2 py-1 text-[11px]"
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
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 border-t border-[#E5E5E5] pt-5">
            <button
              type="button"
              disabled={earTagSaving}
              onClick={() => void saveEarTagConfig()}
              className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {earTagSaving ? "Saving..." : "Save Ear Tag Configuration"}
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
