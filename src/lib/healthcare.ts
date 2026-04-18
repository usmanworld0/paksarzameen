import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type AppointmentActorRole = "doctor" | "patient" | "admin" | "system";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type DoctorRecord = {
  doctorId: string;
  userId: string | null;
  email: string;
  fullName: string;
  specialization: string | null;
  bio: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
  createdAt: string;
  updatedAt: string;
};

export type DoctorSlotRecord = {
  slotId: string;
  doctorId: string;
  slotStart: string;
  slotEnd: string;
  isAvailable: boolean;
  createdAt: string;
};

export type AppointmentRecord = {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientUserId: string;
  patientName: string | null;
  slotId: string;
  slotStart: string;
  slotEnd: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentMessageRecord = {
  messageId: string;
  appointmentId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  attachmentUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type DonorChatMessageRecord = {
  messageId: string;
  roomKey: string;
  donorUserId: string;
  requesterUserId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  bloodGroup: string | null;
  urgencyLevel: UrgencyLevel | null;
  locationCity: string | null;
  donorVerified: boolean;
  createdAt: string;
};

const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const URGENCY_LEVELS: UrgencyLevel[] = ["low", "medium", "high", "critical"];

let didEnsureHealthCareSchema = false;

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedNullableText(value: unknown) {
  const text = normalizedText(value);
  return text ? text : null;
}

function normalizedNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizedUrl(value: unknown) {
  const url = normalizedText(value);
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Invalid attachment URL.");
    }
  } catch {
    throw new Error("Invalid attachment URL.");
  }

  return url;
}

export function normalizeUrgencyLevel(value: unknown): UrgencyLevel {
  const level = normalizedText(value).toLowerCase();
  if ((URGENCY_LEVELS as string[]).includes(level)) {
    return level as UrgencyLevel;
  }

  throw new Error("Invalid urgency level.");
}

export function normalizeAppointmentStatus(value: unknown): AppointmentStatus {
  const status = normalizedText(value).toLowerCase();
  if ((APPOINTMENT_STATUSES as string[]).includes(status)) {
    return status as AppointmentStatus;
  }
  throw new Error("Invalid appointment status.");
}

