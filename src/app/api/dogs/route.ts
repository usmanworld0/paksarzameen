import { NextResponse } from "next/server";
import { listDogsWithFilters, normalizeDogStatus, type DogStatus } from "@/lib/dog-adoption";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ data: [] });
    }

    const { searchParams } = new URL(request.url);
    const rawStatuses = searchParams.getAll("status");

    let statuses: DogStatus[] | undefined;
    if (rawStatuses.length) {
      statuses = rawStatuses.map((item) => normalizeDogStatus(item));
    }

    const city = String(searchParams.get("city") ?? "").trim() || undefined;
    const area = String(searchParams.get("area") ?? "").trim() || undefined;

    const dogs = await listDogsWithFilters(statuses, city ?? null, area ?? null);
    return NextResponse.json({ data: dogs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dogs.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
