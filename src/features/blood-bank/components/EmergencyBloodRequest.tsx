"use client";

import { FormEvent, useState } from "react";

type MatchDonor = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  city: string;
  bloodGroup: string;
  availabilityStatus: string;
  profileImage: string;
  lastDonationDate: string;
  eligibility: boolean;
  score: number;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function EmergencyBloodRequest() {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [city, setCity] = useState("Bahawalpur");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchDonor[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/blood-bank/emergency-match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bloodGroup, city }),
    });

    const payload = (await response.json()) as { data?: MatchDonor[]; error?: string };
    setIsSubmitting(false);

    if (!response.ok || !payload.data) {
      setError(payload.error ?? "Failed to fetch donor matches.");
      return;
    }

    setMatches(payload.data);
  }

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_18px_60px_rgba(8,39,24,0.1)] sm:p-8">
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Emergency Blood Request</p>
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">AI-assisted donor matching</h2>
        <p className="text-sm text-emerald-900/75">Get the top 5 donors by blood compatibility, city proximity, availability, and donation eligibility.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Required blood group</span>
          <select
            value={bloodGroup}
            onChange={(event) => setBloodGroup(event.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">City</span>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="Bahawalpur"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Matching..." : "Find matched donors"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-5 grid gap-3">
        {matches.length === 0 ? (
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            No ranked donors yet. Run an emergency request to view smart matches.
          </p>
        ) : (
          matches.map((donor, index) => (
            <article key={donor.id} className="rounded-2xl border border-emerald-100 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-emerald-950">
                  #{index + 1} {donor.name}
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Score {donor.score}</span>
              </div>
              <p className="mt-2 text-sm text-emerald-900/80">
                {donor.bloodGroup || "N/A"} | {donor.city || "N/A"} | {donor.availabilityStatus}
              </p>
              <p className="text-sm text-emerald-900/80">Contact: {donor.phone || donor.email || "Not provided"}</p>
              <p className="text-xs text-emerald-700/90">Eligibility: {donor.eligibility ? "Eligible" : "Not eligible yet"}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
