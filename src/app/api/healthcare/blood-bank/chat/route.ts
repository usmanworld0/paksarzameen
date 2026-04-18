import { NextResponse } from "next/server";
import { assertHealthcareUserActive, createDonorChatMessage, listDonorChatMessages, normalizeUrgencyLevel } from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const { searchParams } = new URL(request.url);
    const donorUserId = String(searchParams.get("donorUserId") ?? "").trim();
    if (!donorUserId) {
      return NextResponse.json({ error: "donorUserId is required." }, { status: 400 });
    }

    const data = await listDonorChatMessages(user.id, donorUserId);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load donor chat.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertHealthcareUserActive(user.id);

    const body = (await request.json()) as {
      donorUserId?: string;
      body?: string;
      bloodGroup?: string;
      urgencyLevel?: string;
      locationCity?: string;
      donorVerified?: boolean;
    };
    const donorUserId = String(body.donorUserId ?? "").trim();
    const text = String(body.body ?? "").trim();

    if (!donorUserId) {
      return NextResponse.json({ error: "donorUserId is required." }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: "Message body is required." }, { status: 400 });
    }

    const urgencyLevelRaw = String(body.urgencyLevel ?? "").trim();
    const urgencyLevel = urgencyLevelRaw ? normalizeUrgencyLevel(urgencyLevelRaw) : null;

    const data = await createDonorChatMessage({
      requesterUserId: user.id,
      donorUserId,
      senderId: user.id,
      senderName: user.email ?? null,
      body: text,
      bloodGroup: String(body.bloodGroup ?? "").trim() || null,
      urgencyLevel,
      locationCity: String(body.locationCity ?? "").trim() || null,
      donorVerified: Boolean(body.donorVerified),
    });

    return NextResponse.json({ data, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send donor chat message.";
    const statusCode = message.startsWith("SUSPENDED:")
      ? 403
      : message.includes("required") || message.includes("Invalid")
        ? 400
        : 500;
    return NextResponse.json({ error: message.replace(/^SUSPENDED:/, "") }, { status: statusCode });
  }
}
