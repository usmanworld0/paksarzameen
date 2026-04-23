import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { uploadRawFile } from "@/lib/cloudinary";

const RECOMMENDED_MODEL_SIZE_MB = 10;
const MAX_MODEL_SIZE_MB = 25;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No .glb file provided." }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const isGlb =
      fileName.endsWith(".glb") ||
      file.type === "model/gltf-binary" ||
      file.type === "application/octet-stream";

    if (!isGlb) {
      return NextResponse.json(
        { error: "Invalid file type. Only .glb files are supported." },
        { status: 400 }
      );
    }

    const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    if (fileSizeMb > MAX_MODEL_SIZE_MB) {
      return NextResponse.json(
        {
          error:
            "This 3D model is larger than 25MB. Optimize it before uploading so the product page stays fast.",
        },
        { status: 400 }
      );
    }

    const uploaded = await uploadRawFile(file, "commonwealth-lab/models");
    const warning =
      fileSizeMb > RECOMMENDED_MODEL_SIZE_MB
        ? "This model is over 10MB. Run an optimization pass before publishing to keep mobile loads fast."
        : null;

    return NextResponse.json({
      url: uploaded.url,
      publicId: uploaded.publicId,
      modelSize: fileSizeMb,
      modelOptimized: fileSizeMb <= RECOMMENDED_MODEL_SIZE_MB,
      warning,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "3D model upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
