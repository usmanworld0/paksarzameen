import { NextResponse } from "next/server";

import { signupWithEmailPassword } from "@/server/auth-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: "donor" | "admin" | "hospital";
    };

    const user = await signupWithEmailPassword({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      role: body.role,
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    const status = message.toLowerCase().includes("exists") || message.toLowerCase().includes("valid") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
