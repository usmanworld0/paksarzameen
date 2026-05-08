import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

let didEnsureDogMessagesSchema = false;

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function ensureDogMessagesSchema() {
  if (didEnsureDogMessagesSchema) return;
  const pool = getDbPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_messages (
      id text PRIMARY KEY,
      dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      sender_id text NOT NULL,
      sender_name text,
      body text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS dog_messages_dog_id_idx
    ON dog_messages (dog_id, created_at DESC);
  `);

  didEnsureDogMessagesSchema = true;
}

export type DogMessageRecord = {
  id: string;
  dogId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  createdAt: string;
};

export async function listDogMessages(dogId: string) {
  await ensureDogMessagesSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    SELECT id, dog_id, sender_id, sender_name, body, created_at
    FROM dog_messages
    WHERE dog_id = $1
    ORDER BY created_at ASC;
    `,
    [dogId]
  );

  return result.rows.map((r) => ({
    id: String(r.id),
    dogId: String(r.dog_id),
    senderId: String(r.sender_id),
    senderName: r.sender_name ? String(r.sender_name) : null,
    body: String(r.body),
    createdAt: new Date(String(r.created_at)).toISOString(),
  })) as DogMessageRecord[];
}

export async function createDogMessage(dogId: string, senderId: string, senderName: string | null, body: string) {
  await ensureDogMessagesSchema();
  const pool = getDbPool();

  const text = normalizedText(body);
  if (!text) throw new Error("Message body is required.");

  const result = await pool.query(
    `
    INSERT INTO dog_messages (id, dog_id, sender_id, sender_name, body)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, dog_id, sender_id, sender_name, body, created_at;
    `,
    [randomUUID(), dogId, senderId, senderName, text]
  );

  const row = result.rows[0];
  return {
    id: String(row.id),
    dogId: String(row.dog_id),
    senderId: String(row.sender_id),
    senderName: row.sender_name ? String(row.sender_name) : null,
    body: String(row.body),
    createdAt: new Date(String(row.created_at)).toISOString(),
  } as DogMessageRecord;
}
