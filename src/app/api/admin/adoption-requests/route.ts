import { NextResponse } from "next/server";
import { listAdoptionRequests } from "@/lib/dog-adoption";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "view");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const data = await listAdoptionRequests();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load adoption requests.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
