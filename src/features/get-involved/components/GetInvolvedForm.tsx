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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-psz-green/20 bg-psz-green/5 p-8 text-center sm:p-12 lg:col-span-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-psz-green text-white">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-6 font-heading text-3xl font-bold text-neutral-900">
          Thank You!
        </h2>
        <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-500">
          We have received your request and will be in touch within 3-5 working
          days. Welcome to the PakSarZameen community.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-full border border-psz-green px-6 py-2.5 text-sm font-semibold text-psz-green transition-colors hover:bg-psz-green hover:text-white"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2"
      noValidate
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-psz-green">
        Your Details
      </p>

      {/* Row 1 - Name + Email */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
          >
            Full Name <span className="text-psz-green">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={values.fullName}
            onChange={handleChange}
            placeholder="e.g. Abdullah Tanseer"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-psz-green/60"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
          >
            Email Address <span className="text-psz-green">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-psz-green/60"
          />
        </div>
      </div>

      {/* Row 2 - Phone + City */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
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
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-psz-green/60"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
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
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-psz-green/60"
          />
        </div>
      </div>

      {/* Row 3 - Role */}
      <div className="mt-4">
        <label
          htmlFor="role"
          className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
        >
          I Want To <span className="text-psz-green">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          value={values.role}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-psz-green/60"
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
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
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
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "border-psz-green bg-psz-green text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50"
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
          className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
        >
          How Did You Hear About Us?
        </label>
        <select
          id="howHeard"
          name="howHeard"
          value={values.howHeard}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-psz-green/60"
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
          className="block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500"
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
          className="mt-2 min-h-32 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-psz-green/60"
        />
      </div>

      {/* Submit */}
      <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-400">
          <span className="text-psz-green">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-psz-green px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-psz-green-light disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit Application"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
