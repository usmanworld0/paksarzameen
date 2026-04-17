import { NextResponse } from "next/server";
import { getHealthCareQuickAnswer } from "@/lib/healthcare";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const answer = getHealthCareQuickAnswer(String(body.question ?? ""));
    return NextResponse.json({ data: { answer } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to answer question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
