import { randomUUID } from "crypto";

import { getSupabaseAdminClient, getSupabaseReadClient } from "@/lib/supabase/admin";
import { getSupabaseUrl, hasSupabaseConfig, hasSupabaseServiceRoleKey } from "@/lib/supabase/env";
import { canCancelAppointment } from "@/services/healthcare/rules";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
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
  bloodRequestId: string | null;
  senderId: string;
  senderName: string | null;
  body: string;
  bloodGroup: string | null;
  urgencyLevel: UrgencyLevel | null;
  locationCity: string | null;
  donorVerified: boolean;
  createdAt: string;
};

export type BloodDonorMatch = {
  donorUserId: string;
  bloodGroup: string | null;
  urgencyLevel: string | null;
  locationCity: string | null;
  donorVerified: boolean;
  latestActivityAt: string;
};

export type DoctorSortField = "recent" | "experience" | "fee" | "name";
export type DoctorSortOrder = "asc" | "desc";

export type DoctorListFilters = {
  search?: string;
  specialization?: string;
  minExperience?: number;
  maxFee?: number;
  sortBy?: DoctorSortField;
  sortOrder?: DoctorSortOrder;
};

export type DoctorAppointmentFilters = {
  status?: AppointmentStatus;
  search?: string;
  sortBy?: "createdAt" | "slotStart";
  sortOrder?: "asc" | "desc";
};

export type AppointmentListFilters = {
  status?: AppointmentStatus;
  search?: string;
  sortBy?: "createdAt" | "slotStart";
  sortOrder?: "asc" | "desc";
};

type HealthcareAppointmentRow = {
  id: string;
  doctor_id: string;
  patient_user_id: string;
  slot_id: string;
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
};

type HealthcareDoctorRow = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  specialization: string | null;
  bio: string | null;
  experience_years: number | null;
  consultation_fee: number | null;
  created_at: string;
  updated_at: string;
};

type HealthcareDoctorSlotRow = {
  id: string;
  doctor_id: string;
  slot_start: string;
  slot_end: string;
  is_available: boolean;
  created_at: string;
};

const APPOINTMENT_STATUSES: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];
const URGENCY_LEVELS: UrgencyLevel[] = ["low", "medium", "high", "critical"];

const DEMO_DOCTORS = [
  {
    doctorId: "demo-cardiology",
    email: "dr.ahmed@demo.paksarzameen.org",
    fullName: "Dr. Ahmed Khan",
    specialization: "Cardiology",
    bio: "Heart and cardiovascular care with a focus on prevention and long-term management.",
    experienceYears: 15,
    consultationFee: 500,
  },
  {
    doctorId: "demo-pediatrics",
    email: "dr.fatima@demo.paksarzameen.org",
    fullName: "Dr. Fatima Ali",
    specialization: "Pediatrics",
    bio: "Child health, vaccinations, fever, growth, and routine pediatric follow-ups.",
    experienceYears: 12,
    consultationFee: 400,
  },
  {
    doctorId: "demo-general-medicine",
    email: "dr.hassan@demo.paksarzameen.org",
    fullName: "Dr. Hassan Malik",
    specialization: "General Medicine",
    bio: "Primary care support for common illnesses, ongoing symptoms, and initial diagnosis.",
    experienceYears: 10,
    consultationFee: 300,
  },
  {
    doctorId: "demo-orthopedics",
    email: "dr.aisha@demo.paksarzameen.org",
    fullName: "Dr. Aisha Khan",
    specialization: "Orthopedics",
    bio: "Bone, joint, sprain, and mobility care with sports-injury support.",
    experienceYears: 8,
    consultationFee: 450,
  },
  {
    doctorId: "demo-dermatology",
    email: "dr.omar@demo.paksarzameen.org",
    fullName: "Dr. Omar Hassan",
    specialization: "Dermatology",
    bio: "Skin, hair, and cosmetic concerns including rashes, acne, and allergies.",
    experienceYears: 9,
    consultationFee: 350,
  },
] as const;

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

function getSupabase() {
  return getSupabaseAdminClient();
}

function getPublicSupabase() {
  return getSupabaseReadClient();
}

function hasHealthcareReadConfig() {
  return Boolean(getSupabaseUrl() && (hasSupabaseConfig() || hasSupabaseServiceRoleKey()));
}

function getDonorRoomKey(requesterUserId: string, donorUserId: string) {
  return [requesterUserId, donorUserId].sort().join(":");
}

