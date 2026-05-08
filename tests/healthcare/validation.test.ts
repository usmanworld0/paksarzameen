import assert from "node:assert/strict";
import test from "node:test";
import {
  aiQuestionSchema,
  appointmentCreateSchema,
  bloodMatchQuerySchema,
  doctorCreateSchema,
} from "@/lib/healthcare-validation";

test("aiQuestionSchema accepts valid payload", () => {
  const result = aiQuestionSchema.safeParse({ question: "General fever guidance" });
  assert.equal(result.success, true);
});

test("aiQuestionSchema rejects too-short question", () => {
  const result = aiQuestionSchema.safeParse({ question: "a" });
  assert.equal(result.success, false);
});

test("appointmentCreateSchema enforces required fields", () => {
  const ok = appointmentCreateSchema.safeParse({
    doctorId: "doc-1",
    slotId: "slot-1",
    reason: "Need a follow-up consultation",
  });
  assert.equal(ok.success, true);

  const bad = appointmentCreateSchema.safeParse({
    doctorId: "",
    slotId: "slot-1",
    reason: "x",
  });
  assert.equal(bad.success, false);
});

test("bloodMatchQuerySchema validates blood groups", () => {
  const ok = bloodMatchQuerySchema.safeParse({ bloodGroup: "A+", urgencyLevel: "high" });
  assert.equal(ok.success, true);

  const bad = bloodMatchQuerySchema.safeParse({ bloodGroup: "X+", urgencyLevel: "high" });
  assert.equal(bad.success, false);
});

test("doctorCreateSchema enforces minimum strong payload", () => {
  const ok = doctorCreateSchema.safeParse({
    email: "doctor@example.com",
    password: "StrongPass123",
    fullName: "Dr. Example",
  });
  assert.equal(ok.success, true);

  const bad = doctorCreateSchema.safeParse({
    email: "bad-email",
    password: "123",
    fullName: "",
  });
  assert.equal(bad.success, false);
});
