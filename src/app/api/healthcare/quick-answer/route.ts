import { NextResponse } from "next/server";
import { getHealthCareQuickAnswer, logHealthCareAiInteraction } from "@/lib/healthcare";
import { getRequiredApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = String(body.question ?? "");
    const answer = getHealthCareQuickAnswer(question);
    const disclaimer = "AI responses are general wellness guidance only and not a medical diagnosis. Always consult a licensed clinician for treatment decisions.";
    const user = await getRequiredApiUser();

    await logHealthCareAiInteraction({
      userId: user?.id ?? null,
      question,
      answer: `${answer} ${disclaimer}`,
    });

    return NextResponse.json({ data: { answer, disclaimer } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to answer question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
