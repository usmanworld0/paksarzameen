"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";

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
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorMinExperience, setDoctorMinExperience] = useState("");
  const [doctorMaxFee, setDoctorMaxFee] = useState("");
  const [doctorSortBy, setDoctorSortBy] = useState("recent");
  const [doctorSortOrder, setDoctorSortOrder] = useState("desc");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("all");
  const [appointmentSortBy, setAppointmentSortBy] = useState("createdAt");
  const [appointmentSortOrder, setAppointmentSortOrder] = useState("desc");
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

  const filteredSlots = slots.filter((slot) => slot.doctorId === selectedDoctorId);
  const selectedDoctor = doctors.find((doctor) => doctor.doctorId === selectedDoctorId) ?? null;

  function openBookingPanel(doctorId: string) {
    setSelectedDoctorId(doctorId);
    const availableSlots = slots.filter((slot) => slot.doctorId === doctorId);
    setSelectedSlotId(availableSlots[0]?.slotId ?? "");
    setReason("");
    setFeedback(null);
    if (activeTab !== "doctors") {
      setActiveTab("doctors");
    }
  }

  function closeBookingPanel() {
    setSelectedDoctorId("");
    setSelectedSlotId("");
    setReason("");
  }

  const loadData = useCallback(async () => {
    try {
      console.log("[loadData] Starting to load doctors and appointments...");
      const params = new URLSearchParams();
      if (doctorSearch.trim()) params.set("search", doctorSearch.trim());
      if (doctorSpecialization.trim()) params.set("specialization", doctorSpecialization.trim());
      if (doctorMinExperience.trim()) params.set("minExperience", doctorMinExperience.trim());
      if (doctorMaxFee.trim()) params.set("maxFee", doctorMaxFee.trim());
      params.set("sortBy", doctorSortBy);
      params.set("sortOrder", doctorSortOrder);

      const doctorsResponse = await fetch(`/api/healthcare/doctors?${params.toString()}`, { cache: "no-store" });
      const doctorsPayload = (await doctorsResponse.json()) as {
        data?: { doctors?: Doctor[]; slots?: Slot[] };
        error?: string;
      };

      console.log("[loadData] Doctors response status:", doctorsResponse.status);
      console.log("[loadData] Doctors payload:", doctorsPayload);

      if (!doctorsResponse.ok) {
        const errorMsg = doctorsPayload.error ?? "Unable to load doctors right now.";
        console.error("[loadData] Doctors API error:", errorMsg);
        setDoctors([]);
        setSlots([]);
        setFeedback(errorMsg);
        return;
      }

      const doctors = doctorsPayload.data?.doctors ?? [];
      const slots = doctorsPayload.data?.slots ?? [];
      console.log(`[loadData] Loaded ${doctors.length} doctors and ${slots.length} slots`);

      setDoctors(doctors);
      setSlots(slots);

      const appointmentParams = new URLSearchParams();
      if (appointmentSearch.trim()) appointmentParams.set("search", appointmentSearch.trim());
      if (appointmentStatus !== "all") appointmentParams.set("status", appointmentStatus);
      appointmentParams.set("sortBy", appointmentSortBy);
      appointmentParams.set("sortOrder", appointmentSortOrder);

      const appointmentsResponse = await fetch(`/api/healthcare/appointments?${appointmentParams.toString()}`, {
        cache: "no-store",
      });
      const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[]; error?: string };

      console.log("[loadData] Appointments response status:", appointmentsResponse.status);

      if (appointmentsResponse.ok) {
        const appointments = appointmentsPayload.data ?? [];
        console.log(`[loadData] Loaded ${appointments.length} appointments`);
        setAppointments(appointments);
      } else {
        const errorMsg = appointmentsPayload.error ?? "Unable to load appointments right now.";
        console.error("[loadData] Appointments API error:", errorMsg);
        setAppointments([]);
        setFeedback(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[loadData] Exception:", errorMsg, err);
      setDoctors([]);
      setSlots([]);
      setAppointments([]);
      setFeedback("Unable to load healthcare data right now.");
    }
  }, [doctorSearch, doctorSpecialization, doctorMinExperience, doctorMaxFee, doctorSortBy, doctorSortOrder, appointmentSearch, appointmentStatus, appointmentSortBy, appointmentSortOrder]);

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

      setFeedback("Appointment booked successfully!");
      setReason("");
      setSelectedSlotId("");
      await loadData();
    } finally {
      setBooking(false);
    }
  }

  async function cancelAppointment(appointmentId: string) {
    setCancellingAppointmentId(appointmentId);
    setFeedback(null);

    try {
      const response = await fetch("/api/healthcare/appointments", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          status: "cancelled",
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setFeedback(payload.error ?? "Unable to cancel appointment.");
        return;
      }

      setFeedback("Appointment cancelled successfully.");
      await loadData();
    } finally {
      setCancellingAppointmentId(null);
    }
  }

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: MessageCircle },
    { id: "doctors", label: "Find Doctors", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "profile", label: "My Profile", icon: Heart },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f3f3ee]">
      {/* Page Header */}
      <header className="border-b border-[#E5E5E5] px-[5%] pb-8 pt-24 md:pb-12 md:pt-28 bg-white">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Healthcare</p>
              <h1 className="mt-3 text-[clamp(3.2rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-tighter text-[#111111]">
                HealthCare
              </h1>
              <p className="mt-3 max-w-[56ch] text-sm font-medium leading-relaxed text-[#707072]">
                Your personalized medical companion — AI health answers, doctor appointments, and blood bank services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/healthcare/doctor/sign-in"
                className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
              >
                Doctor Sign In
              </Link>
              <Link
                href="/healthcare/doctor/sign-up"
                className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
              >
                Doctor Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-[#E5E5E5] bg-white px-[5%]">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] transition whitespace-nowrap ${
                  activeTab === id
                    ? "border-[#111111] text-[#111111]"
                    : "border-transparent text-[#707072] hover:text-[#111111]"
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
      <div className="px-[5%] py-10">
        <div className="mx-auto max-w-screen-xl">

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* AI Assistant */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
                <div className="border-b border-[#E5E5E5] pb-4 mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Medical AI Chatbox</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Medical AI Assistant</h2>
                  <p className="mt-1 text-sm font-medium text-[#707072]">Get instant answers to your health questions</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about fever, blood donation, symptoms, health concerns..."
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

                {answer && (
                  <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
                    {answer}
                  </p>
                )}

                {disclaimer && (
                  <div className="mt-3 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
                    <p className="text-xs font-medium text-amber-800">{disclaimer}</p>
                  </div>
                )}

                {doctorSuggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] mb-3">
                      Suggested Doctors
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {doctorSuggestions.map((suggestion) => (
                        <article
                          key={suggestion.doctorId}
                          className="rounded-xl border border-sky-100 bg-sky-50 p-3"
                        >
                          <p className="text-sm font-black tracking-tighter text-[#111111]">{suggestion.fullName}</p>
                          <p className="text-xs font-medium text-[#707072]">{suggestion.specialization ?? "General Medicine"}</p>
                          <p className="mt-1 text-xs font-medium text-sky-800">{suggestion.matchReason}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Appointments</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{appointments.length}</p>
                  <p className="mt-1 text-sm font-medium text-[#707072]">Total Appointments</p>
                </div>
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Doctors</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{doctors.length}</p>
                  <p className="mt-1 text-sm font-medium text-[#707072]">Doctors Available</p>
                </div>
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Slots</p>
                  <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{slots.length}</p>
                  <p className="mt-1 text-sm font-medium text-[#707072]">Available Slots</p>
                </div>
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === "doctors" && (
            <div className="space-y-5">
              <div className="border-b border-[#E5E5E5] pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Directory</p>
                <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Find &amp; Book a Doctor</h2>
              </div>

              {/* Booking Panel */}
              {selectedDoctor ? (
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Booking Panel</p>
                      <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">{selectedDoctor.fullName}</h3>
                      <p className="text-sm font-medium text-[#707072]">
                        {selectedDoctor.specialization ?? "General Medicine"}
                        {selectedDoctor.experienceYears ? ` · ${selectedDoctor.experienceYears}+ years` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeBookingPanel}
                      className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {filteredSlots.length > 0 ? (
                      <>
                        <label className="block">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
                            Choose a slot
                          </span>
                          <select
                            value={selectedSlotId}
                            onChange={(event) => setSelectedSlotId(event.target.value)}
                            className={inputClass}
                          >
                            <option value="">Choose slot</option>
                            {filteredSlots.map((slot) => (
                              <option key={slot.slotId} value={slot.slotId}>
                                {new Date(slot.slotStart).toLocaleString()} - {new Date(slot.slotEnd).toLocaleTimeString()}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5">
                            Reason for visit
                          </span>
                          <textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Describe your symptoms or concern"
                            rows={3}
                            className={`min-h-[5rem] ${inputClass}`}
                          />
                        </label>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => void book()}
                            disabled={booking || !selectedSlotId || !reason.trim()}
                            className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {booking ? "Booking..." : "Confirm Appointment"}
                          </button>
                          <button
                            type="button"
                            onClick={closeBookingPanel}
                            className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                        No available slots for this doctor right now. You can still keep the doctor selected and try again once slots are published.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {feedback ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                  {feedback}
                </p>
              ) : null}

              {/* Search & Filters */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <input
                    value={doctorSearch}
                    onChange={(event) => setDoctorSearch(event.target.value)}
                    placeholder="Search doctor, specialization, bio"
                    className={inputClass}
                  />
                  <input
                    value={doctorSpecialization}
                    onChange={(event) => setDoctorSpecialization(event.target.value)}
                    placeholder="Filter specialization"
                    className={inputClass}
                  />
                  <input
                    value={doctorMinExperience}
                    onChange={(event) => setDoctorMinExperience(event.target.value)}
                    placeholder="Min experience (years)"
                    type="number"
                    min={0}
                    className={inputClass}
                  />
                  <input
                    value={doctorMaxFee}
                    onChange={(event) => setDoctorMaxFee(event.target.value)}
                    placeholder="Max fee"
                    type="number"
                    min={0}
                    className={inputClass}
                  />
                  <select
                    value={doctorSortBy}
                    onChange={(event) => setDoctorSortBy(event.target.value)}
                    className={inputClass}
                  >
                    <option value="recent">Sort by newest</option>
                    <option value="experience">Sort by experience</option>
                    <option value="fee">Sort by fee</option>
                    <option value="name">Sort by name</option>
                  </select>
                  <select
                    value={doctorSortOrder}
                    onChange={(event) => setDoctorSortOrder(event.target.value)}
                    className={inputClass}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void loadData()}
                    className="rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                  >
                    Apply Search
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
              </div>

              {/* Doctor Cards */}
              {doctors.length === 0 ? (
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center">
                  <Users className="mx-auto h-10 w-10 text-[#707072]" />
                  <p className="mt-3 text-sm font-medium text-[#707072]">No doctors available at the moment</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.doctorId}
                      className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-[#111111]/15"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f7a47]">
                        {doctor.specialization ?? "General Medicine"}
                      </p>
                      <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">{doctor.fullName}</h3>
                      {doctor.experienceYears ? (
                        <p className="mt-0.5 text-xs font-semibold text-[#707072]">
                          {doctor.experienceYears}+ years experience
                        </p>
                      ) : null}
                      {doctor.bio && (
                        <p className="mt-2 text-sm font-medium text-[#707072]">{doctor.bio}</p>
                      )}
                      {doctor.consultationFee ? (
                        <p className="mt-2 text-sm font-semibold text-[#111111]">
                          Fee: <span className="text-[#0f7a47]">Rs. {doctor.consultationFee}</span>
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openBookingPanel(doctor.doctorId)}
                        className="mt-4 w-full rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E5E5E5] pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">My Schedule</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111]">Your Appointments</h2>
                </div>
                <button
                  type="button"
                  onClick={() => void loadData()}
                  className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                >
                  Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
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
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => void loadData()}
                  className="mt-4 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
                >
                  Apply Filters
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-[#707072]" />
                  <p className="mt-3 text-sm font-medium text-[#707072]">No appointments scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.appointmentId}
                      className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-black tracking-tighter text-[#111111]">
                            {appointment.doctorName}
                          </h3>
                          <p className="mt-1 text-xs font-medium text-[#707072]">
                            {new Date(appointment.slotStart).toLocaleString()}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#707072]">
                            <span className="font-semibold text-[#111111]">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                        <span
                          className={`rounded-xl px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            appointment.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : appointment.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-[#f3f3ee] text-[#707072]"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 border-t border-[#E5E5E5] pt-4">
                        {(appointment.status === "pending" || appointment.status === "confirmed") && (
                          <button
                            type="button"
                            disabled={cancellingAppointmentId === appointment.appointmentId}
                            onClick={() => void cancelAppointment(appointment.appointmentId)}
                            className="mb-3 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingAppointmentId === appointment.appointmentId
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        )}
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
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
          {feedback}
        </div>
      )}
    </div>
  );
}
