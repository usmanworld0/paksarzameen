export type MissionCard = {
  title: string;
  description: string;
  icon: string;
};

export const heroContent = {
  title: "PakSarZameen",
  subtitle: "Building Community Wealth.",
  supportingLine:
    "A mission platform for education, compassion, and sustainable grassroots progress across Pakistan.",
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
    icon: "🌍",
  },
  {
    title: "Ethical Enterprise",
    description:
      "Promote dignified livelihoods that align economic growth with social wellbeing.",
    icon: "⚡",
  },
  {
    title: "Cultural Heritage",
    description:
      "Protect local identity and traditions while building relevant, future-ready opportunities.",
    icon: "🏛️",
  },
  {
    title: "Grassroots Development",
    description:
      "Invest in practical, high-impact local solutions shaped by community realities.",
    icon: "🌱",
  },
];

export const joinContent = {
  heading: "Join the Mission",
  text:
    "Partner with PakSarZameen to expand opportunity, strengthen communities, and deliver measurable social impact across Pakistan.",
  volunteerCta: "Volunteer With PSZ",
  partnerCta: "Become a Partner",
};

export const storiesContent = [
  {
    id: 1,
    quote:
      "PakSarZameen transformed our village. My children now have access to quality education and my husband started a sustainable business through their enterprise program.",
    author: "Fatima Bibi",
    role: "Community Member, Multan",
  },
  {
    id: 2,
    quote:
      "The Room Zia initiative brought light — literally and figuratively — to our community. Solar panels power our school and clinic now.",
    author: "Ahmed Khan",
    role: "Village Elder, Swat",
  },
  {
    id: 3,
    quote:
      "As a partner organization, we've seen PSZ deliver real, measurable impact. Their approach to grassroots development is unmatched.",
    author: "Dr. Sara Malik",
    role: "Director, Rural Health Initiative",
  },
];
