import assert from "node:assert/strict";
import test from "node:test";
import { canCancelAppointment, mapSymptomsToSpecializations } from "@/services/healthcare/rules";
import { detectHealthEmergency } from "@/lib/ai";

test("detectHealthEmergency flags critical terms", () => {
  const result = detectHealthEmergency("I have chest pain and shortness of breath");
  assert.equal(result.isEmergency, true);
  assert.ok(result.matchedKeywords.length >= 1);
});

test("detectHealthEmergency does not flag routine question", () => {
  const result = detectHealthEmergency("How much water should I drink daily?");
  assert.equal(result.isEmergency, false);
  assert.equal(result.matchedKeywords.length, 0);
});

test("mapSymptomsToSpecializations maps to cardiology", () => {
  const result = mapSymptomsToSpecializations("I have chest tightness and heart palpitation");
  assert.equal(result[0]?.specialization, "Cardiology");
});

test("mapSymptomsToSpecializations falls back to general medicine", () => {
  const result = mapSymptomsToSpecializations("Need a general health check guidance");
  assert.equal(result[0]?.specialization, "General Medicine");
});

test("canCancelAppointment enforces minimum hours window", () => {
  const now = new Date("2026-04-18T10:00:00.000Z").getTime();
  const allowed = canCancelAppointment("2026-04-18T13:00:00.000Z", 2, now);
  const denied = canCancelAppointment("2026-04-18T11:00:00.000Z", 2, now);

  assert.equal(allowed, true);
  assert.equal(denied, false);
});
