import { NextResponse } from "next/server";

import { getEmergencyDonorMatches } from "@/server/donor-matching";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      bloodGroup?: string;
      city?: string;
    };

    const donors = await getEmergencyDonorMatches({
      bloodGroup: body.bloodGroup ?? "",
      city: body.city ?? "",
    });

    return NextResponse.json({
      data: donors,
      message: donors.length ? "Top matched donors found." : "No eligible donors found for this criteria.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch donor matches.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
