import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { artistSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const artist = await prisma.artist.findUnique({
    where: { id: params.id },
    include: {
      products: {
        where: { active: true },
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
        },
      },
    },
  });
  if (!artist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(artist);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const artist = await prisma.artist.update({
      where: { id: params.id },
      data: parsed.data,
    });
    revalidatePath("/artists");
    revalidatePath(`/artists/${artist.id}`);
    revalidatePath("/admin/artists");
    return NextResponse.json(artist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Artist slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to update artist." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.artist.delete({ where: { id: params.id } });
  revalidatePath("/artists");
  revalidatePath("/admin/artists");
  return NextResponse.json({ success: true });
}
