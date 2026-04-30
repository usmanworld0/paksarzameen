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
    <div className="site-auth-form-wrap">
    <div className="site-auth-form">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Secure Reset</p>
        <h1 className="site-auth-form__heading">Reset password</h1>
      </div>

      {!hasToken ? (
        <p className="site-status--error mt-4">
          Invalid reset link. Request a new one.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="site-form-label">Confirm CNIC</span>
            <input
              type="text"
              required
              value={cnic}
              onChange={(event) => setCnic(formatCnicInput(event.target.value))}
              className="site-input"
              placeholder="12345-1234567-1"
              inputMode="numeric"
              maxLength={15}
              pattern="\d{5}-\d{7}-\d"
              title="Enter CNIC as 12345-1234567-1"
            />
          </label>

          <label className="block space-y-2">
            <span className="site-form-label">New password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="site-input"
              placeholder="Strong password"
            />
          </label>

          <label className="block space-y-2">
            <span className="site-form-label">Confirm password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="site-input"
              placeholder="Repeat password"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      )}

      {message ? <p className="site-status--success mt-4">{message}</p> : null}
      {error ? <p className="site-status--error mt-4">{error}</p> : null}

      <div className="mt-4 text-center text-[1.3rem] text-[#707072]">
        Back to{" "}
        <Link href="/login" className="font-medium text-[#111111] hover:text-[#707072]">
          login
        </Link>
      </div>
    </div>
    </div>
  );
}
