"use client";

import { useEffect, useMemo, useState } from "react";

import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import { PakistanDogLocationPicker } from "@/features/dog-adoption/components/PakistanDogLocationPicker";
import {
  findDogLocationOption,
  type DogLocationOption,
} from "@/features/dog-adoption/location-catalog";
import type {
  DogRecord,
  DogStatus,
  EarTagGlobalConfigRecord,
  EarTagImageOption,
} from "@/lib/dog-adoption";

type DogFormState = {
  breed: string;
  color: string;
  age: string;
  gender: string;
  description: string;
  status: DogStatus;
  imageUrl: string;
  imageFile: File | null;
  location: DogLocationOption | null;
};

const INITIAL_FORM: DogFormState = {
  breed: "",
  color: "",
  age: "",
  gender: "",
  description: "",
  status: "available",
  imageUrl: "",
  imageFile: null,
  location: null,
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

function resolveDogLocation(dog: DogRecord | null) {
  if (!dog) return null;

  return findDogLocationOption({
    locationKey: dog.locationKey,
    locationLabel: dog.locationLabel,
    city: dog.city,
    area: dog.area,
    latitude: dog.latitude,
    longitude: dog.longitude,
  });
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

  const stats = useMemo(() => {
    const available = dogs.filter((dog) => dog.status === "available").length;
    const pending = dogs.filter((dog) => dog.status === "pending").length;
    const adopted = dogs.filter((dog) => dog.status === "adopted").length;

    return { available, pending, adopted };
  }, [dogs]);

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

  useEffect(() => {
    if (!editingDog) return;

    setForm({
      breed: editingDog.breed,
      color: editingDog.color,
      age: editingDog.age,
      gender: editingDog.gender,
      description: editingDog.description,
      status: editingDog.status,
      imageUrl: editingDog.imageUrl,
      imageFile: null,
      location: resolveDogLocation(editingDog),
    });
  }, [editingDog]);

  function resetForm() {
    setEditingDogId(null);
    setForm(INITIAL_FORM);
  }

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

  async function saveDog() {
    if (!form.location) {
      setError("Select the dog's rescue area from the map before saving.");
      return;
    }

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
      formData.set("locationKey", form.location.key);
      formData.set("locationLabel", form.location.label);
      formData.set("province", form.location.province);
      formData.set("city", form.location.city);
      formData.set("area", form.location.area);
      formData.set("latitude", String(form.location.latitude));
      formData.set("longitude", String(form.location.longitude));
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
    <main className="admin-page">
      <section className="site-shell site-stack--xl pb-20 pt-32">
        <header className="site-panel site-panel--rounded">
          <div className="site-panel__body">
            <p className="site-eyebrow">Dog adoption admin</p>
            <div className="site-toolbar__row mt-3">
              <div>
                <h1 className="site-display">Map-First Dog Intake</h1>
                <p className="site-copy mt-4 max-w-[72rem]">
                  Rescue areas are now locked to the approved Bahawalpur hotspot library so the public marketplace and internal admin workflow share the same real map locations.
                </p>
              </div>
              <div className="site-meta-row">
                <span>{dogs.length} total dogs</span>
                <span>{stats.available} available</span>
                <span>{stats.pending} pending</span>
                <span>{stats.adopted} adopted</span>
              </div>
            </div>
            {quickLinks.length ? (
              <div className="site-form-actions mt-6">
                {quickLinks.map((item) => (
                  <a key={item.href} href={item.href} className="site-link">
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {error ? <div className="site-callout site-callout--error">{error}</div> : null}

        <section className="site-grid site-grid--two xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="border-b border-[#e5e5e5] pb-5">
                <p className="site-eyebrow">{editingDogId ? "Edit dog" : "Add dog"}</p>
                <h2 className="site-heading site-heading--sm mt-3">
                  {editingDogId ? "Update Rescue Profile" : "Create Rescue Profile"}
                </h2>
                <p className="site-copy site-copy--sm mt-3">
                  Rescue names remain automatic. The public-facing location is generated from the selected hotspot.
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  className="site-input"
                  placeholder="Breed"
                  value={form.breed}
                  onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
                />
                <input
                  className="site-input"
                  placeholder="Color"
                  value={form.color}
                  onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                />
                <input
                  className="site-input"
                  placeholder="Age"
                  value={form.age}
                  onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                />
                <input
                  className="site-input"
                  placeholder="Gender"
                  value={form.gender}
                  onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                />
              </div>

              <div className="mt-5">
                <PakistanDogLocationPicker
                  value={form.location}
                  onChange={(location) => setForm((prev) => ({ ...prev, location }))}
                />
              </div>

              <div className="mt-5 grid gap-3">
                <textarea
                  className="site-textarea"
                  placeholder="Description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
                <div className="grid gap-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
                  <select
                    className="site-select"
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as DogStatus }))}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                  <input
                    className="site-input"
                    placeholder="Image URL (optional if upload provided)"
                    value={form.imageUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  />
                </div>
                <input
                  className="site-input"
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

              <div className="site-form-actions mt-6">
                <button type="button" disabled={saving} onClick={() => void saveDog()} className="site-button">
                  {saving ? "Saving..." : editingDogId ? "Update Dog" : "Add Dog"}
                </button>
                {editingDogId ? (
                  <button type="button" onClick={resetForm} className="site-button-secondary">
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="site-toolbar__row border-b border-[#e5e5e5] pb-5">
                <div>
                  <p className="site-eyebrow">Live roster</p>
                  <h2 className="site-heading site-heading--sm mt-3">Current Dog Directory</h2>
                </div>
                <span className="site-badge site-badge--muted">{dogs.length} dogs</span>
              </div>

              {loading ? <p className="site-copy mt-5">Loading dogs...</p> : null}
              {!loading && !dogs.length ? <div className="site-empty mt-5">No dogs found yet.</div> : null}

              <div className="mt-5 space-y-3">
                {dogs.map((dog) => (
                  <article key={dog.dogId} className="rounded-[1.8rem] border border-[#e5e5e5] bg-[#fafafa] p-4">
                    <div className="site-toolbar__row">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[1.6rem] font-medium uppercase tracking-[-0.03em] text-[#111111]">
                            {dog.name}
                          </h3>
                          <span className={`site-badge ${dog.status === "available" ? "site-badge--dark" : "site-badge--muted"}`}>
                            {dog.status}
                          </span>
                        </div>
                        <p className="mt-2 text-[1.05rem] font-medium uppercase tracking-[0.16em] text-[#707072]">
                          Rescue name: {dog.rescueName}
                        </p>
                        <p className="mt-3 text-[1.25rem] leading-[1.7] text-[#707072]">
                          {dog.locationLabel ?? ([dog.city, dog.area].filter(Boolean).join(", ") || "Location pending")}
                        </p>
                        <p className="mt-2 text-[1.15rem] uppercase tracking-[0.14em] text-[#111111]">
                          {dog.breed} / {dog.color} / {dog.age} / {dog.gender}
                        </p>
                        {dog.petName ? <p className="mt-2 text-[1.15rem] text-[#707072]">Pet name: {dog.petName}</p> : null}
                      </div>
                      <div className="site-form-actions">
                        <button
                          type="button"
                          onClick={() => setEditingDogId(dog.dogId)}
                          className="site-button-secondary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeDog(dog.dogId)}
                          className="site-button-secondary"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="site-panel site-panel--rounded">
          <div className="site-panel__body">
            <div className="border-b border-[#e5e5e5] pb-5">
              <p className="site-eyebrow">Ear tag system</p>
              <h2 className="site-heading site-heading--sm mt-3">Global Ear Tag Configuration</h2>
              <p className="site-copy site-copy--sm mt-3">
                These options feed every adopter-facing ear tag customization step.
              </p>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <label className="space-y-2">
                <span className="site-form-label site-form-label--caps">Ear tag style images</span>
                <textarea
                  className="site-textarea"
                  value={formatOptionLines(earTagStyleOptions)}
                  onChange={(event) => setEarTagStyleOptions(parseOptionLines(event.target.value))}
                  placeholder="One option per line: Title | https://..."
                />
              </label>

              <label className="space-y-2">
                <span className="site-form-label site-form-label--caps">Reflective boundary images</span>
                <textarea
                  className="site-textarea"
                  value={formatOptionLines(earTagBoundaryOptions)}
                  onChange={(event) => setEarTagBoundaryOptions(parseOptionLines(event.target.value))}
                  placeholder="One option per line: Title | https://..."
                />
              </label>

              <label className="space-y-2">
                <span className="site-form-label site-form-label--caps">Color options</span>
                <textarea
                  className="site-textarea"
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

              <div className="space-y-4">
                <label className="space-y-2">
                  <span className="site-form-label site-form-label--caps">Upload ear tag style images</span>
                  <input
                    className="site-input"
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
                  <div className="rounded-[1.6rem] border border-[#e5e5e5] bg-[#fafafa] p-4">
                    <p className="site-eyebrow">Style upload titles</p>
                    <div className="mt-3 space-y-3">
                      {earTagStyleFiles.map((file, index) => (
                        <label key={`${file.name}-${index}`} className="space-y-2">
                          <span className="site-form-label">{file.name}</span>
                          <input
                            className="site-input"
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
                  </div>
                ) : null}

                <label className="space-y-2">
                  <span className="site-form-label site-form-label--caps">Upload reflective boundaries</span>
                  <input
                    className="site-input"
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
                  <div className="rounded-[1.6rem] border border-[#e5e5e5] bg-[#fafafa] p-4">
                    <p className="site-eyebrow">Boundary upload titles</p>
                    <div className="mt-3 space-y-3">
                      {earTagBoundaryFiles.map((file, index) => (
                        <label key={`${file.name}-${index}`} className="space-y-2">
                          <span className="site-form-label">{file.name}</span>
                          <input
                            className="site-input"
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
                  </div>
                ) : null}
              </div>
            </div>

            <div className="site-form-actions mt-6">
              <button type="button" disabled={earTagSaving} onClick={() => void saveEarTagConfig()} className="site-button">
                {earTagSaving ? "Saving..." : "Save Ear Tag Configuration"}
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
