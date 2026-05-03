import { NextResponse } from "next/server";
import { createAdoptionRequest } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";
import { getApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as {
      dogId?: string;
      applicantName?: string;
      applicantPhone?: string;
      proposedPetName?: string;
    };

    const dogId = String(body.dogId ?? "").trim();
    const applicantName = String(body.applicantName ?? "").trim();
    const applicantPhone = String(body.applicantPhone ?? "").trim();
    const proposedPetName = String(body.proposedPetName ?? "").trim() || null;

    if (!dogId) {
      return NextResponse.json({ error: "Dog ID is required." }, { status: 400 });
    }
    if (!applicantName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!applicantPhone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    // Attach logged-in user ID if available, but not required
    const user = await getApiUser();

    const data = await createAdoptionRequest(dogId, {
      userId: user?.id ?? null,
      applicantName,
      applicantPhone,
      proposedPetName,
    });

    return NextResponse.json(
      { data, message: "Adoption request submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create adoption request.";
    const statusCode =
      message.includes("not found")
        ? 404
        : message.includes("already") || message.includes("available")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
