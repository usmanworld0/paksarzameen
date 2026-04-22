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
    return <p className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800">Loading profile...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Private Dashboard</p>
          <h1 className="text-3xl font-semibold text-emerald-950">{data.user.name || "Your Profile"}</h1>
          <p className="text-sm text-emerald-900/75">{data.user.email} | Role: {data.user.role}</p>
        </div>
        <LogoutButton
          callbackUrl="/login"
          className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900 md:col-span-2">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            {data.eligibility.isEligible ? "Eligible to donate" : "Not eligible yet"}
          </p>
          <p className="mt-1 text-xs text-emerald-800/80">{data.eligibility.rule}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Profile Completion</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-950">{completionScore}%</p>
          <div className="mt-3 h-2 w-full rounded-full bg-emerald-100">
            <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${completionScore}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-100 bg-emerald-50">
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
              <UserCircle2 className="h-20 w-20 text-emerald-300" />
            )}
          </div>
          <p className="mt-4 text-center text-sm text-emerald-900/80">Use a clear face photo for faster verification.</p>

          <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50">
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
            className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Remove Photo
          </button>
        </div>

        <form onSubmit={saveProfile} className="grid gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_rgba(8,39,24,0.08)] sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Name</span>
          <input
            value={data.user.name ?? ""}
            onChange={(event) => setData({ ...data, user: { ...data.user, name: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">CNIC</span>
          <input
            value={data.profile.cnic}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, cnic: event.target.value } })}
            placeholder="xxxxx-xxxxxxx-x"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Phone</span>
          <input
            value={data.profile.phone}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, phone: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">City</span>
          <input
            value={data.profile.city}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, city: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Emergency contact</span>
          <input
            value={data.profile.emergencyContact}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, emergencyContact: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Blood group</span>
          <select
            value={data.profile.bloodGroup}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, bloodGroup: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            {BLOOD_GROUPS.map((group) => (
              <option key={group || "none"} value={group}>
                {group || "Select"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Availability</span>
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
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Last donation date</span>
          <input
            type="date"
            value={data.profile.lastDonationDate}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, lastDonationDate: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Date of birth</span>
          <input
            type="date"
            value={data.profile.dateOfBirth}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, dateOfBirth: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Gender</span>
          <select
            value={data.profile.gender}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, gender: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option || "none"} value={option}>
                {option || "Select"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Occupation</span>
          <input
            value={data.profile.occupation}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, occupation: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-emerald-950">Marital status</span>
          <select
            value={data.profile.maritalStatus}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, maritalStatus: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          >
            {MARITAL_OPTIONS.map((option) => (
              <option key={option || "none"} value={option}>
                {option || "Select"}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-950">Address</span>
          <input
            value={data.profile.address}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, address: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-950">Allergies</span>
          <textarea
            value={data.profile.allergies}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, allergies: event.target.value } })}
            rows={3}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="Mention known allergies"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-950">Medical history</span>
          <textarea
            value={data.profile.medicalHistory}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, medicalHistory: event.target.value } })}
            rows={4}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="Add important medical notes"
          />
        </label>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
          <button
            type="button"
            onClick={() => void clearProfile()}
            disabled={isSaving}
            className="rounded-xl border border-emerald-300 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear profile
          </button>
        </div>
      </form>
      </div>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
