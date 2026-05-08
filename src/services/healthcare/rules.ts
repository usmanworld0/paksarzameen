const SYMPTOM_SPECIALIZATION_MAP: Array<{
  terms: string[];
  specialization: string;
  reason: string;
}> = [
  { terms: ["skin", "rash", "acne", "eczema"], specialization: "Dermatology", reason: "Skin-related symptoms" },
  { terms: ["heart", "chest", "palpitation", "bp"], specialization: "Cardiology", reason: "Cardiac symptom keywords" },
  { terms: ["child", "baby", "pediatric"], specialization: "Pediatrics", reason: "Child health context" },
  { terms: ["bone", "joint", "fracture", "knee", "back pain"], specialization: "Orthopedics", reason: "Musculoskeletal symptoms" },
  { terms: ["stomach", "liver", "acid", "digestion"], specialization: "Gastroenterology", reason: "Digestive symptom keywords" },
  { terms: ["mental", "anxiety", "depression", "sleep"], specialization: "Psychiatry", reason: "Mental health keyword match" },
  { terms: ["ear", "nose", "throat", "sinus"], specialization: "ENT", reason: "ENT symptom keywords" },
  { terms: ["pregnancy", "period", "women", "gyne"], specialization: "Gynecology", reason: "Women health keyword match" },
];

export function mapSymptomsToSpecializations(question: string) {
  const normalized = question.trim().toLowerCase();
  const matches = SYMPTOM_SPECIALIZATION_MAP
    .filter((entry) => entry.terms.some((term) => normalized.includes(term)))
    .slice(0, 3)
    .map((entry) => ({ specialization: entry.specialization, reason: entry.reason }));

  return matches.length > 0
    ? matches
    : [{ specialization: "General Medicine", reason: "General symptom triage" }];
}

export function canCancelAppointment(slotStartIso: string, minimumHoursBeforeStart: number, nowMs = Date.now()) {
  const slotStartMs = new Date(slotStartIso).getTime();
  if (Number.isNaN(slotStartMs)) {
    return false;
  }

  const minWindowMs = minimumHoursBeforeStart * 60 * 60 * 1000;
  return slotStartMs - nowMs >= minWindowMs;
}
