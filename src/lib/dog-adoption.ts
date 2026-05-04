import { randomUUID } from "crypto";
import { getDbPool } from "@/lib/db";

export type DogStatus = "available" | "pending" | "adopted";
export type AdoptionRequestStatus = "pending" | "approved" | "rejected";

export type DogRecord = {
  dogId: string;
  rescueName: string;
  petName: string | null;
  name: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  locationKey: string | null;
  locationLabel: string | null;
  province: string | null;
  city: string | null;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string;
  imageUrl: string;
  adoptedByUserId: string | null;
  petNamedByUserId: string | null;
  earTagStyleImageUrl: string | null;
  earTagColorTitle: string | null;
  earTagBoundaryImageUrl: string | null;
  status: DogStatus;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdoptionRequestRecord = {
  requestId: string;
  dogId: string;
  dogName: string;
  petName: string | null;
  dogBreed: string;
  dogColor: string;
  dogImageUrl: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  applicantName: string | null;
  applicantPhone: string | null;
  whatsappNumber: string | null;
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
  name?: string;
  breed?: string;
  color: string;
  age: string;
  gender: string;
  locationKey?: string | null;
  locationLabel?: string | null;
  province?: string | null;
  city?: string | null;
  area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description: string;
  imageUrl: string;
  createdBy?: string | null;
  status?: DogStatus;
};

export type UpdateDogInput = Partial<CreateDogInput>;

export type EarTagImageOption = {
  title: string;
  imageUrl: string;
};

export type ColorOption = {
  title: string;
  imageUrl: string;
  textColor?: string; // optional text label color
};

export type EarTagGlobalConfigRecord = {
  styleOptions: EarTagImageOption[];
  styleImages: string[];
  colorOptions: ColorOption[];
  legacyColorOptions?: string[]; // backward compatibility
  boundaryOptions: EarTagImageOption[];
  boundaryImages: string[];
  updatedAt: string;
  updatedBy: string | null;
};

export type UpdateEarTagGlobalConfigInput = {
  styleOptions?: EarTagImageOption[];
  styleImages?: string[];
  colorOptions?: ColorOption[];
  legacyColorOptions?: string[];
  boundaryOptions?: EarTagImageOption[];
  boundaryImages?: string[];
  updatedBy: string | null;
};

export type UpdateDogEarTagCustomizationInput = {
  styleImageUrl: string;
  colorTitle: string;
  boundaryImageUrl: string;
};

export type AdoptedDogRecord = {
  dogId: string;
  dogName: string;
  rescueName: string;
  petName: string | null;
  breed: string;
  color: string;
  age: string;
  gender: string;
  locationKey: string | null;
  locationLabel: string | null;
  province: string | null;
  city: string | null;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string;
  ownerName: string | null;
  ownerEmail: string | null;
  adoptedAt: string;
};

export type CreateDogUpdateInput = {
  dogId: string;
  imageUrl: string;
  caption: string;
  collarTag?: string | null;
  uploadedBy: string;
};

const DOG_STATUSES: DogStatus[] = ["available", "pending", "adopted"];
const REQUEST_STATUSES: AdoptionRequestStatus[] = ["pending", "approved", "rejected"];
const DEFAULT_DOG_IMAGE_URL = "/images/placeholders/10.png";
const EAR_TAG_CONFIG_ID = "global";

let didEnsureDogAdoptionSchema = false;

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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

  const breed = normalizedText(data.breed);
  const color = normalizedText(data.color);
  const age = normalizedText(data.age);
  const gender = normalizedText(data.gender);
  const description = normalizedText(data.description);
  const imageUrl = normalizedText(data.imageUrl) || DEFAULT_DOG_IMAGE_URL;
  const status = normalizeDogStatus(data.status, "available");
  const locationKey = normalizedText(data.locationKey) || null;
  const locationLabel = normalizedText(data.locationLabel) || null;
  const province = normalizedText(data.province) || null;
  const city = normalizedText(data.city) || null;
  const area = normalizedText(data.area) || null;
  const latitude = normalizedNumber(data.latitude);
  const longitude = normalizedNumber(data.longitude);

  if (!color) throw new Error("Color is required.");
  if (!age) throw new Error("Age is required.");
  if (!gender) throw new Error("Gender is required.");
  if (!description) throw new Error("Description is required.");
  return {
    name: normalizedText(data.name) || undefined,
    breed: breed || "",
    color,
    age,
    gender,
    locationKey,
    locationLabel,
    province,
    city,
    area,
    latitude,
    longitude,
    description,
    imageUrl,
    status,
  };
}

