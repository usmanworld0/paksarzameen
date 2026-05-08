import { detectHealthEmergency, generateHealthGeneralAnswer } from "@/lib/ai";
import { getDoctorRecommendationsBySymptoms } from "@/services/healthcare/doctor-recommendation-service";
import { logHealthCareAiInteraction } from "@/services/healthcare/core-service";
import type { HealthAiResponse } from "@/types/healthcare-ai";

const AI_DISCLAIMER = "This is not medical advice. Please consult a doctor.";

export async function getSafeHealthAiResponse(input: {
  userId?: string | null;
  question: string;
}): Promise<HealthAiResponse> {
  const question = input.question.trim();
  const emergencyCheck = detectHealthEmergency(question);

  const doctorSuggestions = await getDoctorRecommendationsBySymptoms(question);

  if (emergencyCheck.isEmergency) {
    const emergencyResponse =
      "Emergency warning: your message includes possible danger signs. Call emergency services or go to the nearest hospital immediately.";

    const response: HealthAiResponse = {
      answer: emergencyResponse,
      emergencyResponse,
      disclaimer: AI_DISCLAIMER,
      classification: "emergency",
      doctorSuggestions,
    };

    await logHealthCareAiInteraction({
      userId: input.userId ?? null,
      question,
      answer: `${response.answer} ${AI_DISCLAIMER}`,
    });

    return response;
  }

  const answer = await generateHealthGeneralAnswer(question);
  const response: HealthAiResponse = {
    answer,
    disclaimer: AI_DISCLAIMER,
    classification: "general",
    doctorSuggestions,
  };

  await logHealthCareAiInteraction({
    userId: input.userId ?? null,
    question,
    answer: `${response.answer} ${AI_DISCLAIMER}`,
  });

  return response;
}
