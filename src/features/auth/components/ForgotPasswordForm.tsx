"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const payload = (await response.json()) as { message?: string };
    setMessage(payload.message ?? "If your email exists, a reset link was sent.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-8">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Password Recovery</p>
        <h1 className="text-3xl font-semibold text-emerald-950">Forgot password</h1>
        <p className="text-sm text-emerald-900/70">Enter your email and we will send a reset link.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}

      <div className="text-center text-sm text-emerald-900/80">
        Back to{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          login
        </Link>
      </div>
    </form>
  );
}
