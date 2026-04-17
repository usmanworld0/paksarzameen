"use client";

import { useEffect, useState } from "react";
import { AppointmentChatBox } from "@/features/healthcare/components/AppointmentChatBox";

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
  const [slots, setSlots] = useState<Slot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function load() {
    const slotsResponse = await fetch("/api/healthcare/doctor/slots", { cache: "no-store" });
    const slotsPayload = (await slotsResponse.json()) as { data?: Slot[] };
    if (slotsResponse.ok) {
      setSlots(slotsPayload.data ?? []);
    }

    const appointmentsResponse = await fetch("/api/healthcare/doctor/appointments", { cache: "no-store" });
    const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[] };
    if (appointmentsResponse.ok) {
      setAppointments(appointmentsPayload.data ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

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
    await load();
  }

  async function updateAppointmentStatus(appointmentId: string, status: string) {
    await fetch("/api/healthcare/doctor/appointments", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appointmentId, status }),
    });
    await load();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6fbf7_0%,_#edf5ef_100%)] px-4 pb-20 pt-28 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your availability slots and chat with patients after appointments are booked.</p>
        </header>

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
          {feedback ? <p className="mt-2 text-sm text-slate-700">{feedback}</p> : null}

          <div className="mt-4 space-y-2">
            {slots.map((slot) => (
              <article key={slot.slotId} className="rounded-lg border border-slate-200 p-3 text-sm">
                {new Date(slot.slotStart).toLocaleString()} - {new Date(slot.slotEnd).toLocaleTimeString()} • {slot.isAvailable ? "Available" : "Booked"}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
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
