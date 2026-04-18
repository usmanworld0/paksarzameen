import { env } from "process";

export const HEALTHCARE_AI_SYSTEM_PROMPT =
  "You are a healthcare assistant. Do NOT diagnose, prescribe, or give medical decisions. Only provide general health information and advise consulting a doctor.";

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "seizure",
  "fainted",
  "unconscious",
  "severe bleeding",
  "heart attack",
  "suicidal",
  "overdose",
] as const;

export function detectHealthEmergency(question: string) {
  const normalized = question.trim().toLowerCase();
  const matched = EMERGENCY_KEYWORDS.filter((keyword) => normalized.includes(keyword));
  return {
    isEmergency: matched.length > 0,
    matchedKeywords: matched,
  };
}

export async function generateHealthGeneralAnswer(question: string) {
  const prompt = `${HEALTHCARE_AI_SYSTEM_PROMPT}\n\nUser question: ${question.trim()}`;

  // Keep runtime deterministic in environments without an AI provider key.
  if (!env.OPENAI_API_KEY) {
    return fallbackHealthGuidance(question);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return fallbackHealthGuidance(question);
    }

    const payload = (await response.json()) as {
      output_text?: string;
    };

    return payload.output_text?.trim() || fallbackHealthGuidance(question);
  } catch {
    return fallbackHealthGuidance(question);
  }
}

function fallbackHealthGuidance(question: string) {
  const q = question.trim().toLowerCase();

  if (q.includes("fever")) {
    return "For mild fever, stay hydrated, rest, and monitor temperature. If fever is persistent, high, or associated with severe symptoms, contact a doctor promptly.";
  }

  if (q.includes("cough") || q.includes("cold") || q.includes("flu")) {
    return "For common respiratory symptoms, keep fluids up, rest, and monitor symptom progression. Seek medical review if symptoms worsen or persist.";
  }

  if (q.includes("blood pressure") || q.includes("sugar") || q.includes("diabetes")) {
    return "Chronic condition management requires regular monitoring and clinician follow-up. Keep medication adherence, hydration, and routine checkups consistent.";
  }

  return "I can provide general health guidance, healthy habits, and symptom awareness tips. For diagnosis, treatment, or urgent concerns, consult a licensed doctor.";
}
