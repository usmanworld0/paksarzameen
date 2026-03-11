export type StoreRegion = "PAK" | "US" | "UK";

export type StoreRegionRecord = {
  code: StoreRegion;
  name: string;
  currency: "PKR" | "USD" | "GBP";
  locale: string;
  countryCodes: string[];
  active: boolean;
  isDefault: boolean;
};

type ProductRegionPriceLike = {
  price: number;
  compareAtPrice?: number | null;
  region?: { code: string } | null;
};

const SUPPORTED_REGION_CONFIG: Record<StoreRegion, Omit<StoreRegionRecord, "active" | "isDefault">> = {
  PAK: {
    code: "PAK",
    name: "Pakistan",
    currency: "PKR",
    locale: "en-PK",
    countryCodes: ["PK"],
  },
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    countryCodes: ["US"],
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    countryCodes: ["GB", "UK"],
  },
};

export const DEFAULT_REGION: StoreRegion = "PAK";
export const REGION_COOKIE_NAME = "psz-region";

function normalizeCountryCode(countryCode?: string | null) {
  return countryCode?.trim().toUpperCase() ?? "";
}

export function isStoreRegion(value?: string | null): value is StoreRegion {
  return value === "PAK" || value === "US" || value === "UK";
}

export function getFallbackStoreRegions(): StoreRegionRecord[] {
  return [
    { ...SUPPORTED_REGION_CONFIG.PAK, active: true, isDefault: true },
    { ...SUPPORTED_REGION_CONFIG.US, active: false, isDefault: false },
    { ...SUPPORTED_REGION_CONFIG.UK, active: false, isDefault: false },
  ];
}

export function normalizeStoreRegionRecord(record: {
  code: string;
  name?: string | null;
  currency?: string | null;
  locale?: string | null;
  countryCodes?: unknown;
  active?: boolean | null;
  isDefault?: boolean | null;
}): StoreRegionRecord | null {
  if (!isStoreRegion(record.code)) {
    return null;
  }

  const supported = SUPPORTED_REGION_CONFIG[record.code];
  const countryCodes = Array.isArray(record.countryCodes)
    ? record.countryCodes.filter((value): value is string => typeof value === "string")
    : supported.countryCodes;

  return {
    code: record.code,
    name: record.name || supported.name,
    currency: (record.currency as StoreRegionRecord["currency"] | null) || supported.currency,
    locale: record.locale || supported.locale,
    countryCodes: countryCodes.length > 0 ? countryCodes : supported.countryCodes,
    active: Boolean(record.active),
    isDefault: Boolean(record.isDefault),
  };
}

export function getActiveStoreRegions(regions?: StoreRegionRecord[]) {
  const source = regions && regions.length > 0 ? regions : getFallbackStoreRegions();
  const active = source.filter((region) => region.active);
  return active.length > 0 ? active : [getDefaultStoreRegion(source)];
}

export function getDefaultStoreRegion(regions?: StoreRegionRecord[]) {
  const source = regions && regions.length > 0 ? regions : getFallbackStoreRegions();
  return (
    source.find((region) => region.isDefault && region.active) ??
    source.find((region) => region.active) ??
    getFallbackStoreRegions()[0]
  );
}

export function getRegionConfig(region: StoreRegion, regions?: StoreRegionRecord[]) {
  const source = regions && regions.length > 0 ? regions : getFallbackStoreRegions();
  return source.find((entry) => entry.code === region) ?? {
    ...SUPPORTED_REGION_CONFIG[region],
    active: false,
    isDefault: region === DEFAULT_REGION,
  };
}

export function detectRegionFromCountryCode(
  countryCode?: string | null,
  regions?: StoreRegionRecord[]
): StoreRegion {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  const activeRegions = getActiveStoreRegions(regions);

  const matched = activeRegions.find((region) =>
    region.countryCodes.includes(normalizedCountryCode)
  );

  if (matched) {
    return matched.code;
  }

  return getDefaultStoreRegion(activeRegions).code;
}

export function detectRegionFromAcceptLanguage(
  acceptLanguage?: string | null,
  regions?: StoreRegionRecord[]
): StoreRegion {
  const normalizedLanguage = acceptLanguage?.toLowerCase() ?? "";
  const activeCodes = new Set(getActiveStoreRegions(regions).map((region) => region.code));

  if (normalizedLanguage.includes("en-us") && activeCodes.has("US")) return "US";
  if ((normalizedLanguage.includes("en-gb") || normalizedLanguage.includes("en-uk")) && activeCodes.has("UK")) return "UK";
  if ((normalizedLanguage.includes("ur-pk") || normalizedLanguage.includes("en-pk")) && activeCodes.has("PAK")) return "PAK";

  return getDefaultStoreRegion(regions).code;
}

export function detectRegionFromHeaders(
  headersLike: Headers | Pick<Headers, "get">,
  regions?: StoreRegionRecord[]
): StoreRegion {
  const countryHeader =
    headersLike.get("x-vercel-ip-country") ??
    headersLike.get("cf-ipcountry") ??
    headersLike.get("x-country-code") ??
    headersLike.get("cloudfront-viewer-country");

  if (countryHeader) {
    return detectRegionFromCountryCode(countryHeader, regions);
  }

  return detectRegionFromAcceptLanguage(headersLike.get("accept-language"), regions);
}

export function getCurrencyForRegion(region: StoreRegion, regions?: StoreRegionRecord[]) {
  return getRegionConfig(region, regions).currency;
}

export function formatRegionalPrice(amount: number, region: StoreRegion, regions?: StoreRegionRecord[]) {
  const { locale, currency } = getRegionConfig(region, regions);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(amount);
}

export function getRegionBadgeLabel(region: StoreRegion, regions?: StoreRegionRecord[]) {
  const config = getRegionConfig(region, regions);
  return `${config.name} • ${config.currency}`;
}

export function resolveProductRegionalPricing(
  product: {
    price: number;
    compareAtPrice?: number | null;
    regionPrices?: ProductRegionPriceLike[];
  },
  region: StoreRegion
) {
  const regionalPrice = product.regionPrices?.find(
    (entry) => entry.region?.code === region
  );

  return {
    price: regionalPrice?.price ?? product.price,
    compareAtPrice: regionalPrice?.compareAtPrice ?? product.compareAtPrice ?? null,
  };
}

export function readRegionFromCookieString(cookieString?: string | null): StoreRegion | null {
  if (!cookieString) return null;

  const rawValue = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REGION_COOKIE_NAME}=`))
    ?.split("=")[1];

  const regionValue = rawValue ?? null;

  if (isStoreRegion(regionValue)) {
    return regionValue;
  }

  return null;
}