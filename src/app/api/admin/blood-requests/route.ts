import { NextResponse } from "next/server";
import { getBloodRequests } from "@/lib/blood-bank";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

export async function GET() {
  const session = await getRequiredAdminOrModuleApiUser("blood_bank", "view");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured." },
        { status: 500 }
      );
    }

    const rows = await getBloodRequests();
    return NextResponse.json({ data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load requests.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
