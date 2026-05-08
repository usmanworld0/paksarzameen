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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-5 rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.07)] sm:p-9"
    >
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctor Portal</p>
        <h1 className="text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">Doctor Sign In</h1>
        <p className="text-sm font-medium text-[#707072]">
          Sign in with your doctor account. Approved accounts go straight to the doctor dashboard.
        </p>
      </div>

      <label className="block">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
          placeholder="doctor@example.com"
        />
      </label>

      <label className="block">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
          placeholder="Enter your password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in as doctor"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/healthcare/doctor/sign-up"
          className="text-xs font-semibold text-[#0f7a47] transition hover:text-[#1a9d5f]"
        >
          Need a doctor account?
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
      {supabaseError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          {supabaseError}
        </p>
      ) : null}
    </form>
  );
}
