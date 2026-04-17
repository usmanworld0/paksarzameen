import { NextResponse } from "next/server";
import { listDogMessages, createDogMessage } from "@/lib/dog-messages";
import { getRequiredApiUser, getRequiredAdminApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dogId = String(url.searchParams.get("dogId") ?? "").trim();

    if (!dogId) {
      return NextResponse.json({ error: "dogId is required." }, { status: 400 });
    }

    const messages = await listDogMessages(dogId);
    return NextResponse.json({ data: messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load messages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    const admin = await getRequiredAdminApiUser();
    const identity = user ?? admin;

    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { dogId?: string; body?: string };
    const dogId = String(body.dogId ?? "").trim();
    const text = String(body.body ?? "").trim();

    if (!dogId) return NextResponse.json({ error: "dogId is required." }, { status: 400 });
    if (!text) return NextResponse.json({ error: "Message body is required." }, { status: 400 });

    const message = await createDogMessage(dogId, identity.id, identity.email ?? null, text);
    return NextResponse.json({ data: message, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
