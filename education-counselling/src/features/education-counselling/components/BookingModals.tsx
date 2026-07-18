"use client";

import { useState } from "react";
import { X, Send, CheckCircle2, Loader2, Sparkles, Calendar, BookOpen, User } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FreeConsultationModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    currentQualification: "",
    intendedDegree: "",
    preferredCountries: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consultation", ...formData }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-black transition">
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-14 w-14 text-[#0f7a47] mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-[#111111] tracking-tight">Consultation Scheduled!</h3>
            <p className="text-xs text-[#707072] max-w-xs mx-auto leading-relaxed">
              We have received your request. An academic counselor will contact you on WhatsApp/Email within 24 hours to confirm your Zoom link.
            </p>
            <button onClick={onClose} className="mt-4 rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#0c6239] transition">
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0f7a47] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Service Program
              </span>
              <h2 className="text-xl font-black tracking-tight text-[#111111]">Book Free 30-Min Consultation</h2>
              <p className="text-xs text-[#707072]">Get initial guidance, country pathways, and timeline evaluations.</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                  placeholder="e.g. Usman Khan"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                    placeholder="usman@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                    placeholder="e.g. +92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Current Education Level</label>
                  <input
                    type="text"
                    required
                    value={formData.currentQualification}
                    onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                    placeholder="e.g. A-Levels, HSSC, Bachelor"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Intended Degree Level</label>
                  <input
                    type="text"
                    required
                    value={formData.intendedDegree}
                    onChange={(e) => setFormData({ ...formData, intendedDegree: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                    placeholder="e.g. Bachelor's, Master's"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Country / Countries</label>
                <input
                  type="text"
                  required
                  value={formData.preferredCountries}
                  onChange={(e) => setFormData({ ...formData, preferredCountries: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                  placeholder="e.g. United States, Germany, Canada"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Time Slot</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold bg-white outline-none"
                  >
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                    <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                    <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Short Description of Assistance Required</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                  placeholder="Tell us about your courses, universities, or scholarship queries..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 mt-4 rounded-xl bg-[#0f7a47] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Booking Slot...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Schedule Consultation
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function CourseRegistrationModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    currentSchool: "",
    currentQualification: "",
    intendedDegree: "Undergraduate",
    preferredField: "",
    preferredCountries: "",
    expectedIntake: "Fall 2027",
    scholarshipRequired: false,
    academicGrades: "",
    englishTestStatus: "Not Taken Yet",
    preferredBatchTiming: "Saturday Afternoon",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "course", ...formData }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-black/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-black transition">
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-14 w-14 text-[#0f7a47] mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-[#111111] tracking-tight">Course Registration Received!</h3>
            <p className="text-xs text-[#707072] max-w-sm mx-auto leading-relaxed">
              Congratulations! Your course registration is registered. Since this course includes intensive in-person training (max 20 students per batch), we will coordinate to schedule your intake interview.
            </p>
            <button onClick={onClose} className="mt-4 rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#0c6239] transition">
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0f7a47] flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                Intensive Program (28 July - 15 Dec)
              </span>
              <h2 className="text-xl font-black tracking-tight text-[#111111]">Join 5-Month Applications &amp; Scholarships Course</h2>
              <p className="text-xs text-[#707072]">Complete guided pathway to essays, college matches, SOP drafts, and visa applications.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Ahmad Shah"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Shah Jahan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="ahmad@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. +92 321 9876543"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Current School / College / Uni</label>
                <input
                  type="text"
                  required
                  value={formData.currentSchool}
                  onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Beaconhouse, Punjab College"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Current Qualification &amp; Grades</label>
                <input
                  type="text"
                  required
                  value={formData.currentQualification}
                  onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. A-Levels (2A*, 1A) / FSC (940/1100)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Intended Degree Level</label>
                <select
                  value={formData.intendedDegree}
                  onChange={(e) => setFormData({ ...formData, intendedDegree: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold bg-white outline-none"
                >
                  <option value="Undergraduate">Undergraduate (Bachelors)</option>
                  <option value="Graduate">Graduate (Masters / PhD)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Field of Study</label>
                <input
                  type="text"
                  required
                  value={formData.preferredField}
                  onChange={(e) => setFormData({ ...formData, preferredField: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Computer Science, Mechanical Eng."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Countries</label>
                <input
                  type="text"
                  required
                  value={formData.preferredCountries}
                  onChange={(e) => setFormData({ ...formData, preferredCountries: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. United States, Germany"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">English Language Test Status</label>
                <select
                  value={formData.englishTestStatus}
                  onChange={(e) => setFormData({ ...formData, englishTestStatus: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold bg-white outline-none"
                >
                  <option value="Not Taken Yet">Not Taken Yet</option>
                  <option value="Registered / Booking In Progress">Registered / Booking In Progress</option>
                  <option value="IELTS Taken (Band 7.0+)">IELTS Taken (Band 7.0+)</option>
                  <option value="IELTS Taken (Band below 7.0)">IELTS Taken (Band below 7.0)</option>
                  <option value="TOEFL/Duolingo Taken">TOEFL/Duolingo Taken</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Batch Timings</label>
                <select
                  value={formData.preferredBatchTiming}
                  onChange={(e) => setFormData({ ...formData, preferredBatchTiming: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2 text-xs font-semibold bg-white outline-none"
                >
                  <option value="Saturday Afternoon (2:00 PM - 5:00 PM)">Saturday Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="Sunday Morning (10:00 AM - 1:00 PM)">Sunday Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Weekday Evening (5:00 PM - 8:00 PM)">Weekday Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="text-xs font-bold text-[#111111] flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.scholarshipRequired}
                    onChange={(e) => setFormData({ ...formData, scholarshipRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  I Require Scholarship Support
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 mt-6 rounded-xl bg-[#0f7a47] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Course Registration
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function PrivateCounsellingModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    requiredService: "Academic Profile Evaluation",
    preferredDate: "",
    preferredTime: "",
    meetingFormat: "Online Meeting (Zoom)",
    sessionDuration: "60 Minutes",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "private", ...formData }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      alert("Failed to book session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-black transition">
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-14 w-14 text-[#0f7a47] mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-[#111111] tracking-tight">Private Session Requested!</h3>
            <p className="text-xs text-[#707072] max-w-xs mx-auto leading-relaxed">
              Your request for a private session with our Head Counsellor is received. We will check availability and send you calendar slots on WhatsApp.
            </p>
            <button onClick={onClose} className="mt-4 rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#0c6239] transition">
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0f7a47] flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                1-on-1 Personalized Session
              </span>
              <h2 className="text-xl font-black tracking-tight text-[#111111]">Book Private Counselling Session</h2>
              <p className="text-xs text-[#707072]">Targeted discussion on essays, college list reviews, interview prep, or visa filings.</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold"
                  placeholder="e.g. Fatima Ali"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold"
                    placeholder="fatima@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold"
                    placeholder="e.g. +92 300 7654321"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Required Counselling Service</label>
                <select
                  value={formData.requiredService}
                  onChange={(e) => setFormData({ ...formData, requiredService: e.target.value })}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold bg-white outline-none"
                >
                  <option value="Academic Profile Evaluation">Academic Profile Evaluation</option>
                  <option value="Career and Degree Selection">Career and Degree Selection</option>
                  <option value="Country and University Selection">Country and University Selection</option>
                  <option value="Application Strategy & Deadline Management">Application Strategy & Deadline Management</option>
                  <option value="Personal Statement Brainstorming & Review">Personal Statement Brainstorming & Review</option>
                  <option value="Supplementary Essay Writing Review">Supplementary Essay Writing Review</option>
                  <option value="Interview Preparation (Mock Sessions)">Interview Preparation (Mock Sessions)</option>
                  <option value="Visa Application Filing Guidance">Visa Application Filing Guidance</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Meeting Mode</label>
                  <select
                    value={formData.meetingFormat}
                    onChange={(e) => setFormData({ ...formData, meetingFormat: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold bg-white outline-none"
                  >
                    <option value="Online Meeting (Zoom)">Online Meeting (Zoom)</option>
                    <option value="In-Person (Bahawalpur Office)">In-Person (Bahawalpur Office)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Session Duration</label>
                  <select
                    value={formData.sessionDuration}
                    onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold bg-white outline-none"
                  >
                    <option value="45 Minutes">45 Minutes</option>
                    <option value="60 Minutes">60 Minutes</option>
                    <option value="90 Minutes">90 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Preferred Time</label>
                  <input
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#707072]">Relevant Documents to Upload (Optional)</label>
                <input
                  type="file"
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-[#0f7a47] hover:file:bg-green-100"
                />
                <span className="text-[10px] text-gray-400 block mt-1">Upload transcripts, CVs, or essay drafts for counselor review.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 mt-4 rounded-xl bg-[#0f7a47] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Requesting Private Session...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Request Private Session
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
