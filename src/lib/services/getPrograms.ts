import { dummyPrograms, type Program } from "@/lib/models/Program";

/**
 * Fetch all programs.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getPrograms(): Promise<Program[]> {
  return dummyPrograms.map((program) => ({ ...program }));
}
