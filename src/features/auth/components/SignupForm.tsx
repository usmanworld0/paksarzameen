"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"donor" | "hospital">("donor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Failed to create account.");
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn("email-password", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!signInResult || signInResult.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4 rounded-3xl border border-emerald-100 bg-white p-7 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-9">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Join The Network</p>
        <h1 className="text-3xl font-semibold text-emerald-950">Create your account</h1>
        <p className="text-sm text-emerald-900/70">Register as a donor or hospital representative.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Full name</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="Your full name"
        />
      </label>

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
        <span className="text-sm font-medium text-emerald-950">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          placeholder="At least 8 chars with uppercase and number"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-emerald-950">Role</span>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "donor" | "hospital")}
          className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <div className="text-center text-sm text-emerald-900/80">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Sign in
        </Link>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
