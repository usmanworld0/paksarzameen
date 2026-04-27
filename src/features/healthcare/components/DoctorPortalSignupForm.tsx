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

  if (isLoadingContext) {
    return (
      <div className="w-full max-w-xl rounded-3xl border border-emerald-100 bg-white p-7 text-sm text-slate-600 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-9">
        Loading doctor application form...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5 rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-9">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-emerald-950">
          {isAuthenticated ? "Update doctor application" : "Apply as a doctor"}
        </h1>
        <p className="text-sm text-emerald-900/70">
          {isAuthenticated
            ? "Update your details and resubmit your doctor request for admin approval."
            : "Create a doctor account, then an admin will approve or decline the request before dashboard access opens."}
        </p>
      </div>

      {existingStatus !== "none" ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Current request status:</span> {existingStatus}
          </p>
          {existingAdminNote ? (
            <p className="mt-2">
              <span className="font-semibold text-slate-900">Admin note:</span> {existingAdminNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-950">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="doctor@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-950">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              placeholder="At least 8 characters"
            />
          </label>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Signed in as <span className="font-semibold text-slate-900">{email}</span>
        </div>
      )}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Full name</span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Dr. Your Name"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Specialization</span>
        <input
          value={specialization}
          onChange={(event) => setSpecialization(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Cardiology, Pediatrics, General Medicine..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-950">Experience years</span>
          <input
            type="number"
            min={0}
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="8"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-emerald-950">Consultation fee</span>
          <input
            type="number"
            min={0}
            value={consultationFee}
            onChange={(event) => setConsultationFee(event.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="1500"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Professional bio</span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className="min-h-28 w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Share your clinical background, focus areas, and experience."
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Submitting..."
          : isAuthenticated
            ? "Resubmit for approval"
            : "Create doctor account"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-emerald-900/80">
        <Link href="/healthcare/doctor/sign-in" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Already have an account?
        </Link>
        <Link href="/healthcare" className="font-medium text-emerald-700 hover:text-emerald-800">
          Back to healthcare
        </Link>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p> : null}
      {supabaseError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {supabaseError}
        </p>
      ) : null}
    </form>
  );
}
