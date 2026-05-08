import { NextResponse } from "next/server";

import { assignPetNameForAdoptedDog } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";
import { getRequiredApiUser } from "@/server/route-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { petName?: string };
    const petName = String(body.petName ?? "").trim();

    if (!petName) {
      return NextResponse.json({ error: "Pet name is required." }, { status: 400 });
    }

    const data = await assignPetNameForAdoptedDog(id, user.id, petName);
    return NextResponse.json({ data, message: "Pet name assigned successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to assign pet name.";
    const statusCode =
      message.includes("not found") ? 404 :
      message.includes("owner") || message.includes("already") || message.includes("after adoption") ? 400 : 500;

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
