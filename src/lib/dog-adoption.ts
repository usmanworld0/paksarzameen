import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

export type DogStatus = "available" | "pending" | "adopted";
export type AdoptionRequestStatus = "pending" | "approved" | "rejected";

export type DogRecord = {
  dogId: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  city: string | null;
  area: string | null;
  description: string;
  imageUrl: string;
  status: DogStatus;
  createdBy?: string | null;
  updatedAt: string;
};

export type AdoptionRequestRecord = {
  requestId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogImageUrl: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  status: AdoptionRequestStatus;
  requestedAt: string;
};

export type DogPostAdoptionUpdateRecord = {
  updateId: string;
  dogId: string;
  dogName: string;
  imageUrl: string;
  caption: string;
  collarTag: string | null;
  uploadedAt: string;
  uploadedBy: string;
};

export type CreateDogInput = {
  name: string;
  breed: string;
  age: string;
  gender: string;
  city?: string | null;
  area?: string | null;
  description: string;
  imageUrl: string;
  status?: DogStatus;
};

export type UpdateDogInput = Partial<CreateDogInput>;

export type CreateDogUpdateInput = {
  dogId: string;
  imageUrl: string;
  caption: string;
  collarTag?: string | null;
  uploadedBy: string;
};

const DOG_STATUSES: DogStatus[] = ["available", "pending", "adopted"];
const REQUEST_STATUSES: AdoptionRequestStatus[] = ["pending", "approved", "rejected"];

let didEnsureDogAdoptionSchema = false;

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeDogStatus(value: unknown, fallback: DogStatus = "available"): DogStatus {
  const raw = normalizedText(value).toLowerCase();
  if (!raw) return fallback;
  if ((DOG_STATUSES as string[]).includes(raw)) {
    return raw as DogStatus;
  }
  throw new Error("Invalid dog status.");
}

export function normalizeAdoptionRequestStatus(value: unknown): AdoptionRequestStatus {
  const raw = normalizedText(value).toLowerCase();
  if ((REQUEST_STATUSES as string[]).includes(raw)) {
    return raw as AdoptionRequestStatus;
  }
  throw new Error("Invalid adoption request status.");
}

export function parseCreateDogPayload(payload: unknown): CreateDogInput {
  const data = (payload ?? {}) as Record<string, unknown>;

  const name = normalizedText(data.name);
  const breed = normalizedText(data.breed);
  const age = normalizedText(data.age);
  const gender = normalizedText(data.gender);
  const description = normalizedText(data.description);
  const imageUrl = normalizedText(data.imageUrl);
  const status = normalizeDogStatus(data.status, "available");
  const city = normalizedText(data.city) || null;
  const area = normalizedText(data.area) || null;

  if (!name) throw new Error("Dog name is required.");
  if (!breed) throw new Error("Breed is required.");
  if (!age) throw new Error("Age is required.");
  if (!gender) throw new Error("Gender is required.");
  if (!description) throw new Error("Description is required.");
  if (!imageUrl) throw new Error("Image URL is required.");

  return {
    name,
    breed,
    age,
    gender,
    city,
    area,
    description,
    imageUrl,
    status,
  };
}

export function parseUpdateDogPayload(payload: unknown): UpdateDogInput {
  const data = (payload ?? {}) as Record<string, unknown>;
  const next: UpdateDogInput = {};

  if ("name" in data) {
    const name = normalizedText(data.name);
    if (!name) throw new Error("Dog name cannot be empty.");
    next.name = name;
  }
  if ("breed" in data) {
    const breed = normalizedText(data.breed);
    if (!breed) throw new Error("Breed cannot be empty.");
    next.breed = breed;
  }
  if ("age" in data) {
    const age = normalizedText(data.age);
    if (!age) throw new Error("Age cannot be empty.");
    next.age = age;
  }
  if ("gender" in data) {
    const gender = normalizedText(data.gender);
    if (!gender) throw new Error("Gender cannot be empty.");
    next.gender = gender;
  }
  if ("description" in data) {
    const description = normalizedText(data.description);
    if (!description) throw new Error("Description cannot be empty.");
    next.description = description;
  }
  if ("city" in data) {
    const city = normalizedText(data.city) || null;
    next.city = city;
  }
  if ("area" in data) {
    const area = normalizedText(data.area) || null;
    next.area = area;
  }
  if ("imageUrl" in data) {
    const imageUrl = normalizedText(data.imageUrl);
    if (!imageUrl) throw new Error("Image URL cannot be empty.");
    next.imageUrl = imageUrl;
  }
  if ("status" in data) {
    next.status = normalizeDogStatus(data.status);
  }

  if (!Object.keys(next).length) {
    throw new Error("No updates provided.");
  }

  return next;
}

