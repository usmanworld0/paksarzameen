"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    msg: "",
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
        body: JSON.stringify({
          type: "inquiry",
          studentName: formData.name,
          email: formData.email,
          phone: "Web Contact Page",
          description: formData.msg,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", msg: "" });
      }
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-[80px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-8 sm:py-12 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-6 space-y-1.5">
          <p className="store-kicker">Connect</p>
          <h1 className="store-heading">Contact Us</h1>
          <p className="store-subheading">
            Visit our Bahawalpur office or send an online inquiry below.
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          
          <div className="space-y-4">
            <div className="store-panel rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
              <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Phone</span>
                <a href="tel:+923001234567" className="text-sm font-normal text-neutral-950 hover:underline">
                  +92 300 1234567
                </a>
              </div>
            </div>

            <div className="store-panel rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
              <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Email</span>
                <a href="mailto:counselling@paksarzameenwfo.com" className="text-sm font-normal text-neutral-950 hover:underline">
                  counselling@paksarzameenwfo.com
                </a>
              </div>
            </div>

            <div className="store-panel rounded-2xl p-4 sm:p-5 flex items-center gap-3.5">
              <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Office</span>
                <span className="text-sm font-normal text-neutral-950">
                  Model Town B, Bahawalpur, Punjab, Pakistan
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button-primary w-full sm:w-auto text-xs"
              >
                <span className="btn-label">WhatsApp Direct</span>
                <span className="btn-icon">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="store-card rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-normal text-neutral-950 mb-1">
              Send an Inquiry
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              We respond within 24 business hours.
            </p>

            {success ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-700 mx-auto" />
                <strong className="block text-sm font-normal text-neutral-950">Message Sent</strong>
                <p className="text-xs text-neutral-600">We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="store-control text-xs"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="store-control text-xs"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    required
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    placeholder="Your questions..."
                    className="store-control text-xs py-2.5 h-auto"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="store-button-primary w-full py-3 text-xs"
                >
                  <span className="btn-label">{loading ? "Sending..." : "Submit Inquiry"}</span>
                  <span className="btn-icon">&rarr;</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
