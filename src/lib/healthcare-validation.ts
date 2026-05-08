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

export const appointmentListQuerySchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  search: z.string().trim().max(120).optional(),
  sortBy: z.enum(["createdAt", "slotStart"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const dateTimeFlexibleSchema = z.string().trim().refine((value) => !Number.isNaN(new Date(value).getTime()), {
  message: "Invalid date/time format.",
});

const dateOnlySchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD.");
const timeOnlySchema = z.string().trim().regex(/^\d{2}:\d{2}$/, "Invalid time format. Use HH:MM.");

export const doctorSlotCreateSchema = z.object({
  slotStart: dateTimeFlexibleSchema,
  slotEnd: dateTimeFlexibleSchema,
});

export const doctorBulkScheduleCreateSchema = z.object({
  startDate: dateOnlySchema,
  endDate: dateOnlySchema.optional(),
  startTime: timeOnlySchema,
  endTime: timeOnlySchema,
  slotDurationMinutes: z.number().int().min(10).max(240),
});

export const doctorSlotAvailabilitySchema = z.object({
  slotId: z.string().trim().min(1),
  isAvailable: z.boolean(),
});

export const doctorSlotDeleteSchema = z.object({
  slotId: z.string().trim().min(1),
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

export const doctorSignupSchema = doctorCreateSchema;

export const doctorSignupRequestUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(80).nullable().optional(),
  bio: z.string().trim().max(1200).nullable().optional(),
  experienceYears: z.number().int().min(0).max(70).nullable().optional(),
  consultationFee: z.number().min(0).max(1_000_000).nullable().optional(),
});

export const doctorSignupRequestReviewSchema = z.object({
  status: z.enum(["approved", "declined"]),
  adminNote: z.string().trim().max(800).nullable().optional(),
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

export const doctorListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  specialization: z.string().trim().max(80).optional(),
  minExperience: z.coerce.number().int().min(0).max(70).optional(),
  maxFee: z.coerce.number().min(0).max(1_000_000).optional(),
  sortBy: z.enum(["recent", "experience", "fee", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const doctorAppointmentQuerySchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  search: z.string().trim().max(120).optional(),
  sortBy: z.enum(["createdAt", "slotStart"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const doctorProfileUpdateSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    specialization: z.string().trim().max(80).nullable().optional(),
    bio: z.string().trim().max(1200).nullable().optional(),
    experienceYears: z.number().int().min(0).max(70).nullable().optional(),
    consultationFee: z.number().min(0).max(1_000_000).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field must be provided.",
  });
