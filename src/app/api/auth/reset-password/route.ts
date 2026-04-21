import { NextResponse } from "next/server";

import { resetPasswordWithToken } from "@/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      cnic?: string;
      password?: string;
    };

    await resetPasswordWithToken({
      token: body.token ?? "",
      cnic: body.cnic ?? "",
      password: body.password ?? "",
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reset password.";
    const status = message.toLowerCase().includes("invalid") || message.toLowerCase().includes("expired") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
