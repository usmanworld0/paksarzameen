export const SITE_NAME = "Commonwealth Lab";
export const SITE_DESCRIPTION =
  "Premium artisan marketplace by PakSarZameen — connecting Pakistan's finest craftspeople with the world.";
export const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://paksarzameenwfo.com";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://store.paksarzameenwfo.com";

export const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Artisans", href: "/artists" },
  { label: "About", href: `${MAIN_SITE_URL}/about` },
] as const;

export const CURRENCY = "PKR";
export const ITEMS_PER_PAGE = 12;
