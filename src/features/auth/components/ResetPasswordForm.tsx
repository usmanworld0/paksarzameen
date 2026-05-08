"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

function formatCnicInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);

  if (digits.length <= 5) return part1;
  if (digits.length <= 12) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
}

type Props = {
  token?: string;
};

export function ResetPasswordForm({ token = "" }: Props) {
  const hasToken = useMemo(() => token.trim().length > 0, [token]);
  const [cnic, setCnic] = useState("");
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
      body: JSON.stringify({ token, cnic, password }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Failed to reset password.");
      return;
    }

    setMessage(payload.message ?? "Password updated.");
    setCnic("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">PakSarZameen</p>
        <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-[#111111]">Reset Password</h1>
        <p className="mt-2 text-sm font-medium text-[#707072]">Set a new password for your account.</p>
      </div>

      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        {!hasToken ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            Invalid reset link. Request a new one.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Confirm CNIC</span>
              <input
                type="text"
                required
                value={cnic}
                onChange={(event) => setCnic(formatCnicInput(event.target.value))}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                placeholder="12345-1234567-1"
                inputMode="numeric"
                maxLength={15}
                pattern="\d{5}-\d{7}-\d"
                title="Enter CNIC as 12345-1234567-1"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">New password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                placeholder="Strong password"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Confirm password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                placeholder="Repeat password"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#111111] py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        {message ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</p>
        ) : null}

        <p className="mt-5 text-center text-xs font-medium text-[#707072]">
          Back to{" "}
          <Link href="/login" className="font-semibold text-[#0f7a47] hover:text-[#1a9d5f]">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}
