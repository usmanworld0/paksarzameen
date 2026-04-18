"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/features/auth/utils/admin-api";

type Doctor = {
  doctorId: string;
  email: string;
  fullName: string;
  specialization: string | null;
  bio?: string | null;
  experienceYears?: number | null;
  consultationFee?: number | null;
};

type Appointment = {
  appointmentId: string;
  patientName: string | null;
  reason: string;
  status: string;
  slotStart: string;
  slotEnd: string;
};

export function AdminHealthCarePanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorMinExperience, setDoctorMinExperience] = useState("");
  const [doctorMaxFee, setDoctorMaxFee] = useState("");
  const [doctorSortBy, setDoctorSortBy] = useState("recent");
  const [doctorSortOrder, setDoctorSortOrder] = useState("desc");
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editingDoctorForm, setEditingDoctorForm] = useState({
    fullName: "",
    specialization: "",
    bio: "",
    experienceYears: "",
    consultationFee: "",
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [appointmentStatus, setAppointmentStatus] = useState("all");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [doctorAppointments, setDoctorAppointments] = useState<Record<string, Appointment[]>>({});
  const [managingDoctor, setManagingDoctor] = useState(false);

  async function loadDoctors() {
    const params = new URLSearchParams();
    if (doctorSearch.trim()) params.set("search", doctorSearch.trim());
    if (doctorSpecialization.trim()) params.set("specialization", doctorSpecialization.trim());
    if (doctorMinExperience.trim()) params.set("minExperience", doctorMinExperience.trim());
    if (doctorMaxFee.trim()) params.set("maxFee", doctorMaxFee.trim());
    params.set("sortBy", doctorSortBy);
    params.set("sortOrder", doctorSortOrder);

    const response = await adminFetch(`/api/admin/healthcare/doctors?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as { data?: Doctor[] };
    if (response.ok) {
      setDoctors(payload.data ?? []);
    }
  }

  async function loadDoctorAppointments(doctorId: string) {
    const params = new URLSearchParams();
    if (appointmentStatus !== "all") params.set("status", appointmentStatus);
    if (appointmentSearch.trim()) params.set("search", appointmentSearch.trim());
    params.set("sortBy", "slotStart");
    params.set("sortOrder", "desc");

    const response = await adminFetch(
      `/api/admin/healthcare/doctors/${doctorId}/appointments?${params.toString()}`,
      { cache: "no-store" }
    );
    const payload = (await response.json()) as { data?: Appointment[]; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to load appointments for this doctor.");
      return;
    }

    setDoctorAppointments((prev) => ({ ...prev, [doctorId]: payload.data ?? [] }));
  }

  function startEditingDoctor(doctor: Doctor) {
    setEditingDoctorId(doctor.doctorId);
    setEditingDoctorForm({
      fullName: doctor.fullName,
      specialization: doctor.specialization ?? "",
      bio: doctor.bio ?? "",
      experienceYears:
        doctor.experienceYears === null || doctor.experienceYears === undefined
          ? ""
          : String(doctor.experienceYears),
      consultationFee:
        doctor.consultationFee === null || doctor.consultationFee === undefined
          ? ""
          : String(doctor.consultationFee),
    });
  }

  async function saveDoctorProfile(doctorId: string) {
    setManagingDoctor(true);
    setError(null);
    setSuccess(null);

    const response = await adminFetch(`/api/admin/healthcare/doctors/${doctorId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: editingDoctorForm.fullName.trim(),
        specialization: editingDoctorForm.specialization.trim() || null,
        bio: editingDoctorForm.bio.trim() || null,
        experienceYears: editingDoctorForm.experienceYears.trim() ? Number(editingDoctorForm.experienceYears) : null,
        consultationFee: editingDoctorForm.consultationFee.trim() ? Number(editingDoctorForm.consultationFee) : null,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Failed to update doctor profile.");
      setManagingDoctor(false);
      return;
    }

    setSuccess("Doctor profile updated.");
    setEditingDoctorId(null);
    setManagingDoctor(false);
    await loadDoctors();
  }

  async function removeDoctor(doctorId: string) {
    setManagingDoctor(true);
    setError(null);
    setSuccess(null);

    const response = await adminFetch(`/api/admin/healthcare/doctors/${doctorId}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Failed to remove doctor.");
      setManagingDoctor(false);
      return;
    }

    setSuccess("Doctor removed.");
    setManagingDoctor(false);
    setSelectedDoctorId((prev) => (prev === doctorId ? null : prev));
    await loadDoctors();
  }

  async function toggleAppointments(doctorId: string) {
    if (selectedDoctorId === doctorId) {
      setSelectedDoctorId(null);
      return;
    }

    setSelectedDoctorId(doctorId);
    if (!doctorAppointments[doctorId]) {
      await loadDoctorAppointments(doctorId);
    }
  }

  useEffect(() => {
    void loadDoctors();
  }, []);

  useEffect(() => {
    void loadDoctors();
  }, [doctorSortBy, doctorSortOrder]);

  useEffect(() => {
    if (selectedDoctorId) {
      void loadDoctorAppointments(selectedDoctorId);
    }
  }, [selectedDoctorId, appointmentStatus]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await adminFetch("/api/admin/healthcare/doctors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          specialization,
          bio,
          experienceYears: experienceYears ? Number(experienceYears) : undefined,
          consultationFee: consultationFee ? Number(consultationFee) : undefined,
        }),
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
      setExperienceYears("");
      setConsultationFee("");
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
            <input value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} placeholder="Experience years (optional)" type="number" min={0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={consultationFee} onChange={(event) => setConsultationFee(event.target.value)} placeholder="Consultation fee (optional)" type="number" min={0} step="0.01" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
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

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              value={doctorSearch}
              onChange={(event) => setDoctorSearch(event.target.value)}
              placeholder="Search doctor"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={doctorSpecialization}
              onChange={(event) => setDoctorSpecialization(event.target.value)}
              placeholder="Specialization"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={doctorMinExperience}
              onChange={(event) => setDoctorMinExperience(event.target.value)}
              placeholder="Min experience"
              type="number"
              min={0}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={doctorMaxFee}
              onChange={(event) => setDoctorMaxFee(event.target.value)}
              placeholder="Max fee"
              type="number"
              min={0}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={doctorSortBy}
              onChange={(event) => setDoctorSortBy(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="recent">Newest</option>
              <option value="experience">Experience</option>
              <option value="fee">Fee</option>
              <option value="name">Name</option>
            </select>
            <select
              value={doctorSortOrder}
              onChange={(event) => setDoctorSortOrder(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadDoctors()}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Apply Search/Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setDoctorSearch("");
                setDoctorSpecialization("");
                setDoctorMinExperience("");
                setDoctorMaxFee("");
                setDoctorSortBy("recent");
                setDoctorSortOrder("desc");
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 p-3">
            <h3 className="text-sm font-semibold text-slate-900">Appointments Filter (Selected Doctor)</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <select
                value={appointmentStatus}
                onChange={(event) => setAppointmentStatus(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="all">All statuses</option>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
              <input
                value={appointmentSearch}
                onChange={(event) => setAppointmentSearch(event.target.value)}
                placeholder="Search reason"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (selectedDoctorId) void loadDoctorAppointments(selectedDoctorId);
                }}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
              >
                Apply Appointment Filter
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {doctors.map((doctor) => (
              <article key={doctor.doctorId} className="rounded-lg border border-slate-200 p-3">
                {editingDoctorId === doctor.doctorId ? (
                  <div className="space-y-2">
                    <input
                      value={editingDoctorForm.fullName}
                      onChange={(event) =>
                        setEditingDoctorForm((prev) => ({ ...prev, fullName: event.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      value={editingDoctorForm.specialization}
                      onChange={(event) =>
                        setEditingDoctorForm((prev) => ({ ...prev, specialization: event.target.value }))
                      }
                      placeholder="Specialization"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={editingDoctorForm.bio}
                      onChange={(event) =>
                        setEditingDoctorForm((prev) => ({ ...prev, bio: event.target.value }))
                      }
                      placeholder="Bio"
                      className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={editingDoctorForm.experienceYears}
                        onChange={(event) =>
                          setEditingDoctorForm((prev) => ({ ...prev, experienceYears: event.target.value }))
                        }
                        type="number"
                        min={0}
                        placeholder="Experience"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        value={editingDoctorForm.consultationFee}
                        onChange={(event) =>
                          setEditingDoctorForm((prev) => ({ ...prev, consultationFee: event.target.value }))
                        }
                        type="number"
                        min={0}
                        placeholder="Fee"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void saveDoctorProfile(doctor.doctorId)}
                        className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingDoctorId(null)}
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-900">{doctor.fullName}</p>
                    <p className="text-xs text-slate-600">{doctor.email}</p>
                    <p className="text-xs text-emerald-700">{doctor.specialization ?? "General"}</p>
                    <p className="text-xs text-slate-500">
                      {doctor.experienceYears ?? 0} years exp • Fee {doctor.consultationFee ?? 0}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingDoctor(doctor)}
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void toggleAppointments(doctor.doctorId)}
                        className="rounded-full border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {selectedDoctorId === doctor.doctorId ? "Hide Appointments" : "View Appointments"}
                      </button>
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void removeDoctor(doctor.doctorId)}
                        className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-60"
                      >
                        Remove Doctor
                      </button>
                    </div>
                  </>
                )}

                {selectedDoctorId === doctor.doctorId ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      Appointments for {doctor.fullName}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {(doctorAppointments[doctor.doctorId] ?? []).map((appointment) => (
                        <div key={appointment.appointmentId} className="rounded-md border border-slate-200 bg-white p-2">
                          <p className="text-xs font-semibold text-slate-900">
                            {appointment.patientName ?? "Patient"} • {appointment.status}
                          </p>
                          <p className="text-xs text-slate-600">
                            {new Date(appointment.slotStart).toLocaleString()} - {new Date(appointment.slotEnd).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-slate-700">{appointment.reason}</p>
                        </div>
                      ))}
                      {(doctorAppointments[doctor.doctorId] ?? []).length === 0 ? (
                        <p className="text-xs text-slate-500">No appointments found for selected filters.</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
