"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Edit2, Save, X, Phone, Heart, Users } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  occupation: string;
  maritalStatus: string;
  allergies: string;
  medicalHistory: string;
  profileImage: string;
};

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

export function HealthcareProfileManager() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const payload = (await response.json()) as {
        user?: { name: string; email: string };
        profile?: Partial<ProfileData>;
        error?: string;
        code?: string;
        hint?: string;
      };

      if (!response.ok) {
        const errorMsg = payload.error || "Failed to load profile";
        const hint = payload.hint ? ` (${payload.hint})` : "";
        if (response.status === 401) {
          setAuthRequired(true);
          setFeedback(null);
        } else {
          console.error("[HealthcareProfileManager] Profile API error:", errorMsg, hint);
          setFeedback({ type: "error", message: errorMsg + hint });
        }
        setLoading(false);
        return;
      }

      setAuthRequired(false);

      if (response.ok && payload.user) {
        const fullProfile: ProfileData = {
          name: payload.user.name || "",
          email: payload.user.email || "",
          phone: payload.profile?.phone || "",
          city: payload.profile?.city || "",
          bloodGroup: payload.profile?.bloodGroup || "",
          dateOfBirth: payload.profile?.dateOfBirth ? payload.profile.dateOfBirth.split("T")[0] : "",
          gender: payload.profile?.gender || "",
          address: payload.profile?.address || "",
          emergencyContact: payload.profile?.emergencyContact || "",
          occupation: payload.profile?.occupation || "",
          maritalStatus: payload.profile?.maritalStatus || "",
          allergies: payload.profile?.allergies || "",
          medicalHistory: payload.profile?.medicalHistory || "",
          profileImage: payload.profile?.profileImage || "",
        };
        setProfile(fullProfile);
        setFormData(fullProfile);
      } else {
        console.error("[HealthcareProfileManager] Invalid payload structure:", payload);
        setFeedback({ type: "error", message: "Profile data incomplete" });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[HealthcareProfileManager] Exception:", errorMsg, err);
      setFeedback({ type: "error", message: "Failed to load profile: " + errorMsg });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setProfile(formData as ProfileData);
        setIsEditing(false);
        setFeedback({ type: "success", message: "Profile updated successfully" });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        const error = (await response.json()) as { error?: string };
        setFeedback({ type: "error", message: error.error || "Failed to save profile" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to save profile" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePhotoUpload(file: File) {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        const data = (await response.json()) as { imageUrl?: string };
        if (data.imageUrl) {
          const updatedImage = data.imageUrl;
          setFormData((prev) => ({ ...prev, profileImage: updatedImage }));
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  profileImage: updatedImage,
                }
              : null
          );
          setPhotoUploadModal(false);
          setPreviewPhoto(null);
          setFeedback({ type: "success", message: "Photo uploaded successfully" });
          setTimeout(() => setFeedback(null), 3000);
        }
      } else {
        setFeedback({ type: "error", message: "Failed to upload photo" });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to upload photo" });
    }
  }

  function handlePhotoSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleInputChange(field: keyof ProfileData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm font-medium text-[#707072]">Loading profile...</p>
      </div>
    );
  }

  if (authRequired && !profile) {
    return (
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 text-center">
        <p className="text-base font-black tracking-tighter text-[#111111]">Sign in to view your healthcare profile</p>
        <p className="mt-2 text-sm font-medium text-[#707072]">
          Your session is missing or expired. Log in again to continue managing your profile.
        </p>
        <div className="mt-5">
          <Link
            href="/login?callbackUrl=/healthcare"
            className="inline-flex items-center justify-center rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto]">
          {/* Profile Photo */}
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#E5E5E5]">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f3f3ee]">
                  <Users className="h-8 w-8 text-[#707072]" />
                </div>
              )}
            </div>
            <button
              onClick={() => setPhotoUploadModal(true)}
              className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white shadow-sm transition hover:border-[#0f7a47] hover:text-[#0f7a47]"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">My Profile</p>
            <h2 className="mt-1 text-xl font-black tracking-tighter text-[#111111]">{profile.name}</h2>
            <p className="mt-0.5 text-sm font-medium text-[#707072]">{profile.email}</p>
            {profile.occupation && (
              <p className="mt-0.5 text-sm font-medium text-[#707072]">{profile.occupation}</p>
            )}
            {profile.bloodGroup && (
              <div className="mt-2 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold text-[#111111]">Blood: {profile.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:items-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#333]"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}

            <LogoutButton
              callbackUrl="/login"
              className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
            />
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="space-y-5">
          {/* Personal Information */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <div className="border-b border-[#E5E5E5] pb-4 mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Personal</p>
              <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">Personal Information</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Full Name</span>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Email</span>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-2.5 text-sm text-[#707072] outline-none"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Date of Birth</span>
                <input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Gender</span>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Occupation</span>
                <input
                  type="text"
                  value={formData.occupation || ""}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Marital Status</span>
                <select
                  value={formData.maritalStatus || ""}
                  onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <div className="border-b border-[#E5E5E5] pb-4 mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Contact
              </p>
              <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">Contact Information</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Phone Number</span>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+92..."
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Emergency Contact</span>
                <input
                  type="tel"
                  value={formData.emergencyContact || ""}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Family member contact"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className={labelClass}>Address</span>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Full address"
                className={inputClass}
              />
            </label>
          </div>

          {/* Health Information */}
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 sm:p-6">
            <div className="border-b border-[#E5E5E5] pb-4 mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47] flex items-center gap-1.5">
                <Heart className="h-3 w-3" /> Health
              </p>
              <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">Health Information</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Blood Group</span>
                <select
                  value={formData.bloodGroup || ""}
                  onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select blood group</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>City</span>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Your city"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className={labelClass}>Allergies</span>
              <textarea
                value={formData.allergies || ""}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="List any allergies (comma-separated)"
                rows={2}
                className={`min-h-[5rem] ${inputClass}`}
              />
            </label>
            <label className="mt-4 block">
              <span className={labelClass}>Medical History</span>
              <textarea
                value={formData.medicalHistory || ""}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                placeholder="Any past medical conditions or surgeries"
                rows={3}
                className={`min-h-[6rem] ${inputClass}`}
              />
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={() => void handleSaveProfile()}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a47] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* Photo Upload Modal */}
      {photoUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Profile Photo</p>
                <h3 className="mt-1 text-lg font-black tracking-tighter text-[#111111]">Upload Profile Photo</h3>
              </div>
              <button
                onClick={() => {
                  setPhotoUploadModal(false);
                  setPreviewPhoto(null);
                }}
                className="rounded-xl border border-[#E5E5E5] p-2 text-[#707072] transition hover:border-[#111111]/30 hover:text-[#111111]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => void handlePhotoSelect(e)}
              className="hidden"
            />

            {previewPhoto ? (
              <div className="space-y-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E5E5E5]">
                  <Image
                    src={previewPhoto}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    const file = fileInputRef.current?.files?.[0];
                    if (file) void handlePhotoUpload(file);
                  }}
                  className="w-full rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f]"
                >
                  Upload Photo
                </button>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
                >
                  Choose Different Photo
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E5E5] py-8 transition hover:border-[#0f7a47]"
              >
                <Upload className="h-8 w-8 text-[#707072]" />
                <p className="mt-2 text-sm font-medium text-[#707072]">Click to select photo</p>
                <p className="text-xs font-medium text-[#707072]">PNG, JPG up to 5MB</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
