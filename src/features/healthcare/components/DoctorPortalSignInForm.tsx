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
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5 rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-9">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-emerald-950">Doctor sign in</h1>
        <p className="text-sm text-emerald-900/70">
          Sign in with your doctor account. Approved accounts go straight to the doctor dashboard.
        </p>
      </div>

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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Enter your password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in as doctor"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-emerald-900/80">
        <Link href="/healthcare/doctor/sign-up" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Need a doctor account?
        </Link>
        <Link href="/healthcare" className="font-medium text-emerald-700 hover:text-emerald-800">
          Back to healthcare
        </Link>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {supabaseError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {supabaseError}
        </p>
      ) : null}
    </form>
  );
}
