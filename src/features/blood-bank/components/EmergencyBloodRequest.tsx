"use client";

import { FormEvent, useState } from "react";
import { DonorChatBox } from "@/features/blood-bank/components/DonorChatBox";

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
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
      <div className="border-b border-[#E5E5E5] pb-4 mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Emergency Blood Request</p>
        <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">AI-Assisted Donor Matching</h2>
        <p className="mt-1 text-sm font-medium text-[#707072]">
          Get the top 5 donors by blood compatibility, city proximity, availability, and donation eligibility.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
            Required Blood Group
          </span>
          <select
            value={bloodGroup}
            onChange={(event) => setBloodGroup(event.target.value)}
            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
            City
          </span>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
            placeholder="Bahawalpur"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Matching..." : "Find Matched Donors"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {matches.length === 0 ? (
          <p className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3 text-sm font-medium text-[#707072]">
            No ranked donors yet. Run an emergency request to view smart matches.
          </p>
        ) : (
          matches.map((donor, index) => (
            <article
              key={donor.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-black tracking-tighter text-[#111111]">
                  #{index + 1} {donor.name}
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Score {donor.score}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                {donor.bloodGroup || "N/A"} | {donor.city || "N/A"} | {donor.availabilityStatus}
              </p>
              <p className="text-sm font-medium text-[#707072]">
                Contact: {donor.phone || donor.email || "Not provided"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">
                {donor.eligibility ? "Eligible" : "Not eligible yet"}
              </p>
              <DonorChatBox donorUserId={donor.id} />
            </article>
          ))
        )}
      </div>
    </div>
  );
}
