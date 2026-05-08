import { NextResponse } from "next/server";

import { uploadImageFile } from "@/lib/cloudinary";
import { updateProfileData } from "@/server/profile-service";
import { getRequiredApiUser } from "@/server/route-auth";

export async function POST(request: Request) {
  const user = await getRequiredApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const fileField = formData.get("image") ?? formData.get("file");

    if (!(fileField instanceof File) || !fileField.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload a valid image file." }, { status: 400 });
    }

    const uploaded = await uploadImageFile(fileField, "blood-bank-profiles");
    await updateProfileData(user.id, {
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
