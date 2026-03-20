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
  { label: "Blood Bank", href: "/blood-bank" },
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
    "PakSarZameen is a community development NGO in Pakistan working from Bahawalpur through volunteer programs, blood bank support, education, health outreach, environmental action, and animal welfare initiatives.",
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
    linkedin: "https://pk.linkedin.com/company/pak-sar-zameen-development-org",
    commonwealthInstagram: "https://www.instagram.com/commonwealthlab.psz",
  },
  emergencyContacts: [
    { name: "Umar Hafeez", phone: "03098237670" },
    { name: "Ahmed Amir", phone: "03233609157" },
  ],
  seo: {
    keywords: [
      "paksarzameen",
      "pak sarzameen",
      "pak sarzameen ngo",
      "ngo in pakistan",
      "ngo in bahawalpur",
      "community development organization pakistan",
      "social welfare organization pakistan",
      "humanitarian organization pakistan",
      "volunteer ngo pakistan",
      "volunteer opportunities pakistan",
      "blood bank bahawalpur",
      "emergency blood support pakistan",
      "education ngo pakistan",
      "community health camps pakistan",
      "environmental ngo pakistan",
      "tree plantation pakistan",
      "animal welfare pakistan",
      "women empowerment pakistan",
      "bahawalpur community welfare",
      "paksarzameen foundation",
    ],
  },
};
