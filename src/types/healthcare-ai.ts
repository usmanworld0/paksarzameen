export type HealthAiSafetyClassification = "emergency" | "general";

export type DoctorRecommendation = {
  doctorId: string;
  fullName: string;
  specialization: string | null;
  consultationFee: number | null;
  experienceYears: number | null;
  matchReason: string;
};

export type HealthAiResponse = {
  answer: string;
  disclaimer: string;
  classification: HealthAiSafetyClassification;
  emergencyResponse?: string;
  doctorSuggestions: DoctorRecommendation[];
};
