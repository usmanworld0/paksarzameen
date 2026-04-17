import { NextResponse } from "next/server";
import { deleteDogPostAdoptionUpdate } from "@/lib/dog-adoption";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "manage");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    await deleteDogPostAdoptionUpdate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete update.";
    const statusCode = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
