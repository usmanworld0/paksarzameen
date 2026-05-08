"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { Check, Loader2, MessageCircle, Phone, User } from "lucide-react";

import type { EarTagGlobalConfigRecord } from "@/lib/dog-adoption";

type AdoptDogButtonProps = {
  dogId: string;
  dogName: string;
  earTagConfig: EarTagGlobalConfigRecord;
};

type VisualOption = {
  title: string;
  imageUrl: string;
  textColor?: string;
};

const SUPPORT_WHATSAPP = "+92 303 5763435";
const SUPPORT_WHATSAPP_LINK = "https://wa.me/923035763435";
const ADOPTION_FEE = "PKR 5,000";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
      {children}
    </p>
  );
}

function SelectionCard({
  option,
  selected,
  onSelect,
}: {
  option: VisualOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden rounded-[24px] border text-left transition-all duration-300 ${
        selected
          ? "border-neutral-950 bg-white shadow-[0_18px_48px_rgba(17,17,17,0.08)]"
          : "border-black/8 bg-white hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_18px_48px_rgba(17,17,17,0.05)]"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f0ea]">
        <Image
          src={option.imageUrl}
          alt={option.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        <div className="absolute right-4 top-4">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md ${
              selected
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-white/35 bg-white/85 text-neutral-950"
            }`}
          >
            {selected ? <Check className="h-4 w-4" strokeWidth={2.5} /> : null}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 text-center">
        <p
          className="text-[0.92rem] leading-tight tracking-[-0.01em] text-neutral-900"
          style={option.textColor ? { color: option.textColor } : undefined}
        >
          {option.title}
        </p>
      </div>
    </button>
  );
}

function PreviewTile({
  label,
  title,
  imageUrl,
}: {
  label: string;
  title: string;
  imageUrl?: string | null;
}) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-white p-3">
      <div className="overflow-hidden rounded-[18px] bg-[#f4f0ea]">
        {imageUrl ? (
          <div className="relative aspect-[4/5] w-full">
            <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center px-4 text-center text-sm text-neutral-400">
            Not selected
          </div>
        )}
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-neutral-950">{title}</p>
    </div>
  );
}

export function AdoptDogButton({ dogId, dogName, earTagConfig }: AdoptDogButtonProps) {
  const styleOptions = useMemo<VisualOption[]>(
    () =>
      earTagConfig.styleOptions.length > 0
        ? earTagConfig.styleOptions
        : earTagConfig.styleImages.map((imageUrl, index) => ({
            title: `Style ${index + 1}`,
            imageUrl,
          })),
    [earTagConfig]
  );

  const colorOptions = useMemo<VisualOption[]>(
    () =>
      earTagConfig.colorOptions.length > 0
        ? earTagConfig.colorOptions
        : (earTagConfig.legacyColorOptions ?? []).map((imageUrl, index) => ({
            title: `Color ${index + 1}`,
            imageUrl,
          })),
    [earTagConfig]
  );

  const boundaryOptions = useMemo<VisualOption[]>(
    () =>
      earTagConfig.boundaryOptions.length > 0
        ? earTagConfig.boundaryOptions
        : earTagConfig.boundaryImages.map((imageUrl, index) => ({
            title: `Boundary ${index + 1}`,
            imageUrl,
          })),
    [earTagConfig]
  );

  const hasStyleOptions = styleOptions.length > 0;
  const hasColorOptions = colorOptions.length > 0;
  const hasBoundaryOptions = boundaryOptions.length > 0;
  const hasAnyTagConfig = hasStyleOptions || hasColorOptions || hasBoundaryOptions;

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

  const selectedStyle = styleOptions.find((option) => option.imageUrl === styleImageUrl) ?? null;
  const selectedColor = colorOptions.find((option) => option.title === colorTitle) ?? null;
  const selectedBoundary = boundaryOptions.find((option) => option.imageUrl === boundaryImageUrl) ?? null;

  const supportWhatsappLink = useMemo(() => {
    const lines = [
      "Assalam o Alaikum,",
      "I have submitted a dog adoption request.",
      `Dog: ${dogName}`,
      `Dog ID: ${dogId}`,
      `Name: ${applicantName.trim() || "-"}`,
      `WhatsApp Number: ${applicantPhone.trim() || "-"}`,
      "I want to make the adoption payment and proceed with the next steps.",
      "Please share the payment details and approval process.",
    ];

    return `${SUPPORT_WHATSAPP_LINK}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [applicantName, applicantPhone, dogId, dogName]);

  function validateDetails() {
    let valid = true;

    if (!applicantName.trim()) {
      setNameError("Please enter your full name.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!applicantPhone.trim()) {
      setPhoneError("Please enter your WhatsApp or phone number.");
      valid = false;
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(applicantPhone.trim())) {
      setPhoneError("Please enter a valid phone number.");
      valid = false;
    } else {
      setPhoneError("");
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validateDetails()) return;

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

      setSuccessMessage(payload.message ?? "Adoption request submitted successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit adoption request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <section className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
        <SectionLabel>Request Received</SectionLabel>
        <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
          Your adoption request has been submitted.
        </h2>
        <p className="mt-4 text-[15px] leading-8 text-neutral-600">{successMessage}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Dog</p>
            <p className="mt-2 text-base text-neutral-950">{dogName}</p>
          </div>
          <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Applicant</p>
            <p className="mt-2 text-base text-neutral-950">{applicantName}</p>
            <p className="mt-1 text-sm text-neutral-500">{applicantPhone}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-black/8 bg-[#fcfbf8] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            WhatsApp Payment
          </p>
          <p className="mt-3 text-[15px] leading-8 text-neutral-600">
            Continue on WhatsApp to receive approval guidance and payment details.
          </p>

          <a
            href={supportWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
          >
            <MessageCircle className="h-4 w-4" />
            Contact WhatsApp
          </a>

          <p className="mt-3 text-center text-sm text-neutral-500">{SUPPORT_WHATSAPP}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Adoption Request</SectionLabel>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] tracking-[-0.06em] text-neutral-950">
              Request this dog
            </h2>
          </div>

          <div className="rounded-full border border-black/8 bg-[#fcfbf8] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Adoption fee {ADOPTION_FEE}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
        <SectionLabel>Your Details</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={applicantName}
                onChange={(event) => {
                  setApplicantName(event.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="e.g. Ahmed Khan"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition-all duration-300 placeholder:text-neutral-400 ${
                  nameError
                    ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                    : "border-black/10 focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.04)]"
                }`}
              />
            </div>
            {nameError ? <p className="mt-2 text-sm text-red-600">{nameError}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              WhatsApp / Phone
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="tel"
                value={applicantPhone}
                onChange={(event) => {
                  setApplicantPhone(event.target.value);
                  if (phoneError) setPhoneError("");
                }}
                placeholder="e.g. +92 300 1234567"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition-all duration-300 placeholder:text-neutral-400 ${
                  phoneError
                    ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                    : "border-black/10 focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(17,17,17,0.04)]"
                }`}
              />
            </div>
            {phoneError ? <p className="mt-2 text-sm text-red-600">{phoneError}</p> : null}
          </div>
        </div>
      </div>

      {hasAnyTagConfig ? (
        <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
          <SectionLabel>Design Your Own</SectionLabel>

          <div className="mt-5 space-y-8">
            {hasStyleOptions ? (
              <div>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-base tracking-[-0.02em] text-neutral-950">Ear tag style</p>
                    <p className="mt-1 text-sm text-neutral-500">Choose the base design.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {styleOptions.map((option) => (
                    <SelectionCard
                      key={`${option.title}:${option.imageUrl}`}
                      option={option}
                      selected={styleImageUrl === option.imageUrl}
                      onSelect={() => setStyleImageUrl(option.imageUrl)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {hasColorOptions ? (
              <div>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-base tracking-[-0.02em] text-neutral-950">Ear tag color</p>
                    <p className="mt-1 text-sm text-neutral-500">Pick the finish you want.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {colorOptions.map((option) => (
                    <SelectionCard
                      key={`${option.title}:${option.imageUrl}`}
                      option={option}
                      selected={colorTitle === option.title}
                      onSelect={() => setColorTitle(option.title)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {hasBoundaryOptions ? (
              <div>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-base tracking-[-0.02em] text-neutral-950">Ear tag boundary</p>
                    <p className="mt-1 text-sm text-neutral-500">Finish the edge treatment.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {boundaryOptions.map((option) => (
                    <SelectionCard
                      key={`${option.title}:${option.imageUrl}`}
                      option={option}
                      selected={boundaryImageUrl === option.imageUrl}
                      onSelect={() => setBoundaryImageUrl(option.imageUrl)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_48px_rgba(17,17,17,0.045)] sm:p-7">
        <SectionLabel>Request Summary</SectionLabel>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Dog</p>
            <p className="mt-2 text-base text-neutral-950">{dogName}</p>
          </div>
          <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Applicant</p>
            <p className="mt-2 text-base text-neutral-950">{applicantName.trim() || "Your name will appear here"}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {applicantPhone.trim() || "Your WhatsApp number will appear here"}
            </p>
          </div>
        </div>

        {hasAnyTagConfig ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {hasStyleOptions ? (
              <PreviewTile
                label="Style"
                title={selectedStyle?.title ?? "Not selected"}
                imageUrl={selectedStyle?.imageUrl ?? null}
              />
            ) : null}
            {hasColorOptions ? (
              <PreviewTile
                label="Color"
                title={selectedColor?.title ?? "Not selected"}
                imageUrl={selectedColor?.imageUrl ?? null}
              />
            ) : null}
            {hasBoundaryOptions ? (
              <PreviewTile
                label="Boundary"
                title={selectedBoundary?.title ?? "Not selected"}
                imageUrl={selectedBoundary?.imageUrl ?? null}
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 rounded-[22px] border border-black/8 bg-[#fcfbf8] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Payment</p>
          <p className="mt-2 text-[15px] leading-8 text-neutral-600">
            Payment is shared only after admin approval.
          </p>
        </div>

        {submitError ? (
          <div className="mt-5 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting request
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Submit adoption request
            </>
          )}
        </button>
      </div>
    </section>
  );
}
