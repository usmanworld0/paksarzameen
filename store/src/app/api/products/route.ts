import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

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
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { images, ...productData } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      artistId: productData.artistId || null,
      compareAtPrice: productData.compareAtPrice || null,
      images: {
        create: (images || []).map((url, i) => ({
          imageUrl: url,
          position: i,
        })),
      },
    },
    include: { images: true },
  });

  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(product, { status: 201 });
}
