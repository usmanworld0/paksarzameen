"use server";

import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Use JPEG, PNG, WebP, or AVIF.");
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await uploadImage(base64, "commonwealth-lab/products");
  return { url: result.url, publicId: result.publicId };
}

export async function removeImage(publicId: string) {
  await deleteImage(publicId);
}
