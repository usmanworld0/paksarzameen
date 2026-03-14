export type NavLink = {
  label: string;
  href: string;
};

const DEFAULT_COMMONWEALTH_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://store.paksarzameenwfo.com";

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About PSZ", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "News & Resources", href: "/news" },
  { label: "Paksarzameen Store", href: "/commonwealth-lab" },
  { label: "Contact", href: "/contact" }
];

export const siteConfig = {
  name: "PakSarZameen",
  missionLine: "Building Community Wealth.",
  description:
    "PakSarzameen is a community-driven organization working for social development, volunteer programs, and humanitarian initiatives across Pakistan.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://paksarzameenwfo.com",
  commonwealthLabel: "Paksarzameen Store",
  commonwealthUrl:
    process.env.NEXT_PUBLIC_COMMONWEALTH_URL ??
    DEFAULT_COMMONWEALTH_URL,
  contact: {
    phone: "+92 303 5763435",
    address:
      "House no 1257, Street 47, Sector A, DHA Bahawalpur, Punjab, Pakistan",
    addressLines: [
      "House no 1257",
      "Street 47",
      "Sector A",
      "DHA Bahawalpur",
      "Punjab",
      "Pakistan",
    ],
    email: "foundationpaksarzameen@gmail.com",
  },
  social: {
    instagram: "https://www.instagram.com/paksarzameen.wfo",
    facebook: "https://www.facebook.com/share/1CsHyybdfH/",
    commonwealthInstagram: "https://www.instagram.com/commonwealthlab.psz",
  },
  seo: {
    keywords: [
      "paksarzameen",
      "pak sarzameen",
      "paksarzameen NGO",
      "pak sar zameen volunteers",
      "pakistan NGO",
      "paksarzameen foundation",
    ],
  },
};
