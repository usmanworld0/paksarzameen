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
  const [existingStatus, setExistingStatus] = useState<
    "pending" | "approved" | "declined" | "none"
  >("none");
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
          payload.data?.request?.experienceYears === null ||
            payload.data?.request?.experienceYears === undefined
            ? ""
            : String(payload.data.request.experienceYears),
        );
        setConsultationFee(
          payload.data?.request?.consultationFee === null ||
            payload.data?.request?.consultationFee === undefined
            ? ""
            : String(payload.data.request.consultationFee),
        );
        setExistingStatus(payload.data?.request?.status ?? "none");
        setExistingAdminNote(payload.data?.request?.adminNote ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load doctor application context.",
        );
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
    return <div className="site-auth-form">Loading doctor application form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="site-auth-form space-y-4">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Doctor Portal</p>
        <h1 className="site-auth-form__heading">
          {isAuthenticated ? "Update Doctor Application" : "Apply As A Doctor"}
        </h1>
        <p className="site-auth-form__copy">
          {isAuthenticated
            ? "Update your details and resubmit your application for review."
            : "Create a doctor account and submit your profile for admin approval."}
        </p>
      </div>

      {existingStatus !== "none" ? (
        <div className="site-status">
          <p>
            <strong>Current request status:</strong> {existingStatus}
          </p>
          {existingAdminNote ? (
            <p className="mt-2">
              <strong>Admin note:</strong> {existingAdminNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {!isAuthenticated ? (
        <>
          <label className="block space-y-2">
            <span className="site-form-label">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="site-input"
              placeholder="doctor@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="site-form-label">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="site-input"
              placeholder="At least 8 characters"
            />
          </label>
        </>
      ) : (
        <div className="site-status">
          Signed in as <strong>{email}</strong>
        </div>
      )}

      <label className="block space-y-2">
        <span className="site-form-label">Full Name</span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="site-input"
          placeholder="Dr. Your Name"
        />
      </label>

      <label className="block space-y-2">
        <span className="site-form-label">Specialization</span>
        <input
          value={specialization}
          onChange={(event) => setSpecialization(event.target.value)}
          className="site-input"
          placeholder="Cardiology, Pediatrics, General Medicine..."
        />
      </label>

      <div className="site-grid site-grid--two">
        <label className="block space-y-2">
          <span className="site-form-label">Experience Years</span>
          <input
            type="number"
            min={0}
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
            className="site-input"
            placeholder="8"
          />
        </label>

        <label className="block space-y-2">
          <span className="site-form-label">Consultation Fee</span>
          <input
            type="number"
            min={0}
            value={consultationFee}
            onChange={(event) => setConsultationFee(event.target.value)}
            className="site-input"
            placeholder="1500"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="site-form-label">Professional Bio</span>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className="site-textarea"
          placeholder="Share your clinical background, focus areas, and experience."
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Submitting..."
          : isAuthenticated
            ? "Resubmit For Approval"
            : "Create Doctor Account"}
      </button>

      <div className="site-inline-links text-[1.3rem]">
        <Link href="/healthcare/doctor/sign-in" className="font-medium text-[#111111] hover:text-[#707072]">
          Already have an account?
        </Link>
        <Link href="/healthcare" className="font-medium text-[#111111] hover:text-[#707072]">
          Back to healthcare
        </Link>
      </div>

      {error ? <p className="site-status--error">{error}</p> : null}
      {success ? <p className="site-status--success">{success}</p> : null}
      {supabaseError ? <p className="site-status">{supabaseError}</p> : null}
    </form>
  );
}
