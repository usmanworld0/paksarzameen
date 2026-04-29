"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Users, Heart, AlertCircle } from "lucide-react";
import { HealthcareProfileManager } from "./HealthcareProfileManager";
import { AppointmentChatBox } from "./AppointmentChatBox";

export function HealthCareHubProfessional() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch('/api/healthcare/doctors?limit=6', { cache: 'no-store' });
        if (res.ok) {
          const payload = await res.json();
          setDoctors(payload.data?.doctors ?? []);
        }
      } catch (e) {
        // ignore
      }
    }
    void loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">HealthCare Platform</h1>
              <p className="text-sm text-slate-600">Your personalized medical companion</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/healthcare/doctor/sign-in" className="text-sm font-semibold text-emerald-700">Doctor Sign In</Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
              <p className="mt-2 text-sm text-slate-600">Overview and quick actions.</p>
            </div>

            <div className="mt-6 space-y-6">
              <HealthcareProfileManager />
              <AppointmentChatBox appointmentId="demo" />
            </div>
          </div>

          <aside>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Find Doctors</p>
              <div className="mt-4 space-y-3">
                {doctors.slice(0, 6).map((d, i) => (
                  <div key={i} className="rounded-md border p-3">{d.fullName ?? 'Doctor'}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
