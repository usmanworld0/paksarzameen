"use client";

import { useState } from "react";
import { X, CheckCircle2, Sparkles } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/48 backdrop-blur-[2px] p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-black/10 p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-700 mx-auto" />
            <h3 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
              Consultation Scheduled
            </h3>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto leading-relaxed">
              We have received your request. An academic counsellor will contact you on WhatsApp/Email within 24 hours to confirm your Zoom link.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="store-pill-outline text-xs mt-4"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <span className="store-kicker">Free Assessment</span>
              <h2 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
                Book 30-Min Consultation
              </h2>
              <p className="text-xs text-neutral-500">
                Initial profile evaluation, country pathways, and timeline guidance.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="store-control text-xs"
                  placeholder="e.g. Usman Khan"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="store-control text-xs"
                    placeholder="usman@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="store-control text-xs"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Current Qualification
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentQualification}
                    onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })}
                    className="store-control text-xs"
                    placeholder="e.g. A-Levels / F.Sc"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Intended Degree
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.intendedDegree}
                    onChange={(e) => setFormData({ ...formData, intendedDegree: e.target.value })}
                    className="store-control text-xs"
                    placeholder="e.g. B.S. CS / M.S. Data"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Target Destination Countries
                </label>
                <input
                  type="text"
                  required
                  value={formData.preferredCountries}
                  onChange={(e) => setFormData({ ...formData, preferredCountries: e.target.value })}
                  className="store-control text-xs"
                  placeholder="e.g. United States, Germany, Canada"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="store-control text-xs py-2.5 h-auto"
                  placeholder="Any specific questions regarding budgets, test scores, etc."
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="store-button-primary w-full py-3.5 text-xs"
              >
                <span className="btn-label">{loading ? "Submitting..." : "Confirm Booking"}</span>
                <span className="btn-icon">&rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function CourseApplicationModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    currentQualification: "",
    academicGrades: "",
    englishTestStatus: "Not Taken Yet",
    preferredBatchTiming: "Weekend Batch (Sat & Sun)",
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
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/48 backdrop-blur-[2px] p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-black/10 p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-700 mx-auto" />
            <h3 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
              Registration Recorded
            </h3>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto leading-relaxed">
              We will contact you via WhatsApp with the batch timetable and onboarding details.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="store-pill-outline text-xs mt-4"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <span className="store-kicker">Cohort Enrollment</span>
              <h2 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
                Application Mentorship Course
              </h2>
              <p className="text-xs text-neutral-500">
                5-Month guided admissions cohort for Fall intake cycles.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="store-control text-xs"
                  placeholder="e.g. Bilal Ahmed"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="store-control text-xs"
                    placeholder="bilal@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="store-control text-xs"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Academic Background
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentQualification}
                    onChange={(e) => setFormData({ ...formData, currentQualification: e.target.value })}
                    className="store-control text-xs"
                    placeholder="e.g. A-Levels / F.Sc / Bachelors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Grades / GPA
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.academicGrades}
                    onChange={(e) => setFormData({ ...formData, academicGrades: e.target.value })}
                    className="store-control text-xs"
                    placeholder="e.g. 3.7 GPA / 3 As"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="store-button-primary w-full py-3.5 text-xs"
              >
                <span className="btn-label">{loading ? "Submitting..." : "Apply for Cohort"}</span>
                <span className="btn-icon">&rarr;</span>
              </button>
            </div>
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
    requiredService: "Undergraduate Essay Review",
    sessionDuration: "60 Minutes (Deep Dive)",
    preferredDate: "",
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
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/48 backdrop-blur-[2px] p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-black/10 p-7 sm:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-black transition"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-700 mx-auto" />
            <h3 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
              Session Booked
            </h3>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto leading-relaxed">
              We have received your 1-on-1 private session request. Our advisory team will confirm your dedicated time slot shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="store-pill-outline text-xs mt-4"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <span className="store-kicker">1-on-1 Mentorship</span>
              <h2 className="text-xl font-normal tracking-[-0.02em] text-neutral-950">
                Book Private Advisory Session
              </h2>
              <p className="text-xs text-neutral-500">
                Detailed essay editing, research proposal review, or mock visa interview.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="store-control text-xs"
                  placeholder="e.g. Ayesha Siddiqui"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="store-control text-xs"
                    placeholder="ayesha@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="store-control text-xs"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Advisory Focus
                </label>
                <select
                  value={formData.requiredService}
                  onChange={(e) => setFormData({ ...formData, requiredService: e.target.value })}
                  className="store-control text-xs font-normal"
                >
                  <option value="Undergraduate Essay Review">Undergraduate Essay &amp; Common App Review</option>
                  <option value="Graduate Research & SOP">Graduate Statement of Purpose (SOP) &amp; Proposal</option>
                  <option value="Scholarship Application">Scholarship Application (Fulbright/Chevening/DAAD)</option>
                  <option value="Visa Mock Interview">Embassy Visa Mock Interview</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Topic Details / Specific Questions
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="store-control text-xs py-2.5 h-auto"
                  placeholder="Tell us what you would like to review in this session..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="store-button-primary w-full py-3.5 text-xs"
              >
                <span className="btn-label">{loading ? "Submitting..." : "Confirm Private Session"}</span>
                <span className="btn-icon">&rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
