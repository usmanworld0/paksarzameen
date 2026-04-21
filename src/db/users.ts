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

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUserWithProfile(input: {
  name: string;
  email: string;
  cnic: string;
  passwordHash: string;
  role: UserRole;
}) {
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      cnic: input.cnic,
      passwordHash: input.passwordHash,
      role: input.role,
      profile: {
        create: {
          availabilityStatus: "unavailable",
        },
      },
    },
  });
}

export async function getUserWithProfileById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

export async function upsertProfile(userId: string, updates: ProfileUpdateInput) {
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
  return prisma.passwordResetToken.create({
    data: input,
  });
}

export async function markUserResetTokensUsed(userId: string) {
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
  return prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { used: true },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function listDonorProfiles() {
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
