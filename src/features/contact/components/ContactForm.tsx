"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setIsError(false);

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
      setIsError(true);
      setStatus(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5"
        >
          Name
        </label>
        <input
          id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5"
        >
          Email
        </label>
        <input
          id="contact-email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10 resize-none"
        />
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status ? (
          <p
            className={
              isError
                ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
                : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"
            }
          >
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}
