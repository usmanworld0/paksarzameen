export type StorefrontMenuNode = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  previewImage?: string | null;
  description?: string | null;
  children?: StorefrontMenuNode[];
};

export type StorefrontActionItem = {
  id: "call" | "wishlist" | "account" | "cart";
  label: string;
  href: string;
  external?: boolean;
};

export type StorefrontNavigationData = {
  menu: StorefrontMenuNode[];
  actions: StorefrontActionItem[];
};

export type StorefrontHeroMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
};

export type StorefrontHeroData = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  media: StorefrontHeroMedia;
};
