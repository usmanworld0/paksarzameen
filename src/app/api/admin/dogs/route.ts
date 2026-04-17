import { NextResponse } from "next/server";

import {
  createDog,
  listDogs,
  normalizeDogStatus,
  parseCreateDogPayload,
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

    const data = await listDogs();
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dogs.";
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

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image");
      const imageUrlFromBody = String(formData.get("imageUrl") ?? "").trim();

      let imageUrl = imageUrlFromBody;
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadImageFile(file, "dog-adoption");
        imageUrl = uploaded.url;
      }

      const payload = parseCreateDogPayload({
        name: formData.get("name"),
        breed: formData.get("breed"),
        age: formData.get("age"),
        gender: formData.get("gender"),
        description: formData.get("description"),
        status: normalizeDogStatus(formData.get("status"), "available"),
        city: formData.get("city"),
        area: formData.get("area"),
        createdBy: session.email,
        imageUrl,
      });

      const data = await createDog(payload);
      return NextResponse.json({ data, message: "Dog created." }, { status: 201 });
    }

    const body = await request.json();
    const payload = parseCreateDogPayload(body);
    const data = await createDog(payload);
    return NextResponse.json({ data, message: "Dog created." }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create dog.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
