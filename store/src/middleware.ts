import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-env";
import { REGION_COOKIE_NAME, detectRegionFromHeaders } from "@/lib/pricing";

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const region = detectRegionFromHeaders(request.headers);

  function withRegionCookie(response: NextResponse) {
    response.cookies.set(REGION_COOKIE_NAME, region, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  }

  if (!pathname.startsWith("/admin")) {
    return withRegionCookie(NextResponse.next());
  }

  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  const isLoginPage = pathname === "/admin/login";

  if (!token && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    const callbackUrl = `${pathname}${search}`;

    if (callbackUrl !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return withRegionCookie(NextResponse.redirect(loginUrl));
  }

  if (token && isLoginPage) {
    const redirectUrl = request.nextUrl.searchParams.get("callbackUrl") || "/admin";
    return withRegionCookie(NextResponse.redirect(new URL(redirectUrl, request.url)));
  }

  return withRegionCookie(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
