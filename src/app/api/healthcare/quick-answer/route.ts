import { NextResponse } from "next/server";
import { aiQuestionSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getSafeHealthAiResponse } from "@/services/healthcare/ai-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = consumeRateLimit({
    key: `healthcare:quick-answer:${user.id}`,
    max: 10,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before sending another question." },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = aiQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid question payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await getSafeHealthAiResponse({
      userId: user.id,
      question: parsed.data.question,
    });

    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to answer question.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
