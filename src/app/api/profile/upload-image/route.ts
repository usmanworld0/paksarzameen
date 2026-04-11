import { NextResponse } from "next/server";

import { upsertProfile } from "@/db/users";
import { uploadImageFile } from "@/lib/cloudinary";
import { getRequiredApiUser } from "@/server/route-auth";

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload a valid image file." }, { status: 400 });
    }

    const uploaded = await uploadImageFile(file, "blood-bank-profiles");
    await upsertProfile(user.id, {
      profileImage: uploaded.url,
    });

    return NextResponse.json({
      message: "Profile image uploaded.",
      imageUrl: uploaded.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload profile image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
