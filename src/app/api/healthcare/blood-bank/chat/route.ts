import { NextResponse } from "next/server";
import { assertHealthcareUserActive, createDonorChatMessage, listDonorChatMessages } from "@/services/healthcare/core-service";
import { getRequiredApiUser } from "@/server/route-auth";
import { donorChatCreateSchema } from "@/lib/healthcare-validation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

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
    const mapped = mapHealthcareError(error, "Failed to load donor chat.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = consumeRateLimit({
    key: `healthcare:blood-bank:chat:${user.id}`,
    max: 30,
    windowMs: 60_000,
  });

  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded for donor chat." }, { status: 429 });
  }

  try {
    await assertHealthcareUserActive(user.id);

    const body = (await request.json()) as unknown;
    const parsed = donorChatCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid donor chat payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await createDonorChatMessage({
      requesterUserId: user.id,
      donorUserId: parsed.data.donorUserId,
      senderId: user.id,
      senderName: user.email ?? null,
      body: parsed.data.body,
      bloodGroup: parsed.data.bloodGroup ?? null,
      urgencyLevel: parsed.data.urgencyLevel ?? null,
      locationCity: parsed.data.locationCity ?? null,
      donorVerified: Boolean(parsed.data.donorVerified),
      bloodRequestId: parsed.data.bloodRequestId ?? null,
    });

    return NextResponse.json({ data, message: "Message sent." }, { status: 201 });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to send donor chat message.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
