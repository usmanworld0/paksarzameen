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

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

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

      setMessage("Registration submitted. Our blood bank team will contact you shortly. رجسٹریشن کامیاب۔");
      setForm(INITIAL_STATE);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!mounted) return;
        if (!res.ok) {
          setIsAuthChecked(true);
          setIsLoggedIn(false);
          return;
        }

        const payload = await res.json();
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
        // ignore network/profile errors — treat as unauthenticated
      } finally {
        if (mounted) setIsAuthChecked(true);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (isAuthChecked && !isLoggedIn) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-5 text-center">
        <p className="text-sm font-medium text-[#707072]">
          Please create an account or sign in to register as a donor — this makes coordination faster.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Registration</p>
        <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">Blood Donation Registration</h3>
        <p className="mt-1 text-sm font-medium text-[#707072]">Enter your basic details.</p>
      </div>

      {isLoggedIn && profile ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-3">
          <div>
            <p className="text-sm font-black tracking-tighter text-[#111111]">{profile.name ?? form.name}</p>
            <p className="mt-0.5 text-xs font-medium text-[#707072]">
              {profile.city ?? form.location} · {(profile.bloodGroup ?? form.bloodGroup) || "Blood group N/A"}
            </p>
            <p className="text-xs font-medium text-[#707072]">Contact: {profile.phone ?? form.contactNumber}</p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#0f7a47] transition hover:text-[#1a9d5f]"
          >
            Edit profile
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Full Name | پورا نام</span>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Contact Number | رابطہ نمبر</span>
          <input
            required
            placeholder="+92 (3xx) xxx xxxx"
            value={form.contactNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>City / Hospital | شہر / اسپتال</span>
          <input
            required
            placeholder="Bahawalpur"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>CNIC | شناختی کارڈ</span>
          <input
            required
            placeholder="xxxxx-xxxxxxx-x"
            value={form.cnic}
            onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Available Time | دستیاب وقت</span>
          <input
            type="datetime-local"
            required
            min={minDateTime}
            value={form.neededAt}
            onChange={(event) => setForm((prev) => ({ ...prev, neededAt: event.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Blood Group (optional)</span>
          <select
            value={form.bloodGroup}
            onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            className={inputClass}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </button>

      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
