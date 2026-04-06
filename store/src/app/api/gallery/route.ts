import { NextResponse } from "next/server";

import { getApprovedGalleryImages } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await getApprovedGalleryImages();
  return NextResponse.json({ images });
}