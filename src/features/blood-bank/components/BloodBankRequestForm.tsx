"use client";

import { type CSSProperties, FormEvent, useMemo, useState } from "react";

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

      setMessage("Request submitted. Our Blood Bank team will contact you shortly.");
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
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={titleStyle}>Emergency Case Tracking Form</h2>
      <p style={descriptionStyle}>
        This form is for tracking after your emergency call. Submit details so the admin team can update status in real time.
      </p>

      <div style={gridStyle}>
        <label style={labelStyle}>
          Full Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Needed Time
          <input
            type="datetime-local"
            required
            min={minDateTime}
            value={form.neededAt}
            onChange={(event) => setForm((prev) => ({ ...prev, neededAt: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          CNIC
          <input
            required
            placeholder="xxxxx-xxxxxxx-x"
            value={form.cnic}
            onChange={(event) => setForm((prev) => ({ ...prev, cnic: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Contact Number
          <input
            required
            placeholder="03xxxxxxxxx"
            value={form.contactNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Location / Hospital
          <input
            required
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Volume of Blood (ml)
          <input
            type="number"
            required
            min={100}
            step={50}
            value={form.volumeMl}
            onChange={(event) => setForm((prev) => ({ ...prev, volumeMl: event.target.value }))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Blood Group (optional)
          <select
            value={form.bloodGroup}
            onChange={(event) => setForm((prev) => ({ ...prev, bloodGroup: event.target.value }))}
            style={{ ...inputStyle, color: "#000", background: "#ffffff" }}
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

        <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
          Additional Notes (optional)
          <textarea
            rows={4}
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} style={buttonStyle}>
        {isSubmitting ? "Submitting..." : "Submit Case Details"}
      </button>

      {message ? <p style={successStyle}>{message}</p> : null}
      {error ? <p style={errorStyle}>{error}</p> : null}
    </form>
  );
}

const formStyle: CSSProperties = {
  width: "min(920px, 92vw)",
  margin: "0 auto",
  padding: "2.6rem",
  borderRadius: "1.8rem",
  background: "rgba(10, 18, 14, 0.8)",
  border: "1px solid rgba(15, 122, 71, 0.45)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(8px)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(2rem, 3vw, 3.2rem)",
  lineHeight: 1.1,
};

const descriptionStyle: CSSProperties = {
  marginTop: "1rem",
  marginBottom: "2rem",
  color: "rgba(255,255,255,0.78)",
  fontSize: "1.45rem",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.2rem",
};

const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.55rem",
  fontSize: "1.25rem",
  color: "rgba(255,255,255,0.9)",
};

const inputStyle: CSSProperties = {
  borderRadius: "0.8rem",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  padding: "0.95rem 1rem",
  fontSize: "1.35rem",
};

const buttonStyle: CSSProperties = {
  marginTop: "1.8rem",
  borderRadius: "0.9rem",
  border: "none",
  padding: "1rem 1.4rem",
  cursor: "pointer",
  background: "linear-gradient(135deg, #cf2c2c 0%, #9f1717 100%)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.35rem",
};

const successStyle: CSSProperties = {
  marginTop: "1.1rem",
  color: "#8fffb8",
  fontSize: "1.25rem",
};

const errorStyle: CSSProperties = {
  marginTop: "1.1rem",
  color: "#ffb8b8",
  fontSize: "1.25rem",
};
