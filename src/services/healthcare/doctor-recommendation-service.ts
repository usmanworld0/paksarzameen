import { listDoctors } from "@/services/healthcare/core-service";
import type { DoctorRecommendation } from "@/types/healthcare-ai";
import { mapSymptomsToSpecializations } from "@/services/healthcare/rules";

export async function getDoctorRecommendationsBySymptoms(question: string): Promise<DoctorRecommendation[]> {
  const specializations = mapSymptomsToSpecializations(question);
  const doctors = await listDoctors();

  const recommendations: DoctorRecommendation[] = [];

  for (const spec of specializations) {
    const matching = doctors
      .filter((doctor) => (doctor.specialization ?? "").toLowerCase().includes(spec.specialization.toLowerCase()))
      .slice(0, 3)
      .map((doctor) => ({
        doctorId: doctor.doctorId,
        fullName: doctor.fullName,
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee,
        experienceYears: doctor.experienceYears,
        matchReason: spec.reason,
      }));

    recommendations.push(...matching);
  }

  const deduped = recommendations.filter(
    (item, index, all) => all.findIndex((candidate) => candidate.doctorId === item.doctorId) === index
  );

  return deduped.slice(0, 5);
}
