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
    <div className="site-auth-form-wrap">
    <form onSubmit={onSubmit} className="site-auth-form space-y-4">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Password Recovery</p>
        <h1 className="site-auth-form__heading">Reset password</h1>
        <p className="site-auth-form__copy">Confirm your email and CNIC, then choose a new password.</p>
      </div>

      <label className="block space-y-2">
        <span className="site-form-label">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="site-input"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="site-form-label">CNIC</span>
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

      {message ? <p className="site-status--success">{message}</p> : null}
      {error ? <p className="site-status--error">{error}</p> : null}

      <div className="text-center text-[1.3rem] text-[#707072]">
        Back to{" "}
        <Link href="/login" className="font-medium text-[#111111] hover:text-[#707072]">
          login
        </Link>
      </div>
    </form>
    </div>
  );
}
