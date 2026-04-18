"use client";

import { useEffect, useState } from "react";
import { AppointmentChatBox } from "@/features/healthcare/components/AppointmentChatBox";

type DoctorProfile = {
  doctorId: string;
  fullName: string;
  email: string;
  specialization: string | null;
  bio: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
};

type Slot = {
  slotId: string;
  slotStart: string;
  slotEnd: string;
  isAvailable: boolean;
};

type Appointment = {
  appointmentId: string;
  patientName: string | null;
  reason: string;
  status: string;
  slotStart: string;
  slotEnd: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export function DoctorDashboard() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    specialization: "",
    bio: "",
    experienceYears: "",
    consultationFee: "",
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");
  const [scheduleStartTime, setScheduleStartTime] = useState("09:00");
  const [scheduleEndTime, setScheduleEndTime] = useState("17:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState("30");
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [slotOperationInProgressId, setSlotOperationInProgressId] = useState<string | null>(null);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("all");
  const [appointmentSortBy, setAppointmentSortBy] = useState("createdAt");
  const [appointmentSortOrder, setAppointmentSortOrder] = useState("desc");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadProfile() {
    const response = await fetch("/api/healthcare/doctor/profile", { cache: "no-store" });
    const payload = (await response.json()) as { data?: DoctorProfile; error?: string };

    if (response.ok && payload.data) {
      setProfile(payload.data);
      setProfileForm({
        fullName: payload.data.fullName,
        specialization: payload.data.specialization ?? "",
        bio: payload.data.bio ?? "",
        experienceYears:
          payload.data.experienceYears === null || payload.data.experienceYears === undefined
            ? ""
            : String(payload.data.experienceYears),
        consultationFee:
          payload.data.consultationFee === null || payload.data.consultationFee === undefined
            ? ""
            : String(payload.data.consultationFee),
      });
    } else {
      setFeedback(payload.error ?? "Unable to load doctor profile.");
    }
  }

  async function loadSlots() {
    const slotsResponse = await fetch("/api/healthcare/doctor/slots", { cache: "no-store" });
    const slotsPayload = (await slotsResponse.json()) as { data?: Slot[]; error?: string };
    if (slotsResponse.ok) {
      setSlots(slotsPayload.data ?? []);
    } else {
      setFeedback(slotsPayload.error ?? "Unable to load slots.");
    }
  }

  async function loadAppointments() {
    const params = new URLSearchParams();
    if (appointmentSearch.trim()) params.set("search", appointmentSearch.trim());
    if (appointmentStatus !== "all") params.set("status", appointmentStatus);
    params.set("sortBy", appointmentSortBy);
    params.set("sortOrder", appointmentSortOrder);

    const appointmentsResponse = await fetch(`/api/healthcare/doctor/appointments?${params.toString()}`, {
      cache: "no-store",
    });
    const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[]; error?: string };
    if (appointmentsResponse.ok) {
      setAppointments(appointmentsPayload.data ?? []);
    } else {
      setFeedback(appointmentsPayload.error ?? "Unable to load appointments.");
    }
  }

  async function load() {
    await Promise.all([loadProfile(), loadSlots(), loadAppointments()]);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [appointmentStatus, appointmentSortBy, appointmentSortOrder]);

  async function addSlot() {
    setFeedback(null);
    const response = await fetch("/api/healthcare/doctor/slots", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slotStart, slotEnd }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setFeedback(payload.error ?? "Failed to add slot.");
      return;
    }

    setFeedback("Slot added.");
    setSlotStart("");
    setSlotEnd("");
    await loadSlots();
  }

  async function generateSchedule() {
    setFeedback(null);
    setIsGeneratingSchedule(true);

    const response = await fetch("/api/healthcare/doctor/slots", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        startDate: scheduleStartDate,
        endDate: scheduleEndDate || undefined,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
        slotDurationMinutes: Number(slotDurationMinutes),
      }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setFeedback(payload.error ?? "Unable to generate schedule.");
      setIsGeneratingSchedule(false);
      return;
    }

    setFeedback(payload.message ?? "Schedule generated.");
    setIsGeneratingSchedule(false);
    await loadSlots();
  }

  async function toggleSlotAvailability(slotId: string, isAvailable: boolean) {
    setSlotOperationInProgressId(slotId);
    setFeedback(null);

    const response = await fetch("/api/healthcare/doctor/slots", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slotId, isAvailable }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setFeedback(payload.error ?? "Unable to update slot availability.");
      setSlotOperationInProgressId(null);
      return;
    }

    setSlotOperationInProgressId(null);
    await loadSlots();
  }

  async function removeSlot(slotId: string) {
    setSlotOperationInProgressId(slotId);
    setFeedback(null);

    const response = await fetch(`/api/healthcare/doctor/slots?slotId=${encodeURIComponent(slotId)}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setFeedback(payload.error ?? "Unable to delete slot.");
      setSlotOperationInProgressId(null);
      return;
    }

    setSlotOperationInProgressId(null);
    await loadSlots();
  }

  async function updateAppointmentStatus(appointmentId: string, status: string) {
    const response = await fetch("/api/healthcare/doctor/appointments", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appointmentId, status }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setFeedback(payload.error ?? "Unable to update appointment.");
      return;
    }

    await loadAppointments();
  }

  async function updateDoctorProfile() {
    setFeedback(null);
    setIsUpdatingProfile(true);

    const response = await fetch("/api/healthcare/doctor/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: profileForm.fullName.trim(),
        specialization: profileForm.specialization.trim() || null,
        bio: profileForm.bio.trim() || null,
        experienceYears: profileForm.experienceYears.trim() ? Number(profileForm.experienceYears) : null,
        consultationFee: profileForm.consultationFee.trim() ? Number(profileForm.consultationFee) : null,
      }),
    });

    const payload = (await response.json()) as { data?: DoctorProfile; error?: string };
    if (!response.ok) {
      setFeedback(payload.error ?? "Unable to update doctor profile.");
      setIsUpdatingProfile(false);
      return;
    }

    if (payload.data) {
      setProfile(payload.data);
    }
    setFeedback("Doctor profile updated.");
    setIsUpdatingProfile(false);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6fbf7_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your profile, availability slots, and patient appointments from one place.</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Manage Doctor Profile</h2>
          <p className="mt-1 text-xs text-slate-500">Keep specialization, experience, and fee updated so patients can find you easily.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={profileForm.fullName}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Full name"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.specialization}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, specialization: event.target.value }))}
              placeholder="Specialization"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.experienceYears}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, experienceYears: event.target.value }))}
              placeholder="Experience years"
              type="number"
              min={0}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={profileForm.consultationFee}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, consultationFee: event.target.value }))}
              placeholder="Consultation fee"
              type="number"
              min={0}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <textarea
            value={profileForm.bio}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Professional bio"
            className="mt-3 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void updateDoctorProfile()}
              disabled={isUpdatingProfile}
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isUpdatingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profile ? <p className="text-xs text-slate-500">Account: {profile.email}</p> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Add Available Slot</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              type="datetime-local"
              value={slotStart}
              onChange={(event) => setSlotStart(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              value={slotEnd}
              onChange={(event) => setSlotEnd(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => void addSlot()}
            className="mt-3 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Add Slot
          </button>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Generate Schedule (Bulk Slots)</h3>
            <p className="mt-1 text-xs text-slate-500">Create slots for one day or a date range with a fixed interval.</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="date"
                value={scheduleStartDate}
                onChange={(event) => setScheduleStartDate(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={scheduleEndDate}
                onChange={(event) => setScheduleEndDate(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="time"
                value={scheduleStartTime}
                onChange={(event) => setScheduleStartTime(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="time"
                value={scheduleEndTime}
                onChange={(event) => setScheduleEndTime(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={10}
                max={240}
                value={slotDurationMinutes}
                onChange={(event) => setSlotDurationMinutes(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Slot duration in minutes"
              />
            </div>

            <button
              type="button"
              onClick={() => void generateSchedule()}
              disabled={isGeneratingSchedule}
              className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isGeneratingSchedule ? "Generating..." : "Generate Schedule"}
            </button>
          </div>

          {feedback ? <p className="mt-2 text-sm text-slate-700">{feedback}</p> : null}

          <div className="mt-4 space-y-2">
            {slots.map((slot) => (
              <article key={slot.slotId} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p>
                  {new Date(slot.slotStart).toLocaleString()} - {new Date(slot.slotEnd).toLocaleTimeString()} • {slot.isAvailable ? "Available" : "Unavailable/Booked"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={slotOperationInProgressId === slot.slotId}
                    onClick={() => void toggleSlotAvailability(slot.slotId, !slot.isAvailable)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60"
                  >
                    {slot.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    type="button"
                    disabled={slotOperationInProgressId === slot.slotId}
                    onClick={() => void removeSlot(slot.slotId)}
                    className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 disabled:opacity-60"
                  >
                    Delete Slot
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
            <button
              type="button"
              onClick={() => void loadAppointments()}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              Refresh
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <input
              value={appointmentSearch}
              onChange={(event) => setAppointmentSearch(event.target.value)}
              placeholder="Search reason"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={appointmentStatus}
              onChange={(event) => setAppointmentStatus(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={appointmentSortBy}
              onChange={(event) => setAppointmentSortBy(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="createdAt">Sort by created time</option>
              <option value="slotStart">Sort by appointment time</option>
            </select>
            <select
              value={appointmentSortOrder}
              onChange={(event) => setAppointmentSortOrder(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadAppointments()}
            className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            Apply Search
          </button>

          <div className="mt-4 space-y-3">
            {appointments.map((appointment) => (
              <article key={appointment.appointmentId} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900">{appointment.patientName ?? "Patient"}</p>
                <p className="text-xs text-slate-600">
                  {new Date(appointment.slotStart).toLocaleString()} - {new Date(appointment.slotEnd).toLocaleTimeString()}
                </p>
                <p className="mt-1 text-sm text-slate-700">{appointment.reason}</p>
                <div className="mt-2">
                  <select
                    value={appointment.status}
                    onChange={(event) => void updateAppointmentStatus(appointment.appointmentId, event.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <AppointmentChatBox appointmentId={appointment.appointmentId} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
