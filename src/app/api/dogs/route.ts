import { NextResponse } from "next/server";
import { normalizeDogStatus, type DogStatus } from "@/lib/dog-adoption";
import { getSupabaseReadClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawStatuses = searchParams.getAll("status");

    let statuses: DogStatus[] | undefined;
    if (rawStatuses.length) {
      statuses = rawStatuses.map((item) => normalizeDogStatus(item));
    }

    const city = String(searchParams.get("city") ?? "").trim() || undefined;
    const area = String(searchParams.get("area") ?? "").trim() || undefined;

    const supabase = getSupabaseReadClient();
    let query = supabase.from("dogs").select("*");

    if (statuses?.length) {
      query = query.in("status", statuses);
    }
    if (city) {
      query = query.eq("city", city);
    }
    if (area) {
      query = query.eq("area", area);
    }
    
    query = query.order("created_at", { ascending: false });

    const { data: dbDogs, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const dogs = (dbDogs || []).map(row => ({
      dogId: String(row.id),
      rescueName: row.rescue_name ? String(row.rescue_name) : String(row.name),
      petName: row.pet_name ? String(row.pet_name) : null,
      name: String(row.name),
      breed: String(row.breed),
      color: row.color ? String(row.color) : "Unknown",
      age: String(row.age),
      gender: String(row.gender),
      locationKey: row.location_key ? String(row.location_key) : null,
      locationLabel: row.location_label ? String(row.location_label) : null,
      province: row.province ? String(row.province) : null,
      city: row.city ? String(row.city) : null,
      area: row.area ? String(row.area) : null,
      latitude:
        typeof row.latitude === "number"
          ? row.latitude
          : row.latitude
            ? Number.isFinite(Number(row.latitude))
              ? Number(row.latitude)
              : null
            : null,
      longitude:
        typeof row.longitude === "number"
          ? row.longitude
          : row.longitude
            ? Number.isFinite(Number(row.longitude))
              ? Number(row.longitude)
              : null
            : null,
      description: String(row.description || ""),
      imageUrl: String(row.image_url),
      adoptedByUserId: row.adopted_by_user_id ? String(row.adopted_by_user_id) : null,
      petNamedByUserId: row.pet_named_by_user_id ? String(row.pet_named_by_user_id) : null,
      earTagStyleImageUrl: row.ear_tag_style_image_url ? String(row.ear_tag_style_image_url) : null,
      earTagColor: row.ear_tag_color ? String(row.ear_tag_color) : null,
      earTagBoundaryImageUrl: row.ear_tag_boundary_image_url ? String(row.ear_tag_boundary_image_url) : null,
      status: (row.status as DogStatus) || "available",
      createdBy: row.created_by ? String(row.created_by) : null,
      createdAt: new Date(String(row.created_at)).toISOString(),
      updatedAt: new Date(String(row.updated_at)).toISOString(),
    }));

    return NextResponse.json({ data: dogs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dogs.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
