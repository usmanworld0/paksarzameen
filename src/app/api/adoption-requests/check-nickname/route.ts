import { NextResponse } from "next/server";
import { isPetNameAvailable } from "@/lib/dog-adoption";
import { hasDatabaseConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim() ?? "";

  if (!name) {
    return NextResponse.json({ available: false, error: "Name is required." }, { status: 400 });
  }

  if (!/^[\p{L}\p{N} '_-]{1,32}$/u.test(name)) {
    return NextResponse.json(
      { available: false, error: "Nickname may only contain letters, numbers, spaces, hyphens, or apostrophes (max 32 characters)." },
      { status: 400 }
    );
  }

  if (!hasDatabaseConnection()) {
    return NextResponse.json({ available: true });
  }

  try {
    const available = await isPetNameAvailable(name);
    return NextResponse.json({ available });
  } catch {
    return NextResponse.json({ available: false, error: "Could not check name availability." }, { status: 500 });
  }
}
