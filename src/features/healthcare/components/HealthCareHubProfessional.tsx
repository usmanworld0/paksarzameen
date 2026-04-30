"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Users, Heart, AlertCircle, Search, X, Loader2 } from "lucide-react";
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
  const [isAskingAI, setIsAskingAI] = useState(false);

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
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeBookingPanel() {
    setSelectedDoctorId("");
    setSelectedSlotId("");
    setReason("");
  }

  async function loadData() {
    try {
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

      if (!doctorsResponse.ok) {
        const errorMsg = doctorsPayload.error ?? "Unable to load doctors right now.";
        setDoctors([]);
        setSlots([]);
        setFeedback(errorMsg);
        return;
      }

      const doctorsRes = doctorsPayload.data?.doctors ?? [];
      const slotsRes = doctorsPayload.data?.slots ?? [];
      
      setDoctors(doctorsRes);
      setSlots(slotsRes);

      const appointmentParams = new URLSearchParams();
      if (appointmentSearch.trim()) appointmentParams.set("search", appointmentSearch.trim());
      if (appointmentStatus !== "all") appointmentParams.set("status", appointmentStatus);
      appointmentParams.set("sortBy", appointmentSortBy);
      appointmentParams.set("sortOrder", appointmentSortOrder);

      const appointmentsResponse = await fetch(`/api/healthcare/appointments?${appointmentParams.toString()}`, {
        cache: "no-store",
      });
      const appointmentsPayload = (await appointmentsResponse.json()) as { data?: Appointment[]; error?: string };
      
      if (appointmentsResponse.ok) {
        setAppointments(appointmentsPayload.data ?? []);
      } else {
        const errorMsg = appointmentsPayload.error ?? "Unable to load appointments right now.";
        setAppointments([]);
        setFeedback(errorMsg);
      }
    } catch (err) {
      setDoctors([]);
      setSlots([]);
      setAppointments([]);
      setFeedback("Unable to load healthcare data right now.");
    }
  }

  async function askQuickAnswer() {
    if (!question.trim() || isAskingAI) return;
    setIsAskingAI(true);
    setAnswer(null);
    setDisclaimer(null);
    setDoctorSuggestions([]);
    
    try {
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
        return;
      }

      setAnswer(payload.data?.answer ?? "No response available.");
      setDisclaimer(payload.data?.disclaimer ?? null);
      setDoctorSuggestions(payload.data?.doctorSuggestions ?? []);
    } finally {
      setIsAskingAI(false);
    }
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

      setFeedback("Appointment booked successfully.");
      setReason("");
      setSelectedSlotId("");
      setSelectedDoctorId("");
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

      setFeedback("Appointment cancelled.");
      await loadData();
    } finally {
      setCancellingAppointmentId(null);
    }
  }

  useEffect(() => {
    void loadData();
  }, [
    doctorSortBy,
    doctorSortOrder,
    appointmentStatus,
    appointmentSortBy,
    appointmentSortOrder
  ]);

  // Temporary feedback clearing
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans pb-24 selection:bg-[#111111] selection:text-white">
      {/* HEADER PAGE SECTION */}
      <header className="px-[5%] pt-12 pb-8 md:pt-16 md:pb-12 border-b border-[#E5E5E5] flex flex-col gap-6 md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-[10vw] md:text-[6rem] leading-[0.9] font-black uppercase tracking-tighter">
            CLINIC.
          </h1>
          <p className="mt-2 text-[#707072] text-sm md:text-base tracking-wide font-medium">
            YOUR DIGITAL MEDICAL COMPANION
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/healthcare/doctor/sign-in"
            className="rounded-full border border-[#CACACB] bg-white px-6 py-2.5 text-sm font-medium transition hover:border-[#111111] hover:text-[#111111]"
          >
            Sign In
          </Link>
          <Link
            href="/healthcare/doctor/sign-up"
            className="rounded-full bg-[#111111] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#707072]"
          >
            Become a Doctor
          </Link>
        </div>
      </header>

      {/* TABS OVERVIEW */}
      <div className="px-[5%] border-b border-[#E5E5E5] sticky top-[4rem] sm:top-[7rem] bg-white z-40">
        <div className="flex gap-8 overflow-x-auto py-5 whitespace-nowrap scrollbar-hide">
          {[
            { id: "dashboard", label: "ASSISTANT" },
            { id: "doctors", label: "FIND DOCTORS" },
            { id: "appointments", label: "APPOINTMENTS" },
            { id: "profile", label: "PROFILE" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`text-sm md:text-base pb-1 font-medium tracking-wide uppercase transition-all duration-200 border-b-2 ${
                activeTab === id
                  ? "border-[#111111] text-[#111111]"
                  : "border-transparent text-[#707072] hover:text-[#111111]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-[5%] py-10 md:py-16">
        
        {/* TAB 1: DASHBOARD / AI */}
        {activeTab === "dashboard" && (
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* AI Assistant */}
            <div>
              <h2 className="text-3xl font-medium tracking-tight mb-8">Medical AI Assistant</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void askQuickAnswer()}
                  placeholder="Ask about symptoms, health concerns, etc..."
                  className="flex-1 rounded-lg border border-[#CACACB] bg-[#F5F5F5] px-5 py-4 text-base focus:bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition"
                />
                <button
                  type="button"
                  disabled={isAskingAI || !question.trim()}
                  onClick={() => void askQuickAnswer()}
                  className="rounded-full bg-[#111111] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#707072] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[120px]"
                >
                  {isAskingAI ? <Loader2 className="animate-spin h-5 w-5" /> : "ASK AI"}
                </button>
              </div>

              {answer && (
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 md:p-8 rounded-none">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#707072] mb-4">Diagnostic Context</h3>
                  <div className="prose prose-sm md:prose-base prose-slate max-w-none text-[#111111] leading-relaxed">
                    {answer}
                  </div>
                </div>
              )}

              {disclaimer && (
                <div className="mt-4 flex items-start gap-3 border-l-4 border-[#D30005] bg-[#FFF0F0] p-4 text-[#D30005]">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{disclaimer}</p>
                </div>
              )}

              {doctorSuggestions.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-medium tracking-tight mb-6">Suggested Specialists</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {doctorSuggestions.map((suggestion) => (
                      <div key={suggestion.doctorId} className="border border-[#E5E5E5] bg-white p-5 cursor-pointer hover:border-[#111111] transition group" onClick={() => openBookingPanel(suggestion.doctorId)}>
                        <p className="text-lg font-semibold text-[#111111]">{suggestion.fullName}</p>
                        <p className="text-sm text-[#707072] mb-3">{suggestion.specialization ?? "General Medicine"}</p>
                        <p className="text-sm font-medium text-[#1151FF] bg-[#F5F5F5] p-3 inline-block w-full">{suggestion.matchReason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats sidebar */}
            <div className="space-y-4">
              <div className="bg-[#F5F5F5] p-6 border border-[#E5E5E5]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#707072]">Total Doctors</p>
                <p className="mt-2 text-4xl font-medium tracking-tight">{doctors.length}</p>
              </div>
              <div className="bg-[#111111] p-6 text-white border border-[#111111]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9E9EA0]">Your Appointments</p>
                <p className="mt-2 text-4xl font-medium tracking-tight">{appointments.length}</p>
              </div>
              <div className="bg-[#F5F5F5] p-6 border border-[#E5E5E5]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#707072]">Available Slots</p>
                <p className="mt-2 text-4xl font-medium tracking-tight">{slots.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTORS */}
        {activeTab === "doctors" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <h2 className="text-3xl font-medium tracking-tight">Our Specialists</h2>
            </div>
            
            {/* Booking Panel Overlay when doctor is selected */}
            {selectedDoctor && (
              <div className="mb-10 bg-[#111111] text-white p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#9E9EA0] mb-2">Selected for booking</p>
                    <h3 className="text-3xl font-medium leading-none">Dr. {selectedDoctor.fullName}</h3>
                    <p className="text-sm text-[#CACACB] mt-2">
                       {selectedDoctor.specialization ?? "General Medicine"}
                       {selectedDoctor.experienceYears ? ` / ${selectedDoctor.experienceYears}+ YRS EXP` : ""}
                    </p>
                  </div>
                  <button
                    onClick={closeBookingPanel}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#28282A] text-white hover:bg-white hover:text-black transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-w-2xl space-y-6">
                  {filteredSlots.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-wide text-[#CACACB]">Time Slot</label>
                        <select
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                          className="w-full rounded-none bg-white text-black px-4 py-3 text-base border-none outline-none focus:ring-2 focus:ring-[#1151FF]"
                        >
                          <option value="" disabled>Select available time</option>
                          {filteredSlots.map((slot) => (
                            <option key={slot.slotId} value={slot.slotId}>
                              {new Date(slot.slotStart).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium uppercase tracking-wide text-[#CACACB]">Reason</label>
                        <input
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Brief description of your concern"
                          className="w-full bg-[#28282A] border border-[#4B4B4D] px-4 py-3 text-base text-white placeholder-[#707072] focus:bg-[#1f1f21] focus:border-white focus:ring-0 outline-none transition rounded-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => void book()}
                        disabled={booking || !selectedSlotId || !reason.trim()}
                        className="rounded-full bg-white text-black px-8 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {booking ? "CONFIRMING..." : "CONFIRM APPOINTMENT"}
                      </button>
                    </>
                  ) : (
                    <div className="bg-[#28282A] p-4 text-[#CACACB] text-sm">
                      Dr. {selectedDoctor.fullName} currently has no open slots. Check back later.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mb-10 p-5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-none space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#707072]" />
                  <input
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    placeholder="Search doctor name..."
                    className="w-full bg-white border border-[#CACACB] pl-10 pr-4 py-3 text-sm focus:border-[#111111] outline-none"
                  />
                </div>
                <input
                  value={doctorSpecialization}
                  onChange={(e) => setDoctorSpecialization(e.target.value)}
                  placeholder="Specialization"
                  className="w-full bg-white border border-[#CACACB] px-4 py-3 text-sm focus:border-[#111111] outline-none"
                />
                <select
                  value={doctorSortBy}
                  onChange={(e) => setDoctorSortBy(e.target.value)}
                  className="w-full bg-white border border-[#CACACB] px-4 py-3 text-sm focus:border-[#111111] outline-none"
                >
                  <option value="recent">Sort: Newest</option>
                  <option value="experience">Sort: Experience</option>
                  <option value="fee">Sort: Fee</option>
                  <option value="name">Sort: Name</option>
                </select>
                <div className="flex gap-2">
                  <select
                    value={doctorSortOrder}
                    onChange={(e) => setDoctorSortOrder(e.target.value)}
                    className="flex-1 bg-white border border-[#CACACB] px-4 py-3 text-sm focus:border-[#111111] outline-none"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                  <button
                    onClick={() => void loadData()}
                    className="bg-[#111111] text-white px-5 rounded-none font-medium hover:bg-[#707072] transition"
                  >
                    APPLY
                  </button>
                </div>
              </div>
            </div>

            {doctors.length === 0 ? (
              <div className="py-20 text-center border border-[#E5E5E5]">
                <p className="text-xl text-[#707072] font-medium tracking-tight">No doctors match your criteria.</p>
                <button 
                  onClick={() => {
                    setDoctorSearch("");
                    setDoctorSpecialization("");
                    setDoctorSortBy("recent");
                    setDoctorSortOrder("desc");
                    void loadData();
                  }}
                  className="mt-4 text-[#111111] underline font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <div key={doctor.doctorId} className="group relative flex flex-col justify-between border border-[#E5E5E5] bg-white p-6 transition-all hover:border-[#111111]">
                    <div className="mb-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">{doctor.fullName}</h3>
                        {doctor.experienceYears && (
                          <span className="bg-[#F5F5F5] text-[#111111] text-xs font-bold px-2 py-1 tracking-widest uppercase">
                            {doctor.experienceYears}+ YR
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-[#707072] mb-4">
                        {doctor.specialization || "General Medicine"}
                      </p>
                      
                      {doctor.bio && (
                         <p className="text-sm text-[#707072] line-clamp-3 leading-relaxed">{doctor.bio}</p>
                      )}
                    </div>
                    
                    <div className="mt-auto space-y-4 border-t border-[#E5E5E5] pt-4">
                      {doctor.consultationFee !== null && (
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-[#707072]">CONSULTATION</span>
                          <span className="text-[#111111]">RS. {doctor.consultationFee}</span>
                        </div>
                      )}
                      <button
                        onClick={() => openBookingPanel(doctor.doctorId)}
                        className="w-full rounded-full border border-[#111111] bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#111111] transition hover:bg-[#111111] hover:text-white"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
              <h2 className="text-3xl font-medium tracking-tight">Your Schedule</h2>
              <button
                onClick={() => void loadData()}
                className="text-sm font-bold uppercase tracking-wide underline decoration-2 underline-offset-4 hover:text-[#707072]"
              >
                REFRESH
              </button>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4 border-y border-[#E5E5E5] py-4">
              <select
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="all">ALL STATUSES</option>
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="completed">COMPLETED</option>
                <option value="cancelled">CANCELLED</option>
              </select>
              <span className="hidden md:inline text-[#CACACB]">|</span>
              <select
                value={appointmentSortBy}
                onChange={(e) => setAppointmentSortBy(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="createdAt">SORT BY CREATED</option>
                <option value="slotStart">SORT BY TIME</option>
              </select>
              <span className="hidden md:inline text-[#CACACB]">|</span>
              <select
                value={appointmentSortOrder}
                onChange={(e) => setAppointmentSortOrder(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="desc">DESCENDING</option>
                <option value="asc">ASCENDING</option>
              </select>
            </div>

            {appointments.length === 0 ? (
              <div className="py-20 text-center border border-[#E5E5E5]">
                <p className="text-xl text-[#707072] font-medium tracking-tight">You have no recorded appointments.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div key={appointment.appointmentId} className="border border-[#E5E5E5] bg-white p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:items-start group">
                    <div className="flex-1 space-y-4">
                       <div className="flex flex-wrap items-center gap-3 mb-2">
                         <span
                           className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                             appointment.status === "confirmed" ? "bg-[#007D48] text-white" :
                             appointment.status === "pending" ? "bg-[#FEDF35] text-black" :
                             appointment.status === "cancelled" ? "bg-[#E5E5E5] text-[#9E9EA0]" :
                             "bg-[#E5E5E5] text-[#111111]"
                           }`}
                         >
                           {appointment.status}
                         </span>
                         <span className="text-sm font-medium text-[#707072]">
                           {new Date(appointment.slotStart).toLocaleString('en-US', { 
                             weekday: 'long', month: 'short', day: 'numeric', 
                             hour: 'numeric', minute: '2-digit' 
                           })}
                         </span>
                       </div>
                       
                       <h3 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">
                         Dr. {appointment.doctorName}
                       </h3>
                       
                       <div className="text-base text-[#111111] bg-[#FAFAFA] p-4 border-l-2 border-[#CACACB]">
                         <span className="text-[#707072] text-xs font-bold uppercase block mb-1">Reason:</span> 
                         {appointment.reason}
                       </div>
                    </div>

                    <div className="w-full lg:w-96 flex flex-col gap-4">
                      {(appointment.status === "pending" || appointment.status === "confirmed") && (
                        <button
                          disabled={cancellingAppointmentId === appointment.appointmentId}
                          onClick={() => void cancelAppointment(appointment.appointmentId)}
                          className="w-full rounded-full border border-[#D30005] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#D30005] transition hover:bg-[#FFF0F0] disabled:opacity-50"
                        >
                          {cancellingAppointmentId === appointment.appointmentId ? "CANCELLING..." : "CANCEL APPOINTMENT"}
                        </button>
                      )}
                      
                      {/* Chat integrated */}
                      <div className="w-full">
                        <AppointmentChatBox appointmentId={appointment.appointmentId} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-4xl">
            <h2 className="text-3xl font-medium tracking-tight mb-8">Personal Profile</h2>
            <HealthcareProfileManager />
          </div>
        )}

      </div>

      {feedback && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full border-2 border-[#111111] bg-[#111111] px-6 py-3 shadow-2xl text-white font-medium animate-in slide-in-from-bottom-5">
          {feedback}
        </div>
      )}
    </div>
  );
}