export async function ensureHealthCareSchema() {
  if (didEnsureHealthCareSchema) return;
  const pool = getDbPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_doctors (
      id text PRIMARY KEY,
      user_id uuid UNIQUE,
      email text NOT NULL,
      full_name text NOT NULL,
      specialization text,
      bio text,
      experience_years integer,
      consultation_fee numeric(10,2),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`ALTER TABLE healthcare_doctors ADD COLUMN IF NOT EXISTS experience_years integer;`);
  await pool.query(`ALTER TABLE healthcare_doctors ADD COLUMN IF NOT EXISTS consultation_fee numeric(10,2);`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_doctor_slots (
      id text PRIMARY KEY,
      doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
      slot_start timestamptz NOT NULL,
      slot_end timestamptz NOT NULL,
      is_available boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_appointments (
      id text PRIMARY KEY,
      doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
      patient_user_id uuid NOT NULL,
      slot_id text NOT NULL REFERENCES healthcare_doctor_slots(id) ON DELETE CASCADE,
      reason text NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      cancelled_at timestamptz,
      completed_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT healthcare_appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
    );
  `);

  await pool.query(`ALTER TABLE healthcare_appointments ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;`);
  await pool.query(`ALTER TABLE healthcare_appointments ADD COLUMN IF NOT EXISTS completed_at timestamptz;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_appointment_messages (
      id text PRIMARY KEY,
      appointment_id text NOT NULL REFERENCES healthcare_appointments(id) ON DELETE CASCADE,
      sender_id text NOT NULL,
      sender_name text,
      body text NOT NULL,
      attachment_url text,
      is_read boolean NOT NULL DEFAULT false,
      read_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`ALTER TABLE healthcare_appointment_messages ADD COLUMN IF NOT EXISTS attachment_url text;`);
  await pool.query(`ALTER TABLE healthcare_appointment_messages ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;`);
  await pool.query(`ALTER TABLE healthcare_appointment_messages ADD COLUMN IF NOT EXISTS read_at timestamptz;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_blood_donor_chats (
      id text PRIMARY KEY,
      room_key text NOT NULL,
      donor_user_id uuid NOT NULL,
      requester_user_id uuid NOT NULL,
      sender_id text NOT NULL,
      sender_name text,
      body text NOT NULL,
      blood_group text,
      urgency_level text,
      location_city text,
      donor_verified boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`ALTER TABLE healthcare_blood_donor_chats ADD COLUMN IF NOT EXISTS blood_group text;`);
  await pool.query(`ALTER TABLE healthcare_blood_donor_chats ADD COLUMN IF NOT EXISTS urgency_level text;`);
  await pool.query(`ALTER TABLE healthcare_blood_donor_chats ADD COLUMN IF NOT EXISTS location_city text;`);
  await pool.query(`ALTER TABLE healthcare_blood_donor_chats ADD COLUMN IF NOT EXISTS donor_verified boolean NOT NULL DEFAULT false;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_audit_logs (
      id text PRIMARY KEY,
      actor_user_id text,
      action text NOT NULL,
      entity_type text NOT NULL,
      entity_id text,
      metadata jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_ai_logs (
      id text PRIMARY KEY,
      user_id text,
      question text NOT NULL,
      answer text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_user_suspensions (
      user_id uuid PRIMARY KEY,
      is_suspended boolean NOT NULL DEFAULT false,
      reason text,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_doctors_user_id_idx ON healthcare_doctors (user_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_slots_doctor_id_idx ON healthcare_doctor_slots (doctor_id, slot_start DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointments_doctor_idx ON healthcare_appointments (doctor_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointments_patient_idx ON healthcare_appointments (patient_user_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointment_messages_idx ON healthcare_appointment_messages (appointment_id, created_at ASC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_room_idx ON healthcare_blood_donor_chats (room_key, created_at ASC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_lookup_idx ON healthcare_blood_donor_chats (donor_user_id, requester_user_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_audit_logs_created_idx ON healthcare_audit_logs (created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_ai_logs_created_idx ON healthcare_ai_logs (created_at DESC);`);

  didEnsureHealthCareSchema = true;
}

export async function createHealthcareAuditLog(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  await pool.query(
    `
    INSERT INTO healthcare_audit_logs (id, actor_user_id, action, entity_type, entity_id, metadata)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb);
    `,
    [
      randomUUID(),
      normalizedNullableText(input.actorUserId),
      normalizedText(input.action),
      normalizedText(input.entityType),
      normalizedNullableText(input.entityId),
      input.metadata ? JSON.stringify(input.metadata) : null,
    ]
  );
}

async function safeAuditLog(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  try {
    await createHealthcareAuditLog(input);
  } catch {
    // Audit logging is best-effort and should not break user flows.
  }
}

export async function logHealthCareAiInteraction(input: {
  userId?: string | null;
  question: string;
  answer: string;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  await pool.query(
    `
    INSERT INTO healthcare_ai_logs (id, user_id, question, answer)
    VALUES ($1, $2, $3, $4);
    `,
    [
      randomUUID(),
      normalizedNullableText(input.userId),
      normalizedText(input.question),
      normalizedText(input.answer),
    ]
  );
}

export async function assertHealthcareUserActive(userId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT is_suspended, reason
    FROM healthcare_user_suspensions
    WHERE user_id = $1
    LIMIT 1;
    `,
    [userId]
  );

  const suspension = result.rows[0];
  if (suspension && Boolean(suspension.is_suspended)) {
    const reason = suspension.reason ? String(suspension.reason) : "Access is temporarily suspended.";
    throw new Error(`SUSPENDED:${reason}`);
  }
}

export async function setHealthcareUserSuspension(input: {
  userId: string;
  isSuspended: boolean;
  reason?: string | null;
  actorUserId?: string | null;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  await pool.query(
    `
    INSERT INTO healthcare_user_suspensions (user_id, is_suspended, reason, updated_at)
    VALUES ($1, $2, $3, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      is_suspended = EXCLUDED.is_suspended,
      reason = EXCLUDED.reason,
      updated_at = now();
    `,
    [input.userId, input.isSuspended, normalizedNullableText(input.reason)]
  );

  await safeAuditLog({
    actorUserId: input.actorUserId,
    action: input.isSuspended ? "user_suspended" : "user_unsuspended",
    entityType: "healthcare_user",
    entityId: input.userId,
    metadata: { reason: normalizedNullableText(input.reason) },
  });
}

export async function getHealthCareAnalytics() {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const [appointmentsByStatus, totals, doctors, activePatients] = await Promise.all([
    pool.query(
      `
      SELECT status, COUNT(*)::int AS total
      FROM healthcare_appointments
      GROUP BY status;
      `
    ),
    pool.query(
      `
      SELECT
        (SELECT COUNT(*)::int FROM healthcare_appointments) AS appointments_total,
        (SELECT COUNT(*)::int FROM healthcare_blood_donor_chats) AS donor_chat_messages_total,
        (SELECT COUNT(*)::int FROM healthcare_appointment_messages) AS appointment_messages_total,
        (SELECT COUNT(*)::int FROM healthcare_user_suspensions WHERE is_suspended = true) AS suspended_users_total;
      `
    ),
    pool.query(`SELECT COUNT(*)::int AS doctors_total FROM healthcare_doctors;`),
    pool.query(`SELECT COUNT(DISTINCT patient_user_id)::int AS active_patients_total FROM healthcare_appointments;`),
  ]);

  return {
    doctorsTotal: Number(doctors.rows[0]?.doctors_total ?? 0),
    activePatientsTotal: Number(activePatients.rows[0]?.active_patients_total ?? 0),
    appointmentsTotal: Number(totals.rows[0]?.appointments_total ?? 0),
    donorChatMessagesTotal: Number(totals.rows[0]?.donor_chat_messages_total ?? 0),
    appointmentMessagesTotal: Number(totals.rows[0]?.appointment_messages_total ?? 0),
    suspendedUsersTotal: Number(totals.rows[0]?.suspended_users_total ?? 0),
    appointmentsByStatus: appointmentsByStatus.rows.reduce<Record<string, number>>((acc, row) => {
      const status = String(row.status);
      const total = Number(row.total ?? 0);
      acc[status] = total;
      return acc;
    }, {}),
  };
}

export async function listDoctors() {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(`
    SELECT id, user_id, email, full_name, specialization, bio, experience_years, consultation_fee, created_at, updated_at
    FROM healthcare_doctors
    ORDER BY created_at DESC;
  `);

  return result.rows.map(mapDoctorRow);
}

export async function getDoctorByUserId(userId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT id, user_id, email, full_name, specialization, bio, experience_years, consultation_fee, created_at, updated_at
    FROM healthcare_doctors
    WHERE user_id = $1
    LIMIT 1;
    `,
    [userId]
  );

  if (!result.rows[0]) return null;
  return mapDoctorRow(result.rows[0]);
}

export async function createDoctor(input: {
  userId?: string | null;
  email: string;
  fullName: string;
  specialization?: string | null;
  bio?: string | null;
  experienceYears?: number | null;
  consultationFee?: number | null;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    INSERT INTO healthcare_doctors (id, user_id, email, full_name, specialization, bio, experience_years, consultation_fee)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, user_id, email, full_name, specialization, bio, experience_years, consultation_fee, created_at, updated_at;
    `,
    [
      randomUUID(),
      input.userId ?? null,
      normalizedText(input.email).toLowerCase(),
      normalizedText(input.fullName),
      normalizedText(input.specialization) || null,
      normalizedText(input.bio) || null,
      normalizedNumber(input.experienceYears),
      normalizedNumber(input.consultationFee),
    ]
  );

  await safeAuditLog({
    actorUserId: input.userId ?? null,
    action: "doctor_created",
    entityType: "doctor",
    entityId: String(result.rows[0].id),
    metadata: {
      specialization: normalizedNullableText(input.specialization),
      experienceYears: normalizedNumber(input.experienceYears),
      consultationFee: normalizedNumber(input.consultationFee),
    },
  });

  return mapDoctorRow(result.rows[0]);
}

export async function addDoctorSlot(doctorId: string, slotStart: string, slotEnd: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  if (Number.isNaN(Date.parse(slotStart)) || Number.isNaN(Date.parse(slotEnd))) {
    throw new Error("Invalid slot start or end time.");
  }

  const start = new Date(slotStart);
  const end = new Date(slotEnd);
  if (start <= new Date()) {
    throw new Error("Slot start must be in the future.");
  }

  if (end <= start) {
    throw new Error("Slot end must be after slot start.");
  }

  const conflict = await pool.query(
    `
    SELECT id
    FROM healthcare_doctor_slots
    WHERE doctor_id = $1
      AND slot_start < $3
      AND slot_end > $2
    LIMIT 1;
    `,
    [doctorId, start.toISOString(), end.toISOString()]
  );

  if (conflict.rows[0]) {
    throw new Error("Slot conflicts with an existing schedule block.");
  }

  const result = await pool.query(
    `
    INSERT INTO healthcare_doctor_slots (id, doctor_id, slot_start, slot_end, is_available)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, doctor_id, slot_start, slot_end, is_available, created_at;
    `,
    [randomUUID(), doctorId, start.toISOString(), end.toISOString()]
  );

  await safeAuditLog({
    actorUserId: doctorId,
    action: "doctor_slot_added",
    entityType: "doctor_slot",
    entityId: String(result.rows[0].id),
    metadata: {
      doctorId,
      slotStart: start.toISOString(),
      slotEnd: end.toISOString(),
    },
  });

  return mapDoctorSlotRow(result.rows[0]);
}

export async function listDoctorSlots(doctorId: string, onlyAvailable = false) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const result = onlyAvailable
    ? await pool.query(
      `
      SELECT id, doctor_id, slot_start, slot_end, is_available, created_at
      FROM healthcare_doctor_slots
      WHERE doctor_id = $1 AND is_available = true AND slot_start >= now()
      ORDER BY slot_start ASC;
      `,
      [doctorId]
    )
    : await pool.query(
      `
      SELECT id, doctor_id, slot_start, slot_end, is_available, created_at
      FROM healthcare_doctor_slots
      WHERE doctor_id = $1
      ORDER BY slot_start ASC;
      `,
      [doctorId]
    );

  return result.rows.map(mapDoctorSlotRow);
}

export async function listAvailableDoctorSlots() {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(`
    SELECT
      s.id,
      s.doctor_id,
      s.slot_start,
      s.slot_end,
      s.is_available,
      s.created_at,
      d.full_name AS doctor_name,
      d.specialization
    FROM healthcare_doctor_slots s
    INNER JOIN healthcare_doctors d ON d.id = s.doctor_id
    WHERE s.is_available = true AND s.slot_start >= now()
    ORDER BY s.slot_start ASC;
  `);

  return result.rows.map((row) => ({
    ...mapDoctorSlotRow(row),
    doctorName: String(row.doctor_name),
    specialization: row.specialization ? String(row.specialization) : null,
  }));
}

export async function bookAppointment(input: {
  doctorId: string;
  patientUserId: string;
  slotId: string;
  reason: string;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const slotResult = await client.query(
      `
      SELECT id, doctor_id, is_available, slot_start, slot_end
      FROM healthcare_doctor_slots
      WHERE id = $1
      LIMIT 1
      FOR UPDATE;
      `,
      [input.slotId]
    );

    const slot = slotResult.rows[0];
    if (!slot) throw new Error("Slot not found.");
    if (!Boolean(slot.is_available)) throw new Error("Slot is no longer available.");
    if (String(slot.doctor_id) !== input.doctorId) {
      throw new Error("Slot does not belong to selected doctor.");
    }

    if (new Date(String(slot.slot_start)) <= new Date()) {
      throw new Error("Cannot book an expired slot.");
    }

    const duplicateActiveAppointment = await client.query(
      `
      SELECT id
      FROM healthcare_appointments
      WHERE slot_id = $1
        AND status IN ('pending', 'confirmed')
      LIMIT 1
      FOR UPDATE;
      `,
      [input.slotId]
    );

    if (duplicateActiveAppointment.rows[0]) {
      throw new Error("Slot is already booked.");
    }

    const reason = normalizedText(input.reason);
    if (!reason) throw new Error("Appointment reason is required.");

    const appointmentResult = await client.query(
      `
      INSERT INTO healthcare_appointments (
        id,
        doctor_id,
        patient_user_id,
        slot_id,
        reason,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING id;
      `,
      [randomUUID(), input.doctorId, input.patientUserId, input.slotId, reason]
    );

    await client.query(
      `
      UPDATE healthcare_doctor_slots
      SET is_available = false
      WHERE id = $1;
      `,
      [input.slotId]
    );

    await client.query("COMMIT");
    const appointmentId = String(appointmentResult.rows[0].id);

    await safeAuditLog({
      actorUserId: input.patientUserId,
      action: "appointment_booked",
      entityType: "appointment",
      entityId: appointmentId,
      metadata: {
        doctorId: input.doctorId,
        slotId: input.slotId,
      },
    });

    return getAppointmentById(appointmentId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAppointmentById(appointmentId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    SELECT
      a.id,
      a.doctor_id,
      a.patient_user_id,
      a.slot_id,
      a.reason,
      a.status,
      a.created_at,
      a.updated_at,
      d.full_name AS doctor_name,
      s.slot_start,
      s.slot_end,
      u.name AS patient_name
    FROM healthcare_appointments a
    INNER JOIN healthcare_doctors d ON d.id = a.doctor_id
    INNER JOIN healthcare_doctor_slots s ON s.id = a.slot_id
    LEFT JOIN users u ON u.id = a.patient_user_id
    WHERE a.id = $1
    LIMIT 1;
    `,
    [appointmentId]
  );

  if (!result.rows[0]) return null;
  return mapAppointmentRow(result.rows[0]);
}

export async function listAppointmentsForDoctor(doctorId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.doctor_id,
      a.patient_user_id,
      a.slot_id,
      a.reason,
      a.status,
      a.created_at,
      a.updated_at,
      d.full_name AS doctor_name,
      s.slot_start,
      s.slot_end,
      u.name AS patient_name
    FROM healthcare_appointments a
    INNER JOIN healthcare_doctors d ON d.id = a.doctor_id
    INNER JOIN healthcare_doctor_slots s ON s.id = a.slot_id
    LEFT JOIN users u ON u.id = a.patient_user_id
    WHERE a.doctor_id = $1
    ORDER BY s.slot_start DESC;
    `,
    [doctorId]
  );

  return result.rows.map(mapAppointmentRow);
}

export async function listAppointmentsForPatient(patientUserId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.doctor_id,
      a.patient_user_id,
      a.slot_id,
      a.reason,
      a.status,
      a.created_at,
      a.updated_at,
      d.full_name AS doctor_name,
      s.slot_start,
      s.slot_end,
      u.name AS patient_name
    FROM healthcare_appointments a
    INNER JOIN healthcare_doctors d ON d.id = a.doctor_id
    INNER JOIN healthcare_doctor_slots s ON s.id = a.slot_id
    LEFT JOIN users u ON u.id = a.patient_user_id
    WHERE a.patient_user_id = $1
    ORDER BY s.slot_start DESC;
    `,
    [patientUserId]
  );

  return result.rows.map(mapAppointmentRow);
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const currentResult = await client.query(
      `
      SELECT id, status, slot_id, slot_start
      FROM healthcare_appointments a
      INNER JOIN healthcare_doctor_slots s ON s.id = a.slot_id
      WHERE a.id = $1
      LIMIT 1
      FOR UPDATE;
      `,
      [appointmentId]
    );

    const current = currentResult.rows[0];
    if (!current) {
      throw new Error("Appointment not found.");
    }

    const currentStatus = String(current.status) as AppointmentStatus;
    if (currentStatus === "cancelled" || currentStatus === "completed") {
      throw new Error("Finalized appointments cannot be modified.");
    }

    if (currentStatus === "pending" && status === "completed") {
      throw new Error("Pending appointment cannot be marked completed directly.");
    }

    if (status === "cancelled") {
      await client.query(
        `
        UPDATE healthcare_doctor_slots
        SET is_available = true
        WHERE id = $1;
        `,
        [String(current.slot_id)]
      );
    }

    await client.query(
      `
      UPDATE healthcare_appointments
      SET status = $2,
          cancelled_at = CASE WHEN $2 = 'cancelled' THEN now() ELSE cancelled_at END,
          completed_at = CASE WHEN $2 = 'completed' THEN now() ELSE completed_at END,
          updated_at = now()
      WHERE id = $1;
      `,
      [appointmentId, status]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const updated = await getAppointmentById(appointmentId);
  if (!updated) throw new Error("Appointment not found.");

  await safeAuditLog({
    action: "appointment_status_updated",
    entityType: "appointment",
    entityId: appointmentId,
    metadata: { status },
  });

  return updated;
}

export async function listAppointmentMessages(appointmentId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT id, appointment_id, sender_id, sender_name, body, attachment_url, is_read, read_at, created_at
    FROM healthcare_appointment_messages
    WHERE appointment_id = $1
    ORDER BY created_at ASC;
    `,
    [appointmentId]
  );

  return result.rows.map(mapAppointmentMessageRow);
}

export async function createAppointmentMessage(
  appointmentId: string,
  senderId: string,
  senderName: string | null,
  body: string,
  attachmentUrl?: string | null
) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const content = normalizedText(body);
  if (!content) throw new Error("Message body is required.");

  const safeAttachmentUrl = normalizedUrl(attachmentUrl);

  const result = await pool.query(
    `
    INSERT INTO healthcare_appointment_messages (id, appointment_id, sender_id, sender_name, body, attachment_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, appointment_id, sender_id, sender_name, body, attachment_url, is_read, read_at, created_at;
    `,
    [randomUUID(), appointmentId, senderId, senderName, content, safeAttachmentUrl]
  );

  await safeAuditLog({
    actorUserId: senderId,
    action: "appointment_message_created",
    entityType: "appointment_message",
    entityId: String(result.rows[0].id),
    metadata: { appointmentId, hasAttachment: Boolean(safeAttachmentUrl) },
  });

  return mapAppointmentMessageRow(result.rows[0]);
}

export async function markAppointmentMessagesRead(appointmentId: string, readerUserId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    UPDATE healthcare_appointment_messages
    SET is_read = true,
        read_at = COALESCE(read_at, now())
    WHERE appointment_id = $1
      AND sender_id <> $2
      AND is_read = false;
    `,
    [appointmentId, readerUserId]
  );

  return Number(result.rowCount ?? 0);
}

function getDonorRoomKey(requesterUserId: string, donorUserId: string) {
  return [requesterUserId, donorUserId].sort().join(":");
}

export async function listDonorChatMessages(requesterUserId: string, donorUserId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const roomKey = getDonorRoomKey(requesterUserId, donorUserId);
  const result = await pool.query(
    `
    SELECT id, room_key, donor_user_id, requester_user_id, sender_id, sender_name, body, blood_group, urgency_level, location_city, donor_verified, created_at
    FROM healthcare_blood_donor_chats
    WHERE room_key = $1
    ORDER BY created_at ASC;
    `,
    [roomKey]
  );

  return result.rows.map(mapDonorChatMessageRow);
}

export async function createDonorChatMessage(input: {
  requesterUserId: string;
  donorUserId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  bloodGroup?: string | null;
  urgencyLevel?: UrgencyLevel | null;
  locationCity?: string | null;
  donorVerified?: boolean;
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const content = normalizedText(input.body);
  if (!content) throw new Error("Message body is required.");

  const roomKey = getDonorRoomKey(input.requesterUserId, input.donorUserId);
  const urgency = input.urgencyLevel ? normalizeUrgencyLevel(input.urgencyLevel) : null;
  const result = await pool.query(
    `
    INSERT INTO healthcare_blood_donor_chats (
      id,
      room_key,
      donor_user_id,
      requester_user_id,
      sender_id,
      sender_name,
      body,
      blood_group,
      urgency_level,
      location_city,
      donor_verified
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, room_key, donor_user_id, requester_user_id, sender_id, sender_name, body, blood_group, urgency_level, location_city, donor_verified, created_at;
    `,
    [
      randomUUID(),
      roomKey,
      input.donorUserId,
      input.requesterUserId,
      input.senderId,
      input.senderName,
      content,
      normalizedNullableText(input.bloodGroup),
      urgency,
      normalizedNullableText(input.locationCity),
      Boolean(input.donorVerified),
    ]
  );

  await safeAuditLog({
    actorUserId: input.senderId,
    action: "blood_donor_chat_message_created",
    entityType: "blood_donor_chat",
    entityId: String(result.rows[0].id),
    metadata: {
      donorUserId: input.donorUserId,
      requesterUserId: input.requesterUserId,
      urgency,
    },
  });

  return mapDonorChatMessageRow(result.rows[0]);
}

export function getHealthCareQuickAnswer(question: string) {
  const q = normalizedText(question).toLowerCase();

  if (!q) {
    return "Please write your health question so I can help quickly.";
  }

  if (q.includes("fever")) {
    return "For fever: stay hydrated, rest, and monitor temperature every 4-6 hours. Seek urgent care if fever is high, persistent for more than 3 days, or accompanied by breathing difficulty.";
  }

  if (q.includes("blood") || q.includes("donor") || q.includes("donation")) {
    return "For blood support, use the Blood Bank subsection to find matching donors and contact them quickly. If there is active bleeding or emergency risk, call local emergency services immediately.";
  }

  if (q.includes("appointment") || q.includes("doctor")) {
    return "You can book an appointment from available slots. For emergencies, do not wait for an online appointment and contact emergency services directly.";
  }

  if (q.includes("chest pain") || q.includes("breath") || q.includes("stroke")) {
    return "Possible emergency signs detected. Please contact emergency services immediately and seek in-person medical care now.";
  }

  return "This quick AI helper provides general guidance only, not a diagnosis. For persistent or serious symptoms, book a doctor appointment or visit emergency care.";
}

function mapDoctorRow(row: Record<string, unknown>): DoctorRecord {
  return {
    doctorId: String(row.id),
    userId: row.user_id ? String(row.user_id) : null,
    email: String(row.email),
    fullName: String(row.full_name),
    specialization: row.specialization ? String(row.specialization) : null,
    bio: row.bio ? String(row.bio) : null,
    experienceYears: row.experience_years === null || row.experience_years === undefined ? null : Number(row.experience_years),
    consultationFee: row.consultation_fee === null || row.consultation_fee === undefined ? null : Number(row.consultation_fee),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function mapDoctorSlotRow(row: Record<string, unknown>): DoctorSlotRecord {
  return {
    slotId: String(row.id),
    doctorId: String(row.doctor_id),
    slotStart: new Date(String(row.slot_start)).toISOString(),
    slotEnd: new Date(String(row.slot_end)).toISOString(),
    isAvailable: Boolean(row.is_available),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function mapAppointmentRow(row: Record<string, unknown>): AppointmentRecord {
  return {
    appointmentId: String(row.id),
    doctorId: String(row.doctor_id),
    doctorName: String(row.doctor_name),
    patientUserId: String(row.patient_user_id),
    patientName: row.patient_name ? String(row.patient_name) : null,
    slotId: String(row.slot_id),
    slotStart: new Date(String(row.slot_start)).toISOString(),
    slotEnd: new Date(String(row.slot_end)).toISOString(),
    reason: String(row.reason),
    status: String(row.status) as AppointmentStatus,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function mapAppointmentMessageRow(row: Record<string, unknown>): AppointmentMessageRecord {
  return {
    messageId: String(row.id),
    appointmentId: String(row.appointment_id),
    senderId: String(row.sender_id),
    senderName: row.sender_name ? String(row.sender_name) : null,
    body: String(row.body),
    attachmentUrl: row.attachment_url ? String(row.attachment_url) : null,
    isRead: Boolean(row.is_read),
    readAt: row.read_at ? new Date(String(row.read_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function mapDonorChatMessageRow(row: Record<string, unknown>): DonorChatMessageRecord {
  return {
    messageId: String(row.id),
    roomKey: String(row.room_key),
    donorUserId: String(row.donor_user_id),
    requesterUserId: String(row.requester_user_id),
    senderId: String(row.sender_id),
    senderName: row.sender_name ? String(row.sender_name) : null,
    body: String(row.body),
    bloodGroup: row.blood_group ? String(row.blood_group) : null,
    urgencyLevel: row.urgency_level ? (String(row.urgency_level) as UrgencyLevel) : null,
    locationCity: row.location_city ? String(row.location_city) : null,
    donorVerified: Boolean(row.donor_verified),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}
