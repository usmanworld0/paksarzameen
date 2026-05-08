import { dummyImpactStats, type ImpactStat } from "@/lib/models/ImpactStat";

/**
 * Fetch impact statistics.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getImpactStats(): Promise<ImpactStat[]> {
  return dummyImpactStats.map((stat) => ({ ...stat }));
}
