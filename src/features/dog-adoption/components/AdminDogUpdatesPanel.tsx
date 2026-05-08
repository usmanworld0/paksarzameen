"use client";

import { useEffect, useMemo, useState } from "react";
import type { DogPostAdoptionUpdateRecord, DogRecord } from "@/lib/dog-adoption";
import { adminFetch } from "@/features/auth/utils/admin-api";
import { canAccessAdminRoute, useAdminClientSession } from "@/features/auth/utils/admin-session-client";

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

  const inputClass = "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="border-b border-[#E5E5E5] pb-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <h1 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">Dog Updates</h1>
          <p className="mt-1 text-sm text-[#707072]">
            Upload life-after-adoption photos and maintain the rescue journey gallery.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { href: "/admin", label: "Control Center" },
              { href: "/admin/dogs", label: "Manage Dogs" },
              { href: "/admin/adoption-requests", label: "Adoption Requests" },
              { href: "/admin/blood-requests", label: "Blood Requests" },
            ]
              .filter((item) => canAccessAdminRoute(session, item.href))
              .map((item) => (
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

          {/* Upload form */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <div className="border-b border-[#E5E5E5] pb-3 mb-4">
              <h2 className="text-xl font-black tracking-tighter text-[#111111]">Upload Post-Adoption Update</h2>
              <p className="mt-1 text-[10px] font-medium text-[#707072]">Only adopted dogs can receive updates.</p>
            </div>

            <div className="grid gap-3">
              <div>
                <label className={labelClass}>Select Dog</label>
                <select
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  value={form.dogId}
                  onChange={(event) => setForm((prev) => ({ ...prev, dogId: event.target.value }))}
                >
                  <option value="">Select adopted dog</option>
                  {adoptedDogs.map((dog) => (
                    <option key={dog.dogId} value={dog.dogId}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Caption</label>
                <textarea
                  className="w-full min-h-28 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  placeholder="Caption"
                  value={form.caption}
                  onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                />
              </div>

              <div>
                <label className={labelClass}>Collar Tag (optional)</label>
                <input
                  className={inputClass}
                  placeholder="Collar Tag"
                  value={form.collarTag}
                  onChange={(event) => setForm((prev) => ({ ...prev, collarTag: event.target.value }))}
                />
              </div>

              <div>
                <label className={labelClass}>Image URL (optional)</label>
                <input
                  className={inputClass}
                  placeholder="Image URL (optional if upload provided)"
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

              <button
                type="button"
                disabled={saving}
                onClick={() => void submitUpdate()}
                className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
              >
                {saving ? "Uploading..." : "Upload Update"}
              </button>
            </div>
          </div>

          {/* Existing updates */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
            <div className="border-b border-[#E5E5E5] pb-3 mb-4">
              <h2 className="text-xl font-black tracking-tighter text-[#111111]">Existing Updates</h2>
            </div>
            {loading ? <p className="text-sm text-[#707072]">Loading updates...</p> : null}
            {!loading && !updates.length ? (
              <p className="text-sm text-[#707072]">No updates uploaded yet.</p>
            ) : null}

            <div className="space-y-3">
              {updates.map((item) => (
                <article key={item.updateId} className="rounded-xl border border-[#E5E5E5] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black tracking-tight text-[#111111]">{item.dogName}</h3>
                      <p className="text-xs font-medium text-[#707072]">{item.caption}</p>
                      {item.collarTag ? (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">
                          Collar: {item.collarTag}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[10px] font-medium text-[#707072]">
                        {new Date(item.uploadedAt).toLocaleString()} · {item.uploadedBy}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteUpdate(item.updateId)}
                      className="shrink-0 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
