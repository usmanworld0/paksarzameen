"use client";

import { useEffect, useMemo, useState } from "react";

import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";
import type { DogPostAdoptionUpdateRecord, DogRecord } from "@/lib/dog-adoption";

type UpdateFormState = {
  dogId: string;
  caption: string;
  collarTag: string;
  imageUrl: string;
  imageFile: File | null;
};

const INITIAL_FORM: UpdateFormState = {
  dogId: "",
  caption: "",
  collarTag: "",
  imageUrl: "",
  imageFile: null,
};

export function AdminDogUpdatesPanel() {
  const { session } = useAdminClientSession();
  const [updates, setUpdates] = useState<DogPostAdoptionUpdateRecord[]>([]);
  const [dogs, setDogs] = useState<DogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UpdateFormState>(INITIAL_FORM);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [updatesResponse, dogsResponse] = await Promise.all([
        adminFetch("/api/admin/dog-updates", { cache: "no-store" }),
        adminFetch("/api/admin/dogs", { cache: "no-store" }),
      ]);

      const updatesPayload = (await updatesResponse.json()) as {
        data?: DogPostAdoptionUpdateRecord[];
        error?: string;
      };
      const dogsPayload = (await dogsResponse.json()) as { data?: DogRecord[]; error?: string };

      if (!updatesResponse.ok) {
        throw new Error(updatesPayload.error ?? "Failed to load updates.");
      }
      if (!dogsResponse.ok) {
        throw new Error(dogsPayload.error ?? "Failed to load dogs.");
      }

      setUpdates(updatesPayload.data ?? []);
      setDogs(dogsPayload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const adoptedDogs = useMemo(() => dogs.filter((dog) => dog.status === "adopted"), [dogs]);

  async function submitUpdate() {
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("dogId", form.dogId);
      formData.set("caption", form.caption);
      formData.set("collarTag", form.collarTag);
      formData.set("imageUrl", form.imageUrl);
      if (form.imageFile) {
        formData.set("image", form.imageFile);
      }

      const response = await adminFetch("/api/admin/dog-updates", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to upload update.");
      }

      setForm(INITIAL_FORM);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to upload update.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUpdate(updateId: string) {
    const proceed = window.confirm("Delete this post-adoption update?");
    if (!proceed) return;

    setError(null);

    try {
      const response = await adminFetch(`/api/admin/dog-updates/${updateId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to delete update.");
      }

      await loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete update.");
    }
  }

  const quickLinks = [
    { href: "/admin", label: "Control Center" },
    { href: "/admin/dogs", label: "Manage Dogs" },
    { href: "/admin/adoption-requests", label: "Adoption Requests" },
    { href: "/admin/blood-requests", label: "Blood Requests" },
  ].filter((item) => canAccessAdminRoute(session, item.href));

  return (
    <main className="admin-page">
      <section className="site-shell site-stack--xl pb-20 pt-32">
        <header className="site-panel site-panel--rounded">
          <div className="site-panel__body">
            <p className="site-eyebrow">Post-adoption storytelling</p>
            <div className="site-toolbar__row mt-3">
              <div>
                <h1 className="site-display">Life After Rescue</h1>
                <p className="site-copy mt-4 max-w-[70rem]">
                  Keep the adoption journey visible by attaching updated photos, collar tag notes, and follow-up moments for dogs already in homes.
                </p>
              </div>
              <span className="site-badge site-badge--muted">{updates.length} updates</span>
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

        <section className="site-grid site-grid--two xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="border-b border-[#e5e5e5] pb-5">
                <p className="site-eyebrow">Upload update</p>
                <h2 className="site-heading site-heading--sm mt-3">Add A New Story</h2>
                <p className="site-copy site-copy--sm mt-3">Only dogs with approved adoptions can receive follow-up updates.</p>
              </div>

              <div className="mt-5 grid gap-3">
                <select
                  className="site-select"
                  value={form.dogId}
                  onChange={(event) => setForm((prev) => ({ ...prev, dogId: event.target.value }))}
                >
                  <option value="">Select adopted dog</option>
                  {adoptedDogs.map((dog) => (
                    <option key={dog.dogId} value={dog.dogId}>
                      {dog.name} ({dog.breed})
                    </option>
                  ))}
                </select>

                <textarea
                  className="site-textarea"
                  placeholder="Caption"
                  value={form.caption}
                  onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                />

                <input
                  className="site-input"
                  placeholder="Collar Tag (optional)"
                  value={form.collarTag}
                  onChange={(event) => setForm((prev) => ({ ...prev, collarTag: event.target.value }))}
                />

                <input
                  className="site-input"
                  placeholder="Image URL (optional if upload provided)"
                  value={form.imageUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                />

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

                <button type="button" disabled={saving} onClick={() => void submitUpdate()} className="site-button">
                  {saving ? "Uploading..." : "Upload Update"}
                </button>
              </div>
            </div>
          </div>

          <div className="site-panel site-panel--rounded">
            <div className="site-panel__body">
              <div className="border-b border-[#e5e5e5] pb-5">
                <p className="site-eyebrow">Existing updates</p>
                <h2 className="site-heading site-heading--sm mt-3">Published Follow-Ups</h2>
              </div>

              {loading ? <p className="site-copy mt-5">Loading updates...</p> : null}
              {!loading && !updates.length ? <div className="site-empty mt-5">No updates uploaded yet.</div> : null}

              <div className="mt-5 space-y-3">
                {updates.map((item) => (
                  <article key={item.updateId} className="rounded-[1.8rem] border border-[#e5e5e5] bg-[#fafafa] p-4">
                    <div className="site-toolbar__row">
                      <div>
                        <h3 className="text-[1.5rem] font-medium uppercase tracking-[-0.03em] text-[#111111]">{item.dogName}</h3>
                        <p className="mt-3 text-[1.25rem] leading-[1.7] text-[#707072]">{item.caption}</p>
                        {item.collarTag ? (
                          <p className="mt-3 text-[1.05rem] uppercase tracking-[0.16em] text-[#111111]">
                            Collar tag: {item.collarTag}
                          </p>
                        ) : null}
                        <p className="mt-3 text-[1.1rem] text-[#707072]">
                          {new Date(item.uploadedAt).toLocaleString()} / {item.uploadedBy}
                        </p>
                      </div>
                      <button type="button" onClick={() => void deleteUpdate(item.updateId)} className="site-button-secondary">
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
