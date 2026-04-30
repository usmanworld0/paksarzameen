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
        <span className="site-form-label site-form-label--caps">
          Name
        </span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="site-input mt-2"
        />
      </label>

      <label className="block">
        <span className="site-form-label site-form-label--caps">
          Email
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="site-input mt-2"
        />
      </label>

      <label className="block">
        <span className="site-form-label site-form-label--caps">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="site-textarea mt-2"
        />
      </label>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="site-button disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status ? (
          <span className="site-status max-w-full break-words">
            {status}
          </span>
        ) : null}
      </div>
    </form>
  );
}
