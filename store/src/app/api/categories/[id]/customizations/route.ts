import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryCustomizationSchema } from "@/lib/validations";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const options = await prisma.customizationOption.findMany({
      where: { categoryId: params.id },
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(options);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = categoryCustomizationSchema.safeParse(body);

  if (!parsed.success) {
    const fieldError = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .find(Boolean);
    return NextResponse.json(
      {
        error:
          fieldError ||
          "Please provide valid customization subcategories and options.",
      },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.customizationOption.deleteMany({ where: { categoryId: params.id } });

      if (parsed.data.options.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (tx.customizationOption.createMany as any)({
          data: parsed.data.options.map((option, index) => ({
            categoryId: params.id,
            name: option.name,
            required: option.required,
            options: option.options,
            position: option.position ?? index,
          })),
        });
      }
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Customization schema is not synced yet. Apply the latest database migration and try again.",
      },
      { status: 503 }
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${params.id}`);
  revalidatePath(`/categories/${category.slug}`);

  return NextResponse.json({ success: true });
}
