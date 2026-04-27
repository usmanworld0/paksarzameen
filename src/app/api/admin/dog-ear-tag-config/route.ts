import { NextResponse } from "next/server";

import {
  getEarTagGlobalConfig,
  updateEarTagGlobalConfig,
} from "@/lib/dog-adoption";
import { hasCloudinaryUploadConfig, uploadImageFile } from "@/lib/cloudinary";
import { hasDatabaseConnection } from "@/lib/db";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

export const dynamic = "force-dynamic";

function parseStringArray(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
  } catch {
    return [];
  }
}

function unique(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }

  return result;
}

export async function GET() {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "view");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const data = await getEarTagGlobalConfig();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load ear tag configuration.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "manage");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!hasDatabaseConnection()) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const current = await getEarTagGlobalConfig();

    const styleImagesInput = parseStringArray(String(formData.get("styleImages") ?? ""));
    const colorOptionsInput = parseStringArray(String(formData.get("colorOptions") ?? ""));
    const boundaryImagesInput = parseStringArray(String(formData.get("boundaryImages") ?? ""));

    const styleUploads = formData.getAll("styleImageFiles").filter((item): item is File => item instanceof File && item.size > 0);
    const boundaryUploads = formData.getAll("boundaryImageFiles").filter((item): item is File => item instanceof File && item.size > 0);

    if ((styleUploads.length || boundaryUploads.length) && !hasCloudinaryUploadConfig()) {
      return NextResponse.json(
        {
          error:
            "Image file upload is unavailable because Cloudinary server configuration is missing. Add Cloudinary env vars or provide image URLs.",
        },
        { status: 400 }
      );
    }

    const uploadedStyleImages: string[] = [];
    for (const file of styleUploads) {
      const uploaded = await uploadImageFile(file, "dog-ear-tags/styles");
      uploadedStyleImages.push(uploaded.url);
    }

    const uploadedBoundaryImages: string[] = [];
    for (const file of boundaryUploads) {
      const uploaded = await uploadImageFile(file, "dog-ear-tags/boundaries");
      uploadedBoundaryImages.push(uploaded.url);
    }

    const data = await updateEarTagGlobalConfig({
      styleImages: unique([...current.styleImages, ...styleImagesInput, ...uploadedStyleImages]),
      colorOptions: unique([...colorOptionsInput]),
      boundaryImages: unique([...current.boundaryImages, ...boundaryImagesInput, ...uploadedBoundaryImages]),
      updatedBy: session.email,
    });

    return NextResponse.json({ data, message: "Ear tag configuration updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update ear tag configuration.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
