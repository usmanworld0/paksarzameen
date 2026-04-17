-- PSZ Main Web (Phase 2)
-- Added for model parity: Program, Article, ImpactStat

CREATE TABLE IF NOT EXISTS programs (
	id uuid PRIMARY KEY,
	title text NOT NULL,
	description text NOT NULL,
	image text NOT NULL,
	category text NOT NULL,
	slug text NOT NULL UNIQUE,
	full_content text NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
	id uuid PRIMARY KEY,
	title text NOT NULL,
	excerpt text NOT NULL,
	date timestamptz NOT NULL,
	category text NOT NULL,
	image text NOT NULL,
	slug text NOT NULL UNIQUE,
	full_content text NOT NULL
);

CREATE TABLE IF NOT EXISTS impact_stats (
	id uuid PRIMARY KEY,
	label text NOT NULL,
	value integer NOT NULL,
	icon text NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
	id uuid PRIMARY KEY,
	name text NOT NULL,
	code text NOT NULL UNIQUE,
	description text,
	discount_percent double precision NOT NULL,
	min_subtotal double precision,
	active boolean NOT NULL DEFAULT true,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

-- Paksarzameen Store (Product Information accordion fields)
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS heritage_story text;

-- Paksarzameen Store (Category customization hierarchy)
ALTER TABLE customization_options ADD COLUMN IF NOT EXISTS subcategory text NOT NULL DEFAULT 'General';
ALTER TABLE customization_options ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS customization_options_category_subcategory_position_idx
ON customization_options (category_id, subcategory, position);

-- PSZ Main Web (Blood Bank emergency workflow)
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

CREATE INDEX IF NOT EXISTS blood_bank_requests_status_idx
ON blood_bank_requests (status);

CREATE INDEX IF NOT EXISTS blood_bank_requests_needed_at_idx
ON blood_bank_requests (needed_at);

-- PSZ Main Web (Google Auth + Customer Art Gallery)
CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name text,
	email text UNIQUE,
	email_verified timestamptz,
	image text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	type text NOT NULL,
	provider text NOT NULL,
	provider_account_id text NOT NULL,
	refresh_token text,
	access_token text,
	expires_at integer,
	token_type text,
	scope text,
	id_token text,
	session_state text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	UNIQUE (provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS accounts_user_id_idx
ON accounts (user_id);

CREATE TABLE IF NOT EXISTS sessions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	session_token text NOT NULL UNIQUE,
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx
ON sessions (user_id);

CREATE TABLE IF NOT EXISTS verification_tokens (
	identifier text NOT NULL,
	token text NOT NULL,
	expires timestamptz NOT NULL,
	PRIMARY KEY (identifier, token)
);

CREATE TABLE IF NOT EXISTS images (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	public_id text NOT NULL UNIQUE,
	image_url text NOT NULL,
	thumbnail_url text,
	original_filename text,
	mime_type text,
	file_size integer,
	width integer,
	height integer,
	caption text,
	approved boolean NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS images_user_id_approved_idx
ON images (user_id, approved);

CREATE INDEX IF NOT EXISTS images_approved_created_at_idx
ON images (approved, created_at DESC);

-- PSZ Main Web (Email OTP Authentication)
CREATE TABLE IF NOT EXISTS otp_codes (
	id uuid PRIMARY KEY,
	email text NOT NULL,
	otp text NOT NULL,
	expires_at timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS otp_codes_email_created_at_idx
ON otp_codes (email, created_at DESC);

CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx
ON otp_codes (expires_at);

-- PSZ Main Web (Email/Password Auth + User Management)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'donor';

CREATE TABLE IF NOT EXISTS user_profile (
	user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS password_reset_tokens (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token_hash text NOT NULL,
	expires_at timestamptz NOT NULL,
	used boolean NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_used_expiry_idx
ON password_reset_tokens (user_id, used, expires_at);

-- Paksarzameen Store (Google Auth + Gallery parity)
-- The store app now uses the same auth and gallery table set as the main app.

-- Paksarzameen Store (Manual gallery signup + approval workflow)
CREATE TABLE IF NOT EXISTS gallery_manual_signups (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
	full_name text NOT NULL,
	email text NOT NULL UNIQUE,
	status text NOT NULL DEFAULT 'active',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_manual_signups_status_idx
ON gallery_manual_signups (status);

CREATE TABLE IF NOT EXISTS gallery_manual_sessions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	signup_id uuid NOT NULL REFERENCES gallery_manual_signups(id) ON DELETE CASCADE,
	token text NOT NULL UNIQUE,
	expires_at timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_manual_sessions_signup_id_idx
ON gallery_manual_sessions (signup_id);

CREATE INDEX IF NOT EXISTS gallery_manual_sessions_expires_at_idx
ON gallery_manual_sessions (expires_at);

-- PSZ Main Web (Dog Adoption module)
CREATE TABLE IF NOT EXISTS dogs (
	id text PRIMARY KEY,
	name text NOT NULL,
	breed text NOT NULL,
	age text NOT NULL,
	gender text NOT NULL,
	description text NOT NULL,
	image_url text NOT NULL,
	status text NOT NULL DEFAULT 'available',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT dogs_status_check CHECK (status IN ('available', 'pending', 'adopted'))
);

CREATE INDEX IF NOT EXISTS dogs_status_idx
ON dogs (status);

CREATE TABLE IF NOT EXISTS adoption_requests (
	id text PRIMARY KEY,
	dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	status text NOT NULL DEFAULT 'pending',
	requested_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT adoption_requests_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS adoption_requests_dog_id_idx
ON adoption_requests (dog_id);

CREATE INDEX IF NOT EXISTS adoption_requests_user_id_idx
ON adoption_requests (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS adoption_requests_pending_unique_idx
ON adoption_requests (dog_id)
WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS dog_post_adoption_updates (
	id text PRIMARY KEY,
	dog_id text NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
	image_url text NOT NULL,
	caption text NOT NULL,
	collar_tag text,
	uploaded_at timestamptz NOT NULL DEFAULT now(),
	uploaded_by text NOT NULL
);

CREATE INDEX IF NOT EXISTS dog_post_updates_dog_id_idx
ON dog_post_adoption_updates (dog_id, uploaded_at DESC);

-- PSZ Main Web (Supabase Auth + RBAC migration)
CREATE TABLE IF NOT EXISTS profiles (
	id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
	email text NOT NULL UNIQUE,
	role text NOT NULL DEFAULT 'user',
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'tenant', 'user'))
);

CREATE TABLE IF NOT EXISTS tenant_permissions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	module text NOT NULL,
	can_view boolean NOT NULL DEFAULT false,
	can_edit boolean NOT NULL DEFAULT false,
	can_manage boolean NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT tenant_permissions_module_check CHECK (module IN ('dog_adoption', 'blood_bank')),
	UNIQUE (user_id, module)
);

CREATE INDEX IF NOT EXISTS tenant_permissions_user_module_idx
ON tenant_permissions (user_id, module);

-- When migrating from legacy users table relationships, align adoption requester to profiles/auth.users.
ALTER TABLE adoption_requests
	DROP CONSTRAINT IF EXISTS adoption_requests_user_id_fkey;

ALTER TABLE adoption_requests
	ADD CONSTRAINT adoption_requests_user_id_fkey
	FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_post_adoption_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_bank_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own profile, admin can manage all.
CREATE POLICY profiles_select_own_or_admin ON profiles
FOR SELECT USING (auth.uid() = id OR EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

CREATE POLICY profiles_update_own_or_admin ON profiles
FOR UPDATE USING (auth.uid() = id OR EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Tenant permissions: user can read own entries, admin can manage all.
CREATE POLICY tenant_permissions_select_own_or_admin ON tenant_permissions
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

CREATE POLICY tenant_permissions_admin_manage ON tenant_permissions
FOR ALL USING (EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Dogs module: admins full access, authenticated users readable,
-- tenants must have dog_adoption view permission.
CREATE POLICY dogs_select_with_dog_permission ON dogs
FOR SELECT USING (
	EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
	OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'user')
	OR EXISTS (
		SELECT 1 FROM tenant_permissions tp
		WHERE tp.user_id = auth.uid() AND tp.module = 'dog_adoption' AND tp.can_view = true
	)
);

CREATE POLICY dogs_admin_manage ON dogs
FOR ALL USING (EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Adoption requests: requester can read/write own requests, admins full access.
CREATE POLICY adoption_requests_select_own_or_admin ON adoption_requests
FOR SELECT USING (
	user_id = auth.uid()
	OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY adoption_requests_insert_self ON adoption_requests
FOR INSERT WITH CHECK (
	user_id = auth.uid()
	AND (
		EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'user')
		OR EXISTS (
			SELECT 1 FROM tenant_permissions tp
			WHERE tp.user_id = auth.uid() AND tp.module = 'dog_adoption' AND tp.can_view = true
		)
	)
);

CREATE POLICY adoption_requests_admin_manage ON adoption_requests
FOR ALL USING (EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Dog post-adoption updates and blood requests: admin-managed tables.
CREATE POLICY dog_post_updates_admin_only ON dog_post_adoption_updates
FOR ALL USING (EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

CREATE POLICY blood_bank_requests_admin_full ON blood_bank_requests
FOR ALL USING (EXISTS (
	SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
));

CREATE POLICY blood_bank_requests_insert_public ON blood_bank_requests
FOR INSERT WITH CHECK (true);

-- PSZ Main Web (HealthCare module)
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

CREATE TABLE IF NOT EXISTS healthcare_doctor_slots (
	id text PRIMARY KEY,
	doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
	slot_start timestamptz NOT NULL,
	slot_end timestamptz NOT NULL,
	is_available boolean NOT NULL DEFAULT true,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_appointments (
	id text PRIMARY KEY,
	doctor_id text NOT NULL REFERENCES healthcare_doctors(id) ON DELETE CASCADE,
	patient_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	slot_id text NOT NULL REFERENCES healthcare_doctor_slots(id) ON DELETE CASCADE,
	reason text NOT NULL,
	status text NOT NULL DEFAULT 'pending',
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
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS healthcare_blood_donor_chats (
	id text PRIMARY KEY,
	room_key text NOT NULL,
	donor_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	requester_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	sender_id text NOT NULL,
	sender_name text,
	body text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS healthcare_doctors_user_id_idx
ON healthcare_doctors (user_id);

CREATE INDEX IF NOT EXISTS healthcare_slots_doctor_id_idx
ON healthcare_doctor_slots (doctor_id, slot_start DESC);

CREATE INDEX IF NOT EXISTS healthcare_appointments_doctor_idx
ON healthcare_appointments (doctor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_appointments_patient_idx
ON healthcare_appointments (patient_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS healthcare_appointment_messages_idx
ON healthcare_appointment_messages (appointment_id, created_at ASC);

CREATE INDEX IF NOT EXISTS healthcare_blood_donor_chats_room_idx
ON healthcare_blood_donor_chats (room_key, created_at ASC);