function mapDoctorRow(row: HealthcareDoctorRow): DoctorRecord {
  return {
    doctorId: row.id,
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    specialization: row.specialization,
    bio: row.bio,
    experienceYears: row.experience_years ?? null,
    consultationFee: row.consultation_fee === null || row.consultation_fee === undefined ? null : Number(row.consultation_fee),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapSlotRow(row: HealthcareDoctorSlotRow): DoctorSlotRecord {
  return {
    slotId: row.id,
    doctorId: row.doctor_id,
    slotStart: new Date(row.slot_start).toISOString(),
    slotEnd: new Date(row.slot_end).toISOString(),
    isAvailable: Boolean(row.is_available),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function buildDemoDoctors(): DoctorRecord[] {
  const now = Date.now();

  return DEMO_DOCTORS.map((doctor, index) => ({
    doctorId: doctor.doctorId,
    userId: null,
    email: doctor.email,
    fullName: doctor.fullName,
    specialization: doctor.specialization,
    bio: doctor.bio,
    experienceYears: doctor.experienceYears,
    consultationFee: doctor.consultationFee,
    createdAt: new Date(now - (index + 1) * 86_400_000).toISOString(),
    updatedAt: new Date(now - (index + 1) * 3_600_000).toISOString(),
  }));
}

function buildDemoSlots(): DoctorSlotRecord[] {
  const now = new Date();
  const doctors = buildDemoDoctors();
  const slots: DoctorSlotRecord[] = [];

  doctors.forEach((doctor, doctorIndex) => {
    for (let dayOffset = 1; dayOffset <= 4; dayOffset += 1) {
      const day = new Date(now);
      day.setDate(now.getDate() + dayOffset);
      const startHour = 10 + doctorIndex;
      const start = new Date(day);
      start.setHours(startHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      slots.push({
        slotId: `${doctor.doctorId}-slot-${dayOffset}`,
        doctorId: doctor.doctorId,
        slotStart: start.toISOString(),
        slotEnd: end.toISOString(),
        isAvailable: true,
        createdAt: new Date(start.getTime() - 86_400_000).toISOString(),
      });
    }
  });

  return slots;
}

function filterAndSortDemoDoctors(filters: DoctorListFilters) {
  const records = buildDemoDoctors();
  const search = normalizedText(filters.search).toLowerCase();
  const specialization = normalizedText(filters.specialization).toLowerCase();
  const minExperience = normalizedNumber(filters.minExperience);
  const maxFee = normalizedNumber(filters.maxFee);
  const sortBy = filters.sortBy ?? "recent";
  const ascending = (filters.sortOrder ?? "desc") === "asc";

  const filtered = records.filter((doctor) => {
    const matchesSearch =
      !search ||
      [doctor.fullName, doctor.specialization ?? "", doctor.bio ?? ""].some((value) => value.toLowerCase().includes(search));
    const matchesSpecialization = !specialization || (doctor.specialization ?? "").toLowerCase().includes(specialization);
    const matchesExperience = minExperience === null || (doctor.experienceYears ?? 0) >= minExperience;
    const matchesFee = maxFee === null || (doctor.consultationFee ?? Number.POSITIVE_INFINITY) <= maxFee;

    return matchesSearch && matchesSpecialization && matchesExperience && matchesFee;
  });

  return filtered.sort((left, right) => {
    if (sortBy === "experience") {
      const diff = (left.experienceYears ?? 0) - (right.experienceYears ?? 0);
      return ascending ? diff : -diff;
    }

    if (sortBy === "fee") {
      const diff = (left.consultationFee ?? 0) - (right.consultationFee ?? 0);
      return ascending ? diff : -diff;
    }

    if (sortBy === "name") {
      const diff = left.fullName.localeCompare(right.fullName);
      return ascending ? diff : -diff;
    }

    const diff = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    return ascending ? diff : -diff;
  });
}

export function getDemoDoctorsWithFilters(filters: DoctorListFilters) {
  return filterAndSortDemoDoctors(filters);
}

export function getDemoAvailableDoctorSlots() {
  return buildDemoSlots();
}

export function normalizeUrgencyLevel(value: unknown): UrgencyLevel {
  const level = normalizedText(value).toLowerCase();
  if ((URGENCY_LEVELS as string[]).includes(level)) {
    return level as UrgencyLevel;
  }

  throw new Error("Invalid urgency level.");
}

export async function listDoctors() {
  return listDoctorsWithFilters({});
}

export async function listDoctorsWithFilters(filters: DoctorListFilters) {
  if (!hasHealthcareReadConfig()) {
    return filterAndSortDemoDoctors(filters);
  }

  const supabase = getPublicSupabase();

  let query = supabase
    .from("healthcare_doctors")
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at");

  const search = normalizedText(filters.search);
  if (search) {
    const escaped = search.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    query = query.or(`full_name.ilike.%${escaped}%,specialization.ilike.%${escaped}%,bio.ilike.%${escaped}%`);
  }

  const specialization = normalizedText(filters.specialization);
  if (specialization) {
    query = query.ilike("specialization", `%${specialization}%`);
  }

  const minExperience = normalizedNumber(filters.minExperience);
  if (minExperience !== null) {
    query = query.gte("experience_years", minExperience);
  }

  const maxFee = normalizedNumber(filters.maxFee);
  if (maxFee !== null) {
    query = query.lte("consultation_fee", maxFee);
  }

  const sortBy = filters.sortBy ?? "recent";
  const ascending = (filters.sortOrder ?? "desc") === "asc";
  if (sortBy === "experience") {
    query = query.order("experience_years", { ascending, nullsFirst: false });
  } else if (sortBy === "fee") {
    query = query.order("consultation_fee", { ascending, nullsFirst: false });
  } else if (sortBy === "name") {
    query = query.order("full_name", { ascending });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const mapped = (data ?? []).map((row) => mapDoctorRow(row as HealthcareDoctorRow));
  if (mapped.length > 0 || !hasSupabaseServiceRoleKey()) {
    return mapped;
  }

  // If anon reads are blocked by RLS in production, retry on server with service-role client.
  const admin = getSupabaseAdminClient();
  let adminQuery = admin
    .from("healthcare_doctors")
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at");

  if (search) {
    const escaped = search.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    adminQuery = adminQuery.or(`full_name.ilike.%${escaped}%,specialization.ilike.%${escaped}%,bio.ilike.%${escaped}%`);
  }

  if (specialization) {
    adminQuery = adminQuery.ilike("specialization", `%${specialization}%`);
  }

  if (minExperience !== null) {
    adminQuery = adminQuery.gte("experience_years", minExperience);
  }

  if (maxFee !== null) {
    adminQuery = adminQuery.lte("consultation_fee", maxFee);
  }

  if (sortBy === "experience") {
    adminQuery = adminQuery.order("experience_years", { ascending, nullsFirst: false });
  } else if (sortBy === "fee") {
    adminQuery = adminQuery.order("consultation_fee", { ascending, nullsFirst: false });
  } else if (sortBy === "name") {
    adminQuery = adminQuery.order("full_name", { ascending });
  } else {
    adminQuery = adminQuery.order("created_at", { ascending: false });
  }

  const { data: adminData, error: adminError } = await adminQuery;
  if (adminError) throw new Error(adminError.message);
  return (adminData ?? []).map((row) => mapDoctorRow(row as HealthcareDoctorRow));
}

export async function getDoctorById(doctorId: string) {
  if (!hasHealthcareReadConfig()) {
    return null;
  }

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("healthcare_doctors")
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at")
    .eq("id", doctorId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapDoctorRow(data as HealthcareDoctorRow);
}

export async function getDoctorByUserId(userId: string) {
  if (!hasHealthcareReadConfig()) {
    return null;
  }

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("healthcare_doctors")
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapDoctorRow(data as HealthcareDoctorRow);
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
  const supabase = getSupabase();

  const payload = {
    id: randomUUID(),
    user_id: input.userId ?? null,
    email: normalizedText(input.email).toLowerCase(),
    full_name: normalizedText(input.fullName),
    specialization: normalizedNullableText(input.specialization),
    bio: normalizedNullableText(input.bio),
    experience_years: normalizedNumber(input.experienceYears),
    consultation_fee: normalizedNumber(input.consultationFee),
  };

  const { data, error } = await supabase
    .from("healthcare_doctors")
    .insert(payload)
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return mapDoctorRow(data as HealthcareDoctorRow);
}

export async function updateDoctor(input: {
  doctorId: string;
  fullName?: string;
  specialization?: string | null;
  bio?: string | null;
  experienceYears?: number | null;
  consultationFee?: number | null;
}) {
  const supabase = getSupabase();
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.fullName !== undefined) {
    const fullName = normalizedText(input.fullName);
    if (!fullName) throw new Error("Doctor full name is required.");
    updatePayload.full_name = fullName;
  }

  if (input.specialization !== undefined) {
    updatePayload.specialization = normalizedNullableText(input.specialization);
  }

  if (input.bio !== undefined) {
    updatePayload.bio = normalizedNullableText(input.bio);
  }

  if (input.experienceYears !== undefined) {
    updatePayload.experience_years = normalizedNumber(input.experienceYears);
  }

  if (input.consultationFee !== undefined) {
    updatePayload.consultation_fee = normalizedNumber(input.consultationFee);
  }

  const { data, error } = await supabase
    .from("healthcare_doctors")
    .update(updatePayload)
    .eq("id", input.doctorId)
    .select("id,user_id,email,full_name,specialization,bio,experience_years,consultation_fee,created_at,updated_at")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Doctor profile not found.");
  return mapDoctorRow(data as HealthcareDoctorRow);
}

export async function deleteDoctor(doctorId: string) {
  const supabase = getSupabase();

  const { data: doctor, error: doctorError } = await supabase
    .from("healthcare_doctors")
    .select("id,user_id")
    .eq("id", doctorId)
    .maybeSingle<{ id: string; user_id: string | null }>();

  if (doctorError) throw new Error(doctorError.message);
  if (!doctor) throw new Error("Doctor profile not found.");

  const { error } = await supabase.from("healthcare_doctors").delete().eq("id", doctorId);
  if (error) throw new Error(error.message);

  return {
    doctorId: doctor.id,
    userId: doctor.user_id,
  };
}

export async function listDoctorSlots(doctorId: string, onlyAvailable = false) {
  if (!hasHealthcareReadConfig()) {
    const demoSlots = buildDemoSlots().filter((slot) => slot.doctorId === doctorId);
    return onlyAvailable ? demoSlots.filter((slot) => slot.isAvailable) : demoSlots;
  }

  const supabase = getPublicSupabase();
  let query = supabase
    .from("healthcare_doctor_slots")
    .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
    .eq("doctor_id", doctorId)
    .order("slot_start", { ascending: true });

  if (onlyAvailable) {
    query = query.eq("is_available", true).gte("slot_start", new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSlotRow(row as HealthcareDoctorSlotRow));
}

export async function listAvailableDoctorSlots() {
  if (!hasHealthcareReadConfig()) {
    return getDemoAvailableDoctorSlots();
  }

  const supabase = getPublicSupabase();
  const { data: slots, error: slotError } = await supabase
    .from("healthcare_doctor_slots")
    .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
    .eq("is_available", true)
    .gte("slot_start", new Date().toISOString())
    .order("slot_start", { ascending: true });

  if (slotError) throw new Error(slotError.message);
  let slotRows = (slots ?? []) as HealthcareDoctorSlotRow[];
  if (!slotRows.length && hasSupabaseServiceRoleKey()) {
    const admin = getSupabaseAdminClient();
    const { data: adminSlots, error: adminSlotError } = await admin
      .from("healthcare_doctor_slots")
      .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
      .eq("is_available", true)
      .gte("slot_start", new Date().toISOString())
      .order("slot_start", { ascending: true });

    if (adminSlotError) throw new Error(adminSlotError.message);
    slotRows = (adminSlots ?? []) as HealthcareDoctorSlotRow[];
  }

  if (!slotRows.length) return [];

  const doctorIds = Array.from(new Set(slotRows.map((row) => row.doctor_id)));
  const { data: doctors, error: doctorError } = await supabase
    .from("healthcare_doctors")
    .select("id,full_name,specialization")
    .in("id", doctorIds);

  if (doctorError) throw new Error(doctorError.message);

  const doctorMap = new Map((doctors ?? []).map((row) => [String(row.id), row]));
  return slotRows.map((row) => ({
    ...mapSlotRow(row),
    doctorName: String(doctorMap.get(row.doctor_id)?.full_name ?? "Doctor"),
    specialization: doctorMap.get(row.doctor_id)?.specialization ? String(doctorMap.get(row.doctor_id)?.specialization) : null,
  }));
}

export async function addDoctorSlot(doctorId: string, slotStart: string, slotEnd: string) {
  const supabase = getSupabase();

  const start = new Date(slotStart);
  const end = new Date(slotEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid slot start or end time.");
  }
  if (start <= new Date()) {
    throw new Error("Slot start must be in the future.");
  }
  if (end <= start) {
    throw new Error("Slot end must be after slot start.");
  }

  const { data: conflicts, error: conflictError } = await supabase
    .from("healthcare_doctor_slots")
    .select("id")
    .eq("doctor_id", doctorId)
    .lt("slot_start", end.toISOString())
    .gt("slot_end", start.toISOString())
    .limit(1);

  if (conflictError) throw new Error(conflictError.message);
  if (conflicts && conflicts.length) {
    throw new Error("Slot conflicts with an existing schedule block.");
  }

  const { data, error } = await supabase
    .from("healthcare_doctor_slots")
    .insert({
      id: randomUUID(),
      doctor_id: doctorId,
      slot_start: start.toISOString(),
      slot_end: end.toISOString(),
      is_available: true,
    })
    .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
    .single();

  if (error) throw new Error(error.message);
  return mapSlotRow(data as HealthcareDoctorSlotRow);
}

function parseTimeToMinutes(value: string) {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid schedule time format.");
  }

  return hours * 60 + minutes;
}

function addMinutesToDate(base: Date, minutes: number) {
  return new Date(base.getTime() + minutes * 60_000);
}

function parseDateOnly(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid schedule date.");
  }
  return date;
}

export async function createDoctorSchedule(input: {
  doctorId: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}) {
  const startDate = parseDateOnly(input.startDate);
  const endDate = parseDateOnly(input.endDate ?? input.startDate);
  const dayStartMinutes = parseTimeToMinutes(input.startTime);
  const dayEndMinutes = parseTimeToMinutes(input.endTime);
  const slotDuration = Math.floor(input.slotDurationMinutes);

  if (endDate < startDate) {
    throw new Error("Schedule end date must be on or after start date.");
  }
  if (slotDuration < 10 || slotDuration > 240) {
    throw new Error("Slot duration must be between 10 and 240 minutes.");
  }
  if (dayEndMinutes <= dayStartMinutes) {
    throw new Error("Schedule end time must be after start time.");
  }

  const daySpan = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  if (daySpan > 31) {
    throw new Error("Schedule range cannot exceed 31 days.");
  }

  const created: DoctorSlotRecord[] = [];
  let skipped = 0;

  for (let dayOffset = 0; dayOffset < daySpan; dayOffset += 1) {
    const currentDay = addMinutesToDate(startDate, dayOffset * 24 * 60);
    const dayStart = addMinutesToDate(currentDay, dayStartMinutes);
    const dayEnd = addMinutesToDate(currentDay, dayEndMinutes);

    for (
      let cursor = new Date(dayStart);
      addMinutesToDate(cursor, slotDuration) <= dayEnd;
      cursor = addMinutesToDate(cursor, slotDuration)
    ) {
      const slotStart = new Date(cursor);
      const slotEnd = addMinutesToDate(slotStart, slotDuration);

      if (slotStart <= new Date()) {
        skipped += 1;
        continue;
      }

      try {
        const slot = await addDoctorSlot(input.doctorId, slotStart.toISOString(), slotEnd.toISOString());
        created.push(slot);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown schedule error";
        if (message.includes("conflicts") || message.includes("future")) {
          skipped += 1;
          continue;
        }
        throw error;
      }
    }
  }

  return {
    created,
    skipped,
  };
}

export async function setDoctorSlotAvailability(input: {
  doctorId: string;
  slotId: string;
  isAvailable: boolean;
}) {
  const supabase = getSupabase();

  const { data: slot, error: slotError } = await supabase
    .from("healthcare_doctor_slots")
    .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
    .eq("id", input.slotId)
    .eq("doctor_id", input.doctorId)
    .maybeSingle<HealthcareDoctorSlotRow>();

  if (slotError) throw new Error(slotError.message);
  if (!slot) throw new Error("Slot not found.");

  if (input.isAvailable) {
    const { data: activeAppointment, error: appointmentError } = await supabase
      .from("healthcare_appointments")
      .select("id")
      .eq("slot_id", input.slotId)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (appointmentError) throw new Error(appointmentError.message);
    if (activeAppointment && activeAppointment.length > 0) {
      throw new Error("Cannot mark this slot available while an active appointment exists.");
    }
  }

  const { data, error } = await supabase
    .from("healthcare_doctor_slots")
    .update({ is_available: input.isAvailable })
    .eq("id", input.slotId)
    .eq("doctor_id", input.doctorId)
    .select("id,doctor_id,slot_start,slot_end,is_available,created_at")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Slot not found.");
  return mapSlotRow(data as HealthcareDoctorSlotRow);
}

export async function deleteDoctorSlot(input: { doctorId: string; slotId: string }) {
  const supabase = getSupabase();

  const { data: slot, error: slotError } = await supabase
    .from("healthcare_doctor_slots")
    .select("id,is_available")
    .eq("id", input.slotId)
    .eq("doctor_id", input.doctorId)
    .maybeSingle<{ id: string; is_available: boolean }>();

  if (slotError) throw new Error(slotError.message);
  if (!slot) throw new Error("Slot not found.");

  if (!slot.is_available) {
    throw new Error("Booked slots cannot be deleted.");
  }

  const { error } = await supabase
    .from("healthcare_doctor_slots")
    .delete()
    .eq("id", input.slotId)
    .eq("doctor_id", input.doctorId);

  if (error) throw new Error(error.message);

  return { slotId: input.slotId };
}

async function hydrateAppointments(rows: HealthcareAppointmentRow[]): Promise<AppointmentRecord[]> {
  if (!rows.length) return [];
  if (!hasSupabaseConfig()) {
    return rows.map((row) => ({
      appointmentId: row.id,
      doctorId: row.doctor_id,
      doctorName: "Doctor",
      patientUserId: row.patient_user_id,
      patientName: null,
      slotId: row.slot_id,
      slotStart: new Date(row.created_at).toISOString(),
      slotEnd: new Date(row.created_at).toISOString(),
      reason: row.reason,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    } satisfies AppointmentRecord));
  }

  const supabase = getSupabase();

  const doctorIds = Array.from(new Set(rows.map((row) => row.doctor_id)));
  const slotIds = Array.from(new Set(rows.map((row) => row.slot_id)));
  const patientIds = Array.from(new Set(rows.map((row) => row.patient_user_id)));

  const [doctorRes, slotRes, patientRes] = await Promise.all([
    supabase.from("healthcare_doctors").select("id,full_name").in("id", doctorIds),
    supabase.from("healthcare_doctor_slots").select("id,slot_start,slot_end").in("id", slotIds),
    supabase.from("profiles").select("id,email").in("id", patientIds),
  ]);

  if (doctorRes.error) throw new Error(doctorRes.error.message);
  if (slotRes.error) throw new Error(slotRes.error.message);
  if (patientRes.error) throw new Error(patientRes.error.message);

  const doctorMap = new Map((doctorRes.data ?? []).map((row) => [String(row.id), String(row.full_name ?? "Doctor")]));
  const slotMap = new Map((slotRes.data ?? []).map((row) => [
    String(row.id),
    {
      start: new Date(String(row.slot_start)).toISOString(),
      end: new Date(String(row.slot_end)).toISOString(),
    },
  ]));
  const patientMap = new Map(
    (patientRes.data ?? []).map((row) => {
      const email = row.email ? String(row.email) : "";
      const fallbackName = email.includes("@") ? email.split("@")[0] : null;
      return [String(row.id), fallbackName] as const;
    })
  );

  return rows.map((row) => {
    const slot = slotMap.get(row.slot_id);
    return {
      appointmentId: row.id,
      doctorId: row.doctor_id,
      doctorName: doctorMap.get(row.doctor_id) ?? "Doctor",
      patientUserId: row.patient_user_id,
      patientName: patientMap.get(row.patient_user_id) ?? null,
      slotId: row.slot_id,
      slotStart: slot?.start ?? new Date(row.created_at).toISOString(),
      slotEnd: slot?.end ?? new Date(row.created_at).toISOString(),
      reason: row.reason,
      status: row.status,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    } satisfies AppointmentRecord;
  });
}

export async function getAppointmentById(appointmentId: string) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("healthcare_appointments")
    .select("id,doctor_id,patient_user_id,slot_id,reason,status,created_at,updated_at")
    .eq("id", appointmentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const hydrated = await hydrateAppointments([data as HealthcareAppointmentRow]);
  return hydrated[0] ?? null;
}

export async function listAppointmentsForDoctor(doctorId: string, filters: AppointmentListFilters = {}) {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  let query = supabase
    .from("healthcare_appointments")
    .select("id,doctor_id,patient_user_id,slot_id,reason,status,created_at,updated_at")
    .eq("doctor_id", doctorId);

  if (filters.status && (APPOINTMENT_STATUSES as string[]).includes(filters.status)) {
    query = query.eq("status", filters.status);
  }

  const search = normalizedText(filters.search);
  if (search) {
    query = query.ilike("reason", `%${search}%`);
  }

  const sortBy = filters.sortBy ?? "createdAt";
  const ascending = (filters.sortOrder ?? "desc") === "asc";
  if (sortBy === "slotStart") {
    query = query.order("slot_id", { ascending });
  } else {
    query = query.order("created_at", { ascending });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  const hydrated = await hydrateAppointments((data ?? []) as HealthcareAppointmentRow[]);

  if (sortBy === "slotStart") {
    return hydrated.sort((a, b) => {
      const diff = new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime();
      return ascending ? diff : -diff;
    });
  }

  return hydrated;
}

export async function listAppointmentsForPatient(patientUserId: string, filters: AppointmentListFilters = {}) {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  let query = supabase
    .from("healthcare_appointments")
    .select("id,doctor_id,patient_user_id,slot_id,reason,status,created_at,updated_at")
    .eq("patient_user_id", patientUserId);

  if (filters.status && (APPOINTMENT_STATUSES as string[]).includes(filters.status)) {
    query = query.eq("status", filters.status);
  }

  const search = normalizedText(filters.search);
  if (search) {
    query = query.ilike("reason", `%${search}%`);
  }

  const sortBy = filters.sortBy ?? "createdAt";
  const ascending = (filters.sortOrder ?? "desc") === "asc";
  if (sortBy === "slotStart") {
    query = query.order("slot_id", { ascending });
  } else {
    query = query.order("created_at", { ascending });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  const hydrated = await hydrateAppointments((data ?? []) as HealthcareAppointmentRow[]);

  if (sortBy === "slotStart") {
    return hydrated.sort((a, b) => {
      const diff = new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime();
      return ascending ? diff : -diff;
    });
  }

  return hydrated;
}

export async function bookAppointment(input: {
  doctorId: string;
  patientUserId: string;
  slotId: string;
  reason: string;
}) {
  const supabase = getSupabase();

  const { data: slot, error: slotError } = await supabase
    .from("healthcare_doctor_slots")
    .select("id,doctor_id,is_available,slot_start,slot_end")
    .eq("id", input.slotId)
    .maybeSingle();

  if (slotError) throw new Error(slotError.message);
  if (!slot) throw new Error("Slot not found.");
  if (!slot.is_available) throw new Error("Slot is no longer available.");
  if (String(slot.doctor_id) !== input.doctorId) throw new Error("Slot does not belong to selected doctor.");
  if (new Date(String(slot.slot_start)) <= new Date()) throw new Error("Cannot book an expired slot.");

  const { data: duplicate, error: duplicateError } = await supabase
    .from("healthcare_appointments")
    .select("id")
    .eq("slot_id", input.slotId)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  if (duplicateError) throw new Error(duplicateError.message);
  if (duplicate && duplicate.length) throw new Error("Slot is already booked.");

  const reason = normalizedText(input.reason);
  if (!reason) throw new Error("Appointment reason is required.");

  const appointmentId = randomUUID();
  const { error: insertError } = await supabase.from("healthcare_appointments").insert({
    id: appointmentId,
    doctor_id: input.doctorId,
    patient_user_id: input.patientUserId,
    slot_id: input.slotId,
    reason,
    status: "pending",
  });

  if (insertError) throw new Error(insertError.message);

  const { error: slotUpdateError } = await supabase
    .from("healthcare_doctor_slots")
    .update({ is_available: false })
    .eq("id", input.slotId)
    .eq("is_available", true);

  if (slotUpdateError) throw new Error(slotUpdateError.message);

  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found.");
  return appointment;
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
  if (!(APPOINTMENT_STATUSES as string[]).includes(status)) {
    throw new Error("Invalid appointment status.");
  }

  const current = await getAppointmentById(appointmentId);
  if (!current) {
    throw new Error("Appointment not found.");
  }

  if (current.status === "cancelled" || current.status === "completed") {
    throw new Error("Finalized appointments cannot be modified.");
  }

  if (current.status === "pending" && status === "completed") {
    throw new Error("Pending appointment cannot be marked completed directly.");
  }

  const supabase = getSupabase();

  if (status === "cancelled") {
    const { error: slotError } = await supabase
      .from("healthcare_doctor_slots")
      .update({ is_available: true })
      .eq("id", current.slotId);

    if (slotError) throw new Error(slotError.message);
  }

  const updatePayload: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === "cancelled") {
    updatePayload.cancelled_at = new Date().toISOString();
  }
  if (status === "completed") {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("healthcare_appointments")
    .update(updatePayload)
    .eq("id", appointmentId);

  if (error) throw new Error(error.message);

  const updated = await getAppointmentById(appointmentId);
  if (!updated) throw new Error("Appointment not found.");
  return updated;
}

export async function createAppointmentMessage(
  appointmentId: string,
  senderId: string,
  senderName: string | null,
  body: string,
  attachmentUrl?: string | null
) {
  const content = normalizedText(body);
  if (!content) throw new Error("Message body is required.");

  const supabase = getSupabase();
  const safeAttachmentUrl = normalizedUrl(attachmentUrl);

  const { data, error } = await supabase
    .from("healthcare_appointment_messages")
    .insert({
      id: randomUUID(),
      appointment_id: appointmentId,
      sender_id: senderId,
      sender_name: senderName,
      body: content,
      attachment_url: safeAttachmentUrl,
    })
    .select("id,appointment_id,sender_id,sender_name,body,attachment_url,is_read,read_at,created_at")
    .single();

  if (error) throw new Error(error.message);

  return {
    messageId: String(data.id),
    appointmentId: String(data.appointment_id),
    senderId: String(data.sender_id),
    senderName: data.sender_name ? String(data.sender_name) : null,
    body: String(data.body),
    attachmentUrl: data.attachment_url ? String(data.attachment_url) : null,
    isRead: Boolean(data.is_read),
    readAt: data.read_at ? new Date(String(data.read_at)).toISOString() : null,
    createdAt: new Date(String(data.created_at)).toISOString(),
  } satisfies AppointmentMessageRecord;
}

export async function listAppointmentMessages(appointmentId: string) {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("healthcare_appointment_messages")
    .select("id,appointment_id,sender_id,sender_name,body,attachment_url,is_read,read_at,created_at")
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    messageId: String(row.id),
    appointmentId: String(row.appointment_id),
    senderId: String(row.sender_id),
    senderName: row.sender_name ? String(row.sender_name) : null,
    body: String(row.body),
    attachmentUrl: row.attachment_url ? String(row.attachment_url) : null,
    isRead: Boolean(row.is_read),
    readAt: row.read_at ? new Date(String(row.read_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
  } satisfies AppointmentMessageRecord));
}

export async function markAppointmentMessagesRead(appointmentId: string, readerUserId: string) {
  if (!hasSupabaseConfig()) {
    return 0;
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("healthcare_appointment_messages")
    .select("id")
    .eq("appointment_id", appointmentId)
    .neq("sender_id", readerUserId)
    .eq("is_read", false);

  if (error) throw new Error(error.message);
  const ids = (data ?? []).map((row) => String(row.id));
  if (!ids.length) return 0;

  const { error: updateError } = await supabase
    .from("healthcare_appointment_messages")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .in("id", ids);

  if (updateError) throw new Error(updateError.message);
  return ids.length;
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
  bloodRequestId?: string | null;
}) {
  const supabase = getSupabase();
  const content = normalizedText(input.body);
  if (!content) throw new Error("Message body is required.");

  const roomKey = getDonorRoomKey(input.requesterUserId, input.donorUserId);
  const urgency = input.urgencyLevel ? normalizeUrgencyLevel(input.urgencyLevel) : null;

  const { data, error } = await supabase
    .from("healthcare_blood_donor_chats")
    .insert({
      id: randomUUID(),
      room_key: roomKey,
      donor_user_id: input.donorUserId,
      requester_user_id: input.requesterUserId,
      blood_request_id: normalizedNullableText(input.bloodRequestId),
      sender_id: input.senderId,
      sender_name: input.senderName,
      body: content,
      blood_group: normalizedNullableText(input.bloodGroup),
      urgency_level: urgency,
      location_city: normalizedNullableText(input.locationCity),
      donor_verified: Boolean(input.donorVerified),
    })
    .select("id,room_key,donor_user_id,requester_user_id,blood_request_id,sender_id,sender_name,body,blood_group,urgency_level,location_city,donor_verified,created_at")
    .single();

  if (error) throw new Error(error.message);

  return {
    messageId: String(data.id),
    roomKey: String(data.room_key),
    donorUserId: String(data.donor_user_id),
    requesterUserId: String(data.requester_user_id),
    bloodRequestId: data.blood_request_id ? String(data.blood_request_id) : null,
    senderId: String(data.sender_id),
    senderName: data.sender_name ? String(data.sender_name) : null,
    body: String(data.body),
    bloodGroup: data.blood_group ? String(data.blood_group) : null,
    urgencyLevel: data.urgency_level ? (String(data.urgency_level) as UrgencyLevel) : null,
    locationCity: data.location_city ? String(data.location_city) : null,
    donorVerified: Boolean(data.donor_verified),
    createdAt: new Date(String(data.created_at)).toISOString(),
  } satisfies DonorChatMessageRecord;
}

export async function listDonorChatMessages(requesterUserId: string, donorUserId: string) {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  const roomKey = getDonorRoomKey(requesterUserId, donorUserId);

  const { data, error } = await supabase
    .from("healthcare_blood_donor_chats")
    .select("id,room_key,donor_user_id,requester_user_id,blood_request_id,sender_id,sender_name,body,blood_group,urgency_level,location_city,donor_verified,created_at")
    .eq("room_key", roomKey)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    messageId: String(row.id),
    roomKey: String(row.room_key),
    donorUserId: String(row.donor_user_id),
    requesterUserId: String(row.requester_user_id),
    bloodRequestId: row.blood_request_id ? String(row.blood_request_id) : null,
    senderId: String(row.sender_id),
    senderName: row.sender_name ? String(row.sender_name) : null,
    body: String(row.body),
    bloodGroup: row.blood_group ? String(row.blood_group) : null,
    urgencyLevel: row.urgency_level ? (String(row.urgency_level) as UrgencyLevel) : null,
    locationCity: row.location_city ? String(row.location_city) : null,
    donorVerified: Boolean(row.donor_verified),
    createdAt: new Date(String(row.created_at)).toISOString(),
  } satisfies DonorChatMessageRecord));
}

export async function getBloodDonorMatches(input: {
  bloodGroup: string;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  city?: string;
  limit?: number;
}): Promise<BloodDonorMatch[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  const limit = Number.isFinite(input.limit) ? Math.max(1, Math.min(25, Number(input.limit))) : 10;

  let query = supabase
    .from("healthcare_blood_donor_chats")
    .select("donor_user_id,blood_group,urgency_level,location_city,donor_verified,created_at")
    .eq("donor_verified", true)
    .in("blood_group", [input.bloodGroup.toUpperCase(), "O+", "O-"])
    .order("created_at", { ascending: false })
    .limit(500);

  if (input.city && input.city.trim()) {
    query = query.ilike("location_city", input.city.trim());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const grouped = new Map<string, BloodDonorMatch>();
  for (const row of data ?? []) {
    const donorUserId = String(row.donor_user_id ?? "");
    if (!donorUserId || grouped.has(donorUserId)) continue;

    grouped.set(donorUserId, {
      donorUserId,
      bloodGroup: row.blood_group ? String(row.blood_group) : null,
      urgencyLevel: row.urgency_level ? String(row.urgency_level) : null,
      locationCity: row.location_city ? String(row.location_city) : null,
      donorVerified: Boolean(row.donor_verified),
      latestActivityAt: new Date(String(row.created_at)).toISOString(),
    });
  }

  const urgencyRank = new Map<string, number>([
    [input.urgencyLevel, 0],
    ["critical", 1],
    ["high", 2],
    ["medium", 3],
    ["low", 4],
  ]);

  return Array.from(grouped.values())
    .sort((a, b) => {
      const bgA = a.bloodGroup === input.bloodGroup.toUpperCase() ? 0 : 1;
      const bgB = b.bloodGroup === input.bloodGroup.toUpperCase() ? 0 : 1;
      if (bgA !== bgB) return bgA - bgB;

      const urgencyA = urgencyRank.get(a.urgencyLevel ?? "") ?? 99;
      const urgencyB = urgencyRank.get(b.urgencyLevel ?? "") ?? 99;
      if (urgencyA !== urgencyB) return urgencyA - urgencyB;

      return new Date(b.latestActivityAt).getTime() - new Date(a.latestActivityAt).getTime();
    })
    .slice(0, limit);
}

export async function assertHealthcareUserActive(userId: string) {
  if (!hasSupabaseConfig()) {
    return;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("healthcare_user_suspensions")
    .select("is_suspended,reason")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (data?.is_suspended) {
    const reason = data.reason ? String(data.reason) : "Access is temporarily suspended.";
    throw new Error(`SUSPENDED:${reason}`);
  }
}

export async function setHealthcareUserSuspension(input: {
  userId: string;
  isSuspended: boolean;
  reason?: string | null;
  actorUserId?: string | null;
}) {
  const supabase = getSupabase();
  const payload = {
    user_id: input.userId,
    is_suspended: input.isSuspended,
    reason: normalizedNullableText(input.reason),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("healthcare_user_suspensions")
    .upsert(payload, { onConflict: "user_id" });

  if (error) throw new Error(error.message);
}

export async function getHealthCareAnalytics() {
  if (!hasSupabaseConfig()) {
    return {
      doctorsTotal: 0,
      activePatientsTotal: 0,
      appointmentsTotal: 0,
      donorChatMessagesTotal: 0,
      appointmentMessagesTotal: 0,
      suspendedUsersTotal: 0,
      appointmentsByStatus: {},
    };
  }

  const supabase = getSupabase();

  const [doctors, activePatients, appointments, donorMessages, appointmentMessages, suspensions, byStatus] = await Promise.all([
    supabase.from("healthcare_doctors").select("id", { count: "exact", head: true }),
    supabase.from("healthcare_appointments").select("patient_user_id"),
    supabase.from("healthcare_appointments").select("id,status"),
    supabase.from("healthcare_blood_donor_chats").select("id", { count: "exact", head: true }),
    supabase.from("healthcare_appointment_messages").select("id", { count: "exact", head: true }),
    supabase.from("healthcare_user_suspensions").select("user_id", { count: "exact", head: true }).eq("is_suspended", true),
    supabase.from("healthcare_appointments").select("status"),
  ]);

  if (doctors.error) throw new Error(doctors.error.message);
  if (activePatients.error) throw new Error(activePatients.error.message);
  if (appointments.error) throw new Error(appointments.error.message);
  if (donorMessages.error) throw new Error(donorMessages.error.message);
  if (appointmentMessages.error) throw new Error(appointmentMessages.error.message);
  if (suspensions.error) throw new Error(suspensions.error.message);
  if (byStatus.error) throw new Error(byStatus.error.message);

  const uniquePatients = new Set((activePatients.data ?? []).map((row) => String(row.patient_user_id)));
  const appointmentsByStatus = (byStatus.data ?? []).reduce<Record<string, number>>((acc, row) => {
    const status = String(row.status);
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    doctorsTotal: doctors.count ?? 0,
    activePatientsTotal: uniquePatients.size,
    appointmentsTotal: appointments.data?.length ?? 0,
    donorChatMessagesTotal: donorMessages.count ?? 0,
    appointmentMessagesTotal: appointmentMessages.count ?? 0,
    suspendedUsersTotal: suspensions.count ?? 0,
    appointmentsByStatus,
  };
}

export async function logHealthCareAiInteraction(input: {
  userId?: string | null;
  question: string;
  answer: string;
}) {
  const supabase = getSupabase();
  const payload = {
    id: randomUUID(),
    user_id: normalizedNullableText(input.userId),
    question: normalizedText(input.question),
    answer: normalizedText(input.answer),
  };

  const healthcareWrite = await supabase.from("healthcare_ai_logs").insert(payload);
  if (healthcareWrite.error) {
    throw new Error(healthcareWrite.error.message);
  }

  const auditWrite = await supabase.from("ai_logs").insert({
    id: randomUUID(),
    user_id: payload.user_id,
    question: payload.question,
    response: payload.answer,
  });

  if (auditWrite.error) {
    throw new Error(auditWrite.error.message);
  }
}

export async function listHealthcareActivityLogs(limit = 100) {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = getSupabase();
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(200, Math.floor(limit))) : 100;

  const { data, error } = await supabase
    .from("healthcare_audit_logs")
    .select("id,actor_user_id,action,entity_type,entity_id,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    actorUserId: row.actor_user_id ? String(row.actor_user_id) : null,
    action: String(row.action),
    entityType: String(row.entity_type),
    entityId: row.entity_id ? String(row.entity_id) : null,
    metadata: row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
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
