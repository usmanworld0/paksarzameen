import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { include: { customizationOptions: true } },
      artist: true,
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
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
  const { images, ...productData } = body;

  // Replace images: delete existing, create new
  await prisma.productImage.deleteMany({ where: { productId: params.id } });

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...productData,
      images: images
        ? {
            create: (images as string[]).map((url, i) => ({
              imageUrl: url,
              position: i,
            })),
          }
        : undefined,
    },
    include: { images: true },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json({ success: true });
}
