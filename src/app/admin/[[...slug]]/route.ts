import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

type RouteParams = {
  slug?: string[];
};

function getAdminTarget(slug: string[] = []) {
  const target = new URL(siteConfig.commonwealthUrl);
  const basePath = target.pathname.replace(/\/$/, "");
  const adminPath = ["admin", ...slug].join("/");

  target.pathname = `${basePath}/${adminPath}`.replace(/\/+/g, "/");
  return target;
}

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> }
) {
  const { slug = [] } = await context.params;
  return NextResponse.redirect(getAdminTarget(slug));
}

export async function HEAD(
  _request: Request,
  context: { params: Promise<RouteParams> }
) {
  const { slug = [] } = await context.params;
  return NextResponse.redirect(getAdminTarget(slug));
}
