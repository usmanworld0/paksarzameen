"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload?.error || "Submission failed");
      }

      setStatus("Message sent. Thank you!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]">
          Name
        </span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]">
          Email
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4d665a]">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#d0e1d8] bg-white px-4 py-3.5 text-base text-[#1f3a2d] outline-none transition-all duration-200 focus:border-[#1f8f63]/65 focus:shadow-[0_0_0_3px_rgba(31,143,99,0.13)]"
        />
      </label>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-[linear-gradient(120deg,#1f8f63_0%,#2ea874_56%,#58b88a_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_20px_rgba(31,116,78,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(31,116,78,0.32)] disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status ? (
          <span className="max-w-full break-words rounded-md bg-[#edf8f1] px-3.5 py-2 text-base text-[#486257]">
            {status}
          </span>
        ) : null}
      </div>
    </form>
  );
}
