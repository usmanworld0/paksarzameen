"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import styles from "./BloodBankRequestForm.module.css";

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
  const [profile, setProfile] = useState<any | null>(null);

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
    // Try to fetch profile to prefill form when user is authenticated
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
      } catch (e) {
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
      <div className={styles.authBox}>
        <p className={styles.authText}>Please create an account or sign in to register as a donor — this makes coordination faster.</p>
        <div className={styles.authButtons}>
          <Link href="/signup" className={styles.authButton}>Create account</Link>
          <Link href="/login" className={styles.authButton}>Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>Blood Donation Registration</h3>
      <p className={styles.description}>Enter your basic details.</p>

      {isLoggedIn && profile ? (
        <div className={styles.profileSummary}>
          <div>
            <strong>{profile.name ?? form.name}</strong>
            <div className={styles.profileRow}>
              {profile.city ?? form.location} · {(profile.bloodGroup ?? form.bloodGroup) || "Blood group N/A"}
            </div>
            <div className={styles.profileRow}>Contact: {profile.phone ?? form.contactNumber}</div>
          </div>
          <div>
            <Link href="/dashboard" className={styles.profileEdit}>Edit profile</Link>
          </div>
        </div>
      ) : null}

      <div className={styles.grid}>
        <label className={styles.label}>
          Full Name | پورا نام
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Contact Number | رابطہ نمبر
          <input
            required
            placeholder="+92 (3xx) xxx xxxx"
            value={form.contactNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          City / Hospital | شہر / اسپتال
          <input
            required
            placeholder="Bahawalpur"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          CNIC | شناختی کارڈ
          <input
            required
            placeholder="xxxxx-xxxxxxx-x"
            value={form.cnic}
            onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={`${styles.label} ${styles.fullWidth}`}>
          Available Time | دستیاب وقت
          <input
            type="datetime-local"
            required
            min={minDateTime}
            value={form.neededAt}
            onChange={(event) => setForm((prev) => ({ ...prev, neededAt: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Blood Group (optional)
          <select
            value={form.bloodGroup}
            onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            className={styles.input}
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

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? "Submitting..." : "Register"}
      </button>

      {message ? <p className={styles.success}>{message}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
