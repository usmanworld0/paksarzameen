import assert from "node:assert/strict";
import test from "node:test";
import { mapHealthcareError } from "@/services/healthcare/error-mapper";

test("mapHealthcareError maps suspension errors", () => {
  const result = mapHealthcareError(new Error("SUSPENDED:Access blocked"), "fallback");
  assert.equal(result.status, 403);
  assert.equal(result.code, "HEALTHCARE_USER_SUSPENDED");
  assert.equal(result.message, "Access blocked");
});

test("mapHealthcareError maps validation-style errors", () => {
  const result = mapHealthcareError(new Error("Invalid slot payload."), "fallback");
  assert.equal(result.status, 400);
  assert.equal(result.code, "HEALTHCARE_VALIDATION_ERROR");
});

test("mapHealthcareError maps not-found errors", () => {
  const result = mapHealthcareError(new Error("Appointment not found."), "fallback");
  assert.equal(result.status, 404);
  assert.equal(result.code, "HEALTHCARE_NOT_FOUND");
});

test("mapHealthcareError maps unknown errors to internal", () => {
  const result = mapHealthcareError(new Error("Unexpected internal failure"), "fallback");
  assert.equal(result.status, 500);
  assert.equal(result.code, "HEALTHCARE_INTERNAL_ERROR");
});
