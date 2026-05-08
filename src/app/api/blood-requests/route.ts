import { NextResponse } from "next/server";
import { createBloodRequest, parseBloodRequestPayload } from "@/lib/blood-bank";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const payload = parseBloodRequestPayload(body);
    const record = await createBloodRequest(payload);

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit request.";
    const status = message.includes("required") || message.includes("Invalid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
