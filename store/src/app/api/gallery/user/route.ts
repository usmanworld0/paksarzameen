import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { getUserGalleryImages } from "@/lib/gallery";
import { getManualGalleryUser } from "@/lib/manual-gallery-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const manualUser = await getManualGalleryUser();
  const userId = session?.user?.id ?? manualUser?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await getUserGalleryImages(userId);
  return NextResponse.json({ images });
}