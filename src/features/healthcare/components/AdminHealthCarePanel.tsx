"use client";

import { useEffect, useMemo, useState } from "react";
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

type DoctorSignupRequest = {
  requestId: string;
  email: string;
  fullName: string;
  specialization: string | null;
  bio: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
  status: "pending" | "approved" | "declined";
  adminNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctorRequests, setDoctorRequests] = useState<DoctorSignupRequest[]>([]);
  const [requestNotes, setRequestNotes] = useState<Record<string, string>>({});
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
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

  const requestCounts = useMemo(
    () => ({
      pending: doctorRequests.filter((request) => request.status === "pending").length,
      approved: doctorRequests.filter((request) => request.status === "approved").length,
      declined: doctorRequests.filter((request) => request.status === "declined").length,
    }),
    [doctorRequests]
  );

  async function loadDoctorRequests() {
    const response = await adminFetch("/api/admin/healthcare/doctor-requests", { cache: "no-store" });
    const payload = (await response.json()) as { data?: DoctorSignupRequest[]; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to load doctor applications.");
      return;
    }

    const requests = payload.data ?? [];
    setDoctorRequests(requests);
    setRequestNotes((current) => {
      const next = { ...current };
      requests.forEach((request) => {
        if (next[request.requestId] === undefined) {
          next[request.requestId] = request.adminNote ?? "";
        }
      });
      return next;
    });
  }

  async function loadDoctors() {
    const params = new URLSearchParams();
    if (doctorSearch.trim()) params.set("search", doctorSearch.trim());
    if (doctorSpecialization.trim()) params.set("specialization", doctorSpecialization.trim());
    if (doctorMinExperience.trim()) params.set("minExperience", doctorMinExperience.trim());
    if (doctorMaxFee.trim()) params.set("maxFee", doctorMaxFee.trim());
    params.set("sortBy", doctorSortBy);
    params.set("sortOrder", doctorSortOrder);

    const response = await adminFetch(`/api/admin/healthcare/doctors?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as { data?: Doctor[]; error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to load doctors.");
      return;
    }

    setDoctors(payload.data ?? []);
  }

  async function reviewDoctorRequest(requestId: string, status: "approved" | "declined") {
    setReviewingRequestId(requestId);
    setError(null);
    setSuccess(null);

    const response = await adminFetch(`/api/admin/healthcare/doctor-requests/${requestId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status,
        adminNote: requestNotes[requestId]?.trim() || null,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to review doctor request.");
      setReviewingRequestId(null);
      return;
    }

    setSuccess(status === "approved" ? "Doctor application approved." : "Doctor application declined.");
    setReviewingRequestId(null);
    await Promise.all([loadDoctorRequests(), loadDoctors()]);
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
    void Promise.all([loadDoctorRequests(), loadDoctors()]);
  }, [loadDoctorRequests, loadDoctors]);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors, doctorSortBy, doctorSortOrder]);

  useEffect(() => {
    if (selectedDoctorId) {
      void loadDoctorAppointments(selectedDoctorId);
    }
  }, [selectedDoctorId, appointmentStatus, loadDoctorAppointments]);

  return (
    <div>
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-slate-900">HealthCare Admin</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review doctor applications, approve portal access, and manage active doctor accounts.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Doctor Applications</h2>
              <p className="mt-1 text-sm text-slate-600">
                Doctors sign up themselves now. Admin review decides whether they get dashboard access.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadDoctorRequests()}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Refresh Requests
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{requestCounts.pending}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Approved</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{requestCounts.approved}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-800">Declined</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{requestCounts.declined}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {doctorRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                No doctor applications yet.
              </div>
            ) : (
              doctorRequests.map((request) => (
                <article key={request.requestId} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{request.fullName}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                            request.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : request.status === "declined"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{request.email}</p>
                      <p className="mt-1 text-sm text-emerald-700">{request.specialization ?? "General Medicine"}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Submitted {new Date(request.createdAt).toLocaleString()}
                        {request.reviewedAt ? ` | Reviewed ${new Date(request.reviewedAt).toLocaleString()}` : ""}
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      <p>Experience: {request.experienceYears ?? 0} years</p>
                      <p>Fee: {request.consultationFee ?? 0}</p>
                    </div>
                  </div>

                  {request.bio ? <p className="mt-3 text-sm leading-6 text-slate-700">{request.bio}</p> : null}

                  <div className="mt-4 space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Admin note
                    </label>
                    <textarea
                      value={requestNotes[request.requestId] ?? ""}
                      onChange={(event) =>
                        setRequestNotes((prev) => ({ ...prev, [request.requestId]: event.target.value }))
                      }
                      placeholder="Optional note for approval or decline."
                      className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={reviewingRequestId === request.requestId}
                      onClick={() => void reviewDoctorRequest(request.requestId, "approved")}
                      className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {reviewingRequestId === request.requestId ? "Saving..." : "Approve Request"}
                    </button>
                    <button
                      type="button"
                      disabled={reviewingRequestId === request.requestId}
                      onClick={() => void reviewDoctorRequest(request.requestId, "declined")}
                      className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
                    >
                      Decline Request
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
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
                      {doctor.experienceYears ?? 0} years exp | Fee {doctor.consultationFee ?? 0}
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
                            {appointment.patientName ?? "Patient"} | {appointment.status}
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
    </div>
  );
}
