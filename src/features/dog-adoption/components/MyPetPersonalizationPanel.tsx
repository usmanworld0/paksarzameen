"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Loader2, Palette, ScanLine, Shield, Type } from "lucide-react";

import type { DogRecord, EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type MyPetPersonalizationPanelProps = {
  dog: DogRecord;
  earTagConfig: EarTagGlobalConfigRecord;
};

function normalizeTitle(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function MyPetPersonalizationPanel({ dog, earTagConfig }: MyPetPersonalizationPanelProps) {
  const styleOptions = useMemo(
    () =>
      earTagConfig.styleOptions.length > 0
        ? earTagConfig.styleOptions
        : earTagConfig.styleImages.map((imageUrl, index) => ({
            title: `Style ${index + 1}`,
            imageUrl,
          })),
    [earTagConfig.styleImages, earTagConfig.styleOptions]
  );

  const boundaryOptions = useMemo(
    () =>
      earTagConfig.boundaryOptions.length > 0
        ? earTagConfig.boundaryOptions
        : earTagConfig.boundaryImages.map((imageUrl, index) => ({
            title: `Boundary ${index + 1}`,
            imageUrl,
          })),
    [earTagConfig.boundaryImages, earTagConfig.boundaryOptions]
  );

  const [savedPetName, setSavedPetName] = useState<string | null>(dog.petName);
  const [petNameDraft, setPetNameDraft] = useState(dog.petName ?? "");
  const [styleImageUrl, setStyleImageUrl] = useState(dog.earTagStyleImageUrl ?? styleOptions[0]?.imageUrl ?? "");
  const [colorTitle, setColorTitle] = useState(dog.earTagColorTitle ?? earTagConfig.colorOptions[0]?.title ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(dog.earTagBoundaryImageUrl ?? boundaryOptions[0]?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasConfig = useMemo(
    () => styleOptions.length > 0 && earTagConfig.colorOptions.length > 0 && boundaryOptions.length > 0,
    [boundaryOptions.length, earTagConfig.colorOptions.length, styleOptions.length]
  );

  const selectedStyle = styleOptions.find((item) => item.imageUrl === styleImageUrl) ?? styleOptions[0] ?? null;
  const selectedColor = earTagConfig.colorOptions.find((item) => item.title === colorTitle) ?? earTagConfig.colorOptions[0] ?? null;
  const selectedBoundary = boundaryOptions.find((item) => item.imageUrl === boundaryImageUrl) ?? boundaryOptions[0] ?? null;

  const engravingValue = savedPetName ?? (petNameDraft.trim() || dog.name);

  async function applyChanges() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let latestPetName = savedPetName;

      if (!latestPetName) {
        const nextPetName = petNameDraft.trim();
        if (!nextPetName) {
          throw new Error("Please enter an engraving name before applying changes.");
        }

        const response = await fetch(`/api/my-pets/${dog.dogId}/pet-name`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ petName: nextPetName }),
        });

        const payload = (await response.json()) as { error?: string; data?: DogRecord };
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to assign pet name.");
        }

        latestPetName = payload.data?.petName ?? nextPetName;
        setSavedPetName(latestPetName);
        setPetNameDraft(latestPetName);
      }

      if (hasConfig) {
        const response = await fetch(`/api/my-pets/${dog.dogId}/ear-tag`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            styleImageUrl,
            colorTitle,
            boundaryImageUrl,
          }),
        });

        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to save ear tag customization.");
        }
      }

      setSuccess(
        hasConfig
          ? latestPetName && !savedPetName
            ? "Pet name assigned and pet tag customization saved."
            : "Pet tag customization saved successfully."
          : latestPetName && !savedPetName
            ? "Pet name assigned successfully."
            : "Changes applied successfully."
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to apply changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900 sm:text-[2.2rem]">Customize Pet Tag</h2>
        <p className="mt-2 max-w-2xl text-[1.5rem] leading-7 text-slate-600">
          Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white">
        <div className="grid gap-0 lg:grid-cols-[1.05fr,1fr]">
          <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div className="mb-5 inline-flex items-center gap-2 text-[1.3rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
              <ScanLine className="h-4 w-4" />
              Live Preview
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#f6f4ef_0%,#ece9e1_100%)] p-6 shadow-inner">
              <div className="relative w-full max-w-[260px] rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_24px_40px_rgba(15,23,42,0.12)]">
                <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),transparent_55%)]" />
                <div className="relative aspect-square overflow-hidden rounded-[24px] bg-slate-100">
                  {selectedColor?.imageUrl ? (
                    <Image
                      src={selectedColor.imageUrl}
                      alt={selectedColor.title}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  ) : null}
                  {selectedStyle?.imageUrl ? (
                    <Image
                      src={selectedStyle.imageUrl}
                      alt={selectedStyle.title}
                      fill
                      sizes="260px"
                      className="object-cover mix-blend-multiply"
                    />
                  ) : null}
                  {selectedBoundary?.imageUrl ? (
                    <Image
                      src={selectedBoundary.imageUrl}
                      alt={selectedBoundary.title}
                      fill
                      sizes="260px"
                      className="object-cover mix-blend-multiply"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 px-4 text-center backdrop-blur-[1px]">
                    <span className="text-[1rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
                      Tag No. {dog.dogId.slice(0, 4).toUpperCase()}
                    </span>
                    <span className="text-[2.2rem] font-extrabold uppercase leading-none tracking-tight text-slate-900">
                      {engravingValue}
                    </span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[1rem] font-medium text-slate-600">
                      {normalizeTitle(selectedColor?.title, "Tag Color")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 lg:p-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[1.3rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
                <Palette className="h-4 w-4" />
                Select Style
              </div>
              <div className="grid grid-cols-3 gap-3">
                {styleOptions.map((item, index) => {
                  const selected = styleImageUrl === item.imageUrl;

                  return (
                    <button
                      key={item.imageUrl}
                      type="button"
                      onClick={() => setStyleImageUrl(item.imageUrl)}
                      className={`group relative aspect-square overflow-hidden rounded-2xl border transition ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                      }`}
                      aria-label={item.title}
                    >
                      <div className="absolute inset-3 overflow-hidden rounded-xl bg-slate-50">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="92px" className="object-cover" />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 truncate rounded-full bg-white/85 px-2 py-1 text-[1rem] font-semibold text-slate-700">
                        {item.title || `Style ${index + 1}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[1.3rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
                <Palette className="h-4 w-4" />
                Tag Color
              </div>
              <div className="flex flex-wrap gap-3">
                {earTagConfig.colorOptions.map((item) => {
                  const selected = colorTitle === item.title;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setColorTitle(item.title)}
                      className={`group relative h-14 w-14 overflow-hidden rounded-xl border transition ${
                        selected ? "border-slate-900 shadow-[0_10px_18px_rgba(15,23,42,0.15)]" : "border-slate-200 hover:border-slate-400"
                      }`}
                      aria-label={item.title}
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 bg-slate-100" />
                      )}
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-900">
                            <Check className="h-4 w-4" />
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[1.3rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
                <Type className="h-4 w-4" />
                Engraving
              </div>
              <input
                value={petNameDraft}
                onChange={(event) => setPetNameDraft(event.target.value)}
                disabled={Boolean(savedPetName) || saving}
                placeholder="Enter pet name"
                className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[1.6rem] font-semibold uppercase tracking-wide text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
              <p className="text-[1.25rem] leading-6 text-slate-500">
                {savedPetName
                  ? "Your pet name is locked after the first save, just like the original flow."
                  : "Set your pet name once. It becomes permanent after you apply changes."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[1.3rem] font-semibold uppercase tracking-[0.08em] text-slate-700">
                <Shield className="h-4 w-4" />
                Boundary
              </div>
              <div className="flex flex-wrap gap-3">
                {boundaryOptions.map((item, index) => {
                  const selected = boundaryImageUrl === item.imageUrl;

                  return (
                    <button
                      key={item.imageUrl}
                      type="button"
                      onClick={() => setBoundaryImageUrl(item.imageUrl)}
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border transition ${
                        selected ? "border-slate-900 shadow-[0_10px_18px_rgba(15,23,42,0.15)]" : "border-slate-200 hover:border-slate-400"
                      }`}
                      aria-label={item.title || `Boundary ${index + 1}`}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title || `Boundary ${index + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      {selected && (
                        <span className="absolute inset-0 border-2 border-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasConfig && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[1.35rem] text-amber-800">
          Ear tag options are not configured by admin yet. You can still assign your pet name here.
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[1.35rem] text-emerald-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[1.35rem] text-rose-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={() => void applyChanges()}
        disabled={saving}
        className="flex w-full items-center justify-center gap-3 rounded-[22px] border border-slate-200 bg-white px-6 py-5 text-[1.8rem] font-semibold text-slate-700 shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Applying Changes
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            Apply Changes
          </>
        )}
      </button>

      <p className="text-center text-[1.2rem] leading-6 text-slate-500">
        Tags are handcrafted and shipped within 3 to 5 business days. All custom designs are final sale.
      </p>
    </section>
  );
}
