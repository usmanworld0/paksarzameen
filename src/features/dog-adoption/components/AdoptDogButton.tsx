"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Check, Loader2, MessageCircle, Phone, User, Tag, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

import type { EarTagGlobalConfigRecord, EarTagDesignItem, EarTagColorVariant, EarTagBoundaryVariant } from "@/lib/dog-adoption";

type AdoptDogButtonProps = {
  dogId: string;
  dogName: string;
  earTagConfig: EarTagGlobalConfigRecord;
};

type VisualOption = {
  id: string;
  title: string;
  imageUrl: string;
  textColor?: string;
  hexCode?: string;
};

const SUPPORT_WHATSAPP = "+92 303 5763435";
const SUPPORT_WHATSAPP_LINK = "https://wa.me/923035763435";
const ADOPTION_FEE = "PKR 5,000";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-500">
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
      className={`group relative overflow-hidden rounded-[26px] border text-left transition-all duration-500 ${
        selected
          ? "border-emerald-600 bg-emerald-50/20 shadow-[0_20px_40px_rgba(15,122,71,0.08)] ring-1 ring-emerald-600"
          : "border-black/5 bg-white hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_20px_40px_rgba(17,17,17,0.04)]"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <Image
          src={option.imageUrl}
          alt={option.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute right-4 top-4">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
              selected
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-white/40 bg-white/80 text-neutral-900"
            }`}
          >
            {selected ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 text-center">
        <p
          className={`text-[0.92rem] font-semibold leading-tight tracking-[-0.01em] ${
            selected ? "text-emerald-950" : "text-neutral-800"
          }`}
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
    <div className="rounded-[24px] border border-black/5 bg-white p-3.5 shadow-sm transition hover:shadow-md">
      <div className="overflow-hidden rounded-[18px] bg-neutral-50 relative aspect-[4/5] w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-neutral-400">
            Not selected
          </div>
        )}
      </div>
      <p className="mt-3.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-none text-neutral-855">{title}</p>
    </div>
  );
}

