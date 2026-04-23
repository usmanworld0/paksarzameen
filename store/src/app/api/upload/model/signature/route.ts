import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MODEL_UPLOAD_FOLDER = "commonwealth-lab/models";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      folder: MODEL_UPLOAD_FOLDER,
      timestamp,
      unique_filename: "true",
      use_filename: "true",
    };

    const apiSecret = cloudinary.config().api_secret;
    const apiKey = cloudinary.config().api_key;
    const cloudName = cloudinary.config().cloud_name;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      signature,
      timestamp,
      folder: MODEL_UPLOAD_FOLDER,
      apiKey,
      cloudName,
      resourceType: "raw",
      uniqueFilename: true,
      useFilename: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to prepare model upload signature.",
      },
      { status: 500 }
    );
  }
}
