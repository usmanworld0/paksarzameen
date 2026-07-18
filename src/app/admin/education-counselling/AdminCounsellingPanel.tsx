"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Calendar,
  Layers,
  FileSpreadsheet,
  Link2,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";

export function AdminCounsellingPanel() {
  const [activeTab, setActiveTab] = useState<
    "universities" | "mentors" | "tutoring" | "bookings" | "articles" | "scanner"
  >("universities");
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Modal / Form state
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<"university" | "mentor" | "tutoring" | "article" | null>(null);
  
  // Link scanner state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [searchBooking, setSearchBooking] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/education-counselling");
      if (!res.ok) throw new Error("Failed to fetch database store.");
      const payload = await res.json();
      setStore(payload.data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveStore = async (type: string, updatedPayload: any) => {
    try {
      let actionName = "";
      if (type === "university") actionName = "save_universities";
      if (type === "mentor") actionName = "save_mentors";
      if (type === "tutoring") actionName = "save_tutoring";
      if (type === "article") actionName = "save_articles";
      if (type === "booking") actionName = "save_bookings";

      const res = await fetch("/api/admin/education-counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionName, payload: updatedPayload }),
      });

      if (!res.ok) throw new Error("Failed to save changes.");
      
      const resData = await res.json();
      if (resData.success) {
        showToast(resData.message || "Saved successfully!");
        setStore((prev: any) => ({ ...prev, [type === "university" ? "universities" : type + "s"]: updatedPayload }));
        setEditingItem(null);
        setEditType(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save.");
    }
  };

  // Universities CRUD Helpers
  const handleDeleteUniversity = (slug: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    const updated = store.universities.filter((u: any) => u.slug !== slug);
    handleSaveStore("university", updated);
  };

  const handleOpenEditUniversity = (uni: any) => {
    setEditingItem(JSON.parse(JSON.stringify(uni))); // Deep copy
    setEditType("university");
  };

  const handleOpenAddUniversity = () => {
    setEditingItem({
      slug: "",
      name: "",
      country: "United States",
      logo: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      banner: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
      ranking: { qs: "100", world: "100" },
      scholarships: { available: false, details: [] },
      overview: { about: "", campusLife: "", population: "10,000+", internationalStudents: "10%" },
      programs: { undergraduate: [], masters: [], phd: [] },
      admission: { entryRequirements: "", englishRequirements: "", documents: [], process: "", processingTime: "" },
      fees: { tuition: "", accommodation: "", livingExpenses: "", visaCost: "" },
      gallery: [],
      faq: [],
      intakes: ["Fall (September)"],
      featured: false,
      lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      officialLinks: { undergradRequirements: "", gradRequirements: "", internationalStudents: "", tuitionFees: "", scholarshipInfo: "", applyWebsite: "" },
      undergradRequirements: { qualification: "", gradesGpa: "", english: "", satAct: "", documents: [], statement: "", recommendations: "", portfolioInterview: "" },
      gradRequirements: { qualification: "", gradesGpa: "", greGmat: "", english: "", statementPurpose: "", recommendations: "", resumeCv: "", researchProposal: "" },
      applicationInfo: { openDate: "", priorityDeadline: "", finalDeadline: "", appFee: "", platform: "", estTuition: "", estLiving: "", scholarships: "" }
    });
    setEditType("university");
  };

  // Mentors CRUD Helpers
  const handleDeleteMentor = (id: string) => {
    if (!confirm("Are you sure you want to delete this mentor?")) return;
    const updated = store.mentors.filter((m: any) => m.id !== id);
    handleSaveStore("mentor", updated);
  };

  const handleOpenEditMentor = (m: any) => {
    setEditingItem(JSON.parse(JSON.stringify(m)));
    setEditType("mentor");
  };

  const handleOpenAddMentor = () => {
    setEditingItem({
      id: `m-${Date.now()}`,
      name: "",
      role: "",
      organization: "",
      program: "",
      expertise: "",
      countries: "",
      bio: "",
      linkedin: "",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
    });
    setEditType("mentor");
  };

  // Announcements CRUD Helpers
  const handleDeleteArticle = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const updated = store.articles.filter((a: any) => a.id !== id);
    handleSaveStore("article", updated);
  };

  const handleOpenEditArticle = (a: any) => {
    setEditingItem(JSON.parse(JSON.stringify(a)));
    setEditType("article");
  };

  const handleOpenAddArticle = () => {
    setEditingItem({
      id: `a-${Date.now()}`,
      title: "",
      content: "",
      category: "News",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      published: true
    });
    setEditType("article");
  };

  // Link Scanner runner
  const handleRunScanner = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/admin/education-counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_links" }),
      });
      if (!res.ok) throw new Error("Scanner request failed.");
      const data = await res.json();
      setScanResult(data);
      showToast("Link scan complete!");
    } catch (e: any) {
      alert("Failed to run scanner: " + e.message);
    } finally {
      setScanning(false);
    }
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    const list = store.bookings || [];
    if (list.length === 0) {
      alert("No registrations available to export.");
      return;
    }
    const headers = [
      "ID", "Type", "Student Name", "Parent Name", "Email", "Phone",
      "Current Education", "Intended Degree", "Preferred Field", "Preferred Countries",
      "Preferred Date", "Preferred Time", "Description", "Scholarship Req.", "Academic Grades", "English Status", "Batches", "Created At"
    ];
    const rows = list.map((b: any) => [
      b.id,
      b.type,
      b.studentName,
      b.parentName || "",
      b.email,
      b.phone,
      b.currentQualification || "",
      b.intendedDegree || "",
      b.preferredField || "",
      b.preferredCountries || "",
      b.preferredDate || "",
      b.preferredTime || "",
      b.description || "",
      b.scholarshipRequired ? "Yes" : "No",
      b.academicGrades || "",
      b.englishTestStatus || "",
      b.preferredBatchTiming || "",
      b.createdAt || ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `psz_counselling_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-[#0f7a47]" />
        <span className="text-sm font-semibold text-[#707072] uppercase tracking-wider">Loading Counselling Database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 max-w-lg mx-auto">
        <AlertTriangle className="h-10 w-10 mx-auto text-red-500 mb-3" />
        <h3 className="font-bold">Access Error</h3>
        <p className="mt-1 text-sm">{error}</p>
        <button onClick={fetchData} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white uppercase hover:bg-red-700">
          Try Again
        </button>
      </div>
    );
  }

  const filteredBookings = (store.bookings || []).filter((b: any) => {
    const searchStr = `${b.studentName} ${b.email} ${b.phone}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchBooking.toLowerCase());
    const matchesType = bookingFilter === "all" || b.type === bookingFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {message && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 rounded-2xl bg-[#111111] px-5 py-4 text-xs font-semibold text-white shadow-xl animate-bounce">
          <CheckCircle className="h-4 w-4 text-[#0f7a47]" />
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#0f7a47]">Education Counselling Subsite</span>
          <h1 className="text-3xl font-black tracking-tight text-[#111111] mt-1">Counselling &amp; Universities Portal CMS</h1>
          <p className="text-xs font-medium text-[#707072] mt-1">Manage global university details, admission criteria, mentors, tutoring schedules, and student registrations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#FAFAFA]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload Store
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#E5E5E5] pb-2 text-sm">
        <button
          onClick={() => setActiveTab("universities")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "universities" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Universities ({store.universities?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("mentors")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "mentors" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <Users className="h-4 w-4" />
          Mentors ({store.mentors?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("tutoring")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "tutoring" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Tutoring Schedules ({store.tutoring?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "bookings" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Registrations ({store.bookings?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "articles" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <Layers className="h-4 w-4" />
          Announcements ({store.articles?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("scanner")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold uppercase tracking-wider transition ${
            activeTab === "scanner" ? "bg-[#111111] text-white" : "text-[#707072] hover:bg-[#FAFAFA] hover:text-[#111111]"
          }`}
        >
          <Link2 className="h-4 w-4" />
          Broken Link Checker
        </button>
      </div>

      {/* TABS VIEWPORT */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sm:p-6 shadow-sm">
        
        {/* Universities Tab */}
        {activeTab === "universities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <h2 className="text-lg font-black tracking-tight text-[#111111]">Featured Universities Directory</h2>
              <button
                onClick={handleOpenAddUniversity}
                className="flex items-center gap-1.5 rounded-xl bg-[#0f7a47] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
              >
                <Plus className="h-4 w-4" />
                Add University
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5E5] text-[10px] font-semibold uppercase tracking-wider text-[#707072]">
                    <th className="py-3 px-2">University Name</th>
                    <th className="py-3 px-2">Country</th>
                    <th className="py-3 px-2">QS Rank</th>
                    <th className="py-3 px-2">Featured</th>
                    <th className="py-3 px-2">Last Updated</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {store.universities?.map((uni: any) => (
                    <tr key={uni.slug} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-2 font-semibold text-[#111111]">{uni.name}</td>
                      <td className="py-3 px-2 text-[#707072]">📍 {uni.country}</td>
                      <td className="py-3 px-2 text-[#707072]">🏆 #{uni.ranking.qs}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          uni.featured ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {uni.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#707072] text-xs">{uni.lastUpdated || "N/A"}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => handleOpenEditUniversity(uni)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Requirements & Links"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUniversity(uni.slug)}
                            className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!store.universities || store.universities.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#707072]">No universities configured. Click Add University to create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === "mentors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <h2 className="text-lg font-black tracking-tight text-[#111111]">Mentors and Advisory Team</h2>
              <button
                onClick={handleOpenAddMentor}
                className="flex items-center gap-1.5 rounded-xl bg-[#0f7a47] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
              >
                <Plus className="h-4 w-4" />
                Add Mentor
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {store.mentors?.map((m: any) => (
                <div key={m.id} className="rounded-2xl border border-[#E5E5E5] p-4 flex gap-4 hover:border-[#111111]/25 transition">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-16 w-16 rounded-xl object-cover border border-[#E5E5E5]"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-sm font-black text-[#111111] truncate">{m.name}</h3>
                    <p className="text-xs font-semibold text-[#0f7a47]">{m.role}</p>
                    <p className="text-[11px] text-[#707072] font-medium truncate">{m.organization}</p>
                    <p className="text-[11px] text-[#707072] line-clamp-2 mt-2">{m.bio}</p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5] mt-2">
                      <button onClick={() => handleOpenEditMentor(m)} className="rounded-lg p-1 text-blue-600 hover:bg-blue-50 transition">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteMentor(m.id)} className="rounded-lg p-1 text-red-600 hover:bg-red-50 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!store.mentors || store.mentors.length === 0) && (
                <div className="col-span-full py-8 text-center text-[#707072]">No mentors configured. Click Add Mentor to onboard one.</div>
              )}
            </div>
          </div>
        )}

        {/* Tutoring Tab */}
        {activeTab === "tutoring" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black tracking-tight text-[#111111] border-b border-[#E5E5E5] pb-4">
              Language &amp; Test Preparation Schedules
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {store.tutoring?.map((t: any, index: number) => (
                <div key={t.id || index} className="rounded-2xl border border-[#E5E5E5] p-5 space-y-3 bg-[#FAFAFA]">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#0f7a47]">Course Program</span>
                    <h3 className="text-base font-black text-[#111111]">{t.name}</h3>
                  </div>
                  <p className="text-xs text-[#707072] line-clamp-3 leading-relaxed">{t.description}</p>
                  
                  <div className="space-y-1.5 text-xs text-[#111111]">
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Duration:</span>
                      <strong>{t.duration}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Schedule:</span>
                      <strong className="text-right max-w-[150px] truncate">{t.schedule}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Tuition Fee:</span>
                      <strong>{t.fee}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#707072]">Format:</span>
                      <strong>{t.format}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem(JSON.parse(JSON.stringify(t)));
                      setEditType("tutoring");
                    }}
                    className="w-full flex items-center justify-center gap-1 mt-4 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#F5F5F5] transition"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit Class Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registrations/Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#111111]">Student Registrations Log</h2>
                <p className="text-xs text-[#707072] mt-0.5">Review submissions from Consultation bookings, Course enrollments, and Private counselling sessions.</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-xl border border-[#0f7a47] text-[#0f7a47] bg-green-50/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-green-50 transition"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export to CSV
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#707072]" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or phone..."
                  value={searchBooking}
                  onChange={(e) => setSearchBooking(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E5E5] pl-10 pr-4 py-2.5 text-xs font-medium placeholder-[#9E9EA0] outline-none focus:border-[#111111] transition"
                />
              </div>

              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="rounded-xl border border-[#E5E5E5] px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white outline-none focus:border-[#111111]"
              >
                <option value="all">All Form Types</option>
                <option value="consultation">30-Min Consultation</option>
                <option value="course">5-Month Course</option>
                <option value="private">Private Sessions</option>
              </select>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5E5] text-[10px] font-semibold uppercase tracking-wider text-[#707072]">
                    <th className="py-3 px-2">Student Details</th>
                    <th className="py-3 px-2">Registration Type</th>
                    <th className="py-3 px-2">Contact Info</th>
                    <th className="py-3 px-2">Preferred / Academic Details</th>
                    <th className="py-3 px-2">Submitted At</th>
                    <th className="py-3 px-2 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] text-xs">
                  {filteredBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3 px-2">
                        <strong className="text-[#111111] text-sm block">{b.studentName}</strong>
                        {b.parentName && <span className="text-[10px] text-[#707072] block">Parent: {b.parentName}</span>}
                        {b.currentSchool && <span className="text-[10px] text-[#707072] block">School: {b.currentSchool}</span>}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          b.type === "consultation" ? "bg-blue-50 text-blue-700" :
                          b.type === "course" ? "bg-amber-50 text-amber-700" :
                          "bg-purple-50 text-purple-700"
                        }`}>
                          {b.type === "consultation" ? "30-Min Consult" :
                           b.type === "course" ? "5-Month Course" : "Private Session"}
                        </span>
                      </td>
                      <td className="py-3 px-2 space-y-0.5">
                        <span className="block text-[#111111] font-semibold">{b.email}</span>
                        <span className="block text-[#707072]">{b.phone}</span>
                      </td>
                      <td className="py-3 px-2 space-y-1 max-w-[240px]">
                        {b.intendedDegree && (
                          <div>
                            <span className="text-[#707072]">Intended:</span> <strong>{b.intendedDegree} ({b.preferredField || "Any Field"})</strong>
                          </div>
                        )}
                        {b.preferredCountries && (
                          <div>
                            <span className="text-[#707072]">Destination:</span> <strong>{b.preferredCountries}</strong>
                          </div>
                        )}
                        {b.preferredDate && (
                          <div>
                            <span className="text-[#707072]">Timing:</span> <strong>{b.preferredDate} @ {b.preferredTime}</strong>
                          </div>
                        )}
                        {b.description && (
                          <p className="text-[10px] text-[#707072] line-clamp-1 italic">"{b.description}"</p>
                        )}
                      </td>
                      <td className="py-3 px-2 text-[#707072]">
                        {b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => {
                            if (!confirm("Remove this registration record?")) return;
                            const updated = store.bookings.filter((bk: any) => bk.id !== b.id);
                            handleSaveStore("booking", updated);
                          }}
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#707072]">No student registrations match your filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <h2 className="text-lg font-black tracking-tight text-[#111111]">Announcements &amp; Advisories</h2>
              <button
                onClick={handleOpenAddArticle}
                className="flex items-center gap-1.5 rounded-xl bg-[#0f7a47] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
              >
                <Plus className="h-4 w-4" />
                Write Post
              </button>
            </div>

            <div className="grid gap-4">
              {store.articles?.map((a: any) => (
                <div key={a.id} className="rounded-2xl border border-[#E5E5E5] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[#FAFAFA] hover:border-[#111111]/25 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#0f7a47]">{a.category}</span>
                      <span className="text-[10px] text-[#707072]">{a.date}</span>
                    </div>
                    <h3 className="text-base font-black text-[#111111]">{a.title}</h3>
                    <p className="text-sm text-[#707072] leading-relaxed max-w-3xl mt-1">{a.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <button onClick={() => handleOpenEditArticle(a)} className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-xs font-bold text-[#111111] hover:bg-[#F5F5F5] transition">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteArticle(a.id)} className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs font-bold hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {(!store.articles || store.articles.length === 0) && (
                <div className="py-8 text-center text-[#707072]">No announcements published. Click Write Post to compose an update.</div>
              )}
            </div>
          </div>
        )}

        {/* Broken Link Scanner Tab */}
        {activeTab === "scanner" && (
          <div className="space-y-6">
            <div className="border-b border-[#E5E5E5] pb-4">
              <h2 className="text-lg font-black tracking-tight text-[#111111]">Outbound University Link Scanner</h2>
              <p className="text-xs text-[#707072] mt-0.5">
                Automatically verify the health of official requirements links, tuition fees links, and application platform outbound URLs configured for each university.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-[#FAFAFA] border border-[#E5E5E5] p-5 rounded-2xl">
              <div>
                <strong className="text-sm block text-[#111111]">Link Health Auditing Engine</strong>
                <p className="text-xs text-[#707072] mt-0.5">Checks all custom outbound URLs on international domains. Runs asynchronous network validations.</p>
              </div>
              <button
                onClick={handleRunScanner}
                disabled={scanning}
                className="ml-auto flex items-center gap-2 rounded-xl bg-[#0f7a47] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {scanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Scanning Links...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Run Link Scan
                  </>
                )}
              </button>
            </div>

            {scanResult && (
              <div className="space-y-4">
                <div className="grid gap-3 grid-cols-3">
                  <div className="rounded-xl border border-[#E5E5E5] p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#707072]">Total Checked</span>
                    <strong className="text-2xl font-black text-[#111111] block mt-1">{scanResult.totalChecked}</strong>
                  </div>
                  <div className="rounded-xl border border-[#E5E5E5] p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#707072]">Broken/Timeout</span>
                    <strong className="text-2xl font-black text-red-600 block mt-1">{scanResult.brokenCount}</strong>
                  </div>
                  <div className="rounded-xl border border-[#E5E5E5] p-4 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#707072]">Auditing Status</span>
                    <strong className="text-2xl font-black text-[#0f7a47] block mt-1">Healthy</strong>
                  </div>
                </div>

                {scanResult.brokenLinks?.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Identified Broken or Slow Outbound Links
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs border border-[#E5E5E5]">
                        <thead>
                          <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] font-semibold text-[#707072]">
                            <th className="py-2.5 px-3">University</th>
                            <th className="py-2.5 px-3">Link Section</th>
                            <th className="py-2.5 px-3">Target Outbound URL</th>
                            <th className="py-2.5 px-3">Scan Result Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {scanResult.brokenLinks.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-[#FFFDF9] transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-[#111111]">{item.university}</td>
                              <td className="py-2.5 px-3 uppercase tracking-wider text-[10px]">{item.linkType}</td>
                              <td className="py-2.5 px-3 text-blue-600 max-w-[300px] truncate">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {item.url}
                                </a>
                              </td>
                              <td className="py-2.5 px-3 text-red-600 font-bold">{item.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center text-green-800">
                    <CheckCircle className="h-8 w-8 text-[#0f7a47] mx-auto mb-2" />
                    <strong>No broken or slow outbound links detected!</strong>
                    <p className="text-xs text-[#707072] mt-0.5">All university resource pages responded with successful HTTP status codes.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-[#E5E5E5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4 bg-[#FAFAFA]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0f7a47]">{editType} record manager</span>
                <h2 className="text-lg font-black tracking-tight text-[#111111]">
                  {editingItem.slug === "" || editingItem.id?.startsWith("new")
                    ? `Create New ${editType}`
                    : `Edit ${editingItem.name || editingItem.title || "Record"}`}
                </h2>
              </div>
              <button onClick={() => setEditingItem(null)} className="rounded-lg p-1 text-[#707072] hover:bg-gray-100 hover:text-black transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* UNIVERSITY FORM CONTENT */}
              {editType === "university" && (
                <div className="space-y-6">
                  {/* Basic Details */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      1. Institutional Identity &amp; Meta Info
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">University Name</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            setEditingItem({ ...editingItem, name, slug });
                          }}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium outline-none focus:border-[#111111]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Unique URL Slug (Auto)</label>
                        <input
                          type="text"
                          value={editingItem.slug}
                          onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium bg-gray-50 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Country / Destination</label>
                        <select
                          value={editingItem.country}
                          onChange={(e) => setEditingItem({ ...editingItem, country: e.target.value })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-bold bg-white"
                        >
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Europe">Europe</option>
                          <option value="Middle East">Middle East</option>
                          <option value="East Asia">East Asia</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">QS Global Rank Indicator</label>
                        <input
                          type="text"
                          value={editingItem.ranking?.qs || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            ranking: { ...editingItem.ranking, qs: e.target.value, world: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium outline-none focus:border-[#111111]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Cover Photo Banner Link</label>
                        <input
                          type="text"
                          value={editingItem.banner}
                          onChange={(e) => setEditingItem({ ...editingItem, banner: e.target.value })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <label className="text-xs font-bold text-[#111111] flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.featured}
                            onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                            className="h-4 w-4 rounded border-[#E5E5E5]"
                          />
                          Feature on Subsite Homepage
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Program Offerings */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      2. Course Level &amp; Popular Program Offerings
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072] block">Undergraduate Degrees (Comma Separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingItem.programs?.undergraduate) ? editingItem.programs.undergraduate.join(", ") : ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            programs: { ...editingItem.programs, undergraduate: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                          placeholder="B.S. Computer Science, B.A. Economics..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072] block">Master's Degrees (Comma Separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingItem.programs?.masters) ? editingItem.programs.masters.join(", ") : ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            programs: { ...editingItem.programs, masters: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                          placeholder="M.S. Computational Science, MBA..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072] block">Doctoral / PhD Programs (Comma Separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingItem.programs?.phd) ? editingItem.programs.phd.join(", ") : ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            programs: { ...editingItem.programs, phd: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                          placeholder="Ph.D. Computer Science, Ph.D. Physics..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Outbound Official Links */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      3. Official Inbound URLs (Must be valid outbound addresses)
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Object.keys(editingItem.officialLinks || {}).map((linkKey) => (
                        <div key={linkKey} className="space-y-1">
                          <label className="text-xs font-semibold text-[#707072] capitalize">{linkKey.replace(/([A-Z])/g, " $1")}</label>
                          <input
                            type="text"
                            value={editingItem.officialLinks?.[linkKey] || ""}
                            onChange={(e) => setEditingItem({
                              ...editingItem,
                              officialLinks: { ...editingItem.officialLinks, [linkKey]: e.target.value }
                            })}
                            className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                            placeholder="https://..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Undergrad Reqs */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      4. Undergraduate Admission Requirements
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Basic Academic Qualification</label>
                        <input
                          type="text"
                          value={editingItem.undergradRequirements?.qualification || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            undergradRequirements: { ...editingItem.undergradRequirements, qualification: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Required Grades / Minimum GPA</label>
                        <input
                          type="text"
                          value={editingItem.undergradRequirements?.gradesGpa || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            undergradRequirements: { ...editingItem.undergradRequirements, gradesGpa: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">English Proficiency Standard</label>
                        <input
                          type="text"
                          value={editingItem.undergradRequirements?.english || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            undergradRequirements: { ...editingItem.undergradRequirements, english: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">SAT / ACT Score Range</label>
                        <input
                          type="text"
                          value={editingItem.undergradRequirements?.satAct || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            undergradRequirements: { ...editingItem.undergradRequirements, satAct: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-[#707072]">Common App Essay Statement Requirements</label>
                        <textarea
                          rows={2}
                          value={editingItem.undergradRequirements?.statement || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            undergradRequirements: { ...editingItem.undergradRequirements, statement: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Graduate Reqs */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      5. Graduate &amp; Master's Admission Requirements
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Required Degrees / Qualifications</label>
                        <input
                          type="text"
                          value={editingItem.gradRequirements?.qualification || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            gradRequirements: { ...editingItem.gradRequirements, qualification: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Required GPA on a 4.0 Scale</label>
                        <input
                          type="text"
                          value={editingItem.gradRequirements?.gradesGpa || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            gradRequirements: { ...editingItem.gradRequirements, gradesGpa: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">GRE / GMAT Standards</label>
                        <input
                          type="text"
                          value={editingItem.gradRequirements?.greGmat || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            gradRequirements: { ...editingItem.gradRequirements, greGmat: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">English Proficiency Standard</label>
                        <input
                          type="text"
                          value={editingItem.gradRequirements?.english || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            gradRequirements: { ...editingItem.gradRequirements, english: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-[#707072]">Statement of Purpose Requirements</label>
                        <textarea
                          rows={2}
                          value={editingItem.gradRequirements?.statementPurpose || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            gradRequirements: { ...editingItem.gradRequirements, statementPurpose: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Application Info */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0f7a47] border-b border-[#E5E5E5] pb-2 mb-3">
                      6. Application Cycle details &amp; Cost Estimation
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Priority Admissions Deadline</label>
                        <input
                          type="text"
                          value={editingItem.applicationInfo?.priorityDeadline || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            applicationInfo: { ...editingItem.applicationInfo, priorityDeadline: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Final Admission Deadline</label>
                        <input
                          type="text"
                          value={editingItem.applicationInfo?.finalDeadline || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            applicationInfo: { ...editingItem.applicationInfo, finalDeadline: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Application Platform Fee</label>
                        <input
                          type="text"
                          value={editingItem.applicationInfo?.appFee || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            applicationInfo: { ...editingItem.applicationInfo, appFee: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#707072]">Estimated Annual Tuition</label>
                        <input
                          type="text"
                          value={editingItem.applicationInfo?.estTuition || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            applicationInfo: { ...editingItem.applicationInfo, estTuition: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-[#707072]">Scholarship Opportunities Information</label>
                        <textarea
                          rows={2}
                          value={editingItem.applicationInfo?.scholarships || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            applicationInfo: { ...editingItem.applicationInfo, scholarships: e.target.value }
                          })}
                          className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MENTOR FORM CONTENT */}
              {editType === "mentor" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Full Name</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Role / Title</label>
                      <input
                        type="text"
                        value={editingItem.role}
                        onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        placeholder="e.g. Head Counsellor, PhD Advisor"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Organization / University</label>
                      <input
                        type="text"
                        value={editingItem.organization}
                        onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Countries Advising On</label>
                      <input
                        type="text"
                        value={editingItem.countries}
                        onChange={(e) => setEditingItem({ ...editingItem, countries: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                        placeholder="e.g. United States, Canada, Europe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">LinkedIn URL</label>
                      <input
                        type="text"
                        value={editingItem.linkedin}
                        onChange={(e) => setEditingItem({ ...editingItem, linkedin: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Photo Image URL</label>
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#707072]">Biography</label>
                      <textarea
                        rows={3}
                        value={editingItem.bio}
                        onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TUTORING FORM CONTENT */}
              {editType === "tutoring" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Course Name</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        disabled
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Course Duration</label>
                      <input
                        type="text"
                        value={editingItem.duration}
                        onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Class Schedule</label>
                      <input
                        type="text"
                        value={editingItem.schedule}
                        onChange={(e) => setEditingItem({ ...editingItem, schedule: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Tuition Fee</label>
                      <input
                        type="text"
                        value={editingItem.fee}
                        onChange={(e) => setEditingItem({ ...editingItem, fee: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Class Format</label>
                      <select
                        value={editingItem.format}
                        onChange={(e) => setEditingItem({ ...editingItem, format: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-bold bg-white"
                      >
                        <option value="Online">Online</option>
                        <option value="In-Person">In-Person</option>
                        <option value="Hybrid (Online / Physical)">Hybrid (Online / Physical)</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#707072]">Course Overview / Description</label>
                      <textarea
                        rows={3}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS FORM CONTENT */}
              {editType === "article" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Announcement Title</label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#707072]">Category</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-bold bg-white"
                      >
                        <option value="News">General News</option>
                        <option value="Event">Event Announcement</option>
                        <option value="Scholarship News">Scholarship News</option>
                        <option value="Admissions Deadline">Admissions Deadline</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#707072]">Description / Content Body</label>
                      <textarea
                        rows={4}
                        value={editingItem.content}
                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E5E5] p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-6 py-4 bg-[#FAFAFA]">
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#F5F5F5] transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editType === "university") {
                    let list = [...store.universities];
                    const idx = list.findIndex(u => u.slug === editingItem.slug);
                    if (idx >= 0) list[idx] = editingItem;
                    else list = [editingItem, ...list];
                    handleSaveStore("university", list);
                  } else if (editType === "mentor") {
                    let list = [...store.mentors];
                    const idx = list.findIndex(m => m.id === editingItem.id);
                    if (idx >= 0) list[idx] = editingItem;
                    else list = [editingItem, ...list];
                    handleSaveStore("mentor", list);
                  } else if (editType === "tutoring") {
                    const list = [...store.tutoring];
                    const idx = list.findIndex(t => t.id === editingItem.id);
                    if (idx >= 0) list[idx] = editingItem;
                    handleSaveStore("tutoring", list);
                  } else if (editType === "article") {
                    let list = [...store.articles];
                    const idx = list.findIndex(a => a.id === editingItem.id);
                    if (idx >= 0) list[idx] = editingItem;
                    else list = [editingItem, ...list];
                    handleSaveStore("article", list);
                  }
                }}
                className="flex items-center gap-1 rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#0c6239] transition"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
