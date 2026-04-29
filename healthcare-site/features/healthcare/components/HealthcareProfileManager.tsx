"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Users } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (!active) return;
        if (!res.ok) return setProfile(null);
        const payload = await res.json();
        setProfile(payload.profile ?? null);
      } catch (e) {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (!profile) return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <p className="text-sm text-slate-600">Sign in to view your healthcare profile</p>
      <Link href="/login" className="mt-3 inline-block rounded bg-emerald-600 px-4 py-2 text-sm text-white">Sign in</Link>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-emerald-50">
          {profile.profileImage ? (
            <Image src={profile.profileImage} alt="Profile" width={64} height={64} className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-600"><Users /></div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{profile.name}</h3>
          <p className="text-sm text-slate-600">{profile.email}</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => { window.location.assign('/login'); }} className="rounded border px-3 py-1 text-sm">Sign out</button>
        </div>
      </div>
    </div>
  );
}
