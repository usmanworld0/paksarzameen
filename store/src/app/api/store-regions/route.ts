import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getAllStoreRegions, updateStoreRegions } from "@/lib/store-regions";
import type { StoreRegion } from "@/lib/pricing";

const updateStoreRegionsSchema = z.object({
  regions: z.array(
    z.object({
      code: z.enum(["PAK", "US", "UK"]),
      active: z.boolean(),
      isDefault: z.boolean(),
    })
  ),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateStoreRegionsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide valid region settings." },
      { status: 400 }
    );
  }

  try {
    await updateStoreRegions(
      parsed.data.regions as Array<{ code: StoreRegion; active: boolean; isDefault: boolean }>
    );

    const regions = await getAllStoreRegions();
    return NextResponse.json({ regions });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update store regions.",
      },
      { status: 400 }
    );
  }
}