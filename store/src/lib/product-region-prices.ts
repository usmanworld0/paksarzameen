import type { StoreRegion, StoreRegionRecord } from "@/lib/pricing";

export type ProductRegionPriceInput = {
  regionCode: StoreRegion;
  price: number;
  compareAtPrice?: number | null;
};

export function normalizeProductRegionPrices(
  regionPrices: ProductRegionPriceInput[],
  storeRegions: StoreRegionRecord[]
) {
  const activeNonDefaultRegions = storeRegions.filter(
    (region) => region.active && !region.isDefault
  );

  const activeCodes = new Set(activeNonDefaultRegions.map((region) => region.code));
  const unique = new Map<StoreRegion, ProductRegionPriceInput>();

  for (const entry of regionPrices) {
    if (!activeCodes.has(entry.regionCode)) {
      continue;
    }

    unique.set(entry.regionCode, {
      regionCode: entry.regionCode,
      price: entry.price,
      compareAtPrice: entry.compareAtPrice ?? null,
    });
  }

  const missingRegions = activeNonDefaultRegions.filter(
    (region) => !unique.has(region.code)
  );

  if (missingRegions.length > 0) {
    throw new Error(
      `Add prices for all active regions: ${missingRegions
        .map((region) => region.name)
        .join(", ")}.`
    );
  }

  return Array.from(unique.values()).sort((left, right) =>
    left.regionCode.localeCompare(right.regionCode)
  );
}

export function buildProductRegionPriceCreateData(regionPrices: ProductRegionPriceInput[]) {
  return regionPrices.map((entry) => ({
    price: entry.price,
    compareAtPrice: entry.compareAtPrice ?? null,
    region: { connect: { code: entry.regionCode } },
  }));
}