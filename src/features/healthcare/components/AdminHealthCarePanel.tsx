"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  const loadDoctorRequests = useCallback(async () => {
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
  }, []);

  const loadDoctors = useCallback(async () => {
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
  }, [doctorSearch, doctorSpecialization, doctorMinExperience, doctorMaxFee, doctorSortBy, doctorSortOrder]);

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

  const loadDoctorAppointments = useCallback(async (doctorId: string) => {
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
  }, [appointmentStatus, appointmentSearch]);

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

  const inputClass = "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
  const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="border-b border-[#E5E5E5] pb-4 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Admin</p>
          <h1 className="mt-2 text-xl font-black tracking-tighter text-[#111111] sm:text-2xl">HealthCare Admin</h1>
          <p className="mt-1 text-sm text-[#707072]">
            Review doctor applications, approve portal access, and manage active doctor accounts.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>
        ) : null}

        {/* Doctor Applications */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E5E5] pb-4 mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Applications</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Doctor Applications</h2>
              <p className="mt-1 text-sm text-[#707072]">
                Doctors sign up themselves now. Admin review decides whether they get dashboard access.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadDoctorRequests()}
              className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
            >
              Refresh Requests
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700">Pending</p>
              <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{requestCounts.pending}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">Approved</p>
              <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{requestCounts.approved}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-700">Declined</p>
              <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{requestCounts.declined}</p>
            </div>
          </div>

          <div className="space-y-3">
            {doctorRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-[#f3f3ee] px-4 py-6 text-sm text-[#707072]">
                No doctor applications yet.
              </div>
            ) : (
              doctorRequests.map((request) => (
                <article key={request.requestId} className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black tracking-tight text-[#111111]">{request.fullName}</h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            request.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : request.status === "declined"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#707072]">{request.email}</p>
                      <p className="mt-0.5 text-xs font-semibold text-[#0f7a47]">{request.specialization ?? "General Medicine"}</p>
                      <p className="mt-1 text-[10px] font-medium text-[#707072]">
                        Submitted {new Date(request.createdAt).toLocaleString()}
                        {request.reviewedAt ? ` · Reviewed ${new Date(request.reviewedAt).toLocaleString()}` : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-medium text-[#707072]">Experience: {request.experienceYears ?? 0} years</p>
                      <p className="text-[10px] font-medium text-[#707072]">Fee: {request.consultationFee ?? 0}</p>
                    </div>
                  </div>

                  {request.bio ? <p className="mt-3 text-sm leading-6 text-[#707072]">{request.bio}</p> : null}

                  <div className="mt-4 space-y-2">
                    <label className={labelClass}>Admin Note</label>
                    <textarea
                      value={requestNotes[request.requestId] ?? ""}
                      onChange={(event) =>
                        setRequestNotes((prev) => ({ ...prev, [request.requestId]: event.target.value }))
                      }
                      placeholder="Optional note for approval or decline."
                      className="min-h-24 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={reviewingRequestId === request.requestId}
                      onClick={() => void reviewDoctorRequest(request.requestId, "approved")}
                      className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
                    >
                      {reviewingRequestId === request.requestId ? "Saving..." : "Approve Request"}
                    </button>
                    <button
                      type="button"
                      disabled={reviewingRequestId === request.requestId}
                      onClick={() => void reviewDoctorRequest(request.requestId, "declined")}
                      className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Decline Request
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Registered Doctors */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
          <div className="border-b border-[#E5E5E5] pb-4 mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Directory</p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Registered Doctors</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Search Doctor</label>
              <input
                value={doctorSearch}
                onChange={(event) => setDoctorSearch(event.target.value)}
                placeholder="Search doctor"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Specialization</label>
              <input
                value={doctorSpecialization}
                onChange={(event) => setDoctorSpecialization(event.target.value)}
                placeholder="Specialization"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Min Experience</label>
              <input
                value={doctorMinExperience}
                onChange={(event) => setDoctorMinExperience(event.target.value)}
                placeholder="Min experience"
                type="number"
                min={0}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max Fee</label>
              <input
                value={doctorMaxFee}
                onChange={(event) => setDoctorMaxFee(event.target.value)}
                placeholder="Max fee"
                type="number"
                min={0}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort By</label>
              <select
                value={doctorSortBy}
                onChange={(event) => setDoctorSortBy(event.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              >
                <option value="recent">Newest</option>
                <option value="experience">Experience</option>
                <option value="fee">Fee</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <select
                value={doctorSortOrder}
                onChange={(event) => setDoctorSortOrder(event.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadDoctors()}
              className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
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
              className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
            >
              Reset
            </button>
          </div>

          {/* Appointment filter */}
          <div className="mt-5 rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072] mb-3">Appointments Filter (Selected Doctor)</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <select
                value={appointmentStatus}
                onChange={(event) => setAppointmentStatus(event.target.value)}
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
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
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
              />
              <button
                type="button"
                onClick={() => {
                  if (selectedDoctorId) void loadDoctorAppointments(selectedDoctorId);
                }}
                className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
              >
                Apply Appointment Filter
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {doctors.map((doctor) => (
              <article key={doctor.doctorId} className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
                {editingDoctorId === doctor.doctorId ? (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        value={editingDoctorForm.fullName}
                        onChange={(event) =>
                          setEditingDoctorForm((prev) => ({ ...prev, fullName: event.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Specialization</label>
                      <input
                        value={editingDoctorForm.specialization}
                        onChange={(event) =>
                          setEditingDoctorForm((prev) => ({ ...prev, specialization: event.target.value }))
                        }
                        placeholder="Specialization"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Bio</label>
                      <textarea
                        value={editingDoctorForm.bio}
                        onChange={(event) =>
                          setEditingDoctorForm((prev) => ({ ...prev, bio: event.target.value }))
                        }
                        placeholder="Bio"
                        className="min-h-20 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Experience (years)</label>
                        <input
                          value={editingDoctorForm.experienceYears}
                          onChange={(event) =>
                            setEditingDoctorForm((prev) => ({ ...prev, experienceYears: event.target.value }))
                          }
                          type="number"
                          min={0}
                          placeholder="Experience"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Consultation Fee</label>
                        <input
                          value={editingDoctorForm.consultationFee}
                          onChange={(event) =>
                            setEditingDoctorForm((prev) => ({ ...prev, consultationFee: event.target.value }))
                          }
                          type="number"
                          min={0}
                          placeholder="Fee"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void saveDoctorProfile(doctor.doctorId)}
                        className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingDoctorId(null)}
                        className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-black tracking-tight text-[#111111]">{doctor.fullName}</p>
                    <p className="text-xs font-medium text-[#707072]">{doctor.email}</p>
                    <p className="text-xs font-semibold text-[#0f7a47]">{doctor.specialization ?? "General"}</p>
                    <p className="text-[10px] font-medium text-[#707072]">
                      {doctor.experienceYears ?? 0} years exp · Fee {doctor.consultationFee ?? 0}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditingDoctor(doctor)}
                        className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#111111] transition hover:border-[#111111]/30"
                      >
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void toggleAppointments(doctor.doctorId)}
                        className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700 transition hover:border-sky-300 disabled:opacity-50"
                      >
                        {selectedDoctorId === doctor.doctorId ? "Hide Appointments" : "View Appointments"}
                      </button>
                      <button
                        type="button"
                        disabled={managingDoctor}
                        onClick={() => void removeDoctor(doctor.doctorId)}
                        className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove Doctor
                      </button>
                    </div>
                  </>
                )}

                {selectedDoctorId === doctor.doctorId ? (
                  <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#707072] mb-3">
                      Appointments for {doctor.fullName}
                    </h4>
                    <div className="space-y-2">
                      {(doctorAppointments[doctor.doctorId] ?? []).map((appointment) => (
                        <div key={appointment.appointmentId} className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                          <p className="text-xs font-black tracking-tight text-[#111111]">
                            {appointment.patientName ?? "Patient"} · {appointment.status}
                          </p>
                          <p className="text-[10px] font-medium text-[#707072]">
                            {new Date(appointment.slotStart).toLocaleString()} – {new Date(appointment.slotEnd).toLocaleTimeString()}
                          </p>
                          <p className="text-[10px] font-medium text-[#707072]">{appointment.reason}</p>
                        </div>
                      ))}
                      {(doctorAppointments[doctor.doctorId] ?? []).length === 0 ? (
                        <p className="text-xs text-[#707072]">No appointments found for selected filters.</p>
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
