import { dummyPrograms, type Program } from "@/lib/models/Program";
<<<<<<< HEAD
import { delay } from "@/lib/utils/delay";

export async function getPrograms(): Promise<Program[]> {
  await delay(500);
=======

/**
 * Fetch all programs.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getPrograms(): Promise<Program[]> {
>>>>>>> 33c6b96 (Perf: lazy-load videos, optimize images, remove artificial delays, next/image and config, CSS perf hints, refactor HomeClient)
  return dummyPrograms.map((program) => ({ ...program }));
}
