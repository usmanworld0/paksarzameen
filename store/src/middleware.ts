import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-env";
import { REGION_COOKIE_NAME, detectRegionFromHeaders } from "@/lib/pricing";

const NO_STORE_VALUE = "no-store, no-cache, max-age=0, must-revalidate";
const PUBLIC_FILE_PATTERN = /\.[^/]+$/;

function isFreshDeploymentRequest(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (pathname.startsWith("/_next/")) return false;
  if (PUBLIC_FILE_PATTERN.test(pathname)) return false;

  const accept = request.headers.get("accept") ?? "";
  const isRscRequest = request.headers.get("rsc") === "1" || searchParams.has("_rsc");

  return accept.includes("text/html") || isRscRequest;
}

function withFreshDeploymentHeaders(response: NextResponse, request: NextRequest) {
  if (!isFreshDeploymentRequest(request)) return response;

  response.headers.set("Cache-Control", NO_STORE_VALUE);
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const region = detectRegionFromHeaders(request.headers);

  function withRegionCookie(response: NextResponse) {
    response.cookies.set(REGION_COOKIE_NAME, region, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return withFreshDeploymentHeaders(response, request);
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
