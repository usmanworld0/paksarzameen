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

export function HealthCareHub() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
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
    const doctorsResponse = await fetch("/api/healthcare/doctors", { cache: "no-store" });
    const doctorsPayload = (await doctorsResponse.json()) as {
      data?: { doctors?: Doctor[]; slots?: Slot[] };
    };
    setDoctors(doctorsPayload.data?.doctors ?? []);
    setSlots(doctorsPayload.data?.slots ?? []);

    const appointmentsResponse = await fetch("/api/healthcare/appointments", { cache: "no-store" });
    const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[] };
    if (appointmentsResponse.ok) {
      setAppointments(appointmentsPayload.data ?? []);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function askQuickAnswer() {
    const response = await fetch("/api/healthcare/quick-answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const payload = (await response.json()) as { data?: { answer?: string; disclaimer?: string } };
    setAnswer(payload.data?.answer ?? "No response available.");
    setDisclaimer(payload.data?.disclaimer ?? null);
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
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Medical AI Chatbox</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Quick Health Answers</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about fever, blood donation, symptoms..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />
          <button
            type="button"
            onClick={() => void askQuickAnswer()}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Ask AI
          </button>
        </div>
        {answer ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{answer}</p> : null}
        {disclaimer ? <p className="mt-2 text-xs text-amber-700">{disclaimer}</p> : null}
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Doctor Appointments</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Book an Appointment</h2>

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">ℹ️ CNIC Required:</span> You must have provided your CNIC (National Identity Card) during signup to book appointments. If you haven&apos;t, please sign up with your CNIC information.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <select
            value={selectedDoctorId}
            onChange={(event) => {
              setSelectedDoctorId(event.target.value);
              setSelectedSlotId("");
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="button"
          disabled={booking}
          onClick={() => void book()}
          className="mt-4 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {booking ? "Booking..." : "Book Appointment"}
        </button>
        {feedback ? <p className="mt-2 text-sm text-slate-700">{feedback}</p> : null}

        <div className="mt-6 grid gap-3">
          {appointments.map((appointment) => (
            <article key={appointment.appointmentId} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{appointment.doctorName}</p>
              <p className="text-xs text-slate-600">
                {new Date(appointment.slotStart).toLocaleString()} - {new Date(appointment.slotEnd).toLocaleTimeString()}
              </p>
              <p className="mt-1 text-sm text-slate-700">{appointment.reason}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-emerald-700">{appointment.status}</p>
              <div className="mt-3">
                <AppointmentChatBox appointmentId={appointment.appointmentId} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Blood Bank Subdivision</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Donate Blood and Find Donors</h2>
        <p className="mt-2 text-sm text-slate-600">Blood services are now organized under HealthCare. Use donor matching and live donor chat on the blood-bank subpage.</p>
        <a href="/healthcare/blood-bank" className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Open Blood Bank →
        </a>
      </section>
    </div>
  );
}
