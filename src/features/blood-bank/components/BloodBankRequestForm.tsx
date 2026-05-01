"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type FormState = {
  name: string;
  neededAt: string;
  cnic: string;
  location: string;
  volumeMl: string;
  contactNumber: string;
  bloodGroup: string;
  notes: string;
};

type ProfileSummary = {
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  bloodGroup?: string | null;
};

const INITIAL_STATE: FormState = {
  name: "",
  neededAt: "",
  cnic: "",
  location: "",
  volumeMl: "450",
  contactNumber: "",
  bloodGroup: "",
  notes: "",
};

export function BloodBankRequestForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blood-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          volumeMl: Number(form.volumeMl),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Submission failed.");
      }

      setMessage("Registration submitted. Our blood bank team will contact you shortly.");
      setForm(INITIAL_STATE);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your request right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!mounted) return;
        if (!response.ok) {
          setIsAuthChecked(true);
          setIsLoggedIn(false);
          return;
        }

        const payload = await response.json();
        const data = payload?.data;
        if (data) {
          if (data.profile) setProfile(data.profile);
          setForm((prev) => ({
            ...prev,
            name: data.user?.name ?? prev.name,
            contactNumber: data.profile?.phone ?? prev.contactNumber,
            location: data.profile?.city ?? prev.location,
            bloodGroup: data.profile?.bloodGroup ?? prev.bloodGroup,
          }));
          setIsLoggedIn(true);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setIsAuthChecked(true);
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (isAuthChecked && !isLoggedIn) {
    return (
      <div className="site-callout">
        <p>Create an account or sign in before registering for blood support coordination.</p>
        <div className="site-form-actions mt-4">
          <Link href="/signup" className="site-button">
            Create Account
          </Link>
          <Link href="/login" className="site-button-secondary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="site-stack--lg">
      <div>
        <p className="site-card__eyebrow">Request support</p>
        <h3 className="site-heading site-heading--sm mt-3">Blood Donation Registration</h3>
        <p className="site-copy mt-4">
          Enter the essential details so the team can coordinate quickly.
        </p>
      </div>

      {isLoggedIn && profile ? (
        <div className="site-callout">
          <strong>{profile.name ?? form.name}</strong>
          <div className="site-meta-row mt-3">
            <span>{profile.city ?? form.location}</span>
            <span>{(profile.bloodGroup ?? form.bloodGroup) || "Blood group N/A"}</span>
            <span>{profile.phone ?? form.contactNumber}</span>
          </div>
          <Link href="/dashboard" className="site-card-link mt-4">
            Edit Profile
          </Link>
        </div>
      ) : null}

      <div className="site-grid site-grid--two">
        <label className="block">
          <span className="site-form-label site-form-label--caps">Full Name</span>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="site-input mt-2"
          />
        </label>

        <label className="block">
          <span className="site-form-label site-form-label--caps">Contact Number</span>
          <input
            required
            placeholder="+92 3xx xxx xxxx"
            value={form.contactNumber}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactNumber: event.target.value }))
            }
            className="site-input mt-2"
          />
        </label>

        <label className="block">
          <span className="site-form-label site-form-label--caps">City / Hospital</span>
          <input
            required
            placeholder="Bahawalpur"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            className="site-input mt-2"
          />
        </label>

        <label className="block">
          <span className="site-form-label site-form-label--caps">CNIC</span>
          <input
            required
            placeholder="xxxxx-xxxxxxx-x"
            value={form.cnic}
            onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))}
            className="site-input mt-2"
          />
        </label>

        <label className="block">
          <span className="site-form-label site-form-label--caps">Available Time</span>
          <input
            type="datetime-local"
            required
            min={minDateTime}
            value={form.neededAt}
            onChange={(event) => setForm((prev) => ({ ...prev, neededAt: event.target.value }))}
            className="site-input mt-2"
          />
        </label>

        <label className="block">
          <span className="site-form-label site-form-label--caps">Blood Group</span>
          <select
            value={form.bloodGroup}
            onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            className="site-select mt-2"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </label>
      </div>

      <div className="site-form-actions">
        <button type="submit" disabled={isSubmitting} className="site-button">
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </div>

      {message ? <p className="site-status--success">{message}</p> : null}
      {error ? <p className="site-status--error">{error}</p> : null}
    </form>
  );
}
