import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { MANUAL_GALLERY_SESSION_COOKIE } from "@/lib/manual-gallery-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const token = cookies().get(MANUAL_GALLERY_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.galleryManualSession.deleteMany({ where: { token } });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(MANUAL_GALLERY_SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
