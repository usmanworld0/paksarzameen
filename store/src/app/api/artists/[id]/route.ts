import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  const artist = await prisma.artist.update({
    where: { id: params.id },
    data: body,
  });
  revalidatePath("/artists");
  revalidatePath(`/artists/${artist.id}`);
  return NextResponse.json(artist);
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
  return NextResponse.json({ success: true });
}
