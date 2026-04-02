"use client";

import { FormEvent, useMemo, useState } from "react";

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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Blood Donation Form | خون عطیہ فارم</h2>
      <p className={styles.description}>
        Register to donate blood. خون عطیہ کرنے کے لئے رجسٹر کریں۔
      </p>

      <div className={styles.grid}>
        <label className={styles.label}>
          Full Name | پورا نام
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
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
          CNIC | شناختی کارڈ
          <input
            required
            placeholder="xxxxx-xxxxxxx-x"
            value={form.cnic}
            onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Contact Number | رابطہ نمبر
          <input
            required
            placeholder="03xxxxxxxxx"
            value={form.contactNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          City / Hospital | شہر / اسپتال
          <input
            required
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Donation Volume (ml) | خون کی مقدار (ملی لیٹر)
          <input
            type="number"
            required
            min={100}
            step={50}
            value={form.volumeMl}
            onChange={(event) => setForm((prev) => ({ ...prev, volumeMl: event.target.value }))}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Blood Group (optional) | بلڈ گروپ (اختیاری)
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

        <label className={`${styles.label} ${styles.fullWidth}`}>
          Notes (optional) | اضافی نوٹس (اختیاری)
          <textarea
            rows={4}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            className={`${styles.input} ${styles.textarea}`}
          />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? "Submitting..." : "Register As Donor | بطور ڈونر رجسٹر کریں"}
      </button>

      {message ? <p className={styles.success}>{message}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
}
