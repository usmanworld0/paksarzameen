"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getActiveSales() {
  const now = new Date();
  return prisma.sale.findMany({
    where: {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllSales() {
  return prisma.sale.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getSaleById(id: string) {
  return prisma.sale.findUnique({ where: { id } });
}

export async function createSale(data: {
  name: string;
  type: "STORE" | "CATEGORY" | "PRODUCT";
  targetId?: string | null;
  discountPercent: number;
  startDate: Date;
  endDate: Date;
  active?: boolean;
}) {
  const sale = await prisma.sale.create({ data });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/sales");
  return sale;
}

export async function updateSale(
  id: string,
  data: {
    name?: string;
    type?: "STORE" | "CATEGORY" | "PRODUCT";
    targetId?: string | null;
    discountPercent?: number;
    startDate?: Date;
    endDate?: Date;
    active?: boolean;
  }
) {
  const sale = await prisma.sale.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/sales");
  return sale;
}

export async function deleteSale(id: string) {
  await prisma.sale.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/sales");
}

/** Calculate the best discount applicable to a product. */
export async function getProductDiscount(
  productId: string,
  categoryId: string
): Promise<number> {
  const now = new Date();
  const sales = await prisma.sale.findMany({
    where: {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
      OR: [
        { type: "STORE" },
        { type: "CATEGORY", targetId: categoryId },
        { type: "PRODUCT", targetId: productId },
      ],
    },
  });
  if (sales.length === 0) return 0;
  return Math.max(...sales.map((s) => s.discountPercent));
}
