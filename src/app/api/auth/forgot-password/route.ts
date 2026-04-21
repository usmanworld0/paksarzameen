import { NextResponse } from "next/server";

import { sendPasswordResetEmail } from "@/lib/mailer";
import { getAuthUrl } from "@/lib/auth-env";
import { generatePasswordResetToken } from "@/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; cnic?: string };
    const email = body.email ?? "";
    const cnic = body.cnic ?? "";

    const result = await generatePasswordResetToken({ email, cnic });

    if (result?.user.email) {
      const origin = getAuthUrl();
      const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(result.token)}`;
      await sendPasswordResetEmail({
        email: result.user.email,
        resetUrl,
      });
    }

    return NextResponse.json({
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "If an account exists for this email, a reset link has been sent.",
      },
      { status: 200 }
    );
  }
}
