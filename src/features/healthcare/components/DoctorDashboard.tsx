"use client";

import { useCallback, useEffect, useState } from "react";
import { AppointmentChatBox } from "@/features/healthcare/components/AppointmentChatBox";
import { DoctorPortalLogoutButton } from "@/features/healthcare/components/DoctorPortalLogoutButton";

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

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";

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

  const loadProfile = useCallback(async () => {
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
  }, []);

  const loadSlots = useCallback(async () => {
    const slotsResponse = await fetch("/api/healthcare/doctor/slots", { cache: "no-store" });
    const slotsPayload = (await slotsResponse.json()) as { data?: Slot[]; error?: string };
    if (slotsResponse.ok) {
      setSlots(slotsPayload.data ?? []);
    } else {
      setFeedback(slotsPayload.error ?? "Unable to load slots.");
    }
  }, []);

  const loadAppointments = useCallback(async () => {
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
  }, [appointmentSearch, appointmentStatus, appointmentSortBy, appointmentSortOrder]);

  const load = useCallback(async () => {
    await Promise.all([loadProfile(), loadSlots(), loadAppointments()]);
  }, [loadProfile, loadSlots, loadAppointments]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

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
    <main className="min-h-screen bg-[#f3f3ee] px-[5%] pb-20 pt-24 sm:pt-28">
      <section className="mx-auto max-w-screen-xl space-y-6">

        {/* Dashboard Header */}
        <header className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctor Portal</p>
              <h1 className="mt-1 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
                Doctor Dashboard
              </h1>
              <p className="mt-2 text-sm font-medium text-[#707072]">
                Manage your profile, availability slots, and patient appointments from one place.
              </p>
            </div>
            <DoctorPortalLogoutButton className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30" />
          </div>
        </header>

        {feedback ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
            {feedback}
          </p>
        ) : null}

        {/* Profile Section */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
          <div className="border-b border-[#E5E5E5] pb-4 mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Profile</p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Manage Doctor Profile</h2>
            <p className="mt-1 text-sm font-medium text-[#707072]">
              Keep specialization, experience, and fee updated so patients can find you easily.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={profileForm.fullName}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Full name"
              className={inputClass}
            />
            <input
              value={profileForm.specialization}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, specialization: event.target.value }))}
              placeholder="Specialization"
              className={inputClass}
            />
            <input
              value={profileForm.experienceYears}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, experienceYears: event.target.value }))}
              placeholder="Experience years"
              type="number"
              min={0}
              className={inputClass}
            />
            <input
              value={profileForm.consultationFee}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, consultationFee: event.target.value }))}
              placeholder="Consultation fee"
              type="number"
              min={0}
              className={inputClass}
            />
          </div>
          <textarea
            value={profileForm.bio}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Professional bio"
            className={`mt-3 min-h-24 ${inputClass}`}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void updateDoctorProfile()}
              disabled={isUpdatingProfile}
              className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
            >
              {isUpdatingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profile ? (
              <p className="text-xs font-medium text-[#707072]">Account: {profile.email}</p>
            ) : null}
          </div>
        </section>

        {/* Slots Section */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
          <div className="border-b border-[#E5E5E5] pb-4 mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Availability</p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Add Available Slot</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="datetime-local"
              value={slotStart}
              onChange={(event) => setSlotStart(event.target.value)}
              className={inputClass}
            />
            <input
              type="datetime-local"
              value={slotEnd}
              onChange={(event) => setSlotEnd(event.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={() => void addSlot()}
            className="mt-3 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
          >
            Add Slot
          </button>

          {/* Bulk Schedule Generator */}
          <div className="mt-6 rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Bulk Generator</p>
            <h3 className="mt-1 text-base font-black tracking-tighter text-[#111111]">Generate Schedule</h3>
            <p className="mt-0.5 text-xs font-medium text-[#707072]">
              Create slots for one day or a date range with a fixed interval.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="date"
                value={scheduleStartDate}
                onChange={(event) => setScheduleStartDate(event.target.value)}
                className={inputClass}
              />
              <input
                type="date"
                value={scheduleEndDate}
                onChange={(event) => setScheduleEndDate(event.target.value)}
                className={inputClass}
              />
              <input
                type="time"
                value={scheduleStartTime}
                onChange={(event) => setScheduleStartTime(event.target.value)}
                className={inputClass}
              />
              <input
                type="time"
                value={scheduleEndTime}
                onChange={(event) => setScheduleEndTime(event.target.value)}
                className={inputClass}
              />
              <input
                type="number"
                min={10}
                max={240}
                value={slotDurationMinutes}
                onChange={(event) => setSlotDurationMinutes(event.target.value)}
                className={inputClass}
                placeholder="Slot duration in minutes"
              />
            </div>

            <button
              type="button"
              onClick={() => void generateSchedule()}
              disabled={isGeneratingSchedule}
              className="mt-3 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:opacity-50"
            >
              {isGeneratingSchedule ? "Generating..." : "Generate Schedule"}
            </button>
          </div>

          {/* Slots List */}
          <div className="mt-5 space-y-2">
            {slots.map((slot) => (
              <article
                key={slot.slotId}
                className="rounded-xl border border-[#E5E5E5] bg-white p-4"
              >
                <p className="text-sm font-medium text-[#111111]">
                  {new Date(slot.slotStart).toLocaleString()} &ndash; {new Date(slot.slotEnd).toLocaleTimeString()}
                  <span
                    className={`ml-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      slot.isAvailable ? "text-[#0f7a47]" : "text-[#707072]"
                    }`}
                  >
                    {slot.isAvailable ? "Available" : "Unavailable/Booked"}
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={slotOperationInProgressId === slot.slotId}
                    onClick={() => void toggleSlotAvailability(slot.slotId, !slot.isAvailable)}
                    className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30 disabled:opacity-50"
                  >
                    {slot.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    type="button"
                    disabled={slotOperationInProgressId === slot.slotId}
                    onClick={() => void removeSlot(slot.slotId)}
                    className="rounded-xl border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete Slot
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Appointments Section */}
        <section className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E5] pb-4 mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Appointments</p>
              <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">Patient Appointments</h2>
            </div>
            <button
              type="button"
              onClick={() => void loadAppointments()}
              className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
            >
              Refresh
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <input
              value={appointmentSearch}
              onChange={(event) => setAppointmentSearch(event.target.value)}
              placeholder="Search reason"
              className={inputClass}
            />
            <select
              value={appointmentStatus}
              onChange={(event) => setAppointmentStatus(event.target.value)}
              className={inputClass}
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
              className={inputClass}
            >
              <option value="createdAt">Sort by created time</option>
              <option value="slotStart">Sort by appointment time</option>
            </select>
            <select
              value={appointmentSortOrder}
              onChange={(event) => setAppointmentSortOrder(event.target.value)}
              className={inputClass}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void loadAppointments()}
            className="mt-3 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
          >
            Apply Search
          </button>

          <div className="mt-5 space-y-3">
            {appointments.map((appointment) => (
              <article
                key={appointment.appointmentId}
                className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
              >
                <p className="text-base font-black tracking-tighter text-[#111111]">
                  {appointment.patientName ?? "Patient"}
                </p>
                <p className="mt-1 text-xs font-medium text-[#707072]">
                  {new Date(appointment.slotStart).toLocaleString()} &ndash; {new Date(appointment.slotEnd).toLocaleTimeString()}
                </p>
                <p className="mt-1 text-sm font-medium text-[#707072]">{appointment.reason}</p>
                <div className="mt-2">
                  <select
                    value={appointment.status}
                    onChange={(event) => void updateAppointmentStatus(appointment.appointmentId, event.target.value)}
                    className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] outline-none transition focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
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
