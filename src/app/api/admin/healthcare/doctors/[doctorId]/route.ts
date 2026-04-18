import { NextResponse } from "next/server";
import { deleteDoctor, getDoctorById, updateDoctor } from "@/services/healthcare/core-service";
import { getRequiredAdminApiUser } from "@/server/route-auth";
import { doctorProfileUpdateSchema } from "@/lib/healthcare-validation";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ doctorId: string }> }
) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { doctorId } = await context.params;
    const data = await getDoctorById(doctorId);
    if (!data) {
      return NextResponse.json({ error: "Doctor profile not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to load doctor profile.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ doctorId: string }> }
) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { doctorId } = await context.params;
    const body = (await request.json()) as unknown;
    const parsed = doctorProfileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid doctor update payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = await updateDoctor({
      doctorId,
      ...parsed.data,
    });

    return NextResponse.json({ data, message: "Doctor profile updated." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to update doctor profile.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ doctorId: string }> }
) {
  const admin = await getRequiredAdminApiUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { doctorId } = await context.params;
    const deleted = await deleteDoctor(doctorId);

    // Keep auth data consistent when the doctor profile is removed.
    if (deleted.userId) {
      const supabaseAdmin = getSupabaseAdminClient();
      await supabaseAdmin.auth.admin.deleteUser(deleted.userId);
    }

    return NextResponse.json({ data: deleted, message: "Doctor removed." });
  } catch (error) {
    const mapped = mapHealthcareError(error, "Failed to delete doctor profile.");
    return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status });
  }
}
