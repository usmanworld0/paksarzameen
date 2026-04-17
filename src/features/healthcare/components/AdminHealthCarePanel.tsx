"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/features/auth/utils/admin-api";

type Doctor = {
  doctorId: string;
  email: string;
  fullName: string;
  specialization: string | null;
};

export function AdminHealthCarePanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  async function loadDoctors() {
    const response = await adminFetch("/api/admin/healthcare/doctors", { cache: "no-store" });
    const payload = (await response.json()) as { data?: Doctor[] };
    if (response.ok) {
      setDoctors(payload.data ?? []);
    }
  }

  useEffect(() => {
    void loadDoctors();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await adminFetch("/api/admin/healthcare/doctors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, fullName, specialization, bio }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Failed to create doctor account.");
        return;
      }

      setSuccess("Doctor account created.");
      setEmail("");
      setPassword("");
      setFullName("");
      setSpecialization("");
      setBio("");
      await loadDoctors();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7fcf7_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-slate-900">HealthCare Admin</h1>
          <p className="mt-2 text-sm text-slate-600">Create doctor accounts and manage the healthcare operations layer.</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create Doctor Account</h2>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3">
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Doctor email" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" required minLength={8} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Doctor full name" required className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={specialization} onChange={(event) => setSpecialization(event.target.value)} placeholder="Specialization" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio" className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-sm" />

            <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? "Creating..." : "Create Doctor"}
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="mt-2 text-sm text-emerald-700">{success}</p> : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Registered Doctors</h2>
          <div className="mt-4 space-y-2">
            {doctors.map((doctor) => (
              <article key={doctor.doctorId} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{doctor.fullName}</p>
                <p className="text-xs text-slate-600">{doctor.email}</p>
                <p className="text-xs text-emerald-700">{doctor.specialization ?? "General"}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
