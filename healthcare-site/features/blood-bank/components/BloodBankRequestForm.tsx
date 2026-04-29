"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type BloodBankRequest = {
  name: string;
  neededAt: string;
  cnic: string;
  location: string;
  volumeMl: string;
  contactNumber: string;
  bloodGroup: string;
  notes: string;
};

const INITIAL_STATE: BloodBankRequest = {
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
  const [form, setForm] = useState<BloodBankRequest>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; phone?: string; city?: string; bloodGroup?: string } | null>(null);

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
        body: JSON.stringify({ ...form, volumeMl: Number(form.volumeMl) }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Submission failed.");
      }

      setMessage("Registration submitted. Our blood bank team will contact you shortly.");
      setForm(INITIAL_STATE);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit your request right now.");
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
        setIsLoggedIn(false);
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
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-8">
        <p className="text-sm text-slate-700">Please create an account or sign in to register as a donor. This makes coordination faster.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Create account</Link>
          <Link href="/login" className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_24px_90px_rgba(7,41,25,0.12)] sm:p-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Blood Bank</p>
        <h3 className="text-2xl font-semibold text-emerald-950">Blood Donation Registration</h3>
        <p className="text-sm text-emerald-900/70">Enter the details needed for the donation request.</p>
      </div>

      {isLoggedIn && profile ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <p className="font-semibold">{profile.name ?? form.name}</p>
          <p>{profile.city ?? form.location} · {(profile.bloodGroup ?? form.bloodGroup) || "Blood group N/A"}</p>
          <p>Contact: {profile.phone ?? form.contactNumber}</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-emerald-950">
          Full Name | پورا نام
          <input required placeholder="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
        </label>

        <label className="space-y-1 text-sm font-medium text-emerald-950">
          Contact Number | رابطہ نمبر
          <input required placeholder="+92 (3xx) xxx xxxx" value={form.contactNumber} onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
        </label>

        <label className="space-y-1 text-sm font-medium text-emerald-950">
          City / Hospital | شہر / اسپتال
          <input required placeholder="Bahawalpur" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
        </label>

        <label className="space-y-1 text-sm font-medium text-emerald-950">
          CNIC | شناختی کارڈ
          <input required placeholder="xxxxx-xxxxxxx-x" value={form.cnic} onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
        </label>

        <label className="space-y-1 text-sm font-medium text-emerald-950 sm:col-span-2">
          Available Time | دستیاب وقت
          <input type="datetime-local" required min={minDateTime} value={form.neededAt} onChange={(event) => setForm((prev) => ({ ...prev, neededAt: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" />
        </label>

        <label className="space-y-1 text-sm font-medium text-emerald-950">
          Blood Group (optional)
          <select value={form.bloodGroup} onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
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

        <label className="space-y-1 text-sm font-medium text-emerald-950 sm:col-span-2">
          Notes
          <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} rows={4} className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200" placeholder="Additional details for the team" />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting..." : "Register"}</button>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
