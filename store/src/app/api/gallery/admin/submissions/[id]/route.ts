import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string } | undefined)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { approved?: boolean };
  if (typeof body.approved !== "boolean") {
    return NextResponse.json({ error: "approved must be boolean" }, { status: 400 });
  }

  const updated = await prisma.image.update({
    where: { id: params.id },
    data: { approved: body.approved },
    select: { id: true, approved: true },
  });

  return NextResponse.json({ image: updated });
}
