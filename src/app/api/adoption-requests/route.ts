import { NextResponse } from "next/server";
import { createAdoptionRequest } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const body = (await request.json()) as { dogId?: string; whatsappNumber?: string };
    const dogId = String(body.dogId ?? "").trim();
    const whatsappNumber = String(body.whatsappNumber ?? "").trim();

    if (!dogId) {
      return NextResponse.json({ error: "Dog ID is required." }, { status: 400 });
    }

    if (!whatsappNumber) {
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });
    }

    const data = await createAdoptionRequest(dogId, user.id, whatsappNumber);
    return NextResponse.json(
      { data, message: "Adoption request submitted. Our admin will contact you on WhatsApp." },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create adoption request.";
    const statusCode =
      message.includes("not found") ? 404 : message.includes("already") || message.includes("available") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
