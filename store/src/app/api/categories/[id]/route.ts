import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { products: true } },
      customizationOptions: true,
    },
  });
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(category);
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
  const category = await prisma.category.update({
    where: { id: params.id },
    data: body,
  });
  revalidatePath("/");
  revalidatePath(`/categories/${category.slug}`);
  return NextResponse.json(category);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.category.delete({ where: { id: params.id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