export async function ensureDogAdoptionSchema() {
  if (didEnsureDogAdoptionSchema) return;

  const pool = getDbPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dogs (
      id text PRIMARY KEY,
      name text NOT NULL,
      breed text NOT NULL,
      age text NOT NULL,
      gender text NOT NULL,
      city text,
      area text,
      description text NOT NULL,
      image_url text NOT NULL,
      created_by text,
      status text NOT NULL DEFAULT 'available',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT dogs_status_check CHECK (status IN ('available', 'pending', 'adopted'))
    );
  `);

  // Ensure columns exist for older deployments
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS city text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS area text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS created_by text;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adoption_requests (
      id text PRIMARY KEY,
      dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status text NOT NULL DEFAULT 'pending',
      requested_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT adoption_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_post_adoption_updates (
      id text PRIMARY KEY,
      dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      image_url text NOT NULL,
      caption text NOT NULL,
      collar_tag text,
      uploaded_at timestamptz NOT NULL DEFAULT now(),
      uploaded_by text NOT NULL
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS dogs_status_idx
    ON dogs (status);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS adoption_requests_dog_id_idx
    ON adoption_requests (dog_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS adoption_requests_user_id_idx
    ON adoption_requests (user_id);
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS adoption_requests_pending_unique_idx
    ON adoption_requests (dog_id)
    WHERE status = 'pending';
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS dog_post_updates_dog_id_idx
    ON dog_post_adoption_updates (dog_id, uploaded_at DESC);
  `);

  didEnsureDogAdoptionSchema = true;
}

export async function listDogs(statuses?: DogStatus[]) {
  return listDogsWithFilters(statuses);
}

export async function listDogsWithFilters(statuses?: DogStatus[], city?: string | null, area?: string | null) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const where: string[] = [];
  const params: unknown[] = [];

  if (statuses?.length) {
    params.push(statuses);
    where.push(`status = ANY($${params.length}::text[])`);
  }

  if (city) {
    params.push(city);
    where.push(`city = $${params.length}`);
  }

  if (area) {
    params.push(area);
    where.push(`area = $${params.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const result = await pool.query(
    `
    SELECT id, name, breed, age, gender, city, area, description, image_url, created_by, status, created_at, updated_at
    FROM dogs
    ${whereClause}
    ORDER BY created_at DESC;
    `,
    params
  );

  return result.rows.map(mapDogRow);
}

export async function getDogById(dogId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    SELECT id, name, breed, age, gender, description, image_url, status, created_at, updated_at
    FROM dogs
    WHERE id = $1
    LIMIT 1;
    `,
    [dogId]
  );

  if (!result.rows[0]) return null;
  return mapDogRow(result.rows[0]);
}

