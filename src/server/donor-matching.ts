import { listDonorProfiles } from "@/db/users";
import { isEligibleForDonation } from "@/server/profile-service";
import { safeText } from "@/server/validation";

const BLOOD_COMPATIBILITY: Record<string, string[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

function isCompatible(donorBloodGroup: string, requestedBloodGroup: string) {
  const allowed = BLOOD_COMPATIBILITY[requestedBloodGroup] ?? [];
  return allowed.includes(donorBloodGroup);
}

export async function getEmergencyDonorMatches(input: { bloodGroup: string; city: string }) {
  const bloodGroup = safeText(input.bloodGroup, 3).toUpperCase();
  const city = safeText(input.city, 80).toLowerCase();

  if (!bloodGroup || !city) {
    throw new Error("Blood group and city are required.");
  }

  const donors = await listDonorProfiles();

  const ranked = donors
    .map((donor) => {
      const donorProfile = donor.profile;
      const donorBloodGroup = donorProfile?.bloodGroup?.toUpperCase() ?? "";
      const donorCity = donorProfile?.city?.toLowerCase() ?? "";
      const available = donorProfile?.availabilityStatus === "available";
      const eligible = isEligibleForDonation(donorProfile?.lastDonationDate ?? null);
      const compatible = donorBloodGroup ? isCompatible(donorBloodGroup, bloodGroup) : false;

      let score = 0;
      if (compatible) score += 50;
      if (donorCity && donorCity === city) score += 30;
      if (available) score += 20;
      if (!eligible) score -= 40;

      return {
        id: donor.id,
        name: donor.name || "Anonymous donor",
        email: donor.email,
        phone: donorProfile?.phone || donorProfile?.emergencyContact || "",
        city: donorProfile?.city || "",
        bloodGroup: donorProfile?.bloodGroup || "",
        availabilityStatus: donorProfile?.availabilityStatus || "unavailable",
        profileImage: donorProfile?.profileImage || "",
        lastDonationDate: donorProfile?.lastDonationDate
          ? donorProfile.lastDonationDate.toISOString().slice(0, 10)
          : "",
        eligibility: eligible,
        score,
      };
    })
    .filter((donor) => donor.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return ranked;
}
