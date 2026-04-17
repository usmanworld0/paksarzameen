import { NextResponse } from "next/server";
import { createDonorChatMessage, listDonorChatMessages } from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
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
    const body = (await request.json()) as { donorUserId?: string; body?: string };
    const donorUserId = String(body.donorUserId ?? "").trim();
    const text = String(body.body ?? "").trim();

    if (!donorUserId) {
      return NextResponse.json({ error: "donorUserId is required." }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: "Message body is required." }, { status: 400 });
    }

    const data = await createDonorChatMessage({
      requesterUserId: user.id,
      donorUserId,
      senderId: user.id,
      senderName: user.email ?? null,
      body: text,
    });

    return NextResponse.json({ data, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send donor chat message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
