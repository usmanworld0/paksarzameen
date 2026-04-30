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
      setError("Please provide your WhatsApp number so our admin can contact you.");
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
      setError(requestError instanceof Error ? requestError.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`adopt-whatsapp-${dogId}`} className="block text-[10px] font-black uppercase tracking-widest text-[#111111]">
          WHATSAPP NUMBER
        </label>
        <input
          id={`adopt-whatsapp-${dogId}`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={whatsappNumber}
          onChange={(event) => setWhatsappNumber(event.target.value)}
          placeholder="03XX1234567"
          className="w-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-bold text-[#111111] uppercase tracking-widest placeholder:text-[#A0A0A0] outline-none transition focus:border-[#111111] disabled:opacity-50"
          disabled={submitting}
        />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#707072]">
          OUR ADMIN WILL CONTACT YOU.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleAdopt()}
        disabled={submitting}
        className="block w-full border border-[#111111] bg-[#111111] px-6 py-4 text-center text-sm font-black tracking-widest uppercase text-white transition hover:bg-white hover:text-[#111111] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "SUBMITTING..." : "ADOPT THIS DOG"}
      </button>

      {success ? (
        <div className="border border-[#111111] bg-[#F5F5F5] p-4 text-[10px] font-black uppercase tracking-widest text-[#111111] text-center">
          {success}
        </div>
      ) : null}
      
      {error ? (
        <div className="border border-[#D30005] bg-[#F5F5F5] p-4 text-[10px] font-black uppercase tracking-widest text-[#D30005] text-center">
          {error}
        </div>
      ) : null}
    </div>
  );
}
