"use client";

import { useEffect, useState } from "react";
import { AppointmentChatBox } from "./AppointmentChatBox";
import { DoctorPortalLogoutButton } from "./DoctorPortalLogoutButton";

export function DoctorDashboard() {
  const [profile, setProfile] = useState<any | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function load() {
    try {
      const [pRes, sRes, aRes] = await Promise.all([
        fetch('/api/healthcare/doctor/profile', { cache: 'no-store' }),
        fetch('/api/healthcare/doctor/slots', { cache: 'no-store' }),
        fetch('/api/healthcare/doctor/appointments', { cache: 'no-store' }),
      ]);

      if (pRes.ok) setProfile((await pRes.json()).data ?? null);
      if (sRes.ok) setSlots((await sRes.json()).data ?? []);
      if (aRes.ok) setAppointments((await aRes.json()).data ?? []);
    } catch (e) {
      setFeedback('Unable to load doctor dashboard.');
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Manage your profile, availability slots, and patient appointments.</p>
          </div>
          <DoctorPortalLogoutButton className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-slate-700" />
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Your profile</h2>
        {profile ? <div className="mt-3">{profile.fullName ?? profile.email}</div> : <div className="mt-3 text-sm text-slate-500">Loading...</div>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
        <div className="mt-3 space-y-2">
          {appointments.length ? appointments.map((a) => (
            <div key={a.appointmentId} className="rounded-md border p-3">{a.patientName ?? 'Patient'}</div>
          )) : <div className="text-sm text-slate-500">No appointments</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Messages</h2>
        <div className="mt-3">
          <AppointmentChatBox appointmentId={appointments[0]?.appointmentId ?? 'demo'} />
        </div>
      </section>
    </div>
  );
}
