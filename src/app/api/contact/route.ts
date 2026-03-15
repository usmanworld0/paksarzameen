import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; message?: string };

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // TODO: Wire this to an email provider or DB. For now return success.
    // Include the submission in logs for server-side visibility when running locally.
    // eslint-disable-next-line no-console
    console.info("Contact submission:", { name: body.name, email: body.email });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
