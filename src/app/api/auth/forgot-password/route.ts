import { NextResponse } from "next/server";

import { resetPasswordWithEmailCnic } from "@/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; cnic?: string; password?: string };
    const email = body.email ?? "";
    const cnic = body.cnic ?? "";
    const password = body.password ?? "";

    await resetPasswordWithEmailCnic({ email, cnic, password });

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 }
    );
  }
}
