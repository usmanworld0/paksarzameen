import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { artistSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function GET() {
  const artists = await prisma.artist.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(artists);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = artistSchema.safeParse(body);

  if (!parsed.success) {
    const fieldError = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);
    return NextResponse.json(
      { error: fieldError || "Please complete the required artist fields." },
      { status: 400 }
    );
  }

  try {
    const artist = await prisma.artist.create({ data: parsed.data });
    revalidatePath("/artists");
    revalidatePath("/admin/artists");
    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Artist slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create artist." }, { status: 500 });
  }
}
