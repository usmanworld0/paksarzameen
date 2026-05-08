import { NextResponse } from "next/server";

import { createLoginTicket, isValidEmail, normalizeEmail, verifyAndConsumeOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; otp?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const otp = body.otp?.trim() ?? "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be a 6-digit code." }, { status: 400 });
    }

    const verifyResult = await verifyAndConsumeOtp(email, otp);
    if (!verifyResult.ok) {
      const message =
        verifyResult.reason === "invalid"
          ? "Invalid OTP. Please try again."
          : "OTP expired or not found. Request a new code.";

      return NextResponse.json({ error: message }, { status: 401 });
    }

    const defaultName = email.split("@")[0]?.replace(/[._-]+/g, " ") ?? "PSZ Member";
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: defaultName,
      },
    });

    const { ticket, expires } = await createLoginTicket(email);

    return NextResponse.json({
      message: "OTP verified successfully.",
      ticket,
      ticketExpiresAt: expires.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      session: {
        status: "verified",
      },
    });
  } catch (error) {
    console.error("verify-otp error", error);
    return NextResponse.json({ error: "Unable to verify OTP right now." }, { status: 500 });
  }
}
