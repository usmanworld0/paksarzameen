import { v2 as cloudinary } from "cloudinary";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for Cloudinary uploads.`);
  }

  return value;
}

cloudinary.config({
  secure: true,
  cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
  api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
  url: process.env.CLOUDINARY_URL,
});

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  mimeType: string | null;
};

export async function uploadImageFile(
  file: File,
  folder = "customer-art-gallery"
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" },
      { width: 1600, crop: "limit" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
    bytes: result.bytes ?? null,
    mimeType: result.format ? `image/${result.format}` : file.type || null,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
