"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Loader2, Shield, Type } from "lucide-react";

import type { DogRecord, EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type MyPetPersonalizationPanelProps = {
  dog: DogRecord;
  earTagConfig: EarTagGlobalConfigRecord;
  showHeader?: boolean;
};

function optionTitle(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function MyPetPersonalizationPanel({ dog, earTagConfig }: MyPetPersonalizationPanelProps) {
  const styleOptions = useMemo(
    () => earTagConfig.styleOptions.length ? earTagConfig.styleOptions : earTagConfig.styleImages.map((imageUrl, index) => ({ title: `Style ${index + 1}`, imageUrl })),
    [earTagConfig.styleImages, earTagConfig.styleOptions]
  );
  const boundaryOptions = useMemo(
    () => earTagConfig.boundaryOptions.length ? earTagConfig.boundaryOptions : earTagConfig.boundaryImages.map((imageUrl, index) => ({ title: `Boundary ${index + 1}`, imageUrl })),
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

  const hasConfig = styleOptions.length > 0 && earTagConfig.colorOptions.length > 0 && boundaryOptions.length > 0;
  const selectedStyle = styleOptions.find((item) => item.imageUrl === styleImageUrl) ?? styleOptions[0] ?? null;
  const selectedColor = earTagConfig.colorOptions.find((item) => item.title === colorTitle) ?? earTagConfig.colorOptions[0] ?? null;
  const selectedBoundary = boundaryOptions.find((item) => item.imageUrl === boundaryImageUrl) ?? boundaryOptions[0] ?? null;

  async function applyChanges() {
    setSaving(true); setError(null); setSuccess(null);
    try {
      let latestPetName = savedPetName;
      if (!latestPetName) {
        const nextPetName = petNameDraft.trim();
        if (!nextPetName) throw new Error("Please enter an engraving name before applying changes.");
        const response = await fetch(`/api/my-pets/${dog.dogId}/pet-name`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ petName: nextPetName }) });
        const payload = (await response.json()) as { error?: string; data?: DogRecord };
        if (!response.ok) throw new Error(payload.error ?? "Failed to assign pet name.");
        latestPetName = payload.data?.petName ?? nextPetName;
        setSavedPetName(latestPetName); setPetNameDraft(latestPetName);
      }
      if (hasConfig) {
        const response = await fetch(`/api/my-pets/${dog.dogId}/ear-tag`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ styleImageUrl, colorTitle, boundaryImageUrl }) });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Failed to save ear tag customization.");
      }
      setSuccess(hasConfig ? "Pet tag customization saved successfully." : "Pet name assigned successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to apply changes.");
    } finally { setSaving(false); }
  }

  const previewImages = [selectedStyle?.imageUrl, selectedColor?.imageUrl, selectedBoundary?.imageUrl].filter((image): image is string => Boolean(image));

  return (
    <section className="bg-white lg:h-[calc(100vh-144px)] lg:overflow-hidden">
      <div className="grid grid-cols-1 lg:h-full lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)]">
        <div className="space-y-4 bg-[#fcfbf8] px-5 py-5 sm:px-8 lg:h-full lg:overflow-y-auto lg:px-0 lg:py-0 scrollbar-thin">
          <div className="relative min-h-[430px] overflow-hidden bg-[#f1f0eb] sm:min-h-[560px] lg:min-h-[calc(100vh-144px)]">
            <Image src={dog.imageUrl} alt={dog.name} fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
            <div className="absolute left-5 top-5 border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-950">{dog.breed}</div>
            <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div><p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/75">Pet tag for</p><p className="mt-2 text-3xl tracking-[-0.06em] sm:text-5xl">{dog.petName ?? dog.name}</p></div>
              <p className="text-right text-xs leading-5 text-white/80">{dog.locationLabel ?? dog.city ?? "Paksarzameen Shelter"}</p>
            </div>
          </div>
          {previewImages.length > 0 ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{previewImages.map((imageUrl, index) => <div key={`${imageUrl}-${index}`} className="relative aspect-square overflow-hidden bg-[#f1f0eb]"><Image src={imageUrl} alt="Selected tag detail" fill sizes="(min-width:1024px) 19vw, 45vw" className="object-cover" /></div>)}</div> : null}
        </div>

        <div className="max-w-xl px-5 py-10 sm:px-8 lg:h-full lg:max-w-[560px] lg:justify-self-center lg:overflow-y-auto lg:px-10 lg:py-[clamp(3rem,7vh,5.5rem)] scrollbar-thin">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Personalize your pet tag</p>
          <h1 className="mt-3 text-center text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[0.9] tracking-[-0.07em] text-neutral-950">{dog.petName ?? dog.name}&apos;s tag</h1>
          <p className="mt-5 text-center text-sm leading-6 text-neutral-500">Choose the details for a unique ID tag, engraved and prepared for your adopted companion.</p>

          <div className="mt-8 border-y border-black/10 py-4 text-sm text-neutral-700">
            <p className="py-1.5">Premium engraving and QR tracking included.</p><p className="py-1.5">Handcrafted for your adopted pet.</p><p className="py-1.5">Estimated preparation: 3–5 business days.</p>
          </div>

          <div className="mt-7 space-y-7">
            <div><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">Select style</p><div className="mt-3 grid grid-cols-3 gap-2">{styleOptions.map((item, index) => <button key={item.imageUrl} type="button" onClick={() => setStyleImageUrl(item.imageUrl)} className={`relative aspect-square overflow-hidden border transition ${styleImageUrl === item.imageUrl ? "border-neutral-950" : "border-black/10 hover:border-neutral-500"}`} aria-label={item.title || `Style ${index + 1}`}><Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />{styleImageUrl === item.imageUrl && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-neutral-950"><Check className="h-3 w-3" /></span>}</button>)}</div></div>
            <div><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">Tag color</p><div className="mt-3 grid grid-cols-3 gap-2">{earTagConfig.colorOptions.map((item) => <button key={item.title} type="button" onClick={() => setColorTitle(item.title)} className={`relative min-h-16 overflow-hidden border px-3 py-4 text-left transition ${colorTitle === item.title ? "border-neutral-950" : "border-black/10 hover:border-neutral-500"}`}>{item.imageUrl ? <Image src={item.imageUrl} alt="" fill sizes="120px" className="object-cover opacity-75" /> : null}<span className="relative text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-950">{item.title}</span>{colorTitle === item.title && <Check className="absolute right-2 top-2 h-4 w-4 text-neutral-950" />}</button>)}</div></div>
            <div><div className="flex items-center gap-2"><Type className="h-4 w-4 text-neutral-500" /><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">Engraving</p></div><input value={petNameDraft} onChange={(event) => setPetNameDraft(event.target.value)} disabled={Boolean(savedPetName) || saving} placeholder="Enter pet name" className="mt-3 h-13 w-full border border-black/15 px-4 text-lg tracking-[-0.03em] text-neutral-950 outline-none transition focus:border-neutral-950 disabled:bg-neutral-100 disabled:text-neutral-500" /></div>
            <div><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-neutral-500" /><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">Reflective boundary</p></div><div className="mt-3 grid grid-cols-3 gap-2">{boundaryOptions.map((item, index) => <button key={item.imageUrl} type="button" onClick={() => setBoundaryImageUrl(item.imageUrl)} className={`relative aspect-square overflow-hidden border transition ${boundaryImageUrl === item.imageUrl ? "border-neutral-950" : "border-black/10 hover:border-neutral-500"}`} aria-label={optionTitle(item.title, `Boundary ${index + 1}`)}><Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />{boundaryImageUrl === item.imageUrl && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-neutral-950"><Check className="h-3 w-3" /></span>}</button>)}</div></div>
          </div>

          {!hasConfig && <p className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">Ear tag options are not configured yet. You can still assign your pet&apos;s engraving name.</p>}
          {success && <p className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</p>}
          {error && <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
          <button type="button" onClick={() => void applyChanges()} disabled={saving} className="mt-8 flex h-14 w-full items-center justify-center gap-3 bg-neutral-950 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving tag</> : <>Save pet tag <Check className="h-4 w-4" /></>}</button>
          <p className="mt-5 text-center text-xs leading-5 text-neutral-500">Custom tags are handcrafted and final sale.</p>
        </div>
      </div>
    </section>
  );
}
