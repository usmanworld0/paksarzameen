"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_REGION,
  REGION_COOKIE_NAME,
  detectRegionFromAcceptLanguage,
  readRegionFromCookieString,
  type StoreRegion,
} from "@/lib/pricing";

export function useStoreRegion() {
  const [region, setRegion] = useState<StoreRegion>(DEFAULT_REGION);

  useEffect(() => {
    const regionFromCookie = readRegionFromCookieString(document.cookie);
    const detectedRegion =
      regionFromCookie ?? detectRegionFromAcceptLanguage(navigator.language);

    setRegion(detectedRegion);
    document.cookie = `${REGION_COOKIE_NAME}=${detectedRegion}; path=/; max-age=2592000; SameSite=Lax`;
  }, []);

  return region;
}