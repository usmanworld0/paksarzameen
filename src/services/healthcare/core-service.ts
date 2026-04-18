import {
  addDoctorSlot,
  assertHealthcareUserActive,
  bookAppointment,
  createAppointmentMessage,
  createDoctor,
  createDonorChatMessage,
  getAppointmentById,
  getDoctorByUserId,
  getHealthCareAnalytics,
  listAppointmentMessages,
  listAppointmentsForDoctor,
  listAppointmentsForPatient,
  listHealthcareActivityLogs,
  listAvailableDoctorSlots,
  listDonorChatMessages,
  listDoctorSlots,
  listDoctors,
  markAppointmentMessagesRead,
  normalizeUrgencyLevel,
  setHealthcareUserSuspension,
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/lib/healthcare";
import { getDbPool } from "@/lib/db";
import { canCancelAppointment } from "@/services/healthcare/rules";

export {
  addDoctorSlot,
  assertHealthcareUserActive,
  bookAppointment,
  createAppointmentMessage,
  createDoctor,
  createDonorChatMessage,
  getAppointmentById,
  getDoctorByUserId,
  getHealthCareAnalytics,
  listAppointmentMessages,
  listAppointmentsForDoctor,
  listAppointmentsForPatient,
  listHealthcareActivityLogs,
  listAvailableDoctorSlots,
  listDonorChatMessages,
  listDoctorSlots,
  listDoctors,
  markAppointmentMessagesRead,
  normalizeUrgencyLevel,
  setHealthcareUserSuspension,
  updateAppointmentStatus,
};

export type BloodDonorMatch = {
  donorUserId: string;
  bloodGroup: string | null;
  urgencyLevel: string | null;
  locationCity: string | null;
  donorVerified: boolean;
  latestActivityAt: string;
};

export async function getBloodDonorMatches(input: {
  bloodGroup: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  city?: string;
  limit?: number;
}): Promise<BloodDonorMatch[]> {
  const pool = getDbPool();
  const limit = Number.isFinite(input.limit) ? Math.max(1, Math.min(25, Number(input.limit))) : 10;

  const params: Array<string | number> = [input.bloodGroup.toUpperCase(), input.urgencyLevel, limit];
  let cityFilterSql = "";

  if (input.city && input.city.trim()) {
    params.splice(2, 0, input.city.trim().toLowerCase());
    cityFilterSql = "AND lower(COALESCE(location_city, '')) = $3";
  }

  const limitParamPosition = input.city && input.city.trim() ? 4 : 3;

  const result = await pool.query(
    `
    WITH ranked AS (
      SELECT
        donor_user_id,
        blood_group,
        urgency_level,
        location_city,
        donor_verified,
        MAX(created_at) AS latest_activity_at
      FROM healthcare_blood_donor_chats
      WHERE donor_user_id IS NOT NULL
        AND donor_verified = true
        AND blood_group IN ($1, 'O+', 'O-')
        ${cityFilterSql}
      GROUP BY donor_user_id, blood_group, urgency_level, location_city, donor_verified
    )
    SELECT donor_user_id, blood_group, urgency_level, location_city, donor_verified, latest_activity_at
    FROM ranked
    ORDER BY
      CASE WHEN blood_group = $1 THEN 0 ELSE 1 END,
      CASE urgency_level
        WHEN $2 THEN 0
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
      END,
      latest_activity_at DESC
    LIMIT $${limitParamPosition};
    `,
    params
  );

  return result.rows.map((row) => ({
    donorUserId: String(row.donor_user_id),
    bloodGroup: row.blood_group ? String(row.blood_group) : null,
    urgencyLevel: row.urgency_level ? String(row.urgency_level) : null,
    locationCity: row.location_city ? String(row.location_city) : null,
    donorVerified: Boolean(row.donor_verified),
    latestActivityAt: new Date(String(row.latest_activity_at)).toISOString(),
  }));
}

export async function enforceAppointmentCancellationRule(input: {
  appointmentId: string;
  actingUserId: string;
  minimumHoursBeforeStart: number;
}) {
  const appointment = await getAppointmentById(input.appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  if (appointment.patientUserId !== input.actingUserId) {
    throw new Error("Appointment not found.");
  }

  if (appointment.status === "cancelled" || appointment.status === "completed") {
    throw new Error("Finalized appointments cannot be cancelled.");
  }

  if (!canCancelAppointment(appointment.slotStart, input.minimumHoursBeforeStart)) {
    throw new Error(`Appointments can only be cancelled at least ${input.minimumHoursBeforeStart} hours before slot start.`);
  }

  return appointment;
}

export async function updateAppointmentByDoctor(input: {
  appointmentId: string;
  doctorId: string;
  status: AppointmentStatus;
}) {
  const appointment = await getAppointmentById(input.appointmentId);
  if (!appointment || appointment.doctorId !== input.doctorId) {
    throw new Error("Forbidden.");
  }

  return updateAppointmentStatus(input.appointmentId, input.status);
}
