import { NextResponse } from "next/server";
import { getRequiredApiUser } from "@/server/route-auth";
import { aiQuestionSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getSafeHealthAiResponse } from "@/services/healthcare/ai-service";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = consumeRateLimit({
    key: `ai:${user.id}`,
    max: 10,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please wait before asking another question.",
      },
      {
        status: 429,
      }
    );
  }

  try {
    const raw = (await request.json()) as unknown;
    const parsed = aiQuestionSchema.safeParse(raw);

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
    const mapped = mapHealthcareError(error, "Unable to process AI request.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
