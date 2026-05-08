import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { safeText } from "@/server/validation";

const ELIGIBILITY_DAYS = 90;

export type ProfileUpdateInput = {
  cnic?: string;
  name?: string;
  phone?: string;
  city?: string;
  bloodGroup?: string;
  availabilityStatus?: "available" | "unavailable";
  lastDonationDate?: string | null;
  emergencyContact?: string;
  profileImage?: string;
  dateOfBirth?: string | null;
  gender?: string;
  address?: string;
  allergies?: string;
  medicalHistory?: string;
  occupation?: string;
  maritalStatus?: string;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};

type UserProfileRow = {
  cnic: string | null;
  phone: string | null;
  city: string | null;
  blood_group: string | null;
  availability_status: string | null;
  last_donation_date: string | null;
  emergency_contact: string | null;
  profile_image: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  allergies: string | null;
  medical_history: string | null;
  occupation: string | null;
  marital_status: string | null;
};

function getSupabase() {
  return getSupabaseAdminClient();
}

export function isEligibleForDonation(lastDonationDate: Date | null) {
  if (!lastDonationDate) {
    return true;
  }

  const eligibleAfter = new Date(lastDonationDate);
  eligibleAfter.setDate(eligibleAfter.getDate() + ELIGIBILITY_DAYS);
  return eligibleAfter <= new Date();
}

function profileToResponse(user: UserRow | null, profile: UserProfileRow | null) {
  if (!user) {
    return null;
  }

  const parsedLastDonationDate = profile?.last_donation_date ? new Date(profile.last_donation_date) : null;

  return {
    user: {
      id: user.id,
      name: user.email ? user.email.split("@")[0] : "User",
      email: user.email ?? "",
      role: user.role ?? "user",
    },
    profile: {
      cnic: profile?.cnic ?? "",
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      bloodGroup: profile?.blood_group ?? "",
      availabilityStatus: profile?.availability_status === "available" ? "available" : "unavailable",
      lastDonationDate: parsedLastDonationDate ? parsedLastDonationDate.toISOString().slice(0, 10) : "",
      emergencyContact: profile?.emergency_contact ?? "",
      profileImage: profile?.profile_image ?? "",
      dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth).toISOString().slice(0, 10) : "",
      gender: profile?.gender ?? "",
      address: profile?.address ?? "",
      allergies: profile?.allergies ?? "",
      medicalHistory: profile?.medical_history ?? "",
      occupation: profile?.occupation ?? "",
      maritalStatus: profile?.marital_status ?? "",
    },
    eligibility: {
      isEligible: isEligibleForDonation(parsedLastDonationDate),
      rule: "Eligible every 3 months after last donation",
    },
  };
}

export async function getProfileData(userId: string) {
  const supabase = getSupabase();

  try {
    const [userResult, profileResult] = await Promise.all([
      supabase.from("profiles").select("id,email,role").eq("id", userId).maybeSingle<UserRow>(),
      supabase
        .from("user_profile")
        .select("cnic,phone,city,blood_group,availability_status,last_donation_date,emergency_contact,profile_image,date_of_birth,gender,address,allergies,medical_history,occupation,marital_status")
        .eq("user_id", userId)
        .maybeSingle<UserProfileRow>(),
    ]);

    if (userResult.error) {
      console.error("[getProfileData] profiles query error:", userResult.error);
      throw new Error(`profiles table: ${userResult.error.message}`);
    }

    if (profileResult.error) {
      console.error("[getProfileData] user_profile query error:", profileResult.error);
      throw new Error(`user_profile table: ${profileResult.error.message}`);
    }

    return profileToResponse(userResult.data ?? null, profileResult.data ?? null);
  } catch (error) {
    console.error("[getProfileData] exception:", error);
    throw error;
  }
}

export async function updateProfileData(userId: string, input: ProfileUpdateInput) {
  const supabase = getSupabase();

  const payload: ProfileUpdateInput = {
    cnic: safeText(input.cnic ?? "", 20),
    phone: safeText(input.phone ?? "", 30),
    city: safeText(input.city ?? "", 80),
    bloodGroup: safeText(input.bloodGroup ?? "", 3).toUpperCase(),
    availabilityStatus: input.availabilityStatus === "available" ? "available" : "unavailable",
    lastDonationDate: input.lastDonationDate ?? null,
    emergencyContact: safeText(input.emergencyContact ?? "", 30),
    profileImage: safeText(input.profileImage ?? "", 500),
    dateOfBirth: input.dateOfBirth ?? null,
    gender: safeText(input.gender ?? "", 40),
    address: safeText(input.address ?? "", 400),
    allergies: safeText(input.allergies ?? "", 400),
    medicalHistory: safeText(input.medicalHistory ?? "", 1200),
    occupation: safeText(input.occupation ?? "", 100),
    maritalStatus: safeText(input.maritalStatus ?? "", 40),
  };

  const profileUpsert = {
    user_id: userId,
    cnic: payload.cnic || null,
    phone: payload.phone || null,
    city: payload.city || null,
    blood_group: payload.bloodGroup || null,
    availability_status: payload.availabilityStatus ?? "unavailable",
    last_donation_date: payload.lastDonationDate || null,
    emergency_contact: payload.emergencyContact || null,
    profile_image: payload.profileImage || null,
    date_of_birth: payload.dateOfBirth || null,
    gender: payload.gender || null,
    address: payload.address || null,
    allergies: payload.allergies || null,
    medical_history: payload.medicalHistory || null,
    occupation: payload.occupation || null,
    marital_status: payload.maritalStatus || null,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase
    .from("user_profile")
    .upsert(profileUpsert, { onConflict: "user_id" });

  if (profileError) throw new Error(profileError.message);

  return getProfileData(userId);
}

export async function clearProfileData(userId: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("user_profile")
    .upsert(
      {
        user_id: userId,
        cnic: null,
        phone: null,
        city: null,
        blood_group: null,
        availability_status: "unavailable",
        last_donation_date: null,
        emergency_contact: null,
        profile_image: null,
        date_of_birth: null,
        gender: null,
        address: null,
        allergies: null,
        medical_history: null,
        occupation: null,
        marital_status: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) throw new Error(error.message);
  return getProfileData(userId);
}
