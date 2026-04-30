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
    <div className="site-auth-form-wrap">
    <form onSubmit={onSubmit} className="site-auth-form max-w-lg space-y-4">
      <div className="site-auth-form__intro">
        <p className="site-auth-form__eyebrow">Join The Network</p>
        <h1 className="site-auth-form__heading">Create your account</h1>
        <p className="site-auth-form__copy">Create an account to register as a donor or request blood when needed.</p>
      </div>

      <label className="block space-y-2">
        <span className="site-form-label">Full name</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="site-input"
          placeholder="Your full name"
        />
      </label>

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
          required
          inputMode="numeric"
          value={cnic}
          onChange={(event) => setCnic(event.target.value)}
          className="site-input"
          placeholder="12345-1234567-1"
          pattern="\d{5}-\d{7}-\d"
          maxLength={15}
          title="CNIC format should be 12345-1234567-1"
        />
      </label>

      <label className="block space-y-2">
        <span className="site-form-label">Password</span>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="site-input"
           placeholder="At least 8 chars with uppercase and number"
        />
      </label>


      <button
        type="submit"
        disabled={isSubmitting}
        className="site-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <div className="text-center text-[1.3rem] text-[#707072]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#111111] hover:text-[#707072]">
          Sign in
        </Link>
      </div>

      {error ? <p className="site-status--error">{error}</p> : null}
    </form>
    </div>
  );
}
