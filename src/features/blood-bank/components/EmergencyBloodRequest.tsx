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
    <section className="site-panel site-panel--rounded">
      <div className="site-panel__body">
        <div>
          <p className="site-eyebrow">Emergency match</p>
          <h2 className="site-heading site-heading--sm mt-3">Find Ranked Donor Matches</h2>
          <p className="site-copy mt-4">
            Match by blood group, city, availability, and donation eligibility.
          </p>
        </div>

        <form onSubmit={onSubmit} className="site-toolbar mt-6">
          <div className="site-toolbar__grid md:grid-cols-3">
            <label className="block">
              <span className="site-form-label site-form-label--caps">Required Blood Group</span>
              <select
                value={bloodGroup}
                onChange={(event) => setBloodGroup(event.target.value)}
                className="site-select mt-2"
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="site-form-label site-form-label--caps">City</span>
              <input
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="site-input mt-2"
                placeholder="Bahawalpur"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="site-button w-full disabled:opacity-60"
              >
                {isSubmitting ? "Matching..." : "Find Donors"}
              </button>
            </div>
          </div>
        </form>

        {error ? <p className="site-status--error mt-6">{error}</p> : null}

        <div className="site-stack mt-6">
          {matches.length === 0 ? (
            <div className="site-empty">
              No ranked donors yet. Run an emergency request to view smart matches.
            </div>
          ) : (
            matches.map((donor, index) => (
              <article key={donor.id} className="site-card site-card--rounded">
                <div className="site-card__body">
                  <div className="site-toolbar__row">
                    <div>
                      <p className="site-card__eyebrow">Match #{index + 1}</p>
                      <h3 className="site-heading site-heading--sm mt-3">{donor.name}</h3>
                    </div>
                    <span className="site-badge">Score {donor.score}</span>
                  </div>

                  <div className="site-meta-row mt-5">
                    <span>{donor.bloodGroup || "N/A"}</span>
                    <span>{donor.city || "N/A"}</span>
                    <span>{donor.availabilityStatus}</span>
                  </div>
                  <p className="site-copy site-copy--sm mt-4">
                    Contact: {donor.phone || donor.email || "Not provided"}
                  </p>
                  <p className="site-copy site-copy--sm mt-2">
                    Eligibility: {donor.eligibility ? "Eligible" : "Not eligible yet"}
                  </p>
                  <DonorChatBox donorUserId={donor.id} />
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
