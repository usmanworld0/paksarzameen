import { getUserWithProfileById, resetProfile, upsertProfile, type ProfileUpdateInput } from "@/db/users";
import { safeText } from "@/server/validation";

const ELIGIBILITY_DAYS = 90;

export function isEligibleForDonation(lastDonationDate: Date | null) {
  if (!lastDonationDate) {
    return true;
  }

  const eligibleAfter = new Date(lastDonationDate);
  eligibleAfter.setDate(eligibleAfter.getDate() + ELIGIBILITY_DAYS);
  return eligibleAfter <= new Date();
}

export function profileToResponse(user: Awaited<ReturnType<typeof getUserWithProfileById>>) {
  if (!user) {
    return null;
  }

  const profile = user.profile;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    profile: {
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      bloodGroup: profile?.bloodGroup ?? "",
      availabilityStatus: profile?.availabilityStatus ?? "unavailable",
      lastDonationDate: profile?.lastDonationDate ? profile.lastDonationDate.toISOString().slice(0, 10) : "",
      emergencyContact: profile?.emergencyContact ?? "",
      profileImage: profile?.profileImage ?? "",
    },
    eligibility: {
      isEligible: isEligibleForDonation(profile?.lastDonationDate ?? null),
      rule: "Eligible every 3 months after last donation",
    },
  };
}

export async function getProfileData(userId: string) {
  const user = await getUserWithProfileById(userId);
  return profileToResponse(user);
}

export async function updateProfileData(userId: string, input: ProfileUpdateInput) {
  const payload: ProfileUpdateInput = {
    name: safeText(input.name ?? "", 80),
    phone: safeText(input.phone ?? "", 30),
    city: safeText(input.city ?? "", 80),
    bloodGroup: safeText(input.bloodGroup ?? "", 3).toUpperCase(),
    availabilityStatus: input.availabilityStatus === "available" ? "available" : "unavailable",
    lastDonationDate: input.lastDonationDate ?? null,
    emergencyContact: safeText(input.emergencyContact ?? "", 30),
    profileImage: safeText(input.profileImage ?? "", 500),
  };

  if (!payload.bloodGroup) {
    payload.bloodGroup = "";
  }

  await upsertProfile(userId, payload);
  return getProfileData(userId);
}

export async function clearProfileData(userId: string) {
  await resetProfile(userId);
  return getProfileData(userId);
}
