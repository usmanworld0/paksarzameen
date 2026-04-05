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
      <div className="flex flex-col items-center justify-center rounded-[1.45rem] border border-[#bfdccc] bg-[linear-gradient(160deg,rgba(237,252,246,0.95),rgba(255,255,255,0.96))] p-8 text-center sm:p-12">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f63] text-white shadow-[0_10px_22px_rgba(32,127,92,0.3)]">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-6 font-heading text-3xl font-bold text-[#1e2a33]">
          Thank You!
        </h2>
        <p className="mt-3 max-w-md text-base leading-relaxed text-[#4c5f5a]">
          We have received your request and will be in touch within 3-5 working
          days. Welcome to the PakSarZameen community.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-full border border-[#1f8f63] px-6 py-2.5 text-sm font-semibold text-[#1f8f63] transition-colors hover:bg-[#1f8f63] hover:text-white"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.3rem] border border-[#d0e1d8] bg-[linear-gradient(165deg,rgba(255,255,255,0.97),rgba(245,251,247,0.94))] p-5 shadow-[0_14px_34px_rgba(35,98,72,0.12)] sm:p-7"
      noValidate
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f8f63]">
        Your Details
      </p>

      {/* Row 1 - Name + Email */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
          >
            Full Name <span className="text-[#1f8f63]">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Abdullah Tanseer"
            className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
          >
            Email Address <span className="text-[#1f8f63]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
          />
        </div>
      </div>

      {/* Row 2 - Phone + City */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+92 303 5763435"
            className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
          >
            City / Region
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={values.city}
            onChange={handleChange}
            placeholder="e.g. Bahawalpur"
            className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
          />
        </div>
      </div>

      {/* Row 3 - Role */}
      <div className="mt-4">
        <label
          htmlFor="role"
          className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
        >
          I Want To <span className="text-[#1f8f63]">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          value={values.role}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
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
      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]">
          Programs of Interest
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROGRAM_OPTIONS.map((program) => {
            const active = values.programs.includes(program);
            return (
              <button
                key={program}
                type="button"
                onClick={() => handleProgramToggle(program)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.04em] transition-all duration-300 ${
                  active
                    ? "border-transparent bg-[linear-gradient(120deg,#1f8f63_0%,#2ea874_58%,#58b88a_100%)] text-white shadow-[0_8px_18px_rgba(31,116,78,0.3)]"
                    : "border-[#d0e1d8] bg-white text-[#4e665a] hover:-translate-y-0.5 hover:border-[#afceb8] hover:bg-[#f4fbf7]"
                }`}
              >
                {program}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 5 - How did you hear */}
      <div className="mt-6">
        <label
          htmlFor="howHeard"
          className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
        >
          How Did You Hear About Us?
        </label>
        <select
          id="howHeard"
          name="howHeard"
          value={values.howHeard}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
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
      <div className="mt-6">
        <label
          htmlFor="message"
          className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]"
        >
          Message / Additional Context
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself, your skills, or what you hope to contribute..."
          className="mt-2 min-h-36 w-full resize-y rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 placeholder:text-[#91a99d] focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
        />
      </div>

      {/* Submit */}
      <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#62776d]">
          <span className="text-[#1f8f63]">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(120deg,#1f8f63_0%,#2ea874_55%,#58b88a_100%)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_26px_rgba(31,116,78,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,116,78,0.36)] disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Application"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
