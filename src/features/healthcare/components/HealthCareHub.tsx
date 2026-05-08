"use client";

import { useEffect, useMemo, useState } from "react";
import { AppointmentChatBox } from "@/features/healthcare/components/AppointmentChatBox";

type Doctor = {
  doctorId: string;
  fullName: string;
  specialization: string | null;
  bio: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
};

type Slot = {
  slotId: string;
  doctorId: string;
  slotStart: string;
  slotEnd: string;
  doctorName: string;
  specialization: string | null;
};

type Appointment = {
  appointmentId: string;
  doctorName: string;
  slotStart: string;
  slotEnd: string;
  reason: string;
  status: string;
};

type DoctorSuggestion = {
  doctorId: string;
  fullName: string;
  specialization: string | null;
  consultationFee: number | null;
  experienceYears: number | null;
  matchReason: string;
};

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";

export function HealthCareHub() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [doctorSuggestions, setDoctorSuggestions] = useState<DoctorSuggestion[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredSlots = useMemo(
    () => slots.filter((slot) => slot.doctorId === selectedDoctorId),
    [slots, selectedDoctorId]
  );

  async function loadData() {
    try {
      const doctorsResponse = await fetch("/api/healthcare/doctors", { cache: "no-store" });
      const doctorsPayload = (await doctorsResponse.json()) as {
        data?: { doctors?: Doctor[]; slots?: Slot[] };
        error?: string;
      };

      if (!doctorsResponse.ok) {
        setDoctors([]);
        setSlots([]);
        setFeedback(doctorsPayload.error ?? "Unable to load doctors right now.");
        return;
      }

      setDoctors(doctorsPayload.data?.doctors ?? []);
      setSlots(doctorsPayload.data?.slots ?? []);

      const appointmentsResponse = await fetch("/api/healthcare/appointments", { cache: "no-store" });
      const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[]; error?: string };
      if (appointmentsResponse.ok) {
        setAppointments(appointmentsPayload.data ?? []);
      } else {
        setAppointments([]);
        setFeedback(appointmentsPayload.error ?? "Unable to load appointments right now.");
      }
    } catch {
      setDoctors([]);
      setSlots([]);
      setAppointments([]);
      setFeedback("Unable to load healthcare data right now.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function askQuickAnswer() {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const payload = (await response.json()) as {
      data?: {
        answer?: string;
        disclaimer?: string;
        doctorSuggestions?: DoctorSuggestion[];
      };
      error?: string;
    };
    if (!response.ok) {
      setAnswer(payload.error ?? "No response available.");
      setDisclaimer(null);
      setDoctorSuggestions([]);
      return;
    }

    setAnswer(payload.data?.answer ?? "No response available.");
    setDisclaimer(payload.data?.disclaimer ?? null);
    setDoctorSuggestions(payload.data?.doctorSuggestions ?? []);
  }

  async function book() {
    if (!selectedDoctorId || !selectedSlotId || !reason.trim()) {
      setFeedback("Select doctor, slot, and reason.");
      return;
    }

    setBooking(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/healthcare/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          slotId: selectedSlotId,
          reason,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback(payload.error ?? "Unable to book appointment.");
        return;
      }

      setFeedback("Appointment requested successfully.");
      setReason("");
      setSelectedSlotId("");
      await loadData();
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Quick Answers */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15">
        <div className="border-b border-[#E5E5E5] pb-4 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Medical AI Chatbox</p>
          <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Quick Health Answers</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about fever, blood donation, symptoms..."
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => void askQuickAnswer()}
            className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
          >
            Ask AI
          </button>
        </div>
        {answer ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            {answer}
          </p>
        ) : null}
        {disclaimer ? (
          <p className="mt-2 text-xs font-medium text-amber-700">{disclaimer}</p>
        ) : null}
        {doctorSuggestions.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {doctorSuggestions.map((doctor) => (
              <article key={doctor.doctorId} className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                <p className="text-sm font-black tracking-tighter text-[#111111]">{doctor.fullName}</p>
                <p className="text-xs font-medium text-[#707072]">{doctor.specialization ?? "General Medicine"}</p>
                <p className="text-xs font-medium text-sky-800">{doctor.matchReason}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {/* Book Appointment */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15">
        <div className="border-b border-[#E5E5E5] pb-4 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctor Appointments</p>
          <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Book an Appointment</h2>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
          <p className="text-sm font-medium text-sky-900">
            <span className="font-semibold">CNIC Required:</span> You must have provided your CNIC (National Identity Card) during signup to book appointments. If you haven&apos;t, please sign up with your CNIC information.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <select
            value={selectedDoctorId}
            onChange={(event) => {
              setSelectedDoctorId(event.target.value);
              setSelectedSlotId("");
            }}
            className={inputClass}
          >
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.fullName}
                {doctor.specialization ? ` - ${doctor.specialization}` : ""}
                {doctor.experienceYears !== null ? ` • ${doctor.experienceYears}y exp` : ""}
                {doctor.consultationFee !== null ? ` • Fee ${doctor.consultationFee}` : ""}
              </option>
            ))}
          </select>

          <select
            value={selectedSlotId}
            onChange={(event) => setSelectedSlotId(event.target.value)}
            className={inputClass}
          >
            <option value="">Select slot</option>
            {filteredSlots.map((slot) => (
              <option key={slot.slotId} value={slot.slotId}>
                {new Date(slot.slotStart).toLocaleString()} - {new Date(slot.slotEnd).toLocaleTimeString()}
              </option>
            ))}
          </select>

          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason"
            className={inputClass}
          />
        </div>

        <button
          type="button"
          disabled={booking}
          onClick={() => void book()}
          className="mt-4 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {booking ? "Booking..." : "Book Appointment"}
        </button>
        {feedback ? (
          <p className="mt-2 text-sm font-medium text-[#707072]">{feedback}</p>
        ) : null}

        <div className="mt-6 space-y-3">
          {appointments.map((appointment) => (
            <article
              key={appointment.appointmentId}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
            >
              <p className="text-base font-black tracking-tighter text-[#111111]">{appointment.doctorName}</p>
              <p className="mt-1 text-xs font-medium text-[#707072]">
                {new Date(appointment.slotStart).toLocaleString()} - {new Date(appointment.slotEnd).toLocaleTimeString()}
              </p>
              <p className="mt-1 text-sm font-medium text-[#707072]">{appointment.reason}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">{appointment.status}</p>
              <div className="mt-3">
                <AppointmentChatBox appointmentId={appointment.appointmentId} />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blood Bank Link */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Blood Bank Subdivision</p>
        <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Donate Blood and Find Donors</h2>
        <p className="mt-2 text-sm font-medium text-[#707072]">
          Blood services are now organized under HealthCare. Use donor matching and live donor chat on the blood-bank subpage.
        </p>
        <a
          href="/healthcare/blood-bank"
          className="mt-4 inline-flex rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
        >
          Open Blood Bank
        </a>
      </div>
    </div>
  );
}
