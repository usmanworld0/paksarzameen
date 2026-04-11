import { NextResponse } from "next/server";

import { sendOtpEmail } from "@/lib/mailer";
import { createOtpCode, isValidEmail, normalizeEmail } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email ? normalizeEmail(body.email) : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const otpResult = await createOtpCode(email);

    if (!otpResult.ok) {
      return NextResponse.json(
        {
          error: "Too many requests. Try again shortly.",
          retryAfterSeconds: otpResult.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(otpResult.retryAfterSeconds),
          },
        }
      );
    }

    await sendOtpEmail({ email, otp: otpResult.otp });

    return NextResponse.json({
      message: "OTP sent successfully.",
      expiresAt: otpResult.expiresAt.toISOString(),
      attemptsLeftInWindow: otpResult.attemptsLeft,
    });
  } catch (error) {
    console.error("send-otp error", error);
    return NextResponse.json({ error: "Unable to send OTP right now." }, { status: 500 });
  }
}
