"use client";

import { useState } from "react";

type AdoptDogButtonProps = {
  dogId: string;
};

export function AdoptDogButton({ dogId }: AdoptDogButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleAdopt() {
    const normalizedWhatsapp = whatsappNumber.trim();
    if (!normalizedWhatsapp) {
      setError("Please provide your WhatsApp number so our team can contact you.");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/adoption-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId, whatsappNumber: normalizedWhatsapp }),
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
      setError(
        requestError instanceof Error ? requestError.message : "Could not submit request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="site-stack">
      <label htmlFor={`adopt-whatsapp-${dogId}`} className="block">
        <span className="site-form-label site-form-label--caps">WhatsApp Number</span>
        <input
          id={`adopt-whatsapp-${dogId}`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="03XX1234567"
          className="site-input mt-2"
          disabled={submitting}
        />
      </label>

      <p className="site-copy site-copy--sm">Our admin team will contact you after review.</p>

      <button
        type="button"
        onClick={() => void handleAdopt()}
        disabled={submitting}
        className="site-button w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Adopt This Dog"}
      </button>

      {success ? <div className="site-status--success">{success}</div> : null}
      {error ? <div className="site-status--error">{error}</div> : null}
    </div>
  );
}
