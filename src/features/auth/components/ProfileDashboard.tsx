"use client";

import { useEffect, useState } from "react";

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
      phone: string;
      city: string;
      bloodGroup: string;
      availabilityStatus: "available" | "unavailable";
      lastDonationDate: string;
      emergencyContact: string;
      profileImage: string;
    };
    eligibility: {
      isEligible: boolean;
      rule: string;
    };
  };
};

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function ProfileDashboard() {
  const [data, setData] = useState<ProfileApiResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile() {
    setIsLoading(true);
    const response = await fetch("/api/profile");
    const payload = (await response.json()) as ProfileApiResponse & { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Failed to load profile.");
      setIsLoading(false);
      return;
    }

    setData(payload.data);
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
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/profile/upload-image", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { imageUrl?: string; error?: string };
    if (!response.ok || !payload.imageUrl || !data) {
      setError(payload.error ?? "Image upload failed.");
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
        <LogoutButton callbackUrl="/login" />
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900">
        Eligibility: <span className="font-semibold">{data.eligibility.isEligible ? "Eligible to donate" : "Not eligible yet"}</span>
        <p className="text-xs text-emerald-800/80">{data.eligibility.rule}</p>
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

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-950">Profile image URL</span>
          <input
            value={data.profile.profileImage}
            onChange={(event) => setData({ ...data, profile: { ...data.profile, profileImage: event.target.value } })}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-950">Upload profile image (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadProfileImage(file);
              }
            }}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900"
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

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
