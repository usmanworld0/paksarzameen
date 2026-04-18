"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Edit2, Save, X, Phone, MapPin, Heart, Calendar, Users, Briefcase } from "lucide-react";

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

export function HealthcareProfileManager() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      const payload = (await response.json()) as {
        user?: {
          name: string;
          email: string;
        };
        profile?: Partial<ProfileData>;
      };

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
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setFeedback({ type: "error", message: "Failed to load profile" });
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
    } catch (error) {
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
    } catch (error) {
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
    return <div className="flex items-center justify-center py-12">
      <div className="text-slate-600">Loading profile...</div>
    </div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center py-12">
      <div className="text-red-600">Failed to load profile</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with feedback */}
      {feedback && (
        <div className={`rounded-xl border p-4 ${feedback.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-8 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto]">
          {/* Profile Photo */}
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-100">
                  <Users className="h-10 w-10 text-emerald-600" />
                </div>
              )}
            </div>
            <button
              onClick={() => setPhotoUploadModal(true)}
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700"
            >
              <Upload className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
            <p className="text-slate-600">{profile.email}</p>
            {profile.occupation && <p className="mt-1 text-sm text-slate-500">{profile.occupation}</p>}
            {profile.bloodGroup && (
              <div className="mt-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-slate-700">Blood: {profile.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input type="email" value={profile.email} disabled className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation || ""}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
                <select
                  value={formData.maritalStatus || ""}
                  onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Phone className="h-5 w-5 text-emerald-600" />
              Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+92..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  value={formData.emergencyContact || ""}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Family member contact"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">Address</label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Full address"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Health Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Heart className="h-5 w-5 text-emerald-600" />
              Health Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
                <select
                  value={formData.bloodGroup || ""}
                  onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Your city"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">Allergies</label>
              <textarea
                value={formData.allergies || ""}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="List any allergies (comma-separated)"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 mt-4">Medical History</label>
              <textarea
                value={formData.medicalHistory || ""}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                placeholder="Any past medical conditions or surgeries"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => void handleSaveProfile()}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* Photo Upload Modal */}
      {photoUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Upload Profile Photo</h3>
              <button
                onClick={() => {
                  setPhotoUploadModal(false);
                  setPreviewPhoto(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
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
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-slate-200">
                  <img src={previewPhoto} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <button
                  onClick={() => {
                    const file = fileInputRef.current?.files?.[0];
                    if (file) void handlePhotoUpload(file);
                  }}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Upload Photo
                </button>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Choose Different Photo
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-8 transition hover:border-emerald-500"
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">Click to select photo</p>
                <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
