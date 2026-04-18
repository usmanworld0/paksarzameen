import { NextResponse } from "next/server";

import { clearProfileData, getProfileData, updateProfileData } from "@/server/profile-service";
import { getRequiredApiUser } from "@/server/route-auth";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profileData = await getProfileData(user.id);
    if (profileData) {
      return NextResponse.json(profileData);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.email ? user.email.split("@")[0] : "User",
        email: user.email,
        role: user.role,
      },
      profile: {
        phone: "",
        city: "",
        bloodGroup: "",
        availabilityStatus: "unavailable",
        lastDonationDate: "",
        emergencyContact: "",
        profileImage: "",
      },
      eligibility: {
        isEligible: true,
        rule: "Eligible every 3 months after last donation",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load profile.";
    console.error("[/api/profile GET]", message, error);

    const errorCode = message.includes("does not exist")
      ? "SCHEMA_NOT_FOUND"
      : message.includes("permission")
        ? "PERMISSION_DENIED"
        : "PROFILE_LOAD_ERROR";

    return NextResponse.json(
      {
        error: message,
        code: errorCode,
        hint:
          errorCode === "SCHEMA_NOT_FOUND"
            ? "Run docs/database/healthcare_schema_init.sql in Supabase SQL Editor"
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
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

    const data = await updateProfileData(user.id, body);
    return NextResponse.json({ data, message: "Profile updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await clearProfileData(user.id);
  return NextResponse.json({ data, message: "Profile data cleared." });
}
