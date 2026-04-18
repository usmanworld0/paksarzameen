"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Users, Heart, AlertCircle } from "lucide-react";
import { HealthcareProfileManager } from "./HealthcareProfileManager";
import { AppointmentChatBox } from "./AppointmentChatBox";

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

export function HealthCareHubProfessional() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "doctors" | "appointments" | "profile">("dashboard");
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

  const filteredSlots = slots.filter((slot) => slot.doctorId === selectedDoctorId);

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
      setAnswer(payload.error ?? "Unable to process question.");
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
      setFeedback("Select doctor, slot, and provide a reason.");
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

      setFeedback("✓ Appointment booked successfully!");
      setReason("");
      setSelectedSlotId("");
      await loadData();
    } finally {
      setBooking(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="sticky top-[6.5rem] z-40 border-b border-slate-200 bg-white shadow-sm sm:top-28">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">HealthCare Platform</h1>
              <p className="text-sm text-slate-600">Your personalized medical companion</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100">
              <Heart className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: MessageCircle },
              { id: "doctors", label: "Find Doctors", icon: Users },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "profile", label: "My Profile", icon: Heart },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  activeTab === id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Medical AI Assistant</h2>
                    <p className="text-sm text-slate-600">Get instant answers to your health questions</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about fever, blood donation, symptoms, health concerns..."
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => void askQuickAnswer()}
                    className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                  >
                    Ask AI
                  </button>
                </div>

                {answer && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm leading-relaxed text-emerald-900">{answer}</p>
                  </div>
                )}

                {disclaimer && (
                  <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
                    <p className="text-xs text-amber-800">{disclaimer}</p>
                  </div>
                )}

                {doctorSuggestions.length > 0 && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-900">Suggested Doctors (System Logic)</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {doctorSuggestions.map((suggestion) => (
                        <div key={suggestion.doctorId} className="rounded-md border border-blue-100 bg-white p-3">
                          <p className="text-sm font-semibold text-slate-900">{suggestion.fullName}</p>
                          <p className="text-xs text-slate-600">{suggestion.specialization ?? "General Medicine"}</p>
                          <p className="mt-1 text-xs text-blue-800">{suggestion.matchReason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Appointments</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{appointments.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-emerald-100" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Doctors Available</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{doctors.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-100" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Available Slots</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{slots.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-100" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Find & Book a Doctor</h2>
            {doctors.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-600">No doctors available at the moment</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.doctorId}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2"></div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{doctor.fullName}</h3>
                          {doctor.specialization && (
                            <p className="text-sm text-emerald-600 font-medium">{doctor.specialization}</p>
                          )}
                        </div>
                        {doctor.experienceYears && (
                          <span className="text-xs font-semibold text-white bg-emerald-600 px-3 py-1 rounded-full">
                            {doctor.experienceYears}+ years
                          </span>
                        )}
                      </div>

                      {doctor.bio && <p className="text-sm text-slate-600">{doctor.bio}</p>}

                      {doctor.consultationFee && (
                        <div className="text-sm font-semibold text-slate-900">
                          Fee: <span className="text-emerald-600">Rs. {doctor.consultationFee}</span>
                        </div>
                      )}

                      {/* Expandable Slots */}
                      {filteredSlots.length > 0 && selectedDoctorId === doctor.doctorId && (
                        <div className="border-t pt-4 space-y-3">
                          <p className="text-sm font-medium text-slate-700">Select a time slot:</p>
                          <select
                            value={selectedSlotId}
                            onChange={(event) => setSelectedSlotId(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          >
                            <option value="">Choose slot</option>
                            {filteredSlots.map((slot) => (
                              <option key={slot.slotId} value={slot.slotId}>
                                {new Date(slot.slotStart).toLocaleString()} -{" "}
                                {new Date(slot.slotEnd).toLocaleTimeString()}
                              </option>
                            ))}
                          </select>

                          <textarea
                            value={selectedDoctorId === doctor.doctorId ? reason : ""}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Reason for visit"
                            rows={2}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                          />

                          <div className="flex gap-2">
                            <button
                              onClick={() => void book()}
                              disabled={booking}
                              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {booking ? "Booking..." : "Confirm Booking"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDoctorId("");
                                setSelectedSlotId("");
                                setReason("");
                              }}
                              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedDoctorId !== doctor.doctorId && (
                        <button
                          onClick={() => {
                            setSelectedDoctorId(doctor.doctorId);
                          }}
                          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Book Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Your Appointments</h2>
            {appointments.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-600">No appointments scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">Dr. {appointment.doctorName}</h3>
                        <div className="mt-2 space-y-2">
                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            {new Date(appointment.slotStart).toLocaleString()}
                          </p>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <AppointmentChatBox appointmentId={appointment.appointmentId} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && <HealthcareProfileManager />}
      </div>

      {feedback && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-lg">
          {feedback}
        </div>
      )}
    </div>
  );
}
