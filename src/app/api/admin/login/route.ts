import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isValidAdminCredentials,
} from "@/lib/main-admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    if (!isValidAdminCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = createAdminSessionToken(email);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to login." }, { status: 500 });
  }
}
