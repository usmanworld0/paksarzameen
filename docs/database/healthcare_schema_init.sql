-- Healthcare schema bootstrap for Supabase
-- Run this in Supabase SQL Editor for the same project used by auth.
-- This ensures all tables needed for healthcare and profile management exist.

BEGIN;

-- Ensure user_profile table exists (required by profile service)
CREATE TABLE IF NOT EXISTS user_profile (
	user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
	phone text,
	city text,
	blood_group text,
	availability_status text NOT NULL DEFAULT 'unavailable',
	last_donation_date timestamptz,
	emergency_contact text,
	profile_image text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_profile_city_blood_group_availability_idx
ON user_profile (city, blood_group, availability_status);

-- Allow service role to access user_profile
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_profile_service_role_access ON user_profile;

CREATE POLICY user_profile_service_role_access ON user_profile
  AS PERMISSIVE
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Healthcare schema tables
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

CREATE TABLE IF NOT EXISTS healthcare_doctor_signup_requests (
  id text PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  specialization text,
  bio text,
  experience_years integer,
  consultation_fee numeric(10,2),
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT healthcare_doctor_signup_requests_status_check CHECK (status IN ('pending', 'approved', 'declined'))
);

CREATE TABLE IF NOT EXISTS healthcare_doctor_slots (
  id text PRIMARY KEY,
  doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  CONSTRAINT healthcare_doctor_slots_time_check CHECK (slot_end > slot_start),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_appointments (
  id text PRIMARY KEY,
  doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
  patient_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot_id text NOT NULL REFERENCES healthcare_doctor_slots(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT healthcare_appointments_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

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

CREATE TABLE IF NOT EXISTS healthcare_blood_donor_chats (
  id text PRIMARY KEY,
  room_key text NOT NULL,
  donor_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requester_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blood_request_id text,
  sender_id text NOT NULL,
  sender_name text,
  body text NOT NULL,
  blood_group text,
  urgency_level text,
  location_city text,
  donor_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_audit_logs (
  id text PRIMARY KEY,
  actor_user_id text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_ai_logs (
  id text PRIMARY KEY,
  user_id text,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_logs (
  id text PRIMARY KEY,
  user_id text,
  question text NOT NULL,
  response text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_user_suspensions (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_suspended boolean NOT NULL DEFAULT false,
  reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS healthcare_doctors_user_id_idx
ON healthcare_doctors (user_id);

CREATE INDEX IF NOT EXISTS healthcare_doctor_signup_requests_status_idx
ON healthcare_doctor_signup_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_slots_doctor_id_idx
ON healthcare_doctor_slots (doctor_id, slot_start DESC);

CREATE INDEX IF NOT EXISTS healthcare_slots_available_idx
ON healthcare_doctor_slots (doctor_id, is_available, slot_start);

CREATE UNIQUE INDEX IF NOT EXISTS healthcare_slots_doctor_time_unique
ON healthcare_doctor_slots (doctor_id, slot_start, slot_end);

CREATE INDEX IF NOT EXISTS healthcare_appointments_doctor_idx
ON healthcare_appointments (doctor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_appointments_patient_idx
ON healthcare_appointments (patient_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_appointments_slot_idx
ON healthcare_appointments (slot_id);

CREATE UNIQUE INDEX IF NOT EXISTS healthcare_appointments_active_slot_unique
ON healthcare_appointments (slot_id)
WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS healthcare_appointment_messages_idx
ON healthcare_appointment_messages (appointment_id, created_at ASC);

CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_room_idx
ON healthcare_blood_donor_chats (room_key, created_at ASC);

CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_lookup_idx
ON healthcare_blood_donor_chats (donor_user_id, requester_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_audit_logs_created_idx
ON healthcare_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_ai_logs_created_idx
ON healthcare_ai_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS ai_logs_timestamp_idx
ON ai_logs (timestamp DESC);

-- Enable RLS on healthcare tables
ALTER TABLE healthcare_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_doctor_signup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_doctor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_appointment_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_blood_donor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all healthcare tables
DROP POLICY IF EXISTS healthcare_service_role_access ON healthcare_doctors;
DROP POLICY IF EXISTS healthcare_service_role_signup_requests ON healthcare_doctor_signup_requests;
DROP POLICY IF EXISTS healthcare_service_role_slots ON healthcare_doctor_slots;
DROP POLICY IF EXISTS healthcare_service_role_appointments ON healthcare_appointments;
DROP POLICY IF EXISTS healthcare_service_role_messages ON healthcare_appointment_messages;
DROP POLICY IF EXISTS healthcare_service_role_donor_chats ON healthcare_blood_donor_chats;
DROP POLICY IF EXISTS healthcare_service_role_audit_logs ON healthcare_audit_logs;
DROP POLICY IF EXISTS healthcare_service_role_suspensions ON healthcare_user_suspensions;
DROP POLICY IF EXISTS healthcare_service_role_ai_logs ON healthcare_ai_logs;
DROP POLICY IF EXISTS ai_logs_service_role ON ai_logs;

CREATE POLICY healthcare_service_role_access ON healthcare_doctors
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_signup_requests ON healthcare_doctor_signup_requests
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_slots ON healthcare_doctor_slots
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_appointments ON healthcare_appointments
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_messages ON healthcare_appointment_messages
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_donor_chats ON healthcare_blood_donor_chats
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_audit_logs ON healthcare_audit_logs
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_suspensions ON healthcare_user_suspensions
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY healthcare_service_role_ai_logs ON healthcare_ai_logs
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY ai_logs_service_role ON ai_logs
  AS PERMISSIVE FOR ALL USING (true) WITH CHECK (true);

COMMIT;

