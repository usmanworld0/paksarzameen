import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

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
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    const fieldError = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);
    return NextResponse.json(
      { error: fieldError || "Please complete the required category fields." },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: parsed.data,
    });
    revalidatePath("/");
    revalidatePath(`/categories/${category.slug}`);
    revalidatePath("/admin/categories");
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Category slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
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

  await prisma.category.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return NextResponse.json({ success: true });
}
