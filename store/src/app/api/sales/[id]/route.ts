import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const sale = await prisma.sale.findUnique({ where: { id: params.id } });
  if (!sale) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(sale);
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
  const sale = await prisma.sale.update({
    where: { id: params.id },
    data: body,
  });
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(sale);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.sale.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json({ success: true });
}
