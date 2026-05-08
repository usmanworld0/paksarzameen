import { cookies, headers } from "next/headers";
import {
  DEFAULT_REGION,
  REGION_COOKIE_NAME,
  detectRegionFromHeaders,
  getDefaultStoreRegion,
  isStoreRegion,
  type StoreRegion,
} from "./pricing";
import { getActiveStoreRegions } from "./store-regions";

export async function getRequestRegion(): Promise<StoreRegion> {
  const activeRegions = await getActiveStoreRegions();
  const cookieRegion = cookies().get(REGION_COOKIE_NAME)?.value;

  if (
    isStoreRegion(cookieRegion) &&
    activeRegions.some((region) => region.code === cookieRegion)
  ) {
    return cookieRegion;
  }

  try {
    return detectRegionFromHeaders(headers(), activeRegions);
  } catch {
    return getDefaultStoreRegion(activeRegions).code ?? DEFAULT_REGION;
  }
}