"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { DogRecord, EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type MyPetPersonalizationPanelProps = {
  dog: DogRecord;
  earTagConfig: EarTagGlobalConfigRecord;
};

export function MyPetPersonalizationPanel({ dog, earTagConfig }: MyPetPersonalizationPanelProps) {
  const styleOptions = useMemo(
    () =>
      earTagConfig.styleOptions.length > 0
        ? earTagConfig.styleOptions
        : earTagConfig.styleImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig.styleImages, earTagConfig.styleOptions]
  );

  const boundaryOptions = useMemo(
    () =>
      earTagConfig.boundaryOptions.length > 0
        ? earTagConfig.boundaryOptions
        : earTagConfig.boundaryImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig.boundaryImages, earTagConfig.boundaryOptions]
  );

  const [petName, setPetName] = useState("");
  const [petNameSaving, setPetNameSaving] = useState(false);
  const [earTagSaving, setEarTagSaving] = useState(false);
  const [styleImageUrl, setStyleImageUrl] = useState(dog.earTagStyleImageUrl ?? styleOptions[0]?.imageUrl ?? "");
  const [colorTitle, setColorTitle] = useState(dog.earTagColorTitle ?? earTagConfig.colorOptions[0]?.title ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(dog.earTagBoundaryImageUrl ?? boundaryOptions[0]?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savedPetName, setSavedPetName] = useState<string | null>(dog.petName);

  const hasConfig = useMemo(
    () => styleOptions.length > 0 && earTagConfig.colorOptions.length > 0 && boundaryOptions.length > 0,
    [boundaryOptions.length, earTagConfig.colorOptions.length, styleOptions.length]
  );

  async function savePetName() {
    setPetNameSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/my-pets/${dog.dogId}/pet-name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petName }),
      });

      const payload = (await response.json()) as { error?: string; data?: DogRecord };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save pet name.");
      }

      const assignedName = payload.data?.petName ?? petName.trim();
      setSavedPetName(assignedName);
      setSuccess("Pet name assigned. It is now locked and cannot be changed.");
      setPetName("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save pet name.");
    } finally {
      setPetNameSaving(false);
    }
  }

  async function saveEarTag() {
    setEarTagSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/my-pets/${dog.dogId}/ear-tag`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styleImageUrl, colorTitle, boundaryImageUrl }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save ear tag customization.");
      }

      setSuccess("Ear tag customization saved successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save ear tag customization.");
    } finally {
      setEarTagSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Customize Your Ear Tag</h2>
      <p className="mt-1 text-sm text-slate-600">
        Assign your pet name once, then personalize ear tag style, color, and reflective boundary.
      </p>

      <div className="mt-4 space-y-3">
        {savedPetName ? (
          <p className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
            Pet name: {savedPetName}
          </p>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Assign Pet Name (one-time)</label>
            <div className="flex flex-wrap gap-2">
              <input
                className="h-11 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
                placeholder="Enter pet name"
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                disabled={petNameSaving}
              />
              <button
                type="button"
                onClick={() => void savePetName()}
                disabled={petNameSaving}
                className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
              >
                {petNameSaving ? "Saving..." : "Save Name"}
              </button>
            </div>
          </div>
        )}
      </div>

      {!savedPetName ? (
        <p className="mt-4 text-xs text-slate-500">Ear tag customization unlocks once pet name is assigned.</p>
      ) : null}

      {savedPetName && hasConfig ? (
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Ear Tag Style</label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((item) => (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setStyleImageUrl(item.imageUrl)}
                  className={`relative overflow-hidden rounded-xl border ${styleImageUrl === item.imageUrl ? "border-emerald-500" : "border-slate-200"}`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title || "Ear tag style"} fill sizes="120px" className="object-cover" />
                  </div>
                  <p className="border-t border-slate-200 bg-white px-2 py-1 text-left text-[11px] font-medium text-slate-700">{item.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Color Options</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {earTagConfig.colorOptions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setColorTitle(item.title)}
                  className={`relative overflow-hidden rounded-xl border transition ${colorTitle === item.title ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="relative h-32 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="140px" className="object-cover" />
                  </div>
                  <div className="border-t border-slate-200 bg-white px-2 py-2 text-center">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    {item.textColor && <p className="text-xs text-slate-500">Text: {item.textColor}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Reflective Boundary</label>
            <div className="grid grid-cols-2 gap-2">
              {boundaryOptions.map((item) => (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setBoundaryImageUrl(item.imageUrl)}
                  className={`relative overflow-hidden rounded-xl border ${boundaryImageUrl === item.imageUrl ? "border-emerald-500" : "border-slate-200"}`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title || "Reflective boundary"} fill sizes="120px" className="object-cover" />
                  </div>
                  <p className="border-t border-slate-200 bg-white px-2 py-1 text-left text-[11px] font-medium text-slate-700">{item.title}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void saveEarTag()}
            disabled={earTagSaving}
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70"
          >
            {earTagSaving ? "Saving..." : "Save Ear Tag"}
          </button>
        </div>
      ) : null}

      {savedPetName && !hasConfig ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Ear tag options are not configured by admin yet.
        </p>
      ) : null}

      {success ? <p className="mt-4 text-sm text-emerald-700">{success}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
