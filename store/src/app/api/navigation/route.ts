import { NextResponse } from "next/server";
import { getStorefrontNavigation } from "@/lib/storefront-navigation";

export async function GET() {
  const navigation = await getStorefrontNavigation();
  return NextResponse.json(navigation);
}
