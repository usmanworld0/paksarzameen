"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function formatCnicInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);

  if (digits.length <= 5) return part1;
  if (digits.length <= 12) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, cnic, password }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(payload.error ?? "Failed to update password.");
      setIsSubmitting(false);
      return;
    }

    setMessage(payload.message ?? "Password updated successfully.");
    setEmail("");
    setCnic("");
    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-8">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Password Recovery</p>
        <h1 className="text-3xl font-semibold text-emerald-950">Reset password</h1>
        <p className="text-sm text-emerald-900/70">Confirm your email and CNIC, then choose a new password.</p>
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

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">CNIC</span>
        <input
          type="text"
          required
          value={cnic}
          onChange={(event) => setCnic(formatCnicInput(event.target.value))}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="12345-1234567-1"
          inputMode="numeric"
          maxLength={15}
          pattern="\d{5}-\d{7}-\d"
          title="Enter CNIC as 12345-1234567-1"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">New password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Strong password"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Confirm password</span>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Repeat password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update password"}
      </button>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="text-center text-sm text-emerald-900/80">
        Back to{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          login
        </Link>
      </div>
    </form>
  );
}
