"use client";

import { useState } from "react";

type AdoptDogButtonProps = {
  dogId: string;
};

export function AdoptDogButton({ dogId }: AdoptDogButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleAdopt() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/adoption-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (response.status === 401) {
        const callbackUrl = encodeURIComponent(`/dog/${dogId}`);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not submit adoption request.");
      }

      setSuccess(payload.message ?? "Adoption request submitted.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => void handleAdopt()}
        disabled={submitting}
        className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-800/25 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Submitting..." : "Adopt This Dog"}
      </button>
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
