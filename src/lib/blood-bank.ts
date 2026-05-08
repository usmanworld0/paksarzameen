import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

export type BloodRequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type BloodRequestInput = {
  name: string;
  neededAt: string;
  cnic: string;
  location: string;
  volumeMl: number;
  contactNumber: string;
  bloodGroup?: string;
  notes?: string;
};

export type BloodRequestRecord = {
  id: string;
  name: string;
  neededAt: string;
  cnic: string;
  location: string;
  volumeMl: number;
  contactNumber: string;
  bloodGroup: string | null;
  notes: string | null;
  status: BloodRequestStatus;
  createdAt: string;
  updatedAt: string;
};

const VALID_STATUSES: BloodRequestStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
];

let didEnsureBloodBankSchema = false;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseBloodRequestPayload(payload: unknown): BloodRequestInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  const name = normalizeText(data.name);
  const neededAt = normalizeText(data.neededAt);
  const cnic = normalizeText(data.cnic);
  const location = normalizeText(data.location);
  const contactNumber = normalizeText(data.contactNumber);
  const bloodGroup = normalizeText(data.bloodGroup) || undefined;
  const notes = normalizeText(data.notes) || undefined;

  const volumeRaw = data.volumeMl;
  const volumeMl =
    typeof volumeRaw === "number"
      ? Math.floor(volumeRaw)
      : Number.parseInt(String(volumeRaw ?? ""), 10);

  if (!name) throw new Error("Name is required.");
  if (!neededAt || Number.isNaN(Date.parse(neededAt))) {
    throw new Error("Valid needed time is required.");
  }
  if (!cnic) throw new Error("CNIC is required.");
  if (!location) throw new Error("Location is required.");
  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    throw new Error("Volume must be greater than 0 ml.");
  }
  if (!contactNumber) throw new Error("Contact number is required.");

  return {
    name,
    neededAt,
    cnic,
    location,
    volumeMl,
    contactNumber,
    bloodGroup,
    notes,
  };
}

export function normalizeStatus(value: unknown): BloodRequestStatus {
  const status = String(value ?? "").toLowerCase() as BloodRequestStatus;
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status provided.");
  }
  return status;
}

export async function ensureBloodBankSchema() {
  if (didEnsureBloodBankSchema) return;

  const pool = getDbPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blood_bank_requests (
      id text PRIMARY KEY,
      name text NOT NULL,
      needed_at timestamptz NOT NULL,
      cnic text NOT NULL,
      location text NOT NULL,
      volume_ml integer NOT NULL,
      contact_number text NOT NULL,
      blood_group text,
      notes text,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS blood_bank_requests_status_idx
    ON blood_bank_requests (status);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS blood_bank_requests_needed_at_idx
    ON blood_bank_requests (needed_at);
  `);

  didEnsureBloodBankSchema = true;
}

export async function createBloodRequest(input: BloodRequestInput) {
  await ensureBloodBankSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
      INSERT INTO blood_bank_requests (
        id,
        name,
        needed_at,
        cnic,
        location,
        volume_ml,
        contact_number,
        blood_group,
        notes,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
      RETURNING
        id,
        name,
        needed_at,
        cnic,
        location,
        volume_ml,
        contact_number,
        blood_group,
        notes,
        status,
        created_at,
        updated_at;
    `,
    [
      randomUUID(),
      input.name,
      input.neededAt,
      input.cnic,
      input.location,
      input.volumeMl,
      input.contactNumber,
      input.bloodGroup ?? null,
      input.notes ?? null,
    ]
  );

  return mapRow(result.rows[0]);
}

export async function getBloodRequests() {
  await ensureBloodBankSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        needed_at,
        cnic,
        location,
        volume_ml,
        contact_number,
        blood_group,
        notes,
        status,
        created_at,
        updated_at
      FROM blood_bank_requests
      ORDER BY created_at DESC;
    `
  );

  return result.rows.map(mapRow);
}

export async function updateBloodRequestStatus(id: string, status: BloodRequestStatus) {
  await ensureBloodBankSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
      UPDATE blood_bank_requests
      SET status = $2,
          updated_at = now()
      WHERE id = $1
      RETURNING
        id,
        name,
        needed_at,
        cnic,
        location,
        volume_ml,
        contact_number,
        blood_group,
        notes,
        status,
        created_at,
        updated_at;
    `,
    [id, status]
  );

  if (!result.rows[0]) {
    throw new Error("Blood request not found.");
  }

  return mapRow(result.rows[0]);
}

function mapRow(row: Record<string, unknown>): BloodRequestRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    neededAt: new Date(String(row.needed_at)).toISOString(),
    cnic: String(row.cnic),
    location: String(row.location),
    volumeMl: Number(row.volume_ml),
    contactNumber: String(row.contact_number),
    bloodGroup: row.blood_group ? String(row.blood_group) : null,
    notes: row.notes ? String(row.notes) : null,
    status: String(row.status) as BloodRequestStatus,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}