export function parseUpdateDogPayload(payload: unknown): UpdateDogInput {
  const data = (payload ?? {}) as Record<string, unknown>;
  const next: UpdateDogInput = {};

  if ("name" in data) {
    throw new Error("Dog naming is adopter-managed and cannot be edited by admin.");
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
  if ("color" in data) {
    const color = normalizedText(data.color);
    if (!color) throw new Error("Color cannot be empty.");
    next.color = color;
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
  if ("locationKey" in data) {
    next.locationKey = normalizedText(data.locationKey) || null;
  }
  if ("locationLabel" in data) {
    next.locationLabel = normalizedText(data.locationLabel) || null;
  }
  if ("province" in data) {
    next.province = normalizedText(data.province) || null;
  }
  if ("city" in data) {
    const city = normalizedText(data.city) || null;
    next.city = city;
  }
  if ("area" in data) {
    const area = normalizedText(data.area) || null;
    next.area = area;
  }
  if ("latitude" in data) {
    next.latitude = normalizedNumber(data.latitude);
  }
  if ("longitude" in data) {
    next.longitude = normalizedNumber(data.longitude);
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
      rescue_name text,
      pet_name text,
      pet_named_by_user_id uuid,
      pet_named_at timestamptz,
      breed text NOT NULL,
      color text,
      age text NOT NULL,
      gender text NOT NULL,
      location_key text,
      location_label text,
      province text,
      city text,
      area text,
      latitude double precision,
      longitude double precision,
      description text NOT NULL,
      image_url text NOT NULL,
      created_by text,
      adopted_by_user_id uuid,
      ear_tag_style_image_url text,
      ear_tag_color text,
      ear_tag_boundary_image_url text,
      ear_tag_customized_at timestamptz,
      status text NOT NULL DEFAULT 'available',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT dogs_status_check CHECK (status IN ('available', 'pending', 'adopted'))
    );
  `);

  // Ensure columns exist for older deployments
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS location_key text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS location_label text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS province text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS city text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS area text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS latitude double precision;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS longitude double precision;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS created_by text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS rescue_name text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS pet_name text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS pet_named_by_user_id uuid;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS pet_named_at timestamptz;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS color text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS adopted_by_user_id uuid;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS ear_tag_style_image_url text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS ear_tag_color text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS ear_tag_boundary_image_url text;`);
  await pool.query(`ALTER TABLE dogs ADD COLUMN IF NOT EXISTS ear_tag_customized_at timestamptz;`);
  await pool.query(`UPDATE dogs SET rescue_name = name WHERE rescue_name IS NULL OR rescue_name = '';`);
  await pool.query(`UPDATE dogs SET color = 'Unknown' WHERE color IS NULL OR color = '';`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dog_ear_tag_global_config (
      id text PRIMARY KEY,
      style_images jsonb NOT NULL DEFAULT '[]'::jsonb,
      color_options jsonb NOT NULL DEFAULT '[]'::jsonb,
      boundary_images jsonb NOT NULL DEFAULT '[]'::jsonb,
      updated_by text,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(
    `
      INSERT INTO dog_ear_tag_global_config (id, style_images, color_options, boundary_images)
      VALUES ($1, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
      ON CONFLICT (id) DO NOTHING;
    `,
    [EAR_TAG_CONFIG_ID]
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS adoption_requests (
      id text PRIMARY KEY,
      dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      whatsapp_number text,
      status text NOT NULL DEFAULT 'pending',
      requested_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT adoption_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
    );
  `);

  await pool.query(`ALTER TABLE adoption_requests ADD COLUMN IF NOT EXISTS whatsapp_number text;`);

  // Allow unauthenticated (walk-in) applicants — make user_id nullable
  await pool.query(`ALTER TABLE adoption_requests ALTER COLUMN user_id DROP NOT NULL;`);
  // Drop FK so auth user IDs not in the public users table don't cause constraint violations
  await pool.query(`ALTER TABLE adoption_requests DROP CONSTRAINT IF EXISTS adoption_requests_user_id_fkey;`);
  await pool.query(`ALTER TABLE adoption_requests ADD COLUMN IF NOT EXISTS applicant_name text;`);
  await pool.query(`ALTER TABLE adoption_requests ADD COLUMN IF NOT EXISTS applicant_phone text;`);
  // Proposed nickname the adopter wants to give the dog
  await pool.query(`ALTER TABLE adoption_requests ADD COLUMN IF NOT EXISTS proposed_pet_name text;`);

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
    SELECT
      id,
      name,
      rescue_name,
      pet_name,
      pet_named_by_user_id,
      breed,
      color,
      age,
      gender,
      location_key,
      location_label,
      province,
      city,
      area,
      latitude,
      longitude,
      description,
      image_url,
      adopted_by_user_id,
      ear_tag_style_image_url,
      ear_tag_color,
      ear_tag_boundary_image_url,
      created_by,
      status,
      created_at,
      updated_at
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
    SELECT
      id,
      name,
      rescue_name,
      pet_name,
      pet_named_by_user_id,
      breed,
      color,
      age,
      gender,
      location_key,
      location_label,
      province,
      city,
      area,
      latitude,
      longitude,
      description,
      image_url,
      adopted_by_user_id,
      ear_tag_style_image_url,
      ear_tag_color,
      ear_tag_boundary_image_url,
      status,
      created_at,
      updated_at
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
  const rescueName = input.name ?? `Rescue-${randomUUID().slice(0, 8).toUpperCase()}`;

  const result = await pool.query(
    `
    INSERT INTO dogs (
      id, name, rescue_name, breed, color, age, gender, location_key, location_label, province, city, area, latitude, longitude, description, image_url, created_by, status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING
      id, name, rescue_name, pet_name, pet_named_by_user_id, breed, color, age, gender, location_key, location_label, province, city, area, latitude, longitude, description,
      image_url, adopted_by_user_id, ear_tag_style_image_url, ear_tag_color, ear_tag_boundary_image_url,
      created_by, status, created_at, updated_at;
    `,
    [
      randomUUID(),
      rescueName,
      rescueName,
      input.breed ?? "",
      input.color,
      input.age,
      input.gender,
      input.locationKey ?? null,
      input.locationLabel ?? null,
      input.province ?? null,
      input.city ?? null,
      input.area ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
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

  if (input.breed) {
    params.push(input.breed);
    updates.push(`breed = $${params.length}`);
  }
  if (input.color) {
    params.push(input.color);
    updates.push(`color = $${params.length}`);
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
  if (Object.prototype.hasOwnProperty.call(input, "locationKey")) {
    params.push(input.locationKey ?? null);
    updates.push(`location_key = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "locationLabel")) {
    params.push(input.locationLabel ?? null);
    updates.push(`location_label = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "province")) {
    params.push(input.province ?? null);
    updates.push(`province = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "latitude")) {
    params.push(input.latitude ?? null);
    updates.push(`latitude = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(input, "longitude")) {
    params.push(input.longitude ?? null);
    updates.push(`longitude = $${params.length}`);
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
    RETURNING
      id, name, rescue_name, pet_name, pet_named_by_user_id, breed, color, age, gender, location_key, location_label, province, city, area, latitude, longitude, description,
      image_url, adopted_by_user_id, ear_tag_style_image_url, ear_tag_color, ear_tag_boundary_image_url,
      status, created_at, updated_at;
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

export async function isPetNameAvailable(proposedName: string): Promise<boolean> {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const name = normalizedText(proposedName).toLowerCase();
  if (!name) return false;

  const dogCheck = await pool.query(
    `SELECT id FROM dogs WHERE LOWER(pet_name) = $1 LIMIT 1`,
    [name]
  );
  if (dogCheck.rows[0]) return false;

  const requestCheck = await pool.query(
    `SELECT id FROM adoption_requests
     WHERE LOWER(proposed_pet_name) = $1
       AND status IN ('pending', 'approved')
     LIMIT 1`,
    [name]
  );
  return !requestCheck.rows[0];
}

export async function createAdoptionRequest(
  dogId: string,
  applicantInput: {
    userId?: string | null;
    applicantName: string;
    applicantPhone: string;
    proposedPetName?: string | null;
  }
) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();
  const client = await pool.connect();

  const applicantName = normalizedText(applicantInput.applicantName);
  const applicantPhone = normalizedText(applicantInput.applicantPhone);
  const proposedPetName = normalizedText(applicantInput.proposedPetName ?? "") || null;
  const userId = applicantInput.userId ?? null;

  if (!applicantName) throw new Error("Full name is required.");
  if (!applicantPhone) throw new Error("Phone number is required.");

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

    // Prevent duplicate submissions from the same phone number
    const existingForPhone = await client.query(
      `SELECT id FROM adoption_requests WHERE dog_id = $1 AND applicant_phone = $2 LIMIT 1;`,
      [dogId, applicantPhone]
    );
    if (existingForPhone.rows[0]) {
      throw new Error("You have already submitted a request for this dog.");
    }

    // Ensure the proposed nickname is globally unique
    if (proposedPetName) {
      const nameLower = proposedPetName.toLowerCase();
      const dogNameCheck = await client.query(
        `SELECT id FROM dogs WHERE LOWER(pet_name) = $1 LIMIT 1`,
        [nameLower]
      );
      if (dogNameCheck.rows[0]) {
        throw new Error(`The nickname "${proposedPetName}" is already taken by another dog.`);
      }
      const reqNameCheck = await client.query(
        `SELECT id FROM adoption_requests
         WHERE LOWER(proposed_pet_name) = $1
           AND status IN ('pending', 'approved')
         LIMIT 1`,
        [nameLower]
      );
      if (reqNameCheck.rows[0]) {
        throw new Error(`The nickname "${proposedPetName}" is already reserved by another adoption request.`);
      }
    }

    const requestResult = await client.query(
      `
      INSERT INTO adoption_requests (id, dog_id, user_id, applicant_name, applicant_phone, proposed_pet_name, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id, dog_id, user_id, applicant_name, applicant_phone, proposed_pet_name, status, requested_at;
      `,
      [randomUUID(), dogId, userId, applicantName, applicantPhone, proposedPetName]
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
      userId: requestResult.rows[0].user_id ? String(requestResult.rows[0].user_id) : null,
      applicantName: requestResult.rows[0].applicant_name ? String(requestResult.rows[0].applicant_name) : null,
      applicantPhone: requestResult.rows[0].applicant_phone ? String(requestResult.rows[0].applicant_phone) : null,
      proposedPetName: requestResult.rows[0].proposed_pet_name ? String(requestResult.rows[0].proposed_pet_name) : null,
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
      ar.applicant_name,
      ar.applicant_phone,
      ar.status,
      ar.requested_at,
      ar.whatsapp_number,
      COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
      d.pet_name AS pet_name,
      d.breed AS dog_breed,
      d.color AS dog_color,
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
      ar.applicant_name,
      ar.applicant_phone,
      ar.status,
      ar.requested_at,
      ar.whatsapp_number,
      COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
      d.pet_name AS pet_name,
      d.breed AS dog_breed,
      d.color AS dog_color,
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
      SELECT id, dog_id, user_id, status
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
    const requestUserId = String(current.user_id);

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
            adopted_by_user_id = $2,
            updated_at = now()
        WHERE id = $1;
        `,
        [dogId, requestUserId]
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
              adopted_by_user_id = NULL,
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
      COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
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
      COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
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
      COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
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



function inferEarTagTitleFromUrl(imageUrl: string): string {
  const raw = normalizedText(imageUrl);
  if (!raw) return "Untitled";

  const withoutQuery = raw.split("?")[0]?.split("#")[0] ?? raw;
  const lastSegment = withoutQuery.split("/").pop() ?? withoutQuery;
  const withoutExt = lastSegment.replace(/\.[^.]+$/, "");
  const normalized = withoutExt.replace(/[-_]+/g, " ").trim();

  if (!normalized) return "Untitled";

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseJsonImageOptions(value: unknown): EarTagImageOption[] {
  const items: unknown[] =
    Array.isArray(value)
      ? value
      : typeof value === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(value) as unknown;
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];

  const seen = new Set<string>();
  const result: EarTagImageOption[] = [];

  for (const item of items) {
    if (typeof item === "string") {
      const imageUrl = normalizedText(item);
      if (!imageUrl) continue;
      const key = imageUrl.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        title: inferEarTagTitleFromUrl(imageUrl),
        imageUrl,
      });
      continue;
    }

    if (!item || typeof item !== "object") continue;

    const record = item as { title?: unknown; imageUrl?: unknown; url?: unknown };
    const imageUrl = normalizedText(record.imageUrl ?? record.url);
    if (!imageUrl) continue;

    const key = imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const title = normalizedText(record.title) || inferEarTagTitleFromUrl(imageUrl);
    result.push({ title, imageUrl });
  }

  return result;
}

function normalizeColorOptions(options: ColorOption[] | undefined): ColorOption[] {
  const seen = new Set<string>();
  const result: ColorOption[] = [];

  for (const option of options ?? []) {
    const imageUrl = normalizedText(option.imageUrl);
    if (!imageUrl) continue;
    const key = imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      title: normalizedText(option.title) || inferEarTagTitleFromUrl(imageUrl),
      imageUrl,
      textColor: normalizedText(option.textColor) || undefined,
    });
  }

  return result;
}

function normalizeEarTagImageOptions(options: EarTagImageOption[] | undefined, fallbackUrls: string[] = []) {
  const optionsInput = (options ?? []).map((option) => ({
    title: normalizedText(option.title),
    imageUrl: normalizedText(option.imageUrl),
  }));

  const fallbackInput = fallbackUrls.map((url) => ({
    title: inferEarTagTitleFromUrl(url),
    imageUrl: normalizedText(url),
  }));

  const seen = new Set<string>();
  const result: EarTagImageOption[] = [];

  for (const option of [...optionsInput, ...fallbackInput]) {
    if (!option.imageUrl) continue;
    const key = option.imageUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      title: option.title || inferEarTagTitleFromUrl(option.imageUrl),
      imageUrl: option.imageUrl,
    });
  }

  return result;
}

function parseColorOptions(value: unknown): ColorOption[] {
  const items: unknown[] =
    Array.isArray(value)
      ? value
      : typeof value === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(value) as unknown;
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];

  const result: ColorOption[] = [];

  for (const item of items) {
    if (typeof item === "string") {
      // Legacy format: just a string (color title)
      const title = normalizedText(item);
      if (title) {
        result.push({ title, imageUrl: "", textColor: undefined });
      }
      continue;
    }

    if (!item || typeof item !== "object") continue;

    const record = item as { title?: unknown; imageUrl?: unknown; url?: unknown; textColor?: unknown };
    const imageUrl = normalizedText(record.imageUrl ?? record.url);
    const title = normalizedText(record.title) || (imageUrl ? inferEarTagTitleFromUrl(imageUrl) : "");
    const textColor = normalizedText(record.textColor);

    if (title && imageUrl) {
      result.push({ title, imageUrl, textColor: textColor || undefined });
    }
  }

  return result;
}


