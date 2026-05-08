export async function delay(ms = 500): Promise<void> {
  await new Promise<void>((res) => setTimeout(res, ms));
}
