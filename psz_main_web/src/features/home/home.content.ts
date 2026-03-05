export type MissionCard = {
  title: string;
  description: string;
  symbol: string;
};

export const heroContent = {
  title: "PakSarZameen",
  subtitle: "Building Community Wealth.",
  supportingLine:
    "A mission platform for education, compassion, and sustainable grassroots progress.",
  exploreCta: "Explore Programs",
  joinCta: "Join the Mission",
  videoSrc:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  mobileFallback: "/images/hero-fallback.svg",
};

export const missionCards: MissionCard[] = [
  {
    title: "Community Empowerment",
    description:
      "Enable neighborhoods to lead positive change through participation and shared responsibility.",
    symbol: "CE",
  },
  {
    title: "Ethical Enterprise",
    description:
      "Promote dignified livelihoods that align economic growth with social wellbeing.",
    symbol: "EE",
  },
  {
    title: "Cultural Heritage",
    description:
      "Protect local identity and traditions while building relevant, future-ready opportunities.",
    symbol: "CH",
  },
  {
    title: "Grassroots Development",
    description:
      "Invest in practical, high-impact local solutions shaped by community realities.",
    symbol: "GD",
  },
];

export const joinContent = {
  heading: "Join the Mission",
  text:
    "Partner with PakSarZameen to expand opportunity, strengthen communities, and deliver measurable social impact.",
  volunteerCta: "Volunteer With PSZ",
  partnerCta: "Become a Partner",
};