export async function getEarTagGlobalConfig(): Promise<EarTagGlobalConfigRecord> {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
      SELECT style_images, color_options, boundary_images, updated_at, updated_by
      FROM dog_ear_tag_global_config
      WHERE id = $1
      LIMIT 1;
    `,
    [EAR_TAG_CONFIG_ID]
  );

  const row = result.rows[0] ?? {
    style_images: [],
    color_options: [],
    boundary_images: [],
    updated_at: new Date().toISOString(),
    updated_by: null,
  };

  const styleOptions = parseJsonImageOptions(row.style_images);
  const boundaryOptions = parseJsonImageOptions(row.boundary_images);
  const colorOptions = parseColorOptions(row.color_options);

  return {
    styleOptions,
    styleImages: styleOptions.map((option) => option.imageUrl),
    colorOptions,
    boundaryOptions,
    boundaryImages: boundaryOptions.map((option) => option.imageUrl),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    updatedBy: row.updated_by ? String(row.updated_by) : null,
  };
}

export async function updateEarTagGlobalConfig(input: UpdateEarTagGlobalConfigInput) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const styleOptions = normalizeEarTagImageOptions(input.styleOptions, input.styleImages ?? []);
  const colorOptions = normalizeColorOptions(input.colorOptions);
  const boundaryOptions = normalizeEarTagImageOptions(input.boundaryOptions, input.boundaryImages ?? []);

  const result = await pool.query(
    `
      UPDATE dog_ear_tag_global_config
      SET
        style_images = $2::jsonb,
        color_options = $3::jsonb,
        boundary_images = $4::jsonb,
        updated_by = $5,
        updated_at = now()
      WHERE id = $1
      RETURNING style_images, color_options, boundary_images, updated_at, updated_by;
    `,
    [
      EAR_TAG_CONFIG_ID,
      JSON.stringify(styleOptions),
      JSON.stringify(colorOptions),
      JSON.stringify(boundaryOptions),
      input.updatedBy,
    ]
  );

  const savedStyleOptions = parseJsonImageOptions(result.rows[0]?.style_images);
  const savedBoundaryOptions = parseJsonImageOptions(result.rows[0]?.boundary_images);

  return {
    styleOptions: savedStyleOptions,
    styleImages: savedStyleOptions.map((option) => option.imageUrl),
    colorOptions: parseColorOptions(result.rows[0]?.color_options),
    boundaryOptions: savedBoundaryOptions,
    boundaryImages: savedBoundaryOptions.map((option) => option.imageUrl),
    updatedAt: new Date(String(result.rows[0]?.updated_at)).toISOString(),
    updatedBy: result.rows[0]?.updated_by ? String(result.rows[0]?.updated_by) : null,
  } satisfies EarTagGlobalConfigRecord;
}

export async function assignPetNameForAdoptedDog(dogId: string, userId: string, petNameRaw: string) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const petName = normalizedText(petNameRaw);
  if (!petName) {
    throw new Error("Pet name is required.");
  }

  const result = await pool.query(
    `
      UPDATE dogs
      SET
        pet_name = $3,
        pet_named_by_user_id = $2,
        pet_named_at = now(),
        updated_at = now()
      WHERE id = $1
        AND status = 'adopted'
        AND adopted_by_user_id = $2
        AND (pet_name IS NULL OR pet_name = '')
      RETURNING
        id, name, rescue_name, pet_name, pet_named_by_user_id, breed, color, age, gender, location_key, location_label, province, city, area, latitude, longitude, description,
        image_url, adopted_by_user_id, ear_tag_style_image_url, ear_tag_color, ear_tag_boundary_image_url,
        status, created_at, updated_at;
    `,
    [dogId, userId, petName]
  );

  if (!result.rows[0]) {
    const check = await pool.query(
      `
        SELECT id, adopted_by_user_id, status, pet_name
        FROM dogs
        WHERE id = $1
        LIMIT 1;
      `,
      [dogId]
    );

    if (!check.rows[0]) {
      throw new Error("Dog not found.");
    }

    if (String(check.rows[0].status) !== "adopted") {
      throw new Error("Pet naming is available only after adoption is approved.");
    }

    if (!check.rows[0].adopted_by_user_id || String(check.rows[0].adopted_by_user_id) !== userId) {
      throw new Error("Only the dog owner can set the pet name.");
    }

    throw new Error("Pet name is already assigned and cannot be changed.");
  }

  return mapDogRow(result.rows[0]);
}

export async function updateDogEarTagCustomization(
  dogId: string,
  userId: string,
  input: UpdateDogEarTagCustomizationInput
) {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const styleImageUrl = normalizedText(input.styleImageUrl);
  const colorTitle = normalizedText(input.colorTitle);
  const boundaryImageUrl = normalizedText(input.boundaryImageUrl);

  if (!styleImageUrl || !colorTitle || !boundaryImageUrl) {
    throw new Error("Ear tag style, color, and reflective boundary are required.");
  }

  const config = await getEarTagGlobalConfig();
  if (!config.styleOptions.some((option) => option.imageUrl === styleImageUrl)) {
    throw new Error("Selected ear tag style is not in global configuration.");
  }
  if (!config.colorOptions.some((option) => option.title === colorTitle)) {
    throw new Error("Selected ear tag color is not in global configuration.");
  }
  if (!config.boundaryOptions.some((option) => option.imageUrl === boundaryImageUrl)) {
    throw new Error("Selected reflective boundary design is not in global configuration.");
  }

  const result = await pool.query(
    `
      UPDATE dogs
      SET
        ear_tag_style_image_url = $3,
        ear_tag_color = $4,
        ear_tag_boundary_image_url = $5,
        ear_tag_customized_at = now(),
        updated_at = now()
      WHERE id = $1
        AND status = 'adopted'
        AND adopted_by_user_id = $2
        AND pet_name IS NOT NULL
        AND pet_name <> ''
      RETURNING
        id, name, rescue_name, pet_name, pet_named_by_user_id, breed, color, age, gender, location_key, location_label, province, city, area, latitude, longitude, description,
        image_url, adopted_by_user_id, ear_tag_style_image_url, ear_tag_color, ear_tag_boundary_image_url,
        status, created_at, updated_at;
    `,
    [dogId, userId, styleImageUrl, colorTitle, boundaryImageUrl]
  );

  if (!result.rows[0]) {
    throw new Error("Only the adopted dog owner can customize ear tag after pet naming.");
  }

  return mapDogRow(result.rows[0]);
}

export async function listAdoptedDogsWithOwners() {
  await ensureDogAdoptionSchema();
  const pool = getDbPool();

  const result = await pool.query(
    `
      SELECT
        d.id,
        COALESCE(d.pet_name, d.rescue_name, d.name) AS dog_name,
        d.rescue_name,
        d.pet_name,
        d.breed,
        d.color,
        d.age,
        d.gender,
        d.location_key,
        d.location_label,
        d.province,
        d.city,
        d.area,
        d.latitude,
        d.longitude,
        d.image_url,
        d.updated_at,
        u.name AS owner_name,
        u.email AS owner_email
      FROM dogs d
      LEFT JOIN users u ON u.id = d.adopted_by_user_id
      WHERE d.status = 'adopted'
      ORDER BY d.updated_at DESC;
    `
  );

  return result.rows.map((row) => ({
    dogId: String(row.id),
    dogName: String(row.dog_name),
    rescueName: row.rescue_name ? String(row.rescue_name) : String(row.dog_name),
    petName: row.pet_name ? String(row.pet_name) : null,
    breed: String(row.breed),
    color: row.color ? String(row.color) : "Unknown",
    age: String(row.age),
    gender: String(row.gender),
    locationKey: row.location_key ? String(row.location_key) : null,
    locationLabel: row.location_label ? String(row.location_label) : null,
    province: row.province ? String(row.province) : null,
    city: row.city ? String(row.city) : null,
    area: row.area ? String(row.area) : null,
    latitude: typeof row.latitude === "number" ? row.latitude : normalizedNumber(row.latitude),
    longitude: typeof row.longitude === "number" ? row.longitude : normalizedNumber(row.longitude),
    imageUrl: String(row.image_url),
    ownerName: row.owner_name ? String(row.owner_name) : null,
    ownerEmail: row.owner_email ? String(row.owner_email) : null,
    adoptedAt: new Date(String(row.updated_at)).toISOString(),
  })) satisfies AdoptedDogRecord[];
}

function mapDogRow(row: Record<string, unknown>): DogRecord {
  const rescueName = row.rescue_name ? String(row.rescue_name) : String(row.name);
  const petName = row.pet_name ? String(row.pet_name) : null;
  const displayName = petName ?? rescueName;

  return {
    dogId: String(row.id),
    rescueName,
    petName,
    name: displayName,
    breed: String(row.breed),
    color: row.color ? String(row.color) : "Unknown",
    age: String(row.age),
    gender: String(row.gender),
    locationKey: row.location_key ? String(row.location_key) : null,
    locationLabel: row.location_label ? String(row.location_label) : null,
    province: row.province ? String(row.province) : null,
    city: row.city ? String(row.city) : null,
    area: row.area ? String(row.area) : null,
    latitude: typeof row.latitude === "number" ? row.latitude : normalizedNumber(row.latitude),
    longitude: typeof row.longitude === "number" ? row.longitude : normalizedNumber(row.longitude),
    description: String(row.description),
    imageUrl: String(row.image_url),
    adoptedByUserId: row.adopted_by_user_id ? String(row.adopted_by_user_id) : null,
    petNamedByUserId: row.pet_named_by_user_id ? String(row.pet_named_by_user_id) : null,
    earTagStyleImageUrl: row.ear_tag_style_image_url ? String(row.ear_tag_style_image_url) : null,
    earTagColorTitle: row.ear_tag_color ? String(row.ear_tag_color) : null,
    earTagBoundaryImageUrl: row.ear_tag_boundary_image_url ? String(row.ear_tag_boundary_image_url) : null,
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
    petName: row.pet_name ? String(row.pet_name) : null,
    dogBreed: String(row.dog_breed),
    dogColor: row.dog_color ? String(row.dog_color) : "Unknown",
    dogImageUrl: String(row.dog_image_url),
    userId: row.user_id ? String(row.user_id) : null,
    userName: row.user_name ? String(row.user_name) : null,
    userEmail: row.user_email ? String(row.user_email) : null,
    applicantName: row.applicant_name ? String(row.applicant_name) : null,
    applicantPhone: row.applicant_phone ? String(row.applicant_phone) : null,
    whatsappNumber: row.whatsapp_number ? String(row.whatsapp_number) : null,
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
