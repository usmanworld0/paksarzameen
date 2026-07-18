"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Globe, Facebook, Linkedin, Twitter } from "lucide-react";

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
          phone: "N/A (Contact Form)",
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
    <div className="w-full pt-[90px] min-h-screen bg-slate-50">
      <div className="max-w-[1320px] mx-auto px-[6vw] py-10 space-y-10">
        
        {/* HEADER */}
        <div className="border-b border-black/[0.05] pb-5 space-y-2 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Connect With Us</span>
          <h1 className="text-3xl font-black tracking-tight text-[#1d1d1f]">Contact PakSarZameen</h1>
          <p className="text-xs text-[#707072] leading-relaxed">
            Get in touch with our educational counselling office in Bahawalpur or submit an online query below.
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#111111]">Office Coordinates</h2>
              <p className="text-xs text-[#707072] mt-1 leading-relaxed">
                Our staff is available from Monday to Saturday, 10:00 AM to 6:00 PM (PKT), for physical consultations and evaluations.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Phone</span>
                  <a href="tel:+923001234567" className="font-semibold hover:underline text-[#111111]">+92 300 1234567</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Email Address</span>
                  <a href="mailto:counselling@paksarzameenwfo.com" className="font-semibold hover:underline text-[#111111]">counselling@paksarzameenwfo.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Physical Office</span>
                  <span className="font-semibold text-[#111111]">Model Town B, Bahawalpur, Punjab, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-4 border-t border-black/[0.04]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707072] block">Social Media &amp; Support Channels</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white hover:bg-[#20ba59] transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Support
                </a>
                <a
                  href="https://linkedin.com/company/paksarzameen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/10 hover:bg-gray-50 text-blue-700 transition"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com/paksarzameen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/10 hover:bg-gray-50 text-blue-800 transition"
                  aria-label="Facebook Page"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/paksarzameen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/10 hover:bg-gray-50 text-blue-400 transition"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-black text-[#111111] tracking-tight mb-1">Send a Message</h3>
            <p className="text-xs text-[#707072] mb-6">Leave your details and an academic coordinator will contact you shortly.</p>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-[#0f7a47] mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-[#111111]">Query Submitted!</h3>
                <p className="text-xs text-[#707072] max-w-xs mx-auto">
                  Your general inquiry was successfully recorded in our database. We will reply to your email address within 24 business hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-xl border border-black/10 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-gray-50 transition"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                    placeholder="e.g. Fatima Ali"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                    placeholder="fatima@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Your Question / Inquiry details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                    placeholder="Ask about university matching, specific qualifications, or tutoring schedules..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 mt-2 rounded-xl bg-[#111111] hover:bg-[#0f7a47] py-3 text-xs font-black uppercase tracking-wider text-white transition disabled:bg-gray-400"
                >
                  {loading ? "Sending Message..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
