"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Props = {
  token?: string;
};

export function ResetPasswordForm({ token = "" }: Props) {
  const hasToken = useMemo(() => token.trim().length > 0, [token]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Failed to reset password.");
      return;
    }

    setMessage(payload.message ?? "Password updated.");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-8">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Secure Reset</p>
        <h1 className="text-3xl font-semibold text-emerald-950">Reset password</h1>
      </div>

      {!hasToken ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Invalid reset link. Request a new one.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
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
        </form>
      )}

      {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-4 text-center text-sm text-emerald-900/80">
        Back to{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          login
        </Link>
      </div>
    </div>
  );
}
