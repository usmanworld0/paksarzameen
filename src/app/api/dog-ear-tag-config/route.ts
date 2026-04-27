import { NextResponse } from "next/server";

import { getEarTagGlobalConfig } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const data = await getEarTagGlobalConfig();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load ear tag configuration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
