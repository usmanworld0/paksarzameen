export const SITE_NAME = "Paksarzameen Store";
export const SITE_DESCRIPTION =
  "Premium artisan marketplace by PakSarZameen — connecting Pakistan's finest craftspeople with the world.";
export const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://paksarzameenwfo.com"
    : "http://localhost:3000");
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://store.paksarzameenwfo.com";

export const COMMONWEALTH_LOGO_URL =
  process.env.NEXT_PUBLIC_COMMONWEALTH_LOGO_URL ||
  "/paksarzameen_logo.png";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Customizations", href: "/customizations" },
  { label: "Artisans & Craftsmen", href: "/artists" },
  { label: "Customer's Art Gallery", href: "/customers-art-gallery" },
  { label: "Policies", href: "/policies" },
  { label: "About", href: `${MAIN_SITE_URL}/about` },
] as const;

export const CURRENCY = "PKR";
export const ITEMS_PER_PAGE = 12;
