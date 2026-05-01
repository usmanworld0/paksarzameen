"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export function DoctorPortalSignInForm() {
  const [supabaseError] = useState(() => {
    try {
      createClient();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Supabase is not configured.";
    }
  });
  const supabase = supabaseError ? null : createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError(supabaseError ?? "Supabase is not configured.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      setError(signInError.message || "Unable to sign in.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign("/healthcare/doctor");
  }

  return (
    <form onSubmit={handleSubmit} className="site-auth-form space-y-4">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Doctor Portal</p>
        <h1 className="site-auth-form__heading">Doctor Sign In</h1>
        <p className="site-auth-form__copy">
          Sign in with your doctor account to access the healthcare dashboard.
        </p>
      </div>

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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="site-input"
          placeholder="Enter your password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in as doctor"}
      </button>

      <div className="site-inline-links text-[1.3rem]">
        <Link href="/healthcare/doctor/sign-up" className="font-medium text-[#111111] hover:text-[#707072]">
          Need a doctor account?
        </Link>
        <Link href="/healthcare" className="font-medium text-[#111111] hover:text-[#707072]">
          Back to healthcare
        </Link>
      </div>

      {error ? <p className="site-status--error">{error}</p> : null}
      {supabaseError ? <p className="site-status">{supabaseError}</p> : null}
    </form>
  );
}
