import type { Program } from "@/lib/models/Program";
import { getPrograms } from "@/lib/services/getPrograms";

export async function getProgramBySlug(
  slug: string,
): Promise<Program | undefined> {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug);
}
