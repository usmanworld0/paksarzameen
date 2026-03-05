import { dummyImpactStats, type ImpactStat } from "@/lib/models/ImpactStat";
import { delay } from "@/lib/utils/delay";

export async function getImpactStats(): Promise<ImpactStat[]> {
  await delay(500);
  return dummyImpactStats.map((stat) => ({ ...stat }));
}
