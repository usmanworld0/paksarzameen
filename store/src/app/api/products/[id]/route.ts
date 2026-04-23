import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import {
  buildProductRegionPriceCreateData,
  normalizeProductRegionPrices,
  type ProductRegionPriceInput,
} from "@/lib/product-region-prices";
import { getAllStoreRegions } from "@/lib/store-regions";

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
      regionPrices: { include: { region: true } },
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
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    const fieldError = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);
    return NextResponse.json(
      { error: fieldError || "Please complete the required product fields." },
      { status: 400 }
    );
  }

  const { images, availability, regionPrices, ...productData } = parsed.data;

  try {
    await prisma.productImage.deleteMany({ where: { productId: params.id } });
    await prisma.productRegionPrice.deleteMany({ where: { productId: params.id } });

    const storeRegions = await getAllStoreRegions();
    const normalizedRegionPrices = normalizeProductRegionPrices(
      regionPrices as ProductRegionPriceInput[],
      storeRegions
    );

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...productData,
        stock: availability ? 1 : 0,
        artistId: productData.artistId || null,
        compareAtPrice: productData.compareAtPrice || null,
        model3DUrl: productData.model3DUrl || null,
        modelOptimized: productData.model3DUrl ? productData.modelOptimized : false,
        modelSize: productData.model3DUrl ? productData.modelSize || null : null,
        images: images
          ? {
              create: images.map((url, i) => ({
                imageUrl: url,
                position: i,
              })),
            }
          : undefined,
        regionPrices: {
          create: buildProductRegionPriceCreateData(normalizedRegionPrices),
        },
      },
      include: { images: true, regionPrices: { include: { region: true } } },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/admin/products");
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Add prices for all active regions:")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Product slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
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

  await prisma.product.delete({ where: { id: params.id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return NextResponse.json({ success: true });
}
