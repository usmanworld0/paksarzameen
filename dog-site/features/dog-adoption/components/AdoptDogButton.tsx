"use client";

import { useState } from "react";
import { apiUrl } from "../../../lib/api";
import { parseJsonResponse } from "../../../lib/fetchHelpers";

type AdoptDogButtonProps = { dogId: string };

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
      const response = await fetch(apiUrl("/api/adoption-requests"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dogId, whatsappNumber: normalizedWhatsapp }),
      });

      const payload = await parseJsonResponse(response);

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
      <div className="space-y-2">
        <label htmlFor={`adopt-whatsapp-${dogId}`} className="block text-sm font-medium text-slate-700">WhatsApp Number</label>
        <input id={`adopt-whatsapp-${dogId}`} type="tel" inputMode="tel" autoComplete="tel" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="03XX1234567" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" disabled={submitting} />
        <p className="text-xs text-slate-500">Our admin will contact you on this WhatsApp number.</p>
      </div>

      <button type="button" onClick={() => void handleAdopt()} disabled={submitting} className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-800/25 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Submitting..." : "Adopt This Dog"}</button>
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
