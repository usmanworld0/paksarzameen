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
      <div className="flex flex-col items-center justify-center rounded-[1.6rem] border border-[#e5e5e5] bg-[#fafafa] p-8 text-center sm:p-12">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#111111] text-white">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-6 font-['Arial_Narrow'] text-[3.4rem] font-bold uppercase tracking-[-0.06em] text-[#111111]">
          Thank You!
        </h2>
        <p className="mt-3 max-w-md text-[1.5rem] leading-[1.8] text-[#707072]">
          We have received your request and will be in touch within 3-5 working
          days. Welcome to the PakSarZameen community.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="site-button-secondary mt-8"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.6rem] border border-[#e5e5e5] bg-white p-5 sm:p-7"
      noValidate
    >
      <p className="site-form-label site-form-label--caps">
        Your Details
      </p>

      {/* Row 1 - Name + Email */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="site-form-label site-form-label--caps"
          >
            Full Name <span className="text-[#111111]">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Abdullah Tanseer"
            className="site-input mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="site-form-label site-form-label--caps"
          >
            Email Address <span className="text-[#111111]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="site-input mt-2"
          />
        </div>
      </div>

      {/* Row 2 - Phone + City */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="site-form-label site-form-label--caps"
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
            className="site-input mt-2"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="site-form-label site-form-label--caps"
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
            className="site-input mt-2"
          />
        </div>
      </div>

      {/* Row 3 - Role */}
      <div className="mt-4">
        <label
          htmlFor="role"
          className="site-form-label site-form-label--caps"
        >
          I Want To <span className="text-[#111111]">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          value={values.role}
          onChange={handleChange}
          className="site-select mt-2"
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
        <p className="site-form-label site-form-label--caps">
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
                className={`rounded-full border px-4 py-2.5 text-[1.2rem] font-medium uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#cacacb] bg-white text-[#111111] hover:border-[#111111] hover:bg-[#f5f5f5]"
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
          className="site-form-label site-form-label--caps"
        >
          How Did You Hear About Us?
        </label>
        <select
          id="howHeard"
          name="howHeard"
          value={values.howHeard}
          onChange={handleChange}
          className="site-select mt-2"
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
          className="site-form-label site-form-label--caps"
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
          className="site-textarea mt-2"
        />
      </div>

      {/* Submit */}
      <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[1.25rem] text-[#707072]">
          <span className="text-[#111111]">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={loading}
          className="site-button inline-flex w-full items-center gap-2 disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Application"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
