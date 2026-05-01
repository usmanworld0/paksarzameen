"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

import type { EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type AdoptDogButtonProps = {
  dogId: string;
  earTagConfig: EarTagGlobalConfigRecord;
};

const SUPPORT_WHATSAPP = "+92 303 5763435";

export function AdoptDogButton({ dogId, earTagConfig }: AdoptDogButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<"ear-tag" | "confirmation">("ear-tag");

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

  const [styleImageUrl, setStyleImageUrl] = useState(styleOptions[0]?.imageUrl ?? "");
  const [color, setColor] = useState(earTagConfig.colorOptions[0] ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(boundaryOptions[0]?.imageUrl ?? "");

  const hasConfig = useMemo(
    () => styleOptions.length > 0 && earTagConfig.colorOptions.length > 0 && boundaryOptions.length > 0,
    [boundaryOptions.length, earTagConfig.colorOptions.length, styleOptions.length]
  );

  async function handleAdopt() {
    if (!styleImageUrl || !color || !boundaryImageUrl) {
      setError("Please select all ear tag options");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/adoption-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dogId,
          whatsappNumber: SUPPORT_WHATSAPP,
          earTagStyle: styleImageUrl,
          earTagColor: color,
          earTagBoundary: boundaryImageUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (response.status === 401) {
        const callbackUrl = encodeURIComponent(`/dog/${dogId}`);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not submit adoption request.");
      }

      setSuccess(payload.message ?? "Adoption request submitted!");
      setStep("confirmation");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation Step
  if (step === "confirmation" && success) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <span className="text-lg">✓</span>
            {success}
          </p>
          <p className="text-sm text-emerald-700">Your adoption request has been received!</p>
        </div>

        <div className="space-y-3 rounded-xl border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Next Steps</p>
          <div className="space-y-2 text-sm text-slate-700">
            <p>1. Our team will review your adoption request</p>
            <p>2. Contact us on WhatsApp for further processing and payment</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <a
                href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\s+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {SUPPORT_WHATSAPP}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ear Tag Selection Step
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900">Select Your Ear Tag Style</h3>
      <p className="text-sm text-slate-600">Choose how you&apos;d like to customize your dog&apos;s ear tag after adoption</p>

      {hasConfig && (
        <div className="space-y-4">
          {/* Ear Tag Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">Ear Tag Style</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {styleOptions.map((item) => (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setStyleImageUrl(item.imageUrl)}
                  disabled={submitting}
                  className={`relative overflow-hidden rounded-xl border-2 transition ${
                    styleImageUrl === item.imageUrl
                      ? "border-emerald-600 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-300"
                  } disabled:opacity-50`}
                >
                  <div className="relative h-20 w-full bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Ear tag style"}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <p className="bg-white px-2 py-1 text-[11px] font-medium text-slate-700">{item.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">Color</label>
            <select
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={submitting}
              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            >
              {earTagConfig.colorOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Boundary */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">Reflective Boundary</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {boundaryOptions.map((item) => (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setBoundaryImageUrl(item.imageUrl)}
                  disabled={submitting}
                  className={`relative overflow-hidden rounded-xl border-2 transition ${
                    boundaryImageUrl === item.imageUrl
                      ? "border-emerald-600 ring-2 ring-emerald-200"
                      : "border-slate-200 hover:border-slate-300"
                  } disabled:opacity-50`}
                >
                  <div className="relative h-20 w-full bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Reflective boundary"}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <p className="bg-white px-2 py-1 text-[11px] font-medium text-slate-700">{item.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={() => void handleAdopt()}
        disabled={submitting || !styleImageUrl || !color || !boundaryImageUrl}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-800/25 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Processing..." : "Submit Adoption Request"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
