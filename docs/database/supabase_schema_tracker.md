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
