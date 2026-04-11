import { NextResponse } from "next/server";

import { clearProfileData, getProfileData, updateProfileData } from "@/server/profile-service";
import { getRequiredApiUser } from "@/server/route-auth";

export async function GET() {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getProfileData(user.id);
  return NextResponse.json({ data });
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
