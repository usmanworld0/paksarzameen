"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ManualSignupFormProps = {
  callbackUrl?: string;
  className?: string;
  submitButtonClassName?: string;
};

export function ManualSignupForm({
  callbackUrl = "/upload-art",
  className,
  submitButtonClassName,
}: ManualSignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/gallery/user/manual-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error ?? "Signup failed");
        return;
      }

      // Redirect to callback (server will read cookie)
      window.location.href = callbackUrl;
    } catch (err) {
      setError("Signup failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full space-y-4 ${className ?? ""}`.trim()}>
      <div className="grid gap-4">
        <div>
          <label htmlFor="gallery-full-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
            Full name
          </label>
          <Input
            id="gallery-full-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11 rounded-xl border-[#e5d8cf] bg-white px-4"
            required
          />
        </div>

        <div>
          <label htmlFor="gallery-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600">
            Email
          </label>
          <Input
            id="gallery-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
            className="h-11 rounded-xl border-[#e5d8cf] bg-white px-4"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button
          type="submit"
          size="lg"
          className={`w-full rounded-full bg-[#0f7a47] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,122,71,0.14)] transition hover:bg-[#081c10] hover:text-white ${submitButtonClassName ?? ""}`.trim()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up…" : "Sign up"}
        </Button>
      </div>
    </form>
  );
}
