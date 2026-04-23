import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  buildProductRegionPriceCreateData,
  normalizeProductRegionPrices,
  type ProductRegionPriceInput,
} from "@/lib/product-region-prices";
import { getAllStoreRegions } from "@/lib/store-regions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: Record<string, unknown> = { active: true };

  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (featured) where.featured = true;

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "name"
          ? { name: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        artist: true,
        images: { orderBy: { position: "asc" } },
        regionPrices: { include: { region: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
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
    const storeRegions = await getAllStoreRegions();
    const normalizedRegionPrices = normalizeProductRegionPrices(
      regionPrices as ProductRegionPriceInput[],
      storeRegions
    );

    const product = await prisma.product.create({
      data: {
        ...productData,
        stock: availability ? 1 : 0,
        artistId: productData.artistId || null,
        compareAtPrice: productData.compareAtPrice || null,
        model3DUrl: productData.model3DUrl || null,
        modelOptimized: productData.model3DUrl ? productData.modelOptimized : false,
        modelSize: productData.model3DUrl ? productData.modelSize || null : null,
        images: {
          create: (images || []).map((url, i) => ({
            imageUrl: url,
            position: i,
          })),
        },
        regionPrices: {
          create: buildProductRegionPriceCreateData(normalizedRegionPrices),
        },
      },
      include: { images: true, regionPrices: { include: { region: true } } },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Add prices for all active regions:")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Product slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
