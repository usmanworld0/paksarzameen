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
