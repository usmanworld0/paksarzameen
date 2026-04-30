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
    <form onSubmit={onSubmit} className="site-auth-form space-y-4">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Welcome Back</p>
        <h2 className="site-auth-form__heading">Sign in</h2>
        <p className="site-auth-form__copy">Use your email and password to access your donor dashboard.</p>
      </div>

      <label className="block space-y-2">
        <span className="site-form-label">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="site-input"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="site-form-label">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="site-input"
          placeholder="Enter your password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <div className="site-inline-links text-[1.3rem]">
        <Link href="/signup" className="font-medium text-[#111111] hover:text-[#707072]">
          Create account
        </Link>
        <Link href="/forgot-password" className="font-medium text-[#111111] hover:text-[#707072]">
          Forgot password?
        </Link>
      </div>

      {error ? <p className="site-status--error">{error}</p> : null}
    </form>
  );
}
