"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const signInResult = await signIn("email-password", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!signInResult || signInResult.error) {
      setError(signInResult?.error || "Invalid credentials. Please try again.");
      return;
    }

    router.push(signInResult.url || callbackUrl || "/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">PakSarZameen</p>
        <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tighter text-[#111111]">Sign In</h1>
        <p className="mt-2 text-sm font-medium text-[#707072]">Welcome back. Enter your credentials below.</p>
      </div>

      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072]">Password</span>
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
            className="w-full rounded-xl bg-[#111111] py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{error}</p>
          ) : null}
        </form>

        <div className="mt-5 flex items-center justify-between">
          <Link href="/signup" className="text-xs font-semibold text-[#0f7a47] hover:text-[#1a9d5f]">
            Create account
          </Link>
          <Link href="/forgot-password" className="text-xs font-semibold text-[#0f7a47] hover:text-[#1a9d5f]">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
