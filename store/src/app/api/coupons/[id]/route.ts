import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const coupon = await prisma.coupon.findUnique({ where: { id: params.id } });

  if (!coupon) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(coupon);
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
  const parsed = couponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const coupon = await prisma.coupon.update({
    where: { id: params.id },
    data: parsed.data,
  });

  revalidatePath("/admin/coupons");
  return NextResponse.json(coupon);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.coupon.delete({ where: { id: params.id } });
  revalidatePath("/admin/coupons");
  return NextResponse.json({ success: true });
}