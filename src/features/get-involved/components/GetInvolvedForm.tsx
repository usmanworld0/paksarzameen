"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  programs: string[];
  message: string;
  howHeard: string;
};

const ROLE_OPTIONS = [
  "Volunteer",
  "Institutional Partner",
  "Corporate Donor",
  "Individual Donor",
  "Media / Press",
  "Researcher / Academic",
  "Other",
];

const PROGRAM_OPTIONS = [
  "Mahkma Shajarkari (Environment)",
  "Dar ul Aloom (Education)",
  "Tibi Imdad (Health)",
  "Insaani Khidmat (Welfare)",
  "Wajood-e-Zan (Women Empowerment)",
  "Paksarzameen Store",
  "General / All Programs",
];

const HOW_HEARD_OPTIONS = [
  "Social Media",
  "Word of Mouth",
  "News Article",
  "Event or Workshop",
  "Website Search",
  "Other",
];

const INITIAL: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  role: "",
  programs: [],
  message: "",
  howHeard: "",
};

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";

const labelClass =
  "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

export function GetInvolvedForm() {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleProgramToggle(program: string) {
    setValues((prev) => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter((p) => p !== program)
        : [...prev.programs, program],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate async submission for now. Replace with a real API call later.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f7a47] text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-black tracking-tighter text-[#111111]">
          Thank You!
        </h2>
        <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-[#707072]">
          We have received your request and will be in touch within 3–5 working
          days. Welcome to the PakSarZameen community.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 rounded-xl border border-[#E5E5E5] bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#0f7a47] hover:text-[#0f7a47]"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-7"
      noValidate
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
        Your Details
      </p>

      {/* Row 1 - Name + Email */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-[#0f7a47]">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Abdullah Tanseer"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-[#0f7a47]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 2 - Phone + City */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+92 303 5763435"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>
            City / Region
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={values.city}
            onChange={handleChange}
            placeholder="e.g. Bahawalpur"
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3 - Role */}
      <div className="mt-4">
        <label htmlFor="role" className={labelClass}>
          I Want To <span className="text-[#0f7a47]">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          value={values.role}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" disabled>
            Select your role
          </option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Row 4 - Program interest (multi-select chips) */}
      <div className="mt-5">
        <p className={labelClass}>Programs of Interest</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROGRAM_OPTIONS.map((program) => {
            const active = values.programs.includes(program);
            return (
              <button
                key={program}
                type="button"
                onClick={() => handleProgramToggle(program)}
                className={`rounded-xl border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${
                  active
                    ? "border-[#0f7a47] bg-[#0f7a47] text-white"
                    : "border-[#E5E5E5] bg-white text-[#707072] hover:border-[#0f7a47] hover:text-[#0f7a47]"
                }`}
              >
                {program}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 5 - How did you hear */}
      <div className="mt-5">
        <label htmlFor="howHeard" className={labelClass}>
          How Did You Hear About Us?
        </label>
        <select
          id="howHeard"
          name="howHeard"
          value={values.howHeard}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" disabled>
            Select an option
          </option>
          {HOW_HEARD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Row 6 - Message */}
      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          Message / Additional Context
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself, your skills, or what you hope to contribute..."
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10 resize-none"
        />
      </div>

      {/* Submit */}
      <div className="mt-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-[#707072]">
          <span className="text-[#0f7a47]">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a47] px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Application"}
          {!loading && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </form>
  );
}
