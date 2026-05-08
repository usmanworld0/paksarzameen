"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedCnic = cnic.trim();
    if (!/^\d{5}-\d{7}-\d$/.test(normalizedCnic)) {
      setError("Please provide a valid CNIC format (e.g., 12345-1234567-1).");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Default new accounts to `donor` so users can both donate and request blood.
      body: JSON.stringify({ name, email, cnic: normalizedCnic, password, role: "donor" }),
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
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">PakSarZameen</p>
        <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-[#111111]">Sign Up</h1>
        <p className="mt-2 text-sm font-medium text-[#707072]">Create an account to register as a donor or request blood when needed.</p>
      </div>

      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Full name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              placeholder="Your full name"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">CNIC</span>
            <input
              required
              inputMode="numeric"
              value={cnic}
              onChange={(event) => setCnic(event.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              placeholder="12345-1234567-1"
              pattern="\d{5}-\d{7}-\d"
              maxLength={15}
              title="CNIC format should be 12345-1234567-1"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              placeholder="At least 8 chars with uppercase and number"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#111111] py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </form>

        <p className="mt-5 text-center text-xs font-medium text-[#707072]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#0f7a47] hover:text-[#1a9d5f]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
