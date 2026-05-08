"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type DoctorRequestResponse = {
  data?: {
    access?: "approved" | "pending" | "declined" | "none";
    request?: {
      fullName: string;
      specialization: string | null;
      bio: string | null;
      experienceYears: number | null;
      consultationFee: number | null;
      status: "pending" | "approved" | "declined";
      adminNote: string | null;
    } | null;
    user?: {
      email: string;
    };
  };
  error?: string;
};

export function DoctorPortalSignupForm() {
  const [supabaseError] = useState(() => {
    try {
      createClient();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Supabase is not configured.";
    }
  });
  const supabase = supabaseError ? null : createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [existingStatus, setExistingStatus] = useState<"pending" | "approved" | "declined" | "none">("none");
  const [existingAdminNote, setExistingAdminNote] = useState<string | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExistingContext() {
      try {
        const response = await fetch("/api/healthcare/doctor/request", {
          cache: "no-store",
          credentials: "include",
        });

        if (!isMounted) {
          return;
        }

        if (response.status === 401) {
          setIsAuthenticated(false);
          setIsLoadingContext(false);
          return;
        }

        const payload = (await response.json()) as DoctorRequestResponse;
        if (!response.ok) {
          setError(payload.error ?? "Unable to load your doctor application.");
          setIsLoadingContext(false);
          return;
        }

        if (payload.data?.access === "approved") {
          window.location.assign("/healthcare/doctor");
          return;
        }

        setIsAuthenticated(true);
        setEmail(payload.data?.user?.email ?? "");
        setFullName(payload.data?.request?.fullName ?? "");
        setSpecialization(payload.data?.request?.specialization ?? "");
        setBio(payload.data?.request?.bio ?? "");
        setExperienceYears(
          payload.data?.request?.experienceYears === null || payload.data?.request?.experienceYears === undefined
            ? ""
            : String(payload.data.request.experienceYears)
        );
        setConsultationFee(
          payload.data?.request?.consultationFee === null || payload.data?.request?.consultationFee === undefined
            ? ""
            : String(payload.data.request.consultationFee)
        );
        setExistingStatus(payload.data?.request?.status ?? "none");
        setExistingAdminNote(payload.data?.request?.adminNote ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load doctor application context.");
      } finally {
        if (isMounted) {
          setIsLoadingContext(false);
        }
      }
    }

    void loadExistingContext();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      fullName: fullName.trim(),
      specialization: specialization.trim() || null,
      bio: bio.trim() || null,
      experienceYears: experienceYears.trim() ? Number(experienceYears) : null,
      consultationFee: consultationFee.trim() ? Number(consultationFee) : null,
    };

    if (isAuthenticated) {
      const response = await fetch("/api/healthcare/doctor/request", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const responsePayload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(responsePayload.error ?? "Unable to submit doctor application.");
        setIsSubmitting(false);
        return;
      }

      setExistingStatus("pending");
      setExistingAdminNote(null);
      setSuccess("Doctor application submitted for review.");
      setIsSubmitting(false);
      window.location.assign("/healthcare/doctor");
      return;
    }

    const response = await fetch("/api/healthcare/doctor/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        ...payload,
      }),
    });

    const responsePayload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(responsePayload.error ?? "Unable to create doctor account.");
      setIsSubmitting(false);
      return;
    }

    if (!supabase) {
      setSuccess("Account created. Please sign in to continue.");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setSuccess("Account created. Please sign in to continue.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign("/healthcare/doctor");
  }

  const inputClass =
    "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

  if (isLoadingContext) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-[#E5E5E5] bg-white p-7 text-sm font-medium text-[#707072] shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:p-9">
        Loading doctor application form...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-5 rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:p-9"
    >
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctor Portal</p>
        <h1 className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
          {isAuthenticated ? "Update Doctor Application" : "Apply as a Doctor"}
        </h1>
        <p className="text-sm font-medium text-[#707072]">
          {isAuthenticated
            ? "Update your details and resubmit your doctor request for admin approval."
            : "Create a doctor account, then an admin will approve or decline the request before dashboard access opens."}
        </p>
      </div>

      {existingStatus !== "none" ? (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
          <p className="text-sm font-medium text-[#707072]">
            <span className="font-semibold text-[#111111]">Current request status:</span> {existingStatus}
          </p>
          {existingAdminNote ? (
            <p className="mt-2 text-sm font-medium text-[#707072]">
              <span className="font-semibold text-[#111111]">Admin note:</span> {existingAdminNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <>
          <label className="block">
            <span className={labelClass}>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="doctor@example.com"
            />
          </label>

          <label className="block">
            <span className={labelClass}>Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
            />
          </label>
        </>
      ) : (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 text-sm font-medium text-[#707072]">
          Signed in as <span className="font-semibold text-[#111111]">{email}</span>
        </div>
      )}

      <label className="block">
        <span className={labelClass}>Full Name</span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className={inputClass}
          placeholder="Dr. Your Name"
        />
      </label>

      <label className="block">
        <span className={labelClass}>Specialization</span>
        <input
          value={specialization}
          onChange={(event) => setSpecialization(event.target.value)}
          className={inputClass}
          placeholder="Cardiology, Pediatrics, General Medicine..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Experience Years</span>
          <input
            type="number"
            min={0}
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
            className={inputClass}
            placeholder="8"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Consultation Fee</span>
          <input
            type="number"
            min={0}
            value={consultationFee}
            onChange={(event) => setConsultationFee(event.target.value)}
            className={inputClass}
            placeholder="1500"
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Professional Bio</span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className={`min-h-28 ${inputClass}`}
          placeholder="Share your clinical background, focus areas, and experience."
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
      >
        {isSubmitting
          ? "Submitting..."
          : isAuthenticated
            ? "Resubmit for Approval"
            : "Create Doctor Account"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/healthcare/doctor/sign-in"
          className="text-xs font-semibold text-[#0f7a47] transition hover:text-[#1a9d5f]"
        >
          Already have an account?
        </Link>
        <Link
          href="/healthcare"
          className="text-xs font-semibold text-[#707072] transition hover:text-[#111111]"
        >
          Back to healthcare
        </Link>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">{success}</p>
      ) : null}
      {supabaseError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          {supabaseError}
        </p>
      ) : null}
    </form>
  );
}
