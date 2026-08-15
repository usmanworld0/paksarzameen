"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";

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
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-[88px] min-h-screen bg-white text-[#111111]">
      <div className="store-container py-10 sm:py-16 space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/6 pb-8 space-y-2">
          <p className="store-kicker">Connect With Us</p>
          <h1 className="store-heading">Contact PakSarZameen</h1>
          <p className="store-subheading max-w-2xl">
            Get in touch with our educational counselling office in Bahawalpur or submit an online query below.
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          
          {/* Coordinates Column */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-normal text-neutral-950">Office Coordinates</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-600">
                Our counsellors are available Monday to Saturday, 10:00 AM to 6:00 PM (PKT), for physical consultations and transcript reviews.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
              <div className="store-panel rounded-2xl p-5 flex items-center gap-4">
                <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Phone</span>
                  <a href="tel:+923001234567" className="font-normal text-neutral-950 hover:underline">
                    +92 300 1234567
                  </a>
                </div>
              </div>

              <div className="store-panel rounded-2xl p-5 flex items-center gap-4">
                <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Email Address</span>
                  <a href="mailto:counselling@paksarzameenwfo.com" className="font-normal text-neutral-950 hover:underline">
                    counselling@paksarzameenwfo.com
                  </a>
                </div>
              </div>

              <div className="store-panel rounded-2xl p-5 flex items-center gap-4">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Physical Office</span>
                  <span className="font-normal text-neutral-950">
                    Model Town B, Bahawalpur, Punjab, Pakistan
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="store-button-primary w-full sm:w-auto"
              >
                <span className="btn-label">WhatsApp Direct Desk</span>
                <span className="btn-icon">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="store-card rounded-2xl p-8 sm:p-10">
            <h3 className="text-xl font-normal leading-tight text-neutral-950 mb-2">
              Send an Online Message
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Leave your contact details and our team will get in touch shortly.
            </p>

            {success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-700 mx-auto" />
                <strong className="block text-sm font-normal text-neutral-950">Message Sent</strong>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  Your inquiry has been submitted. An academic coordinator will reply within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="store-pill-outline text-xs mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fatima Ali"
                    className="store-control text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="fatima@example.com"
                    className="store-control text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Inquiry Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    placeholder="Ask about university matching, specific qualifications, or tutoring schedules..."
                    className="store-control text-xs py-3 h-auto"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="store-button-primary w-full py-3.5 text-xs"
                >
                  <span className="btn-label">{loading ? "Sending..." : "Submit Message"}</span>
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
