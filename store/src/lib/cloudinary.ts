import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const DEFAULT_CLOUDINARY_URL =
  "cloudinary://137426147159797:YY3hgPCKpxVCh2JeA-y-vX16Ifw@dzsz8qwjc";
const DEFAULT_CLOUDINARY_CLOUD_NAME = "dzsz8qwjc";
const DEFAULT_CLOUDINARY_API_KEY = "137426147159797";
const DEFAULT_CLOUDINARY_API_SECRET = "YY3hgPCKpxVCh2JeA-y-vX16Ifw";

function getCloudinaryConfig() {
  return {
    cloudinaryUrl: process.env.CLOUDINARY_URL ?? DEFAULT_CLOUDINARY_URL,
    cloudName:
      process.env.CLOUDINARY_CLOUD_NAME ?? DEFAULT_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY ?? DEFAULT_CLOUDINARY_API_KEY,
    apiSecret:
      process.env.CLOUDINARY_API_SECRET ?? DEFAULT_CLOUDINARY_API_SECRET,
  };
}

cloudinary.config({
  secure: true,
  url: getCloudinaryConfig().cloudinaryUrl,
  cloud_name: getCloudinaryConfig().cloudName,
  api_key: getCloudinaryConfig().apiKey,
  api_secret: getCloudinaryConfig().apiSecret,
});

export { cloudinary };

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  mimeType: string | null;
};

export type CloudinaryRawUploadResult = {
  url: string;
  publicId: string;
  bytes: number | null;
  mimeType: string | null;
  originalFilename: string | null;
};

export async function uploadImageFile(
  file: File,
  folder: string = "customer-art-gallery"
): Promise<CloudinaryUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
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

export async function uploadImage(
  file: string,
  folder: string = "commonwealth-lab"
): Promise<{ url: string; publicId: string }> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured on the server.");
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      { width: 1200, crop: "limit" },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function uploadRawFile(
  file: File,
  folder: string = "commonwealth-lab/models"
): Promise<CloudinaryRawUploadResult> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const buffer = Buffer.from(await file.arrayBuffer());

  return await new Promise<CloudinaryRawUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
        filename_override: file.name,
        format: extension,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary did not return a result."));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes ?? null,
          mimeType: file.type || null,
          originalFilename: result.original_filename ?? file.name,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  await deleteImage(publicId);
}
