import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { uploadImageFile, deleteCloudinaryImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const caption = formData.get("caption");
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!files.length) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  if (files.some((file) => !file.type.startsWith("image/"))) {
    return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
  }

  const createdImages: Array<{ id: string }> = [];
  const uploadedPublicIds: string[] = [];

  try {
    for (const file of files) {
      const uploaded = await uploadImageFile(file);
      uploadedPublicIds.push(uploaded.publicId);

      const record = await prisma.image.create({
        data: {
          userId: session.user.id,
          publicId: uploaded.publicId,
          imageUrl: uploaded.url,
          thumbnailUrl: uploaded.url,
          originalFilename: file.name,
          mimeType: uploaded.mimeType,
          fileSize: uploaded.bytes,
          width: uploaded.width,
          height: uploaded.height,
          caption: typeof caption === "string" && caption.trim() ? caption.trim() : null,
          approved: false,
        },
        select: { id: true },
      });

      createdImages.push(record);
    }

    return NextResponse.json(
      {
        images: createdImages,
        message: "Images uploaded successfully and marked for review.",
      },
      { status: 201 }
    );
  } catch (error) {
    await Promise.all(
      uploadedPublicIds.map((publicId) => deleteCloudinaryImage(publicId).catch(() => undefined))
    );

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to upload images.",
      },
      { status: 500 }
    );
  }
}