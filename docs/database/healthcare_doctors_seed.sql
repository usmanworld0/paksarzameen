-- Healthcare doctors seed data
-- Run this in Supabase SQL Editor after healthcare_schema_init.sql
-- This populates sample doctors and available slots for immediate testing

BEGIN;

-- Insert sample doctors
INSERT INTO healthcare_doctors (id, email, full_name, specialization, bio, experience_years, consultation_fee, created_at, updated_at)
VALUES
  ('doc_001', 'dr.Ahmed@example.com', 'Dr. Ahmed Khan', 'Cardiology', 'Specialist in heart and cardiovascular diseases with 15 years of experience', 15, 500.00, now(), now()),
  ('doc_002', 'dr.Fatima@example.com', 'Dr. Fatima Ali', 'Pediatrics', 'Experienced pediatrician caring for children of all ages', 12, 400.00, now(), now()),
  ('doc_003', 'dr.Hassan@example.com', 'Dr. Hassan Malik', 'General Medicine', 'General practitioner with expertise in internal medicine', 10, 300.00, now(), now()),
  ('doc_004', 'dr.Aisha@example.com', 'Dr. Aisha Khan', 'Orthopedics', 'Specialist in bone and joint disorders', 8, 450.00, now(), now()),
  ('doc_005', 'dr.Omar@example.com', 'Dr. Omar Hassan', 'Dermatology', 'Expert in skin conditions and cosmetic treatments', 9, 350.00, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample appointment slots (next 7 days, 2 slots per day per doctor)
INSERT INTO healthcare_doctor_slots (id, doctor_id, slot_start, slot_end, is_available, created_at)
SELECT
  'slot_' || row_number() OVER (ORDER BY doc.id, day_offset, slot_hour),
  doc.id,
  (now()::date + (day_offset || ' days')::interval + (slot_hour || ':00')::time)::timestamptz,
  (now()::date + (day_offset || ' days')::interval + ((slot_hour + 1) || ':00')::time)::timestamptz,
  true,
  now()
FROM
  (SELECT id FROM healthcare_doctors LIMIT 5) doc
  CROSS JOIN (SELECT 1 as day_offset UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) days
  CROSS JOIN (SELECT 10 as slot_hour UNION ALL SELECT 14 UNION ALL SELECT 16) times
WHERE
  NOT EXISTS (
    SELECT 1 FROM healthcare_doctor_slots
    WHERE doctor_id = doc.id
  )
ON CONFLICT DO NOTHING;

COMMIT;
