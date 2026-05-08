import { prisma } from "@/lib/prisma";

export type UserRole = "donor" | "admin" | "hospital";

export type ProfileUpdateInput = {
  name?: string;
  phone?: string;
  city?: string;
  bloodGroup?: string;
  availabilityStatus?: "available" | "unavailable";
  lastDonationDate?: string | null;
  emergencyContact?: string;
  profileImage?: string;
  dateOfBirth?: string | null;
  gender?: string;
  address?: string;
  allergies?: string;
  medicalHistory?: string;
  occupation?: string;
  maritalStatus?: string;
};

let authSchemaReady: Promise<void> | null = null;

async function ensureAuthSchema() {
  if (!authSchemaReady) {
    authSchemaReady = (async () => {
      await prisma.$executeRawUnsafe("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text");

      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          CREATE TYPE "UserRole" AS ENUM ('donor', 'admin', 'hospital');
        EXCEPTION
          WHEN duplicate_object THEN NULL;
        END
        $$;
      `);

      await prisma.$executeRawUnsafe("ALTER TABLE users ADD COLUMN IF NOT EXISTS role \"UserRole\" NOT NULL DEFAULT 'donor'");
      await prisma.$executeRawUnsafe("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");
      await prisma.$executeRawUnsafe(`
        ALTER TABLE users
        ALTER COLUMN role TYPE "UserRole"
        USING (
          CASE
            WHEN role::text IN ('donor', 'admin', 'hospital') THEN role::text::"UserRole"
            ELSE 'donor'::"UserRole"
          END
        )
      `);
      await prisma.$executeRawUnsafe("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'donor'");

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS user_profile (
          user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          cnic text UNIQUE,
          phone text,
          city text,
          blood_group text,
          availability_status text NOT NULL DEFAULT 'unavailable',
          last_donation_date timestamptz,
          emergency_contact text,
          profile_image text,
          date_of_birth timestamptz,
          gender text,
          address text,
          allergies text,
          medical_history text,
          occupation text,
          marital_status text,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);

      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS cnic text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS phone text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS city text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS blood_group text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS availability_status text NOT NULL DEFAULT 'unavailable'");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS last_donation_date timestamptz");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS emergency_contact text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS profile_image text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS date_of_birth timestamptz");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS gender text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS address text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS allergies text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS medical_history text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS occupation text");
      await prisma.$executeRawUnsafe("ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS marital_status text");

      await prisma.$executeRawUnsafe("CREATE UNIQUE INDEX IF NOT EXISTS user_profile_cnic_key ON user_profile (cnic)");
      await prisma.$executeRawUnsafe("CREATE INDEX IF NOT EXISTS user_profile_city_blood_group_availability_idx ON user_profile (city, blood_group, availability_status)");

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash text NOT NULL,
          expires_at timestamptz NOT NULL,
          used boolean NOT NULL DEFAULT false,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `);

      await prisma.$executeRawUnsafe(
        "CREATE INDEX IF NOT EXISTS password_reset_tokens_user_used_expiry_idx ON password_reset_tokens (user_id, used, expires_at)"
      );
    })();
  }

  try {
    await authSchemaReady;
  } catch (error) {
    authSchemaReady = null;
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  await ensureAuthSchema();
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByEmailWithProfile(email: string) {
  await ensureAuthSchema();
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
}

export async function createUserWithProfile(input: {
  name: string;
  email: string;
  cnic: string;
  passwordHash: string;
  role: UserRole;
}) {
  await ensureAuthSchema();
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      profile: {
        create: {
          cnic: input.cnic,
          availabilityStatus: "unavailable",
        },
      },
    },
  });
}

export async function getUserWithProfileById(userId: string) {
  await ensureAuthSchema();
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

export async function upsertProfile(userId: string, updates: ProfileUpdateInput) {
  await ensureAuthSchema();
  const parsedLastDonationDate = updates.lastDonationDate ? new Date(updates.lastDonationDate) : null;
  const parsedDateOfBirth = updates.dateOfBirth ? new Date(updates.dateOfBirth) : null;

  if (updates.name && updates.name.trim()) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: updates.name.trim() },
    });
  }

  return prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      phone: updates.phone || null,
      city: updates.city || null,
      bloodGroup: updates.bloodGroup || null,
      availabilityStatus: updates.availabilityStatus ?? "unavailable",
      lastDonationDate: parsedLastDonationDate,
      emergencyContact: updates.emergencyContact || null,
      profileImage: updates.profileImage || null,
      dateOfBirth: parsedDateOfBirth,
      gender: updates.gender || null,
      address: updates.address || null,
      allergies: updates.allergies || null,
      medicalHistory: updates.medicalHistory || null,
      occupation: updates.occupation || null,
      maritalStatus: updates.maritalStatus || null,
    },
    update: {
      phone: updates.phone || null,
      city: updates.city || null,
      bloodGroup: updates.bloodGroup || null,
      availabilityStatus: updates.availabilityStatus ?? "unavailable",
      lastDonationDate: parsedLastDonationDate,
      emergencyContact: updates.emergencyContact || null,
      profileImage: updates.profileImage || null,
      dateOfBirth: parsedDateOfBirth,
      gender: updates.gender || null,
      address: updates.address || null,
      allergies: updates.allergies || null,
      medicalHistory: updates.medicalHistory || null,
      occupation: updates.occupation || null,
      maritalStatus: updates.maritalStatus || null,
    },
  });
}

export async function resetProfile(userId: string) {
  await ensureAuthSchema();
  return prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      availabilityStatus: "unavailable",
    },
    update: {
      phone: null,
      city: null,
      bloodGroup: null,
      availabilityStatus: "unavailable",
      lastDonationDate: null,
      emergencyContact: null,
      profileImage: null,
    },
  });
}

export async function createPasswordResetTokenRecord(input: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  await ensureAuthSchema();
  return prisma.passwordResetToken.create({
    data: input,
  });
}

export async function markUserResetTokensUsed(userId: string) {
  await ensureAuthSchema();
  return prisma.passwordResetToken.updateMany({
    where: {
      userId,
      used: false,
    },
    data: {
      used: true,
    },
  });
}

export async function findValidResetToken(tokenHash: string) {
  await ensureAuthSchema();
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function consumeResetToken(tokenId: string) {
  await ensureAuthSchema();
  return prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { used: true },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await ensureAuthSchema();
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function listDonorProfiles() {
  await ensureAuthSchema();
  return prisma.user.findMany({
    where: {
      role: "donor",
      email: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: {
        select: {
          city: true,
          bloodGroup: true,
          availabilityStatus: true,
          lastDonationDate: true,
          emergencyContact: true,
          phone: true,
          profileImage: true,
        },
      },
    },
  });
}
