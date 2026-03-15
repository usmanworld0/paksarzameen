"use client";

import { useState, FormEvent } from "react";

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

      setStatus("Message sent — thank you!");
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
        <span className="text-sm font-medium text-neutral-700">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-md border border-neutral-200 p-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-neutral-200 p-2"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-neutral-700">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full rounded-md border border-neutral-200 p-2"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-psz-green px-4 py-2 text-white"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status ? <span className="text-sm text-neutral-600">{status}</span> : null}
      </div>
    </form>
  );
}
