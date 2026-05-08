"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ShieldCheck, UserCircle2 } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/LogoutButton";

type ProfileApiResponse = {
  data: {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: string;
    };
    profile: {
      cnic: string;
      phone: string;
      city: string;
      bloodGroup: string;
      availabilityStatus: "available" | "unavailable";
      lastDonationDate: string;
      emergencyContact: string;
      profileImage: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      allergies: string;
      medicalHistory: string;
      occupation: string;
      maritalStatus: string;
    };
    eligibility: {
      isEligible: boolean;
      rule: string;
    };
  };
};

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDER_OPTIONS = ["", "Male", "Female", "Other", "Prefer not to say"];
const MARITAL_OPTIONS = ["", "Single", "Married", "Divorced", "Widowed", "Prefer not to say"];

function getCompletionScore(data: ProfileApiResponse["data"] | null) {
  if (!data) return 0;

  const checks = [
    Boolean(data.user.name),
    Boolean(data.profile.cnic),
    Boolean(data.profile.phone),
    Boolean(data.profile.city),
    Boolean(data.profile.bloodGroup),
    Boolean(data.profile.emergencyContact),
    Boolean(data.profile.dateOfBirth),
    Boolean(data.profile.gender),
    Boolean(data.profile.address),
    Boolean(data.profile.profileImage),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

const inputClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10";

const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707072] mb-1.5";

export function ProfileDashboard() {
  const [data, setData] = useState<ProfileApiResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const completionScore = getCompletionScore(data);

  async function loadProfile() {
    setIsLoading(true);
    const response = await fetch("/api/profile");
    const payload = (await response.json()) as {
      data?: ProfileApiResponse["data"];
      user?: ProfileApiResponse["data"]["user"];
      profile?: ProfileApiResponse["data"]["profile"];
      eligibility?: ProfileApiResponse["data"]["eligibility"];
      error?: string;
    };

    if (!response.ok) {
      setError(payload.error ?? "Failed to load profile.");
      setIsLoading(false);
      return;
    }

    if (payload.data) {
      setData(payload.data);
    } else if (payload.user && payload.profile && payload.eligibility) {
      setData({
        user: payload.user,
        profile: payload.profile,
        eligibility: payload.eligibility,
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.user.name ?? "",
        ...data.profile,
      }),
    });

    const payload = (await response.json()) as { data?: ProfileApiResponse["data"]; error?: string; message?: string };
    setIsSaving(false);

    if (!response.ok || !payload.data) {
      setError(payload.error ?? "Unable to save profile.");
      return;
    }

    setData(payload.data);
    setMessage(payload.message ?? "Profile saved.");
  }

  async function clearProfile() {
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/profile", { method: "DELETE" });
    const payload = (await response.json()) as { data?: ProfileApiResponse["data"]; error?: string; message?: string };
    setIsSaving(false);

    if (!response.ok || !payload.data) {
      setError(payload.error ?? "Unable to clear profile.");
      return;
    }

    setData(payload.data);
    setMessage(payload.message ?? "Profile reset.");
  }

  async function uploadProfileImage(file: File) {
    setIsUploadingImage(true);
    setError(null);
    setMessage(null);
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/profile/upload-image", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { imageUrl?: string; error?: string };
    if (!response.ok || !payload.imageUrl || !data) {
      setError(payload.error ?? "Image upload failed.");
      setIsUploadingImage(false);
      return;
    }

    setData({
      ...data,
      profile: {
        ...data.profile,
        profileImage: payload.imageUrl,
      },
    });
    setMessage("Profile image uploaded. Save profile to persist details.");
    setIsUploadingImage(false);
  }

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-xs font-medium text-[#707072]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Private Dashboard</p>
          <h2 className="mt-1 text-2xl font-black tracking-tighter text-[#111111] sm:text-3xl">
            {data.user.name || "Your Profile"}
          </h2>
          <p className="mt-1 text-sm font-medium text-[#707072]">{data.user.email} &middot; Role: {data.user.role}</p>
        </div>
        <LogoutButton
          callbackUrl="/login"
          className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
        />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5 md:col-span-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#0f7a47]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">
              {data.eligibility.isEligible ? "Eligible to donate" : "Not eligible yet"}
            </p>
          </div>
          <p className="mt-2 text-sm font-medium text-[#707072]">{data.eligibility.rule}</p>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Profile Completion</p>
          <p className="mt-2 text-3xl font-black tracking-tighter text-[#111111]">{completionScore}%</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[#f3f3ee]">
            <div
              className="h-full rounded-full bg-[#0f7a47] transition-all"
              style={{ width: `${completionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile image + form */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Image panel */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Photo</p>
          <div className="mt-4 mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#f3f3ee]">
            {data.profile.profileImage ? (
              <Image
                src={data.profile.profileImage}
                alt="Profile"
                width={144}
                height={144}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2 className="h-20 w-20 text-[#bbb]" />
            )}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-[#707072]">
            Use a clear face photo for faster verification.
          </p>

          <label className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30">
            <Camera className="h-4 w-4" />
            {isUploadingImage ? "Uploading..." : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadProfileImage(file);
                }
              }}
              disabled={isUploadingImage}
            />
          </label>

          <button
            type="button"
            onClick={() => setData({ ...data, profile: { ...data.profile, profileImage: "" } })}
            className="mt-2 w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30"
          >
            Remove Photo
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={saveProfile}
          className="rounded-2xl border border-[#E5E5E5] bg-white p-6"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f7a47]">Profile Details</p>
          <h3 className="mt-1 text-base font-black tracking-tighter text-[#111111]">Personal Information</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Name</span>
              <input
                value={data.user.name ?? ""}
                onChange={(event) => setData({ ...data, user: { ...data.user, name: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>CNIC</span>
              <input
                value={data.profile.cnic}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, cnic: event.target.value } })}
                placeholder="xxxxx-xxxxxxx-x"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Phone</span>
              <input
                value={data.profile.phone}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, phone: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>City</span>
              <input
                value={data.profile.city}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, city: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Emergency Contact</span>
              <input
                value={data.profile.emergencyContact}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, emergencyContact: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Blood Group</span>
              <select
                value={data.profile.bloodGroup}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, bloodGroup: event.target.value } })}
                className={inputClass}
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group || "none"} value={group}>
                    {group || "Select"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Availability</span>
              <select
                value={data.profile.availabilityStatus}
                onChange={(event) =>
                  setData({
                    ...data,
                    profile: {
                      ...data.profile,
                      availabilityStatus: event.target.value as "available" | "unavailable",
                    },
                  })
                }
                className={inputClass}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Last Donation Date</span>
              <input
                type="date"
                value={data.profile.lastDonationDate}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, lastDonationDate: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Date of Birth</span>
              <input
                type="date"
                value={data.profile.dateOfBirth}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, dateOfBirth: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Gender</span>
              <select
                value={data.profile.gender}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, gender: event.target.value } })}
                className={inputClass}
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option || "none"} value={option}>
                    {option || "Select"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Occupation</span>
              <input
                value={data.profile.occupation}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, occupation: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Marital Status</span>
              <select
                value={data.profile.maritalStatus}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, maritalStatus: event.target.value } })}
                className={inputClass}
              >
                {MARITAL_OPTIONS.map((option) => (
                  <option key={option || "none"} value={option}>
                    {option || "Select"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className={labelClass}>Address</span>
              <input
                value={data.profile.address}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, address: event.target.value } })}
                className={inputClass}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelClass}>Allergies</span>
              <textarea
                value={data.profile.allergies}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, allergies: event.target.value } })}
                rows={3}
                placeholder="Mention known allergies"
                className={inputClass}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={labelClass}>Medical History</span>
              <textarea
                value={data.profile.medicalHistory}
                onChange={(event) => setData({ ...data, profile: { ...data.profile, medicalHistory: event.target.value } })}
                rows={4}
                placeholder="Add important medical notes"
                className={inputClass}
              />
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => void clearProfile()}
                disabled={isSaving}
                className="rounded-xl border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:border-[#111111]/30 disabled:opacity-50"
              >
                Clear Profile
              </button>
            </div>
          </div>
        </form>
      </div>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
