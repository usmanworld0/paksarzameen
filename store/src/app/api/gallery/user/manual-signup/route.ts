import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { MANUAL_GALLERY_SESSION_COOKIE } from "@/lib/manual-gallery-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

    if (!name) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
      select: { id: true, email: true, name: true },
    });

    const signup = await prisma.galleryManualSignup.upsert({
      where: { email },
      update: {
        userId: user.id,
        fullName: name,
        status: "active",
      },
      create: {
        userId: user.id,
        fullName: name,
        email,
        status: "active",
      },
      select: { id: true },
    });

    await prisma.galleryManualSession.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { signupId: signup.id }],
      },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await prisma.galleryManualSession.create({
      data: {
        signupId: signup.id,
        token,
        expiresAt,
      },
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(MANUAL_GALLERY_SESSION_COOKIE, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Signup failed" }, { status: 500 });
  }
}
