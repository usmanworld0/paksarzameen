import { z } from "zod";

const bloodGroupSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^(A|B|AB|O)[+-]$/, "Invalid blood group format.")
  .optional();

const urgencyLevelSchema = z.enum(["low", "medium", "high", "critical"]);

export const aiQuestionSchema = z.object({
  question: z.string().trim().min(2).max(800),
});

export const appointmentCreateSchema = z.object({
  doctorId: z.string().trim().min(1),
  slotId: z.string().trim().min(1),
  reason: z.string().trim().min(3).max(1500),
});

export const appointmentCancelSchema = z.object({
  appointmentId: z.string().trim().min(1),
  status: z.literal("cancelled"),
});

export const doctorSlotCreateSchema = z.object({
  slotStart: z.string().datetime({ offset: true }),
  slotEnd: z.string().datetime({ offset: true }),
});

export const appointmentMessageCreateSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  attachmentUrl: z.string().url().optional(),
});

export const donorChatCreateSchema = z.object({
  donorUserId: z.string().trim().min(1),
  body: z.string().trim().min(1).max(2000),
  bloodGroup: bloodGroupSchema,
  urgencyLevel: urgencyLevelSchema.optional(),
  locationCity: z.string().trim().min(2).max(80).optional(),
  donorVerified: z.boolean().optional(),
  bloodRequestId: z.string().trim().min(1).optional(),
});

export const bloodMatchQuerySchema = z.object({
  bloodGroup: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(A|B|AB|O)[+-]$/, "Invalid blood group format."),
  urgencyLevel: urgencyLevelSchema,
  city: z.string().trim().min(2).max(80).optional(),
});

export const doctorCreateSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(80).optional(),
  bio: z.string().trim().max(1200).optional(),
  experienceYears: z.number().int().min(0).max(70).nullable().optional(),
  consultationFee: z.number().min(0).max(1_000_000).nullable().optional(),
});

export const suspensionSchema = z.object({
  userId: z.string().trim().min(1),
  isSuspended: z.boolean(),
  reason: z.string().trim().max(800).optional(),
});

export const doctorAppointmentStatusSchema = z.object({
  appointmentId: z.string().trim().min(1),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});
