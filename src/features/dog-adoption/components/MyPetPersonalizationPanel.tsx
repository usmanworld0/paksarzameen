"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { DogRecord, EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type MyPetPersonalizationPanelProps = {
  dog: DogRecord;
  earTagConfig: EarTagGlobalConfigRecord;
};

export function MyPetPersonalizationPanel({
  dog,
  earTagConfig,
}: MyPetPersonalizationPanelProps) {
  const styleOptions = useMemo(
    () =>
      earTagConfig.styleOptions.length > 0
        ? earTagConfig.styleOptions
        : earTagConfig.styleImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig.styleImages, earTagConfig.styleOptions],
  );

  const boundaryOptions = useMemo(
    () =>
      earTagConfig.boundaryOptions.length > 0
        ? earTagConfig.boundaryOptions
        : earTagConfig.boundaryImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig.boundaryImages, earTagConfig.boundaryOptions],
  );

  const [petName, setPetName] = useState("");
  const [petNameSaving, setPetNameSaving] = useState(false);
  const [earTagSaving, setEarTagSaving] = useState(false);
  const [styleImageUrl, setStyleImageUrl] = useState(
    dog.earTagStyleImageUrl ?? styleOptions[0]?.imageUrl ?? "",
  );
  const [color, setColor] = useState(dog.earTagColor ?? earTagConfig.colorOptions[0] ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(
    dog.earTagBoundaryImageUrl ?? boundaryOptions[0]?.imageUrl ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savedPetName, setSavedPetName] = useState<string | null>(dog.petName);

  const hasConfig = useMemo(
    () =>
      styleOptions.length > 0 &&
      earTagConfig.colorOptions.length > 0 &&
      boundaryOptions.length > 0,
    [boundaryOptions.length, earTagConfig.colorOptions.length, styleOptions.length],
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
        body: JSON.stringify({ styleImageUrl, color, boundaryImageUrl }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save ear tag customization.");
      }

      setSuccess("Ear tag customization saved successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save ear tag customization.",
      );
    } finally {
      setEarTagSaving(false);
    }
  }

  return (
    <section className="site-panel site-panel--rounded">
      <div className="site-panel__body">
        <p className="site-card__eyebrow">Personalization</p>
        <h2 className="site-heading site-heading--sm mt-3">Customize The Ear Tag</h2>
        <p className="site-copy mt-4">
          Assign your pet name once, then choose the ear tag style, color, and reflective boundary.
        </p>

        <div className="site-stack mt-6">
          {savedPetName ? (
            <div className="site-callout">Pet name: {savedPetName}</div>
          ) : (
            <div className="site-stack">
              <label className="site-form-label site-form-label--caps" htmlFor="pet-name">
                Assign Pet Name
              </label>
              <div className="site-form-actions">
                <input
                  id="pet-name"
                  className="site-input flex-1"
                  placeholder="Enter pet name"
                  value={petName}
                  onChange={(event) => setPetName(event.target.value)}
                  disabled={petNameSaving}
                />
                <button
                  type="button"
                  onClick={() => void savePetName()}
                  disabled={petNameSaving}
                  className="site-button"
                >
                  {petNameSaving ? "Saving..." : "Save Name"}
                </button>
              </div>
            </div>
          )}
        </div>

        {!savedPetName ? (
          <p className="site-copy site-copy--sm mt-4">
            Ear tag customization unlocks once the pet name is assigned.
          </p>
        ) : null}

        {savedPetName && hasConfig ? (
          <div className="site-stack--lg mt-6">
            <div>
              <label className="site-form-label site-form-label--caps">Ear Tag Style</label>
              <div className="site-grid mt-3 sm:grid-cols-2">
                {styleOptions.map((item) => (
                  <button
                    key={item.imageUrl}
                    type="button"
                    onClick={() => setStyleImageUrl(item.imageUrl)}
                    className={`site-card overflow-hidden text-left ${
                      styleImageUrl === item.imageUrl ? "border-[#111111]" : ""
                    }`}
                  >
                    <div className="site-detail__media h-32">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "Ear tag style"}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <div className="site-card__body !p-4">
                      <p className="site-copy site-copy--sm text-[#111111]">{item.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="site-form-label site-form-label--caps" htmlFor="ear-tag-color">
                Color
              </label>
              <select
                id="ear-tag-color"
                className="site-select mt-2"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              >
                {earTagConfig.colorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="site-form-label site-form-label--caps">
                Reflective Boundary
              </label>
              <div className="site-grid mt-3 sm:grid-cols-2">
                {boundaryOptions.map((item) => (
                  <button
                    key={item.imageUrl}
                    type="button"
                    onClick={() => setBoundaryImageUrl(item.imageUrl)}
                    className={`site-card overflow-hidden text-left ${
                      boundaryImageUrl === item.imageUrl ? "border-[#111111]" : ""
                    }`}
                  >
                    <div className="site-detail__media h-32">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || "Reflective boundary"}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <div className="site-card__body !p-4">
                      <p className="site-copy site-copy--sm text-[#111111]">{item.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => void saveEarTag()}
              disabled={earTagSaving}
              className="site-button"
            >
              {earTagSaving ? "Saving..." : "Save Ear Tag"}
            </button>
          </div>
        ) : null}

        {savedPetName && !hasConfig ? (
          <div className="site-callout mt-6">
            Ear tag options are not configured by admin yet.
          </div>
        ) : null}

        {success ? <p className="site-status--success mt-6">{success}</p> : null}
        {error ? <p className="site-status--error mt-6">{error}</p> : null}
      </div>
    </section>
  );
}
