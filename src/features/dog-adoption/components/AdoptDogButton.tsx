"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MessageCircle, Check, ChevronRight, ChevronLeft, Loader2, Heart } from "lucide-react";

import type { EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type AdoptDogButtonProps = {
  dogId: string;
  earTagConfig: EarTagGlobalConfigRecord;
};

type Step = "style" | "color" | "boundary" | "confirm" | "success";

const SUPPORT_WHATSAPP = "+92 303 5763435";

const WIZARD_STEPS: { key: Step; label: string }[] = [
  { key: "style", label: "Style" },
  { key: "color", label: "Color" },
  { key: "boundary", label: "Boundary" },
  { key: "confirm", label: "Confirm" },
];

export function AdoptDogButton({ dogId, earTagConfig }: AdoptDogButtonProps) {
  const styleOptions = useMemo(
    () =>
      earTagConfig.styleOptions.length > 0
        ? earTagConfig.styleOptions
        : earTagConfig.styleImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig]
  );

  const boundaryOptions = useMemo(
    () =>
      earTagConfig.boundaryOptions.length > 0
        ? earTagConfig.boundaryOptions
        : earTagConfig.boundaryImages.map((imageUrl) => ({ title: "Untitled", imageUrl })),
    [earTagConfig]
  );

  const colorOptions = earTagConfig.colorOptions;

  const hasConfig =
    styleOptions.length > 0 && colorOptions.length > 0 && boundaryOptions.length > 0;

  const [step, setStep] = useState<Step>(hasConfig ? "style" : "confirm");
  const [styleImageUrl, setStyleImageUrl] = useState(styleOptions[0]?.imageUrl ?? "");
  const [colorTitle, setColorTitle] = useState(colorOptions[0]?.title ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(boundaryOptions[0]?.imageUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentStepIdx = WIZARD_STEPS.findIndex((s) => s.key === step);

  async function handleSubmit() {
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
          earTagColor: colorTitle,
          earTagBoundary: boundaryImageUrl,
        }),
      });
      const payload = (await response.json()) as { error?: string; message?: string };
      if (response.status === 401) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(`/dog/${dogId}`)}`;
        return;
      }
      if (!response.ok) throw new Error(payload.error ?? "Could not submit adoption request.");
      setSuccessMessage(payload.message ?? "Adoption request submitted!");
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──
  if (step === "success" && successMessage) {
    return (
      <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="space-y-5 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Request Submitted!</h3>
            <p className="mt-1 text-sm text-emerald-700">{successMessage}</p>
          </div>
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">What Happens Next</p>
            {[
              "Our team reviews your adoption request",
              "We'll contact you on WhatsApp for confirmation & payment",
              "Once approved, you get to name your new companion!",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/[\s+]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-semibold text-white shadow transition hover:bg-[#1fb85a]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ── No-config fallback ──
  if (!hasConfig) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:opacity-70"
        >
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : <><Heart className="h-4 w-4" />Submit Adoption Request</>}
        </button>
        {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Ear Tag Customization</p>
        <h3 className="mt-0.5 text-base font-bold text-slate-900">
          {step === "style" && "Choose a Style"}
          {step === "color" && "Choose a Color"}
          {step === "boundary" && "Choose Reflective Boundary"}
          {step === "confirm" && "Review & Confirm"}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-0">
        {WIZARD_STEPS.map((s, i) => {
          const done = i < currentStepIdx;
          const active = i === currentStepIdx;
          return (
            <div key={s.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition ${
                    done
                      ? "bg-emerald-600 text-white"
                      : active
                      ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={`hidden text-[10px] font-semibold sm:block ${
                    active ? "text-emerald-700" : done ? "text-slate-500" : "text-slate-300"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < WIZARD_STEPS.length - 1 && (
                <div className={`mb-4 h-0.5 flex-1 mx-1 ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step: Style ── */}
      {step === "style" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Pick the ear tag design that suits your dog</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {styleOptions.map((item) => {
              const selected = styleImageUrl === item.imageUrl;
              return (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setStyleImageUrl(item.imageUrl)}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition ${
                    selected
                      ? "border-emerald-500 shadow-md shadow-emerald-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />
                    {selected && (
                      <div className="absolute inset-0 flex items-end justify-end bg-emerald-600/10 p-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`py-2 text-center text-xs font-semibold ${selected ? "text-emerald-700 bg-emerald-50" : "text-slate-600 bg-white"}`}>
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep("color")}
            disabled={!styleImageUrl}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            Next: Pick Color <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Step: Color ── */}
      {step === "color" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Select the color of your dog&apos;s ear tag</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {colorOptions.map((item) => {
              const selected = colorTitle === item.title;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setColorTitle(item.title)}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition ${
                    selected
                      ? "border-emerald-500 shadow-md shadow-emerald-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />
                    {selected && (
                      <div className="absolute inset-0 flex items-end justify-end bg-emerald-600/10 p-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`py-2 text-center text-xs font-semibold ${selected ? "text-emerald-700 bg-emerald-50" : "text-slate-600 bg-white"}`}>
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep("style")}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep("boundary")}
              disabled={!colorTitle}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              Next: Boundary <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Boundary ── */}
      {step === "boundary" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Choose the reflective boundary design</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {boundaryOptions.map((item) => {
              const selected = boundaryImageUrl === item.imageUrl;
              return (
                <button
                  key={item.imageUrl}
                  type="button"
                  onClick={() => setBoundaryImageUrl(item.imageUrl)}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition ${
                    selected
                      ? "border-emerald-500 shadow-md shadow-emerald-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />
                    {selected && (
                      <div className="absolute inset-0 flex items-end justify-end bg-emerald-600/10 p-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`py-2 text-center text-xs font-semibold ${selected ? "text-emerald-700 bg-emerald-50" : "text-slate-600 bg-white"}`}>
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep("color")}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => setStep("confirm")}
              disabled={!boundaryImageUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              Review & Confirm <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Confirm ── */}
      {step === "confirm" && (
        <div className="space-y-4">
          {hasConfig && (
            <>
              <p className="text-sm text-slate-500">Your ear tag selections — looks great!</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Style",
                    imageUrl: styleImageUrl,
                    title: styleOptions.find((s) => s.imageUrl === styleImageUrl)?.title ?? "—",
                  },
                  {
                    label: "Color",
                    imageUrl: colorOptions.find((c) => c.title === colorTitle)?.imageUrl ?? "",
                    title: colorTitle || "—",
                  },
                  {
                    label: "Boundary",
                    imageUrl: boundaryImageUrl,
                    title: boundaryOptions.find((b) => b.imageUrl === boundaryImageUrl)?.title ?? "—",
                  },
                ].map((row) => (
                  <div key={row.label} className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="relative h-20 w-full bg-slate-100">
                      {row.imageUrl ? (
                        <Image src={row.imageUrl} alt={row.label} fill sizes="100px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300 text-xs">No image</div>
                      )}
                    </div>
                    <div className="bg-slate-50 px-2 py-1.5 text-center">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">{row.label}</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{row.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-700">
              <strong>Adoption fee: PKR 5,000</strong> — payable after admin approval via WhatsApp.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            {hasConfig && (
              <button
                onClick={() => setStep("boundary")}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
              ) : (
                <><Heart className="h-4 w-4" />Submit Adoption Request</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
