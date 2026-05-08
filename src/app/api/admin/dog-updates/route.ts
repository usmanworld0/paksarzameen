import { NextResponse } from "next/server";

import {
  createDogPostAdoptionUpdate,
  listAllDogPostAdoptionUpdates,
} from "@/lib/dog-adoption";
import { uploadImageFile } from "@/lib/cloudinary";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "view");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const data = await listAllDogPostAdoptionUpdates();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load updates.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "manage");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const dogId = String(formData.get("dogId") ?? "").trim();
    const caption = String(formData.get("caption") ?? "").trim();
    const collarTag = String(formData.get("collarTag") ?? "").trim();

    if (!dogId) {
      return NextResponse.json({ error: "Dog ID is required." }, { status: 400 });
    }

    const imageFile = formData.get("image");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (imageFile instanceof File && imageFile.size > 0) {
      const uploaded = await uploadImageFile(imageFile, "dog-adoption-updates");
      imageUrl = uploaded.url;
    }

    const data = await createDogPostAdoptionUpdate({
      dogId,
      imageUrl,
      caption,
      collarTag: collarTag || null,
      uploadedBy: session.email,
    });

    return NextResponse.json({ data, message: "Post-adoption update uploaded." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create update.";
    const statusCode = message.includes("adopted") || message.includes("required") ? 400 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
