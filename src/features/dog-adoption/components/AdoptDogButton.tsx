"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  MessageCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Heart,
  User,
  Phone,
} from "lucide-react";

import type { EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type AdoptDogButtonProps = {
  dogId: string;
  earTagConfig: EarTagGlobalConfigRecord;
};

type Step = "details" | "style" | "color" | "boundary" | "confirm" | "success";

const SUPPORT_WHATSAPP = "+92 303 5763435";
const SUPPORT_WHATSAPP_LINK = "https://wa.me/923035763435";

const STEP_LABELS: Record<Step, string> = {
  details: "Your Info",
  style: "Style",
  color: "Color",
  boundary: "Boundary",
  confirm: "Confirm",
  success: "",
};

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
  const hasTagConfig = styleOptions.length > 0 && colorOptions.length > 0 && boundaryOptions.length > 0;

  // Steps depend on whether ear tag config exists
  const activeSteps: Step[] = hasTagConfig
    ? ["details", "style", "color", "boundary", "confirm"]
    : ["details", "confirm"];

  const [step, setStep] = useState<Step>("details");
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [styleImageUrl, setStyleImageUrl] = useState(styleOptions[0]?.imageUrl ?? "");
  const [colorTitle, setColorTitle] = useState(colorOptions[0]?.title ?? "");
  const [boundaryImageUrl, setBoundaryImageUrl] = useState(boundaryOptions[0]?.imageUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentStepIdx = activeSteps.indexOf(step);

  function validateDetails() {
    let ok = true;
    if (!applicantName.trim()) {
      setNameError("Please enter your full name");
      ok = false;
    } else {
      setNameError("");
    }
    if (!applicantPhone.trim()) {
      setPhoneError("Please enter your WhatsApp / phone number");
      ok = false;
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(applicantPhone.trim())) {
      setPhoneError("Please enter a valid phone number");
      ok = false;
    } else {
      setPhoneError("");
    }
    return ok;
  }

  function goNext() {
    const idx = activeSteps.indexOf(step);
    const next = activeSteps[idx + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const idx = activeSteps.indexOf(step);
    const prev = activeSteps[idx - 1];
    if (prev) setStep(prev);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/adoption-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dogId,
          applicantName: applicantName.trim(),
          applicantPhone: applicantPhone.trim(),
          earTagStyle: styleImageUrl,
          earTagColor: colorTitle,
          earTagBoundary: boundaryImageUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not submit adoption request.");
      }

      setSuccessMessage(payload.message ?? "Adoption request submitted!");
      setStep("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="space-y-5 p-6">
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-emerald-800">Request Submitted!</h3>
            <p className="mt-1 text-sm text-emerald-700">{successMessage}</p>
          </div>

          {/* Next steps */}
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">What Happens Next</p>
            {[
              "Our team reviews your request within 24 hours",
              "Contact us on WhatsApp below to confirm and arrange payment",
              "Once approved, your dog will be ready for pickup!",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="mb-3 text-sm font-semibold text-green-800">Contact us for payment &amp; pickup details:</p>
            <a
              href={SUPPORT_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow transition hover:bg-[#1fb85a]"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp · {SUPPORT_WHATSAPP}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Progress Bar ────────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="flex items-center gap-0">
      {activeSteps.map((s, i) => {
        const done = i < currentStepIdx;
        const active = i === currentStepIdx;
        return (
          <div key={s} className="flex flex-1 items-center">
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
              <span className={`hidden text-[10px] font-semibold sm:block ${active ? "text-emerald-700" : done ? "text-slate-400" : "text-slate-300"}`}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < activeSteps.length - 1 && (
              <div className={`mb-4 h-0.5 flex-1 mx-1 ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Image option picker shared by style & boundary steps
  const ImagePicker = ({
    options,
    selected,
    onSelect,
  }: {
    options: { title: string; imageUrl: string }[];
    selected: string;
    onSelect: (url: string) => void;
  }) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((item) => {
        const isSelected = selected === item.imageUrl;
        return (
          <button
            key={item.imageUrl}
            type="button"
            onClick={() => onSelect(item.imageUrl)}
            className={`overflow-hidden rounded-2xl border-2 transition ${
              isSelected
                ? "border-emerald-500 shadow-md shadow-emerald-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="relative h-24 w-full bg-slate-100">
              <Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />
              {isSelected && (
                <div className="absolute inset-0 flex items-end justify-end bg-emerald-600/10 p-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
            <p className={`py-2 text-center text-xs font-semibold ${isSelected ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-600"}`}>
              {item.title}
            </p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Adopt This Dog</p>
        <h3 className="mt-0.5 text-base font-bold text-slate-900">
          {step === "details" && "Your Details"}
          {step === "style" && "Choose Ear Tag Style"}
          {step === "color" && "Choose Ear Tag Color"}
          {step === "boundary" && "Choose Reflective Boundary"}
          {step === "confirm" && "Review & Submit"}
        </h3>
      </div>

      <ProgressBar />

      {/* ── Step: Your Details ────────────────────────────────────────────── */}
      {step === "details" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            We&apos;ll use these details to process your adoption request. No account needed.
          </p>

          <div className="space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Ahmed Khan"
                  value={applicantName}
                  onChange={(e) => {
                    setApplicantName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    nameError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  }`}
                />
              </div>
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                WhatsApp / Phone Number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="e.g. +92 300 1234567"
                  value={applicantPhone}
                  onChange={(e) => {
                    setApplicantPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                    phoneError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
                  }`}
                />
              </div>
              {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-700">
              <strong>Adoption fee: PKR 5,000</strong> — payable via WhatsApp after admin approval.
            </p>
          </div>

          <button
            onClick={() => {
              if (validateDetails()) goNext();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            {hasTagConfig ? (
              <>Next: Customize Ear Tag <ChevronRight className="h-4 w-4" /></>
            ) : (
              <>Continue <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      )}

      {/* ── Step: Style ───────────────────────────────────────────────────── */}
      {step === "style" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Pick the ear tag design for your dog</p>
          <ImagePicker options={styleOptions} selected={styleImageUrl} onSelect={setStyleImageUrl} />
          <div className="flex gap-2">
            <button onClick={goBack} className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!styleImageUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              Next: Color <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Color ───────────────────────────────────────────────────── */}
      {step === "color" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Select the color of the ear tag</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {colorOptions.map((item) => {
              const isSelected = colorTitle === item.title;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setColorTitle(item.title)}
                  className={`overflow-hidden rounded-2xl border-2 transition ${
                    isSelected ? "border-emerald-500 shadow-md shadow-emerald-100" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-24 w-full bg-slate-100">
                    <Image src={item.imageUrl} alt={item.title} fill sizes="120px" className="object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-end justify-end bg-emerald-600/10 p-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`py-2 text-center text-xs font-semibold ${isSelected ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-600"}`}>
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button onClick={goBack} className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!colorTitle}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              Next: Boundary <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Boundary ────────────────────────────────────────────────── */}
      {step === "boundary" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Choose the reflective boundary design</p>
          <ImagePicker options={boundaryOptions} selected={boundaryImageUrl} onSelect={setBoundaryImageUrl} />
          <div className="flex gap-2">
            <button onClick={goBack} className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={goNext}
              disabled={!boundaryImageUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              Review & Confirm <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Confirm ─────────────────────────────────────────────────── */}
      {step === "confirm" && (
        <div className="space-y-4">
          {/* Applicant summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Details</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="font-semibold">{applicantName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Phone className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{applicantPhone}</span>
            </div>
          </div>

          {/* Ear tag summary */}
          {hasTagConfig && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Ear Tag Selection</p>
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
                      ) : null}
                    </div>
                    <div className="bg-slate-50 px-2 py-1.5 text-center">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">{row.label}</p>
                      <p className="truncate text-xs font-semibold text-slate-700">{row.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs text-amber-700">
              <strong>Adoption fee: PKR 5,000</strong> — you will be contacted via WhatsApp with payment &amp; pickup details after approval.
            </p>
          </div>

          {submitError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={goBack}
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
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
