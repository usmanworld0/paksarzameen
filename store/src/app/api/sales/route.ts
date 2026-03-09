import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saleSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
  const sales = await prisma.sale.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = saleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const sale = await prisma.sale.create({ data: parsed.data });
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(sale, { status: 201 });
}
