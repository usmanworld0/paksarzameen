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

  return (
    <div>
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/10 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Admin · Dog Updates</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Upload life-after-adoption photos and maintain the rescue journey gallery.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
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
            <h2 className="text-xl font-semibold text-slate-900">Upload Post-Adoption Update</h2>
            <p className="mt-1 text-xs text-slate-500">Only adopted dogs can receive updates.</p>

            <div className="mt-4 grid gap-3">
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
                className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Caption"
                value={form.caption}
                onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
              />

              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Collar Tag (optional)"
                value={form.collarTag}
                onChange={(event) => setForm((prev) => ({ ...prev, collarTag: event.target.value }))}
              />

              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Image URL (optional if upload provided)"
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

              <button
                type="button"
                disabled={saving}
                onClick={() => void submitUpdate()}
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
              >
                {saving ? "Uploading..." : "Upload Update"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Existing Updates</h2>
            {loading ? <p className="mt-3 text-sm text-slate-600">Loading updates...</p> : null}
            {!loading && !updates.length ? (
              <p className="mt-3 text-sm text-slate-600">No updates uploaded yet.</p>
            ) : null}

            <div className="mt-4 space-y-3">
              {updates.map((item) => (
                <article key={item.updateId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.dogName}</h3>
                      <p className="text-xs text-slate-600">{item.caption}</p>
                      {item.collarTag ? (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Collar: {item.collarTag}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-slate-500">
                        {new Date(item.uploadedAt).toLocaleString()} · {item.uploadedBy}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteUpdate(item.updateId)}
                      className="rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700"
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
