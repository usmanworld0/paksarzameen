export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About PSZ", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "News & Resources", href: "/news" },
  { label: "Commonwealth Lab", href: "/commonwealth-lab" },
  { label: "Contact", href: "/contact" }
];

export const siteConfig = {
  name: "PakSarZameen",
  missionLine: "Building Community Wealth.",
  description:
    "A mission-driven platform focused on education, welfare, and sustainable social progress.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://psz-main-web.example.com",
  commonwealthLabel: "Commonwealth Lab",
  commonwealthUrl:
    process.env.NEXT_PUBLIC_COMMONWEALTH_URL ??
    "https://commonwealth-lab.example.com"
};
