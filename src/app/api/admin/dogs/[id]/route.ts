import { NextResponse } from "next/server";

import { getDogById, parseUpdateDogPayload, updateDog, deleteDog } from "@/lib/dog-adoption";
import { hasCloudinaryUploadConfig, uploadImageFile } from "@/lib/cloudinary";
import { getRequiredAdminOrModuleApiUser } from "@/server/route-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: RouteContext) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "view");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    const data = await getDogById(id);

    if (!data) {
      return NextResponse.json({ error: "Dog not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "manage");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image");
      const imageUrlFromBody = String(formData.get("imageUrl") ?? "").trim();
      let imageUrl = imageUrlFromBody;

      if (file instanceof File && file.size > 0) {
        if (!hasCloudinaryUploadConfig()) {
          return NextResponse.json(
            {
              error:
                "Image file upload is unavailable because Cloudinary server configuration is missing. Add Cloudinary env vars or provide an Image URL.",
            },
            { status: 400 }
          );
        }

        const uploaded = await uploadImageFile(file, "dog-adoption");
        imageUrl = uploaded.url;
      }

      const payload = parseUpdateDogPayload({
        name: formData.get("name"),
        breed: formData.get("breed"),
        age: formData.get("age"),
        gender: formData.get("gender"),
        description: formData.get("description"),
        status: formData.get("status"),
        city: formData.get("city"),
        area: formData.get("area"),
        imageUrl: imageUrl || undefined,
      });

      const data = await updateDog(id, payload);
      return NextResponse.json({ data, message: "Dog updated." });
    }

    const body = await request.json();
    const payload = parseUpdateDogPayload(body);
    const data = await updateDog(id, payload);
    return NextResponse.json({ data, message: "Dog updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update dog.";
    const statusCode = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getRequiredAdminOrModuleApiUser("dog_adoption", "manage");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const { id } = await context.params;
    await deleteDog(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete dog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
