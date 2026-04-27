import { NextResponse } from "next/server";
import { getDogById, listDogPostAdoptionUpdates } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: RouteContext) {
  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    const dog = await getDogById(id);

    if (!dog) {
      return NextResponse.json({ error: "Dog not found." }, { status: 404 });
    }

    const updates = await listDogPostAdoptionUpdates(id);
    return NextResponse.json({ data: { dog, updates } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
