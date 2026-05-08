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
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Customization</p>
          <h2 className="mt-2 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Customize Pet Tag</h2>
          <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-[#707072]">
            Design a unique ID tag for your buddy. All tags include premium engraving and QR tracking.
          </p>
        </div>
      )}

      {/* Preview + Options */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)]">
          {/* Live Preview */}
          <div className="border-b border-[#E5E5E5] p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-[#0f7a47]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Live Preview</p>
            </div>

            <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-6 lg:min-h-[320px]">
              <div className="relative flex h-[160px] w-[160px] items-center justify-center rounded-xl border border-[#E5E5E5] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:h-[180px] sm:w-[180px]">
                <div className="absolute inset-[18px] overflow-hidden rounded-lg bg-[#f3f3ee]">
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
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#707072]">
                      Tag No. {dog.dogId.slice(0, 4).toUpperCase()}
                    </span>
                    <span className="text-2xl font-black uppercase tracking-tight text-[#111111]">{engravingValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-5 p-5 lg:p-6">
            {/* Style */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#0f7a47]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Select Style</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {styleOptions.slice(0, 3).map((item, index) => {
                  const selected = styleImageUrl === item.imageUrl;

                  return (
                    <button
                      key={item.imageUrl}
                      type="button"
                      onClick={() => setStyleImageUrl(item.imageUrl)}
                      className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                        selected
                          ? "border-[#111111] bg-[#111111]/5"
                          : "border-[#E5E5E5] bg-white hover:border-[#111111]/30"
                      }`}
                      aria-label={item.title || `Style ${index + 1}`}
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="40px" className="object-cover" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#0f7a47]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Tag Color</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {earTagConfig.colorOptions.slice(0, 5).map((item) => {
                  const selected = colorTitle === item.title;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setColorTitle(item.title)}
                      className={`relative h-10 w-10 overflow-hidden rounded-xl border-2 transition ${
                        selected
                          ? "border-[#111111]"
                          : "border-[#E5E5E5] hover:border-[#111111]/30"
                      }`}
                      aria-label={item.title}
                    >
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} fill sizes="40px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 bg-[#f3f3ee]" />
                      )}
                      {selected && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <Check className="h-4 w-4 text-[#111111]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Engraving */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-[#0f7a47]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Engraving</p>
              </div>
              <input
                value={petNameDraft}
                onChange={(event) => setPetNameDraft(event.target.value)}
                disabled={Boolean(savedPetName) || saving}
                placeholder="Enter pet name"
                className="h-12 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 text-base font-black uppercase tracking-wide text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10 disabled:cursor-not-allowed disabled:bg-[#f3f3ee] disabled:text-[#707072]"
              />
            </div>

            {/* Boundary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0f7a47]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Boundary</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#707072]">
                  {normalizeTitle(selectedBoundary?.title, "Reflective Boundary")}
                </span>
                <div className="flex gap-2">
                  {boundaryOptions.slice(0, 3).map((item, index) => {
                    const selected = boundaryImageUrl === item.imageUrl;

                    return (
                      <button
                        key={item.imageUrl}
                        type="button"
                        onClick={() => setBoundaryImageUrl(item.imageUrl)}
                        className={`relative h-8 w-8 overflow-hidden rounded-lg border-2 transition ${
                          selected
                            ? "border-[#111111]"
                            : "border-[#E5E5E5] hover:border-[#111111]/30"
                        }`}
                        aria-label={item.title || `Boundary ${index + 1}`}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.title || `Boundary ${index + 1}`}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
          Ear tag options are not configured by admin yet. You can still assign your pet name here.
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Apply Changes */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white px-5 py-5">
        <button
          type="button"
          onClick={() => void applyChanges()}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying Changes
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Apply Changes
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs font-medium leading-relaxed text-[#707072]">
        Tags are handcrafted and shipped within 3 to 5 business days. All custom designs are final sale.
      </p>
    </section>
  );
}
