import { dummyPrograms, type Program } from "@/lib/models/Program";
import { delay } from "@/lib/utils/delay";

export async function getPrograms(): Promise<Program[]> {
  await delay(500);
  return dummyPrograms.map((program) => ({ ...program }));
}