export async function createDog(input: CreateDogInput) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    INSERT INTO dogs (
      id, name, breed, age, gender, city, area, description, image_url, created_by, status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id, name, breed, age, gender, city, area, description, image_url, created_by, status, created_at, updated_at;
    `,
    [
      randomUUID(),
      input.name,
      input.breed,
      input.age,
      input.gender,
      input.city ?? null,
      input.area ?? null,
      input.description,
      input.imageUrl,
      input.createdBy ?? null,
      input.status ?? "available",
    ]
  );

  return mapDogRow(result.rows[0]);
}

export async function updateDog(dogId: string, input: UpdateDogInput) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const updates: string[] = [];
  const params: unknown[] = [dogId];

  if (input.name) {
    params.push(input.name);
    updates.push(`name = $${params.length}`);
  }
  if (input.breed) {
    params.push(input.breed);
    updates.push(`breed = $${params.length}`);
  }
  if (input.age) {
    params.push(input.age);
    updates.push(`age = $${params.length}`);
  }
  if (input.gender) {
    params.push(input.gender);
    updates.push(`gender = $${params.length}`);
  }
  if (input.description) {
    params.push(input.description);
    updates.push(`description = $${params.length}`);
  }
  if (input.imageUrl) {
    params.push(input.imageUrl);
    updates.push(`image_url = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "city")) {
    params.push(input.city ?? null);
    updates.push(`city = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "area")) {
    params.push(input.area ?? null);
    updates.push(`area = $${params.length}`);
  }
  if (input.status) {
    params.push(input.status);
    updates.push(`status = $${params.length}`);
  }

  if (!updates.length) {
    throw new Error("No updates provided.");
  }

  const result = await pool.query(
    `
    UPDATE dogs
    SET ${updates.join(", ")},
        updated_at = now()
    WHERE id = $1
    RETURNING id, name, breed, age, gender, description, image_url, status, created_at, updated_at;
    `,
    params
  );

  if (!result.rows[0]) {
    throw new Error("Dog not found.");
  }

  return mapDogRow(result.rows[0]);
}

export async function deleteDog(dogId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();
  await pool.query(`DELETE FROM dogs WHERE id = $1`, [dogId]);
}

export async function createAdoptionRequest(dogId: string, userId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dogResult = await client.query(
      `SELECT id, status FROM dogs WHERE id = $1 LIMIT 1 FOR UPDATE`,
      [dogId]
    );

    if (!dogResult.rows[0]) {
      throw new Error("Dog not found.");
    }

    const currentStatus = String(dogResult.rows[0].status) as DogStatus;
    if (currentStatus !== "available") {
      throw new Error("Dog is no longer available for adoption.");
    }

    const existingForUser = await client.query(
      `
      SELECT id
      FROM adoption_requests
      WHERE dog_id = $1 AND user_id = $2
      LIMIT 1;
      `,
      [dogId, userId]
    );

    if (existingForUser.rows[0]) {
      throw new Error("You have already submitted a request for this dog.");
    }

    const requestResult = await client.query(
      `
      INSERT INTO adoption_requests (id, dog_id, user_id, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING id, dog_id, user_id, status, requested_at;
      `,
      [randomUUID(), dogId, userId]
    );

    await client.query(
      `
      UPDATE dogs
      SET status = 'pending',
          updated_at = now()
      WHERE id = $1;
      `,
      [dogId]
    );

    await client.query("COMMIT");

    return {
      requestId: String(requestResult.rows[0].id),
      dogId: String(requestResult.rows[0].dog_id),
      userId: String(requestResult.rows[0].user_id),
      status: String(requestResult.rows[0].status) as AdoptionRequestStatus,
      requestedAt: new Date(String(requestResult.rows[0].requested_at)).toISOString(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listAdoptionRequests() {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(`
    SELECT
      ar.id,
      ar.dog_id,
      ar.user_id,
      ar.status,
      ar.requested_at,
      d.name AS dog_name,
      d.breed AS dog_breed,
      d.image_url AS dog_image_url,
      u.name AS user_name,
      u.email AS user_email
    FROM adoption_requests ar
    INNER JOIN dogs d ON d.id = ar.dog_id
    LEFT JOIN users u ON u.id = ar.user_id
    ORDER BY ar.requested_at DESC;
  `);

  return result.rows.map(mapAdoptionRequestRow);
}

export async function listMyAdoptionRequests(userId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    SELECT
      ar.id,
      ar.dog_id,
      ar.user_id,
      ar.status,
      ar.requested_at,
      d.name AS dog_name,
      d.breed AS dog_breed,
      d.image_url AS dog_image_url,
      u.name AS user_name,
      u.email AS user_email
    FROM adoption_requests ar
    INNER JOIN dogs d ON d.id = ar.dog_id
    LEFT JOIN users u ON u.id = ar.user_id
    WHERE ar.user_id = $1
    ORDER BY ar.requested_at DESC;
    `,
    [userId]
  );

  return result.rows.map(mapAdoptionRequestRow);
}

export async function reviewAdoptionRequest(
  requestId: string,
  status: AdoptionRequestStatus
) {
  if (status === "pending") {
    throw new Error("Pending is not a valid review action.");
  }

  await ensureDogAdoptionSchema();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const requestResult = await client.query(
      `
      SELECT id, dog_id, status
      FROM adoption_requests
      WHERE id = $1
      LIMIT 1
      FOR UPDATE;
      `,
      [requestId]
    );

    const current = requestResult.rows[0];
    if (!current) {
      throw new Error("Adoption request not found.");
    }

    const dogId = String(current.dog_id);

    await client.query(
      `
      UPDATE adoption_requests
      SET status = $2
      WHERE id = $1;
      `,
      [requestId, status]
    );

    if (status === "approved") {
      await client.query(
        `
        UPDATE dogs
        SET status = 'adopted',
            updated_at = now()
        WHERE id = $1;
        `,
        [dogId]
      );

      await client.query(
        `
        UPDATE adoption_requests
        SET status = 'rejected'
        WHERE dog_id = $1 AND id <> $2 AND status = 'pending';
        `,
        [dogId, requestId]
      );
    }

    if (status === "rejected") {
      const pendingResult = await client.query(
        `
        SELECT 1
        FROM adoption_requests
        WHERE dog_id = $1 AND status = 'pending'
        LIMIT 1;
        `,
        [dogId]
      );

      if (!pendingResult.rows[0]) {
        await client.query(
          `
          UPDATE dogs
          SET status = 'available',
              updated_at = now()
          WHERE id = $1 AND status <> 'adopted';
          `,
          [dogId]
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listDogPostAdoptionUpdates(dogId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    SELECT
      dpu.id,
      dpu.dog_id,
      d.name AS dog_name,
      dpu.image_url,
      dpu.caption,
      dpu.collar_tag,
      dpu.uploaded_at,
      dpu.uploaded_by
    FROM dog_post_adoption_updates dpu
    INNER JOIN dogs d ON d.id = dpu.dog_id
    WHERE dpu.dog_id = $1
    ORDER BY dpu.uploaded_at DESC;
    `,
    [dogId]
  );

  return result.rows.map(mapDogPostAdoptionUpdateRow);
}

export async function listAllDogPostAdoptionUpdates() {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(`
    SELECT
      dpu.id,
      dpu.dog_id,
      d.name AS dog_name,
      dpu.image_url,
      dpu.caption,
      dpu.collar_tag,
      dpu.uploaded_at,
      dpu.uploaded_by
    FROM dog_post_adoption_updates dpu
    INNER JOIN dogs d ON d.id = dpu.dog_id
    ORDER BY dpu.uploaded_at DESC;
  `);

  return result.rows.map(mapDogPostAdoptionUpdateRow);
}

export async function createDogPostAdoptionUpdate(input: CreateDogUpdateInput) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const dogResult = await pool.query(
    `
    SELECT id, status
    FROM dogs
    WHERE id = $1
    LIMIT 1;
    `,
    [input.dogId]
  );

  const dog = dogResult.rows[0];
  if (!dog) {
    throw new Error("Dog not found.");
  }
  if (String(dog.status) !== "adopted") {
    throw new Error("Only adopted dogs can receive post-adoption updates.");
  }

  const caption = normalizedText(input.caption);
  const imageUrl = normalizedText(input.imageUrl);
  const collarTag = normalizedText(input.collarTag ?? "") || null;

  if (!caption) {
    throw new Error("Caption is required.");
  }
  if (!imageUrl) {
    throw new Error("Image URL is required.");
  }

  const result = await pool.query(
    `
    INSERT INTO dog_post_adoption_updates (
      id,
      dog_id,
      image_url,
      caption,
      collar_tag,
      uploaded_by
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING
      id,
      dog_id,
      image_url,
      caption,
      collar_tag,
      uploaded_at,
      uploaded_by;
    `,
    [randomUUID(), input.dogId, imageUrl, caption, collarTag, input.uploadedBy]
  );

  const full = await pool.query(
    `
    SELECT
      dpu.id,
      dpu.dog_id,
      d.name AS dog_name,
      dpu.image_url,
      dpu.caption,
      dpu.collar_tag,
      dpu.uploaded_at,
      dpu.uploaded_by
    FROM dog_post_adoption_updates dpu
    INNER JOIN dogs d ON d.id = dpu.dog_id
    WHERE dpu.id = $1
    LIMIT 1;
    `,
    [String(result.rows[0].id)]
  );

  return mapDogPostAdoptionUpdateRow(full.rows[0]);
}

export async function deleteDogPostAdoptionUpdate(updateId: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
    DELETE FROM dog_post_adoption_updates
    WHERE id = $1
    RETURNING id;
    `,
    [updateId]
  );

  if (!result.rows[0]) {
    throw new Error("Update not found.");
  }
}

function mapDogRow(row: Record<string, unknown>): DogRecord {
  return {
    dogId: String(row.id),
    name: String(row.name),
    breed: String(row.breed),
    age: String(row.age),
    gender: String(row.gender),
    city: row.city ? String(row.city) : null,
    area: row.area ? String(row.area) : null,
    description: String(row.description),
    imageUrl: String(row.image_url),
    status: String(row.status) as DogStatus,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function mapAdoptionRequestRow(row: Record<string, unknown>): AdoptionRequestRecord {
  return {
    requestId: String(row.id),
    dogId: String(row.dog_id),
    dogName: String(row.dog_name),
    dogBreed: String(row.dog_breed),
    dogImageUrl: String(row.dog_image_url),
    userId: String(row.user_id),
    userName: row.user_name ? String(row.user_name) : null,
    userEmail: row.user_email ? String(row.user_email) : null,
    status: String(row.status) as AdoptionRequestStatus,
    requestedAt: new Date(String(row.requested_at)).toISOString(),
  };
}

function mapDogPostAdoptionUpdateRow(
  row: Record<string, unknown>
): DogPostAdoptionUpdateRecord {
  return {
    updateId: String(row.id),
    dogId: String(row.dog_id),
    dogName: String(row.dog_name),
    imageUrl: String(row.image_url),
    caption: String(row.caption),
    collarTag: row.collar_tag ? String(row.collar_tag) : null,
    uploadedAt: new Date(String(row.uploaded_at)).toISOString(),
    uploadedBy: String(row.uploaded_by),
  };
}
