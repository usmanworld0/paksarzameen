import { prisma } from "@/lib/prisma";
import {
  DEFAULT_REGION,
  getDefaultStoreRegion,
  getFallbackStoreRegions,
  normalizeStoreRegionRecord,
  type StoreRegion,
  type StoreRegionRecord,
} from "@/lib/pricing";

export async function getAllStoreRegions() {
  const regions = await prisma.storeRegion.findMany({
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
  });

  const normalized = regions
    .map((region) => normalizeStoreRegionRecord(region))
    .filter((region): region is StoreRegionRecord => Boolean(region));

  return normalized.length > 0 ? normalized : getFallbackStoreRegions();
}

export async function getActiveStoreRegions() {
  const regions = await getAllStoreRegions();
  return regions.filter((region) => region.active);
}

export async function getDefaultActiveStoreRegion() {
  const regions = await getAllStoreRegions();
  return getDefaultStoreRegion(regions);
}

export async function updateStoreRegions(
  updates: Array<{ code: StoreRegion; active: boolean; isDefault: boolean }>
) {
  const fallbackRegions = getFallbackStoreRegions();
  const nextRegions = fallbackRegions.map((region) => {
    const incoming = updates.find((entry) => entry.code === region.code);
    return incoming
      ? { ...region, active: incoming.active, isDefault: incoming.isDefault }
      : region;
  });

  const activeRegions = nextRegions.filter((region) => region.active);

  if (activeRegions.length === 0) {
    throw new Error("At least one region must stay active.");
  }

  const defaultRegion =
    activeRegions.find((region) => region.isDefault) ??
    activeRegions.find((region) => region.code === DEFAULT_REGION) ??
    activeRegions[0];

  await prisma.$transaction(
    nextRegions.map((region) =>
      prisma.storeRegion.upsert({
        where: { code: region.code },
        update: {
          name: region.name,
          currency: region.currency,
          locale: region.locale,
          countryCodes: region.countryCodes,
          active: region.active,
          isDefault: region.code === defaultRegion.code,
        },
        create: {
          code: region.code,
          name: region.name,
          currency: region.currency,
          locale: region.locale,
          countryCodes: region.countryCodes,
          active: region.active,
          isDefault: region.code === defaultRegion.code,
        },
      })
    )
  );
}