-- Healthcare Complete Reset and Setup for Supabase
-- Run this in Supabase SQL Editor to fix profile and healthcare issues
-- This script drops and recreates everything cleanly

BEGIN;

-- Drop existing tables that might be broken
DROP TABLE IF EXISTS healthcare_appointments CASCADE;
DROP TABLE IF EXISTS healthcare_appointment_messages CASCADE;
DROP TABLE IF EXISTS healthcare_blood_donor_chats CASCADE;
DROP TABLE IF EXISTS healthcare_doctor_slots CASCADE;
DROP TABLE IF EXISTS healthcare_doctor_signup_requests CASCADE;
DROP TABLE IF EXISTS healthcare_doctors CASCADE;
DROP TABLE IF EXISTS healthcare_audit_logs CASCADE;
DROP TABLE IF EXISTS healthcare_ai_logs CASCADE;
DROP TABLE IF EXISTS healthcare_user_suspensions CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
DROP TABLE IF EXISTS ai_logs CASCADE;

-- Recreate user_profile table (required by profile service)
CREATE TABLE user_profile (
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

CREATE INDEX user_profile_city_blood_group_availability_idx
ON user_profile (city, blood_group, availability_status);

-- Enable RLS and grant service role access
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_profile_all ON user_profile FOR ALL USING (true) WITH CHECK (true);

-- Recreate healthcare tables
CREATE TABLE healthcare_doctors (
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

CREATE TABLE healthcare_doctor_signup_requests (
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

CREATE TABLE healthcare_doctor_slots (
  id text PRIMARY KEY,
  doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
  slot_start timestamptz NOT NULL,
  slot_end timestamptz NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE healthcare_appointments (
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

CREATE TABLE healthcare_appointment_messages (
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

CREATE TABLE healthcare_blood_donor_chats (
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

CREATE TABLE healthcare_audit_logs (
  id text PRIMARY KEY,
  actor_user_id text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE healthcare_ai_logs (
  id text PRIMARY KEY,
  user_id text,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai_logs (
  id text PRIMARY KEY,
  user_id text,
  question text NOT NULL,
  response text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE healthcare_user_suspensions (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_suspended boolean NOT NULL DEFAULT false,
  reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX healthcare_doctors_user_id_idx ON healthcare_doctors (user_id);
CREATE INDEX healthcare_doctor_signup_requests_status_idx ON healthcare_doctor_signup_requests (status, created_at DESC);
CREATE INDEX healthcare_slots_doctor_id_idx ON healthcare_doctor_slots (doctor_id, slot_start DESC);
CREATE INDEX healthcare_appointments_doctor_idx ON healthcare_appointments (doctor_id, created_at DESC);
CREATE INDEX healthcare_appointments_patient_idx ON healthcare_appointments (patient_user_id, created_at DESC);
CREATE INDEX healthcare_appointment_messages_idx ON healthcare_appointment_messages (appointment_id, created_at ASC);
CREATE INDEX healthcare_blood_donor_chats_room_idx ON healthcare_blood_donor_chats (room_key, created_at ASC);
CREATE INDEX healthcare_blood_donor_chats_lookup_idx ON healthcare_blood_donor_chats (donor_user_id, requester_user_id, created_at DESC);
CREATE INDEX healthcare_audit_logs_created_idx ON healthcare_audit_logs (created_at DESC);
CREATE INDEX healthcare_ai_logs_created_idx ON healthcare_ai_logs (created_at DESC);
CREATE INDEX ai_logs_timestamp_idx ON ai_logs (timestamp DESC);

-- Enable RLS on all healthcare tables
ALTER TABLE healthcare_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_doctor_signup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_doctor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_appointment_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_blood_donor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access to all healthcare tables
CREATE POLICY healthcare_doctors_all ON healthcare_doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_doctor_signup_requests_all ON healthcare_doctor_signup_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_slots_all ON healthcare_doctor_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_appointments_all ON healthcare_appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_messages_all ON healthcare_appointment_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_donor_chats_all ON healthcare_blood_donor_chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_suspensions_all ON healthcare_user_suspensions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY healthcare_ai_logs_all ON healthcare_ai_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY ai_logs_all ON ai_logs FOR ALL USING (true) WITH CHECK (true);

-- Insert sample doctors
INSERT INTO healthcare_doctors (id, email, full_name, specialization, bio, experience_years, consultation_fee)
VALUES
  ('doc_001', 'dr.ahmed@example.com', 'Dr. Ahmed Khan', 'Cardiology', 'Specialist in heart and cardiovascular diseases', 15, 500.00),
  ('doc_002', 'dr.fatima@example.com', 'Dr. Fatima Ali', 'Pediatrics', 'Experienced pediatrician caring for children', 12, 400.00),
  ('doc_003', 'dr.hassan@example.com', 'Dr. Hassan Malik', 'General Medicine', 'General practitioner with internal medicine expertise', 10, 300.00),
  ('doc_004', 'dr.aisha@example.com', 'Dr. Aisha Khan', 'Orthopedics', 'Specialist in bone and joint disorders', 8, 450.00),
  ('doc_005', 'dr.omar@example.com', 'Dr. Omar Hassan', 'Dermatology', 'Expert in skin conditions and treatments', 9, 350.00)
ON CONFLICT (id) DO NOTHING;

-- Generate appointment slots for next 7 days (2-3 slots per doctor per day)
INSERT INTO healthcare_doctor_slots (id, doctor_id, slot_start, slot_end, is_available)
SELECT
  'slot_' || row_number() OVER (ORDER BY doc.id, day_offset, slot_hour),
  doc.id,
  now()::date + (day_offset || ' days')::interval + (slot_hour || ':00')::time,
  now()::date + (day_offset || ' days')::interval + ((slot_hour + 1) || ':00')::time,
  true
FROM
  (SELECT id FROM healthcare_doctors ORDER BY id) doc
  CROSS JOIN (SELECT 1 as day_offset UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) days
  CROSS JOIN (SELECT 9 as slot_hour UNION ALL SELECT 11 UNION ALL SELECT 14 UNION ALL SELECT 16) times
ON CONFLICT DO NOTHING;

COMMIT;
