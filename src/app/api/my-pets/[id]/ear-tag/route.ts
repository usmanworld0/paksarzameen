import { NextResponse } from "next/server";

import { updateDogEarTagCustomization } from "@/lib/dog-adoption";
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
    const body = (await request.json()) as {
      styleImageUrl?: string;
      colorTitle?: string;
      boundaryImageUrl?: string;
    };

    const styleImageUrl = String(body.styleImageUrl ?? "").trim();
    const colorTitle = String(body.colorTitle ?? "").trim();
    const boundaryImageUrl = String(body.boundaryImageUrl ?? "").trim();

    if (!styleImageUrl || !colorTitle || !boundaryImageUrl) {
      return NextResponse.json(
        { error: "Ear tag style, color, and reflective boundary design are required." },
        { status: 400 }
      );
    }

    const data = await updateDogEarTagCustomization(id, user.id, {
      styleImageUrl,
      colorTitle,
      boundaryImageUrl,
    });

    return NextResponse.json({ data, message: "Ear tag customization saved." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save ear tag customization.";
    const statusCode =
      message.includes("not found") ? 404 :
      message.includes("owner") || message.includes("required") || message.includes("global configuration") ? 400 : 500;

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
