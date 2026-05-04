"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Loader2, Palette, ScanLine, Shield, Type } from "lucide-react";

import type { DogRecord, EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type MyPetPersonalizationPanelProps = {
  dog: DogRecord;
  earTagConfig: EarTagGlobalConfigRecord;
  showHeader?: boolean;
};

function normalizeTitle(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function MyPetPersonalizationPanel({
  dog,
  earTagConfig,
  showHeader = true,
}: MyPetPersonalizationPanelProps) {
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
  const selectedColor =
    earTagConfig.colorOptions.find((item) => item.title === colorTitle) ?? earTagConfig.colorOptions[0] ?? null;
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
    <section className="space-y-4">
      {showHeader && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2.2rem]">Customize Pet Tag</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking.
          </p>
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)]">
          <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
              <ScanLine className="h-4 w-4" />
              Live Preview
            </div>

            <div className="flex min-h-[260px] items-center justify-center rounded-[20px] bg-[#fbfaf7] p-6 lg:min-h-[320px]">
              <div className="relative flex h-[160px] w-[160px] items-center justify-center rounded-[6px] border border-slate-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:h-[180px] sm:w-[180px]">
                <div className="absolute inset-[18px] overflow-hidden rounded-[4px] bg-slate-100">
                  {selectedColor?.imageUrl ? (
                    <Image src={selectedColor.imageUrl} alt={selectedColor.title} fill sizes="180px" className="object-cover" />
                  ) : null}
                  {selectedStyle?.imageUrl ? (
                    <Image src={selectedStyle.imageUrl} alt={selectedStyle.title} fill sizes="180px" className="object-cover mix-blend-multiply" />
                  ) : null}
                  {selectedBoundary?.imageUrl ? (
                    <Image src={selectedBoundary.imageUrl} alt={selectedBoundary.title} fill sizes="180px" className="object-cover mix-blend-multiply" />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/55 px-4 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Tag No. {dog.dogId.slice(0, 4).toUpperCase()}
                    </span>
                    <span className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">{engravingValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 lg:p-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                <Palette className="h-4 w-4" />
                Select Style
              </div>
              <div className="grid grid-cols-3 gap-3">
                {styleOptions.slice(0, 3).map((item, index) => {
                  const selected = styleImageUrl === item.imageUrl;

                  return (
                    <button
                      key={item.imageUrl}
                      type="button"
                      onClick={() => setStyleImageUrl(item.imageUrl)}
                      className={`relative flex aspect-square items-center justify-center rounded-[6px] border transition ${
                        selected ? "border-slate-900 bg-slate-50" : "border-slate-300 bg-white hover:border-slate-500"
                      }`}
                      aria-label={item.title || `Style ${index + 1}`}
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-sm">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="40px" className="object-cover" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                <Palette className="h-4 w-4" />
                Tag Color
              </div>
              <div className="flex flex-wrap gap-3">
                {earTagConfig.colorOptions.slice(0, 5).map((item) => {
                  const selected = colorTitle === item.title;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setColorTitle(item.title)}
                      className={`relative h-10 w-10 overflow-hidden rounded-[6px] border transition ${
                        selected ? "border-slate-900 bg-slate-50" : "border-slate-300 bg-white hover:border-slate-500"
                      }`}
                      aria-label={item.title}
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill sizes="40px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 bg-slate-100" />
                      )}
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <Check className="h-4 w-4 text-slate-900" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                <Type className="h-4 w-4" />
                Engraving
              </div>
              <input
                value={petNameDraft}
                onChange={(event) => setPetNameDraft(event.target.value)}
                disabled={Boolean(savedPetName) || saving}
                placeholder="Enter pet name"
                className="h-12 w-full rounded-[6px] border border-slate-300 bg-white px-4 text-base font-semibold uppercase tracking-wide text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                <Shield className="h-4 w-4" />
                Boundary
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700">{normalizeTitle(selectedBoundary?.title, "Reflective Boundary")}</span>
                <div className="flex gap-2">
                  {boundaryOptions.slice(0, 3).map((item, index) => {
                    const selected = boundaryImageUrl === item.imageUrl;

                    return (
                      <button
                        key={item.imageUrl}
                        type="button"
                        onClick={() => setBoundaryImageUrl(item.imageUrl)}
                        className={`relative h-8 w-8 overflow-hidden rounded-[4px] border transition ${
                          selected ? "border-slate-900" : "border-slate-300 hover:border-slate-500"
                        }`}
                        aria-label={item.title || `Boundary ${index + 1}`}
                      >
                        <Image src={item.imageUrl} alt={item.title || `Boundary ${index + 1}`} fill sizes="32px" className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasConfig && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Ear tag options are not configured by admin yet. You can still assign your pet name here.
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="rounded-[20px] border border-slate-200 bg-white px-5 py-5">
        <button
          type="button"
          onClick={() => void applyChanges()}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-3 rounded-[16px] border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
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
      </div>

      <p className="text-center text-xs leading-6 text-slate-500">
        Tags are handcrafted and shipped within 3 to 5 business days. All custom designs are final sale.
      </p>
    </section>
  );
}
