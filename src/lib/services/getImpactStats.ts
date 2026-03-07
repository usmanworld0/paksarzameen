import { dummyImpactStats, type ImpactStat } from "@/lib/models/ImpactStat";
<<<<<<< HEAD
import { delay } from "@/lib/utils/delay";

export async function getImpactStats(): Promise<ImpactStat[]> {
  await delay(500);
=======

/**
 * Fetch impact statistics.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getImpactStats(): Promise<ImpactStat[]> {
>>>>>>> 33c6b96 (Perf: lazy-load videos, optimize images, remove artificial delays, next/image and config, CSS perf hints, refactor HomeClient)
  return dummyImpactStats.map((stat) => ({ ...stat }));
}