export function AdoptDogButton({ dogId, dogName, earTagConfig }: AdoptDogButtonProps) {
  const designs = useMemo<EarTagDesignItem[]>(() => earTagConfig.designs || [], [earTagConfig]);

  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [proposedPetName, setProposedPetName] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [petNameError, setPetNameError] = useState("");
  const [petNameValidating, setPetNameValidating] = useState(false);
  const [petNameAvailable, setPetNameAvailable] = useState<boolean | null>(null);

  // Cascading Customizer States
  const [selectedDesignId, setSelectedDesignId] = useState(designs[0]?.id || "");
  const activeDesign = useMemo(() => designs.find((d) => d.id === selectedDesignId) || null, [designs, selectedDesignId]);

  const colorOptions = useMemo<VisualOption[]>(() => {
    if (!activeDesign) return [];
    return activeDesign.colors.map((c) => ({
      id: c.id,
      title: c.title,
      imageUrl: c.imageUrl,
      textColor: c.textColor,
      hexCode: c.hexCode,
    }));
  }, [activeDesign]);

  const boundaryOptions = useMemo<VisualOption[]>(() => {
    if (!activeDesign) return [];
    return activeDesign.boundaries.map((b) => ({
      id: b.id,
      title: b.title,
      imageUrl: b.imageUrl,
    }));
  }, [activeDesign]);

  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedBoundaryId, setSelectedBoundaryId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle cascading state resets when selected design changes
  useEffect(() => {
    if (activeDesign) {
      setSelectedColorId(activeDesign.colors[0]?.id || "");
      setSelectedBoundaryId(activeDesign.boundaries[0]?.id || "");
    }
  }, [selectedDesignId, activeDesign]);

  const activeColor = useMemo(() => colorOptions.find((c) => c.id === selectedColorId) || null, [colorOptions, selectedColorId]);
  const activeBoundary = useMemo(() => boundaryOptions.find((b) => b.id === selectedBoundaryId) || null, [boundaryOptions, selectedBoundaryId]);

  // Pet name availability live validation
  useEffect(() => {
    const trimmed = proposedPetName.trim();
    if (!trimmed) {
      setPetNameAvailable(null);
      setPetNameError("");
      return;
    }

    const timer = setTimeout(async () => {
      setPetNameValidating(true);
      setPetNameError("");
      try {
        const response = await fetch(`/api/adoption-requests/check-nickname?name=${encodeURIComponent(trimmed)}`);
        const payload = (await response.json()) as { available?: boolean; error?: string };
        if (response.ok) {
          setPetNameAvailable(payload.available ?? false);
          if (payload.available === false) {
            setPetNameError(`The nickname "${trimmed}" is already reserved by another dog.`);
          }
        } else {
          setPetNameAvailable(null);
        }
      } catch {
        setPetNameAvailable(null);
      } finally {
        setPetNameValidating(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [proposedPetName]);

  const supportWhatsappLink = useMemo(() => {
    const lines = [
      "Assalam o Alaikum,",
      "I have submitted a dog adoption request.",
      `Dog: ${dogName}`,
      `Proposed Pet Name: ${proposedPetName.trim() || "-"}`,
      `Design: ${activeDesign?.title || "-"}`,
      `Color: ${activeColor?.title || "-"}`,
      `Boundary: ${activeBoundary?.title || "-"}`,
      `Applicant: ${applicantName.trim() || "-"}`,
      `WhatsApp: ${applicantPhone.trim() || "-"}`,
      "I want to make the adoption payment and proceed with the next steps.",
    ];

    return `${SUPPORT_WHATSAPP_LINK}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [applicantName, applicantPhone, dogName, proposedPetName, activeDesign, activeColor, activeBoundary]);

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

    if (!proposedPetName.trim()) {
      setPetNameError("A custom pet name is required.");
      valid = false;
    } else if (petNameAvailable === false) {
      setPetNameError("This pet name is already taken. Please choose another.");
      valid = false;
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
          proposedPetName: proposedPetName.trim(),
          earTagDesignId: selectedDesignId,
          earTagDesignTitle: activeDesign?.title ?? "",
          earTagStyle: activeColor?.imageUrl ?? activeDesign?.imageUrl ?? "",
          earTagColor: activeColor?.title ?? "",
          earTagBoundary: activeBoundary?.imageUrl ?? "",
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
      <section className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.05)] sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <SectionLabel>Adoption Pending</SectionLabel>
        <h2 className="mt-4 text-[clamp(2rem,3.8vw,3.2rem)] font-semibold leading-[1.0] tracking-[-0.04em] text-neutral-900">
          Request submitted successfully.
        </h2>
        <p className="mt-4 text-[0.98rem] leading-7 text-neutral-650">{successMessage}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-black/5 bg-neutral-50/50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Adopted Companion</p>
            <p className="mt-2 text-[1.1rem] font-semibold text-neutral-900">{dogName}</p>
            {proposedPetName && (
              <p className="mt-1 text-sm text-emerald-600 font-medium">Pet Name: &ldquo;{proposedPetName}&rdquo;</p>
            )}
          </div>
          <div className="rounded-[24px] border border-black/5 bg-neutral-50/50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Adopter Details</p>
            <p className="mt-2 text-[1.1rem] font-semibold text-neutral-900">{applicantName}</p>
            <p className="mt-1 text-sm text-neutral-500">{applicantPhone}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[26px] border border-black/5 bg-neutral-50/50 p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Complete Adoption Steps
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-650">
            Please proceed to WhatsApp to receive guidance from our team, complete the adoption documentation, and clear details.
          </p>

          <a
            href={supportWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-900 bg-neutral-900 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-neutral-800 hover:-translate-y-0.5 shadow-lg"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            Message on WhatsApp
          </a>

          <p className="mt-4 text-center text-xs text-neutral-400 font-medium">{SUPPORT_WHATSAPP}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Kicker Header */}
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.045)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SectionLabel>Adoption Portal</SectionLabel>
            <h2 className="mt-3 text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-[1.0] tracking-[-0.05em] text-neutral-900">
              Personalize & Adopt
            </h2>
          </div>

          <div className="rounded-full border border-black/5 bg-neutral-50 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-505">
            Contribution: {ADOPTION_FEE}
          </div>
        </div>
      </div>

      {/* Adopter Details */}
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.045)] sm:p-8">
        <SectionLabel>1. Applicant Details</SectionLabel>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
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
                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition-all duration-305 placeholder:text-neutral-450 ${
                  nameError
                    ? "border-red-350 focus:border-red-450 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                    : "border-black/5 focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(15,122,71,0.05)]"
                }`}
              />
            </div>
            {nameError ? <p className="mt-2 text-xs text-red-650 font-medium">{nameError}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
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
                className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-neutral-900 outline-none transition-all duration-305 placeholder:text-neutral-450 ${
                  phoneError
                    ? "border-red-355 focus:border-red-455 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                    : "border-black/5 focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(15,122,71,0.05)]"
                }`}
              />
            </div>
            {phoneError ? <p className="mt-2 text-xs text-red-655 font-medium">{phoneError}</p> : null}
          </div>
        </div>
      </div>

      {/* Pet Name Selection Card */}
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.045)] sm:p-8">
        <SectionLabel>2. Engrave Companion Name</SectionLabel>
        <div className="mt-5 max-w-lg">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Proposed Pet Name
          </label>
          <div className="relative">
            <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={proposedPetName}
              onChange={(event) => {
                setProposedPetName(event.target.value.replace(/[^a-zA-Z\s]/g, ""));
                setPetNameError("");
              }}
              placeholder="e.g. Simba, Luna, Max"
              className={`h-13 w-full rounded-2xl border bg-white pl-11 pr-12 text-base font-medium text-neutral-900 outline-none transition-all duration-305 placeholder:text-neutral-450 ${
                petNameError
                  ? "border-red-350 focus:border-red-450 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                  : "border-black/5 focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(15,122,71,0.05)]"
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              {petNameValidating ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-neutral-400" />
              ) : petNameAvailable === true ? (
                <Check className="h-5 w-5 text-emerald-600" strokeWidth={3} />
              ) : petNameAvailable === false ? (
                <AlertCircle className="h-5 w-5 text-red-505" />
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-400 leading-normal">
            This name will be engraved on their customized ear tag and permanently logged in the shelter index. Only letters and spaces.
          </p>
          {petNameError ? (
            <p className="mt-2.5 text-xs text-red-650 font-semibold flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {petNameError}
            </p>
          ) : petNameAvailable === true ? (
            <p className="mt-2.5 text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Nickname is available!
            </p>
          ) : null}
        </div>
      </div>

      {/* Cascading Ear Tag Selector */}
      {designs.length > 0 ? (
        <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.045)] sm:p-8 space-y-8">
          <div>
            <SectionLabel>3. Custom Ear Tag Setup</SectionLabel>
            <p className="mt-2 text-sm text-neutral-500">Designs are compiled natively. Select a design, color variant, and reflective edge.</p>
          </div>

          {/* Design Selection */}
          <div className="border-t border-black/5 pt-6">
            <div className="mb-4">
              <p className="text-base font-semibold tracking-[-0.02em] text-neutral-900">Ear Tag Design</p>
              <p className="text-xs text-neutral-505 mt-1">Choose the base geometric design layout.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((option) => (
                <SelectionCard
                  key={option.id}
                  option={{
                    id: option.id,
                    title: option.title,
                    imageUrl: option.imageUrl,
                  }}
                  selected={selectedDesignId === option.id}
                  onSelect={() => setSelectedDesignId(option.id)}
                />
              ))}
            </div>
          </div>

          {/* Color Selection - Cascaded */}
          {colorOptions.length > 0 && (
            <div className="border-t border-black/5 pt-6">
              <div className="mb-4">
                <p className="text-base font-semibold tracking-[-0.02em] text-neutral-900">
                  Tag Color Variant for <span className="text-emerald-700">{activeDesign?.title}</span>
                </p>
                <p className="text-xs text-neutral-505 mt-1">Pick a color configured specifically for this design.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {colorOptions.map((option) => (
                  <SelectionCard
                    key={option.id}
                    option={option}
                    selected={selectedColorId === option.id}
                    onSelect={() => setSelectedColorId(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Boundary Selection - Cascaded */}
          {boundaryOptions.length > 0 && (
            <div className="border-t border-black/5 pt-6">
              <div className="mb-4">
                <p className="text-base font-semibold tracking-[-0.02em] text-neutral-900">
                  Reflective Boundary Variant for <span className="text-emerald-700">{activeDesign?.title}</span>
                </p>
                <p className="text-xs text-neutral-505 mt-1">Reflective boundaries ensure location visibility in darkness.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {boundaryOptions.map((option) => (
                  <SelectionCard
                    key={option.id}
                    option={option}
                    selected={selectedBoundaryId === option.id}
                    onSelect={() => setSelectedBoundaryId(option.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Summary and Pass Composite Card */}
      <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(17,17,17,0.045)] sm:p-8 space-y-6">
        <SectionLabel>4. Verification & Summary</SectionLabel>

        {/* Vision Pro styled Pass Composite Preview Card */}
        <div className="relative overflow-hidden rounded-[30px] border border-neutral-800 bg-[#0d120f] text-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
                  Official Adoption Pass
                </span>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-450">Shelter ID</p>
                <h3 className="text-3xl font-bold tracking-tighter leading-tight mt-1">{dogName}</h3>
              </div>

              {proposedPetName && (
                <div className="transition-all duration-300">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-450">New Pet Name</p>
                  <p className="text-2xl font-black text-emerald-300 tracking-tight leading-none mt-1.5">
                    &ldquo;{proposedPetName.trim()}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {activeDesign && (
                <div className="rounded-[20px] bg-white/5 border border-white/10 px-4 py-3 text-center min-w-[90px] backdrop-blur-md">
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-neutral-450 block">Design</span>
                  <span className="text-xs font-semibold text-neutral-200 mt-1 block truncate max-w-[80px]">
                    {activeDesign.title}
                  </span>
                </div>
              )}
              {activeColor && (
                <div className="rounded-[20px] bg-white/5 border border-white/10 px-4 py-3 text-center min-w-[90px] backdrop-blur-md">
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-neutral-450 block">Color</span>
                  <span className="text-xs font-semibold text-neutral-200 mt-1 block truncate max-w-[80px]">
                    {activeColor.title}
                  </span>
                </div>
              )}
              {activeBoundary && (
                <div className="rounded-[20px] bg-white/5 border border-white/10 px-4 py-3 text-center min-w-[90px] backdrop-blur-md">
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-neutral-450 block">Boundary</span>
                  <span className="text-xs font-semibold text-neutral-200 mt-1 block truncate max-w-[80px]">
                    {activeBoundary.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Regular list summary details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] border border-black/5 bg-neutral-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Proposed Pet Name</p>
            <p className="mt-2 text-base font-semibold text-neutral-905">
              {proposedPetName.trim() || "(Enter custom pet name above)"}
            </p>
          </div>
          <div className="rounded-[22px] border border-black/5 bg-neutral-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Adopter Details</p>
            <p className="mt-2 text-base font-semibold text-neutral-905">{applicantName || "Your name"}</p>
            <p className="mt-1 text-sm text-neutral-505">{applicantPhone || "WhatsApp number"}</p>
          </div>
        </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <PreviewTile
              label="Tag Design Style"
              title={activeDesign?.title ?? "Not selected"}
              imageUrl={activeDesign?.imageUrl}
            />
            <PreviewTile
              label="Selected Color"
              title={activeColor?.title ?? "Not selected"}
              imageUrl={activeColor?.imageUrl}
            />
            <PreviewTile
              label="Selected Boundary"
              title={activeBoundary?.title ?? "Not selected"}
              imageUrl={activeBoundary?.imageUrl}
            />
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-750 font-medium">
            {submitError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-900 bg-neutral-900 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg hover:-translate-y-0.5"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting request
            </>
          ) : (
            <>
              <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
              Submit adoption request
            </>
          )}
        </button>
      </div>
    </section>
  );
}
