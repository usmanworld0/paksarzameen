import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

function bindAuthOrigin(request: Request) {
	// Keep Auth.js callbacks on the active store origin even if env vars drift.
	const origin = new URL(request.url).origin;
	process.env.NEXTAUTH_URL = origin;
	process.env.AUTH_URL = origin;
}

export async function GET(request: Request, context: Parameters<typeof handler>[1]) {
	bindAuthOrigin(request);
	return handler(request, context);
}

export async function POST(request: Request, context: Parameters<typeof handler>[1]) {
	bindAuthOrigin(request);
	return handler(request, context);
}
