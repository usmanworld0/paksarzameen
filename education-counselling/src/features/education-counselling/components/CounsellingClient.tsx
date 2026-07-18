"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  User,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { TunnelHero } from "./TunnelHero";
import {
  FreeConsultationModal,
  CourseRegistrationModal,
  PrivateCounsellingModal,
} from "./BookingModals";
import styles from "./CounsellingClient.module.css";

interface CounsellingClientProps {
  initialStore: {
    universities: any[];
    mentors: any[];
    tutoring: any[];
    articles: any[];
  };
}

export function CounsellingClient({ initialStore }: CounsellingClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Modal visibility states
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [privateModalOpen, setPrivateModalOpen] = useState(false);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Extract featured universities (exactly 3)
  const featuredUnis = useMemo(() => {
    return (initialStore.universities || []).filter(u => u.featured).slice(0, 3);
  }, [initialStore.universities]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/universities?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry",
          studentName: inquiryName,
          email: inquiryEmail,
          phone: "N/A (General Inquiry)",
          description: inquiryMsg,
        }),
      });
      if (res.ok) {
        setInquirySuccess(true);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryMsg("");
      }
    } catch {
      alert("Inquiry failed. Please try again.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const dummyTestimonials = [
    {
      name: "Ayesha Fatima",
      destination: "University of Melbourne, Australia",
      degree: "Master of Public Health",
      quote: "PakSarZameen's course was a game changer for me. The SOP review was extremely detailed, and I secured a 50% tuition scholarship!",
      rating: 5,
    },
    {
      name: "Bilal Hassan",
      destination: "University of Toronto, Canada",
      degree: "B.S. Computer Science",
      quote: "Thanks to Usama's guidance, I structured my application essays perfectly. The visa guidance was spot-on, and I got my permit in just 3 weeks.",
      rating: 5,
    },
    {
      name: "Zainab Malik",
      destination: "Harvard University, United States",
      degree: "Master of Business Administration (MBA)",
      quote: "The 1-on-1 private counselling sessions with the Head Counsellor prepared me for the rigorous interview process. Outstanding support!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "What is covered in the Free 30-Minute Consultation?",
      a: "The session includes a comprehensive academic profile assessment, initial suggestions on universities/countries that fit your budget, timeline plans, and guidance on next steps.",
    },
    {
      q: "Is the Five-Month course conducted online or physically?",
      a: "It is a hybrid program. Students attend weekly or bi-weekly physical sessions in Bahawalpur (max 20 students per batch) for personal mentoring, with digital follow-ups and draft edits done online.",
    },
    {
      q: "How does the outbound link status work?",
      a: "Our administration actively monitors university outbound links. We display checked statuses and verify links are up-to-date. Deadlines are reviewed regularly for accuracy.",
    },
    {
      q: "Can I get help with scholarship applications?",
      a: "Yes. Both our 5-Month course and Private Counselling options offer exhaustive guides for university, government, and external scholarships (Commonwealth, DAAD, Fulbright, etc.).",
    },
  ];

  return (
    <div className="w-full pt-[72px]">
      
      {/* SECTION 1: Immersive University Banner (3D Tunnel) */}
      <TunnelHero universities={initialStore.universities || []} />

      {/* SECTION 2: Search Bar */}
      <section className="bg-white py-12 border-b border-black/[0.04]">
        <div className="max-w-[1320px] mx-auto px-[6vw]">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0f7a47] block">Explore Global Pathways</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Which university are you aiming for?</h2>
            <p className="text-xs text-[#707072] leading-relaxed">Search through leading institutions across the US, UK, Canada, Australia, and Europe.</p>
            
            <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2 relative">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by university name or program (e.g. Harvard)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-black/[0.08] bg-[#FAFAFA] pl-11 pr-4 py-3.5 text-xs font-semibold placeholder-gray-400 outline-none focus:border-[#111111] transition"
                />
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-[#111111] hover:bg-[#0f7a47] px-6 text-xs font-black uppercase tracking-wider text-white transition-colors duration-200"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 3: Featured Universities Section */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-[1320px] mx-auto px-[6vw] space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Selected Institutions</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Featured Global Universities</h2>
            <p className="text-xs text-[#707072] max-w-md mx-auto">Explore requirements and scholarship guidelines for some of the world&apos;s most prestigious universities.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredUnis.map((uni) => (
              <div 
                key={uni.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-black/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => router.push(`/universities/${uni.slug}`)}
              >
                {/* Banner & Logo */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={uni.banner}
                    alt={uni.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-md"
                      style={{ background: uni.logo }}
                    >
                      {uni.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FAFAFA] block">📍 {uni.country}</span>
                      <h3 className="text-sm font-black text-white tracking-tight line-clamp-1">{uni.name}</h3>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#1d1d1f] shadow-sm">
                    🏆 QS #{uni.ranking.qs}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs text-[#707072] leading-relaxed line-clamp-3 italic">
                      &ldquo;{uni.overview?.about || "View entry requirements, intakes and costs."}&rdquo;
                    </p>

                    <div className="space-y-1.5 pt-2 text-[11px] text-[#1d1d1f]">
                      <div className="flex justify-between">
                        <span className="text-[#707072]">University Type:</span>
                        <strong>Research Institution</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707072]">Intake Timelines:</span>
                        <strong>{uni.intakes?.join(", ") || "Fall / Spring"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707072]">Scholarships:</span>
                        <strong className="text-[#0f7a47]">{uni.scholarships?.available ? "Available" : "Limited"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Updated: {uni.lastUpdated || "Recently"}</span>
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0f7a47] group-hover:translate-x-1 transition-transform"
                    >
                      View Requirements
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/universities"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white hover:bg-gray-50 px-8 text-xs font-black uppercase tracking-wider text-[#111111] transition-all"
            >
              View All Universities
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: Our Services */}
      <section id="services" className="py-16 bg-white border-b border-black/[0.04]">
        <div className="max-w-[1320px] mx-auto px-[6vw] space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Admissions Pathways</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Our Educational Counselling Services</h2>
            <p className="text-xs text-[#707072] max-w-sm mx-auto">Get structured support, from initial consultations to drafting essays and securing visas.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Service 1 */}
            <div className="rounded-3xl border border-black/[0.06] p-6 sm:p-8 flex flex-col justify-between bg-[#FAFAFA] hover:border-black/10 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111] tracking-tight">Free 30-Minute Online Consultation</h3>
                <p className="text-xs text-[#707072] leading-relaxed">
                  Ideal for parents and students starting their study abroad journey. Get immediate feedback on eligibility.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-[#1d1d1f] pt-2">
                  <li className="flex items-center gap-2">✓ General study abroad pathways</li>
                  <li className="flex items-center gap-2">✓ Initial academic profile assessment</li>
                  <li className="flex items-center gap-2">✓ Match countries &amp; universities</li>
                  <li className="flex items-center gap-2">✓ Admissions timeline breakdown</li>
                  <li className="flex items-center gap-2">✓ Action recommendations</li>
                </ul>
              </div>
              <button
                onClick={() => setConsultModalOpen(true)}
                className="w-full mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] text-xs font-black uppercase tracking-wider text-white transition"
              >
                Schedule a Free Consultation
              </button>
            </div>

            {/* Service 2 */}
            <div className="rounded-3xl border-2 border-[#0f7a47] p-6 sm:p-8 flex flex-col justify-between bg-white relative hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-3.5 left-6 bg-[#0f7a47] rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                Best Value
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-green-50 text-[#0f7a47] flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111] tracking-tight">5-Month Applications &amp; Scholarships Course</h3>
                <p className="text-xs text-[#707072] leading-relaxed">
                  A structured classroom program guiding you step-by-step from zero to university submission.
                </p>
                <div className="text-[10px] font-bold text-[#0f7a47] bg-green-50 rounded-xl px-3 py-2">
                  📅 Dates: 28th July 2026 - 15th December 2026
                </div>
                <ul className="space-y-2 text-xs font-semibold text-[#1d1d1f] pt-2">
                  <li className="flex items-center gap-2">✓ Max 20 students per batch</li>
                  <li className="flex items-center gap-2">✓ Complete essay &amp; statement drafts</li>
                  <li className="flex items-center gap-2">✓ Scholarship matching &amp; filings</li>
                  <li className="flex items-center gap-2">✓ Career mapping &amp; course filters</li>
                  <li className="flex items-center gap-2">✓ Visa &amp; document filing</li>
                </ul>
              </div>
              <button
                onClick={() => setCourseModalOpen(true)}
                className="w-full mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#0f7a47] hover:bg-[#0c6239] text-xs font-black uppercase tracking-wider text-white transition"
              >
                Join the Five-Month Course
              </button>
            </div>

            {/* Service 3 */}
            <div className="rounded-3xl border border-black/[0.06] p-6 sm:p-8 flex flex-col justify-between bg-[#FAFAFA] hover:border-black/10 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111] tracking-tight">Private Personalized Counselling Sessions</h3>
                <p className="text-xs text-[#707072] leading-relaxed">
                  Book direct, focused meetings with our Head Counsellor according to your custom timeline requirements.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-[#1d1d1f] pt-2">
                  <li className="flex items-center gap-2">✓ Personal Statement diagnostics</li>
                  <li className="flex items-center gap-2">✓ Academic profile boosting</li>
                  <li className="flex items-center gap-2">✓ Recommendation letter structuring</li>
                  <li className="flex items-center gap-2">✓ Mock admission interviews</li>
                  <li className="flex items-center gap-2">✓ Secure document upload audits</li>
                </ul>
              </div>
              <button
                onClick={() => setPrivateModalOpen(true)}
                className="w-full mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#111111] hover:bg-[#0f7a47] text-xs font-black uppercase tracking-wider text-white transition"
              >
                Book a Private Counselling Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Mentors and About Us Section */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-[1320px] mx-auto px-[6vw] space-y-16">
          
          {/* Who We Are (About Us) */}
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Who We Are</span>
                <h2 className="text-3xl font-black tracking-tight text-[#111111]">Advising with integrity, transparency &amp; ethics.</h2>
              </div>
              
              <div className="space-y-4 text-xs text-[#707072] leading-relaxed">
                <p>
                  PakSarZameen is dedicated to providing accessible, high-quality, and ethical educational counselling to students aspiring to pursue global qualifications. We believe in providing customized academic pathways that match each student&apos;s career objectives and budget.
                </p>
                <p>
                  Our coordinators cover all major global study destinations—including the United States, Canada, United Kingdom, Australia, Europe, Middle East, and East Asia—guiding candidates across both undergraduate and graduate levels.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-[#111111] block font-bold">Ethical Support</strong>
                    <span className="text-[11px] text-[#707072]">No false promises or fake links.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-50 text-[#0f7a47] flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-[#111111] block font-bold">Elite Network</strong>
                    <span className="text-[11px] text-[#707072]">Mentors from Ivy League &amp; top schools.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-black/[0.04] bg-white p-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0f7a47] block mb-2">Our Mission Statement</span>
              <h3 className="text-lg font-black tracking-tight text-[#111111] mb-3">To empower underrepresented students by making elite university admissions transparent and accessible.</h3>
              <p className="text-xs text-[#707072] leading-relaxed">
                We work to dismantle the information barrier that limits student potentials, providing systematic guidance on financial aid packaging, need-based scholarships, and research-track graduations.
              </p>
              <div className="mt-6 flex justify-end">
                <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0f7a47] hover:underline">
                  More About PakSarZameen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Meet Our Mentors */}
          <div className="space-y-8 pt-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Advisory Board</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Meet Our Mentors</h2>
              <p className="text-xs text-[#707072] max-w-sm mx-auto">Get guidance from professionals who have walked the same path.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(initialStore.mentors || []).map((m) => (
                <div key={m.id} className="rounded-3xl border border-black/[0.06] bg-white p-6 flex flex-col justify-between hover:border-black/10 hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-black/[0.06]"
                      />
                      <div>
                        <h3 className="text-sm font-black text-[#111111] tracking-tight">{m.name}</h3>
                        <span className="text-[10px] font-bold text-[#0f7a47] block">{m.role}</span>
                        <span className="text-[9px] text-[#707072] block">{m.organization}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#707072] leading-relaxed line-clamp-4">
                      &ldquo;{m.bio}&rdquo;
                    </p>

                    <div className="space-y-1.5 text-[10px] font-semibold text-[#1d1d1f] pt-2">
                      <div>
                        <span className="text-[#707072]">Expertise:</span> {m.expertise}
                      </div>
                      <div>
                        <span className="text-[#707072]">Destinations:</span> {m.countries}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.04] mt-4 flex items-center justify-between">
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/about"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-gray-50 px-6 text-xs font-black uppercase tracking-wider text-[#111111]"
              >
                View Full Mentor Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Student Testimonials */}
      <section className="py-16 bg-white border-b border-black/[0.04]">
        <div className="max-w-[1320px] mx-auto px-[6vw] space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Student Voices</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Student Testimonials</h2>
            <p className="text-xs text-[#707072] max-w-xs mx-auto">Success stories of candidates who secured admission and funding.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dummyTestimonials.map((t, idx) => (
              <div key={idx} className="rounded-3xl border border-black/[0.06] bg-[#FAFAFA] p-6 space-y-4 hover:shadow-md transition">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-xs text-[#707072] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="pt-2">
                  <strong className="text-sm text-[#111111] block font-black">{t.name}</strong>
                  <span className="text-[10px] text-[#0f7a47] font-semibold block">{t.degree}</span>
                  <span className="text-[9px] text-[#707072] block">{t.destination}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Frequently Asked Questions */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-[800px] mx-auto px-[6vw] space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Information Center</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-black/[0.05] bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs uppercase tracking-wider text-[#1d1d1f] hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openFaq === idx && (
                  <div className="p-5 border-t border-black/[0.04] text-xs text-[#707072] leading-relaxed bg-[#FAFAFA]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Contact and Registration Call-To-Action */}
      <section id="consultation-form" className="py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-[6vw] grid gap-10 lg:grid-cols-2">
          
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f7a47] block">Get In Touch</span>
              <h2 className="text-3xl font-black tracking-tight text-[#111111]">Have questions? Ask our counsellors directly.</h2>
              <p className="text-xs text-[#707072] leading-relaxed">
                Contact our office in Bahawalpur, send us an email query, or connect instantly on WhatsApp.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Call Office</span>
                  <a href="tel:+923001234567" className="font-semibold hover:underline text-[#111111]">+92 300 1234567</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Email Query</span>
                  <a href="mailto:counselling@paksarzameenwfo.com" className="font-semibold hover:underline text-[#111111]">counselling@paksarzameenwfo.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 text-[#0f7a47] flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[#707072] block font-bold text-[9px] uppercase tracking-wider">Office Address</span>
                  <span className="font-semibold text-[#111111]">Model Town B, Bahawalpur, Punjab, Pakistan</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923001234567?text=Hi%20PakSarZameen%2C%20I%20would%20like%20to%20inquire%20about%20study%20abroad%20counselling."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-xs font-black uppercase tracking-wider text-white hover:bg-[#20ba59] transition"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
              <button
                onClick={() => setConsultModalOpen(true)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f7a47] px-6 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
              >
                Book Consultation Slot
              </button>
            </div>
          </div>

          {/* Quick General Inquiry Form */}
          <div className="rounded-3xl border border-black/[0.06] bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-black text-[#111111] tracking-tight mb-2">Send a General Inquiry</h3>
            <p className="text-xs text-[#707072] mb-4">Have a fast question? Leave your details and query below.</p>

            {inquirySuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#0f7a47] mx-auto" />
                <strong className="text-sm text-[#111111] block font-bold">Query Received!</strong>
                <p className="text-xs text-[#707072]">We will get back to you shortly.</p>
                <button
                  onClick={() => setInquirySuccess(false)}
                  className="mt-4 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111]"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                    placeholder="e.g. Ayesha"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                    placeholder="ayesha@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-[#707072]">Your Message / Question</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-xs font-semibold placeholder-gray-400 outline-none"
                    placeholder="I want to know if I am eligible for Swedish universities with a CGPA of 3.2..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full flex items-center justify-center gap-1.5 mt-2 rounded-xl bg-[#111111] hover:bg-[#0f7a47] py-3 text-xs font-black uppercase tracking-wider text-white transition disabled:bg-gray-400"
                >
                  {inquiryLoading ? "Sending Query..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="bg-[#FAFAFA] py-8 text-center text-xs text-[#707072] border-t border-black/[0.03]">
        <div className="max-w-[1320px] mx-auto px-[6vw]">
          Disclaimer: Admission criteria, fee guidelines, and application opening/closing deadlines are provided for illustrative purposes. Always confirm through the official pages before applying.
        </div>
      </div>

      {/* Modals Mounting */}
      <FreeConsultationModal 
        isOpen={consultModalOpen} 
        onClose={() => setConsultModalOpen(false)} 
      />
      <CourseRegistrationModal 
        isOpen={courseModalOpen} 
        onClose={() => setCourseModalOpen(false)} 
      />
      <PrivateCounsellingModal 
        isOpen={privateModalOpen} 
        onClose={() => setPrivateModalOpen(false)} 
      />
    </div>
  );
}
