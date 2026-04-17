import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type DoctorRecord = {
  doctorId: string;
  userId: string | null;
  email: string;
  fullName: string;
  specialization: string | null;
  bio: string | null;
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
  createdAt: string;
};

const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

let didEnsureHealthCareSchema = false;

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

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
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT healthcare_appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_appointment_messages (
      id text PRIMARY KEY,
      appointment_id text NOT NULL REFERENCES healthcare_appointments(id) ON DELETE CASCADE,
      sender_id text NOT NULL,
      sender_name text,
      body text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS healthcare_blood_donor_chats (
      id text PRIMARY KEY,
      room_key text NOT NULL,
      donor_user_id uuid NOT NULL,
      requester_user_id uuid NOT NULL,
      sender_id text NOT NULL,
      sender_name text,
      body text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_doctors_user_id_idx ON healthcare_doctors (user_id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_slots_doctor_id_idx ON healthcare_doctor_slots (doctor_id, slot_start DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointments_doctor_idx ON healthcare_appointments (doctor_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointments_patient_idx ON healthcare_appointments (patient_user_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_appointment_messages_idx ON healthcare_appointment_messages (appointment_id, created_at ASC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_room_idx ON healthcare_blood_donor_chats (room_key, created_at ASC);`);

  didEnsureHealthCareSchema = true;
}

export async function listDoctors() {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(`
    SELECT id, user_id, email, full_name, specialization, bio, created_at, updated_at
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
    SELECT id, user_id, email, full_name, specialization, bio, created_at, updated_at
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
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    INSERT INTO healthcare_doctors (id, user_id, email, full_name, specialization, bio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, email, full_name, specialization, bio, created_at, updated_at;
    `,
    [
      randomUUID(),
      input.userId ?? null,
      normalizedText(input.email).toLowerCase(),
      normalizedText(input.fullName),
      normalizedText(input.specialization) || null,
      normalizedText(input.bio) || null,
    ]
  );

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
  if (end <= start) {
    throw new Error("Slot end must be after slot start.");
  }

  const result = await pool.query(
    `
    INSERT INTO healthcare_doctor_slots (id, doctor_id, slot_start, slot_end, is_available)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, doctor_id, slot_start, slot_end, is_available, created_at;
    `,
    [randomUUID(), doctorId, start.toISOString(), end.toISOString()]
  );

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
    return getAppointmentById(String(appointmentResult.rows[0].id));
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
  await pool.query(
    `
    UPDATE healthcare_appointments
    SET status = $2,
        updated_at = now()
    WHERE id = $1;
    `,
    [appointmentId, status]
  );

  const updated = await getAppointmentById(appointmentId);
  if (!updated) throw new Error("Appointment not found.");
  return updated;
}

export async function listAppointmentMessages(appointmentId: string) {
  await ensureHealthCareSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
    SELECT id, appointment_id, sender_id, sender_name, body, created_at
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
  body: string
) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const content = normalizedText(body);
  if (!content) throw new Error("Message body is required.");

  const result = await pool.query(
    `
    INSERT INTO healthcare_appointment_messages (id, appointment_id, sender_id, sender_name, body)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, appointment_id, sender_id, sender_name, body, created_at;
    `,
    [randomUUID(), appointmentId, senderId, senderName, content]
  );

  return mapAppointmentMessageRow(result.rows[0]);
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
    SELECT id, room_key, donor_user_id, requester_user_id, sender_id, sender_name, body, created_at
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
}) {
  await ensureHealthCareSchema();
  const pool = getDbPool();

  const content = normalizedText(input.body);
  if (!content) throw new Error("Message body is required.");

  const roomKey = getDonorRoomKey(input.requesterUserId, input.donorUserId);
  const result = await pool.query(
    `
    INSERT INTO healthcare_blood_donor_chats (
      id,
      room_key,
      donor_user_id,
      requester_user_id,
      sender_id,
      sender_name,
      body
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, room_key, donor_user_id, requester_user_id, sender_id, sender_name, body, created_at;
    `,
    [
      randomUUID(),
      roomKey,
      input.donorUserId,
      input.requesterUserId,
      input.senderId,
      input.senderName,
      content,
    ]
  );

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
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}
