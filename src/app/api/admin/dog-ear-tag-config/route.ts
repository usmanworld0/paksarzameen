import { NextResponse } from "next/server";

import {
  type ColorOption,
  type EarTagImageOption,
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

function inferTitleFromUrl(imageUrl: string): string {
  const raw = imageUrl.trim();
  if (!raw) return "Untitled";

  const withoutQuery = raw.split("?")[0]?.split("#")[0] ?? raw;
  const lastSegment = withoutQuery.split("/").pop() ?? withoutQuery;
  const withoutExt = lastSegment.replace(/\.[^.]+$/, "");
  const normalized = withoutExt.replace(/[-_]+/g, " ").trim();

  if (!normalized) return "Untitled";

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseImageOptions(value: string | null): EarTagImageOption[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as { title?: unknown; imageUrl?: unknown; url?: unknown };
        const imageUrl = String(row.imageUrl ?? row.url ?? "").trim();
        if (!imageUrl) return null;
        const title = String(row.title ?? "").trim() || inferTitleFromUrl(imageUrl);
        return { title, imageUrl } satisfies EarTagImageOption;
      })
      .filter((item): item is EarTagImageOption => Boolean(item));
  } catch {
    return [];
  }
}

function uniqueImageOptions(values: EarTagImageOption[]) {
  const seen = new Set<string>();
  const result: EarTagImageOption[] = [];

  for (const value of values) {
    const imageUrl = value.imageUrl.trim();
    if (!imageUrl) continue;

    const key = imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      title: value.title.trim() || inferTitleFromUrl(imageUrl),
      imageUrl,
    });
  }

  return result;
}

function parseColorOptions(value: string | null): ColorOption[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): ColorOption | null => {
        if (!item || typeof item !== "object") return null;
        const row = item as { title?: unknown; imageUrl?: unknown; url?: unknown; textColor?: unknown };
        const imageUrl = String(row.imageUrl ?? row.url ?? "").trim();
        if (!imageUrl) return null;
        const title = String(row.title ?? "").trim() || inferTitleFromUrl(imageUrl);
        const textColor = String(row.textColor ?? "").trim() || undefined;
        return { title, imageUrl, textColor };
      })
      .filter((item): item is ColorOption => item !== null);
  } catch {
    return [];
  }
}

function uniqueColorOptions(values: ColorOption[]) {
  const seen = new Set<string>();
  const result: ColorOption[] = [];

  for (const value of values) {
    const imageUrl = value.imageUrl.trim();
    if (!imageUrl) continue;

    const key = imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      title: value.title.trim() || inferTitleFromUrl(imageUrl),
      imageUrl,
      textColor: value.textColor?.trim(),
    });
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

    const styleOptionsInput = parseImageOptions(String(formData.get("styleOptions") ?? ""));
    const colorOptionsInput = parseColorOptions(String(formData.get("colorOptions") ?? ""));
    const boundaryOptionsInput = parseImageOptions(String(formData.get("boundaryOptions") ?? ""));
    const styleImagesInput = parseStringArray(String(formData.get("styleImages") ?? ""));
    const boundaryImagesInput = parseStringArray(String(formData.get("boundaryImages") ?? ""));
    const styleUploadTitles = parseStringArray(String(formData.get("styleUploadTitles") ?? ""));
    const colorUploadTitles = parseStringArray(String(formData.get("colorUploadTitles") ?? ""));
    const colorUploadTextColors = parseStringArray(String(formData.get("colorUploadTextColors") ?? ""));
    const boundaryUploadTitles = parseStringArray(String(formData.get("boundaryUploadTitles") ?? ""));

    const styleUploads = formData.getAll("styleImageFiles").filter((item): item is File => item instanceof File && item.size > 0);
    const colorUploads = formData.getAll("colorImageFiles").filter((item): item is File => item instanceof File && item.size > 0);
    const boundaryUploads = formData.getAll("boundaryImageFiles").filter((item): item is File => item instanceof File && item.size > 0);

    if ((styleUploads.length || colorUploads.length || boundaryUploads.length) && !hasCloudinaryUploadConfig()) {
      return NextResponse.json(
        {
          error:
            "Image file upload is unavailable because Cloudinary server configuration is missing. Add Cloudinary env vars or provide image URLs.",
        },
        { status: 400 }
      );
    }

    const uploadedStyleOptions: EarTagImageOption[] = [];
    for (const [index, file] of styleUploads.entries()) {
      const uploaded = await uploadImageFile(file, "dog-ear-tags/styles");
      const fallbackTitle = file.name.replace(/\.[^.]+$/, "");
      uploadedStyleOptions.push({
        title: styleUploadTitles[index] || fallbackTitle || inferTitleFromUrl(uploaded.url),
        imageUrl: uploaded.url,
      });
    }

    const uploadedColorOptions: ColorOption[] = [];
    for (const [index, file] of colorUploads.entries()) {
      const uploaded = await uploadImageFile(file, "dog-ear-tags/colors");
      const fallbackTitle = file.name.replace(/\.[^.]+$/, "");
      uploadedColorOptions.push({
        title: colorUploadTitles[index] || fallbackTitle || inferTitleFromUrl(uploaded.url),
        imageUrl: uploaded.url,
        textColor: colorUploadTextColors[index],
      });
    }

    const uploadedBoundaryOptions: EarTagImageOption[] = [];
    for (const [index, file] of boundaryUploads.entries()) {
      const uploaded = await uploadImageFile(file, "dog-ear-tags/boundaries");
      const fallbackTitle = file.name.replace(/\.[^.]+$/, "");
      uploadedBoundaryOptions.push({
        title: boundaryUploadTitles[index] || fallbackTitle || inferTitleFromUrl(uploaded.url),
        imageUrl: uploaded.url,
      });
    }

    const legacyStyleOptions = styleImagesInput.map((imageUrl) => ({
      title: inferTitleFromUrl(imageUrl),
      imageUrl,
    }));

    const legacyBoundaryOptions = boundaryImagesInput.map((imageUrl) => ({
      title: inferTitleFromUrl(imageUrl),
      imageUrl,
    }));

    const data = await updateEarTagGlobalConfig({
      styleOptions: uniqueImageOptions([
        ...current.styleOptions,
        ...legacyStyleOptions,
        ...styleOptionsInput,
        ...uploadedStyleOptions,
      ]),
      colorOptions: uniqueColorOptions([
        ...current.colorOptions,
        ...colorOptionsInput,
        ...uploadedColorOptions,
      ]),
      boundaryOptions: uniqueImageOptions([
        ...current.boundaryOptions,
        ...legacyBoundaryOptions,
        ...boundaryOptionsInput,
        ...uploadedBoundaryOptions,
      ]),
      updatedBy: session.email,
    });

    return NextResponse.json({ data, message: "Ear tag configuration updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update ear tag configuration.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
