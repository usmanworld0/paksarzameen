export type MissionCard = {
  title: string;
  description: string;
  icon: string;
};

export type TeamMember = {
  image: string;
};

export type ScrollTextBlock = {
  title: string;
  description: string;
};

export type ProgramCard = {
  name: string;
  subtitle: string;
  desc: string;
  tag: string;
  icon: string;
  bg: string;
  tagColor: string;
};

export type Chapter = {
  city: string;
  tagline: string;
  icon: string;
  accent: string;
};

export const PSZ_CHAPTERS: readonly Chapter[] = [
  {
    city: "Islamabad",
    tagline: "Policy and strategy",
    icon: "faisal-mosque",
    accent: "#0f7a47",
  },
  {
    city: "Bahawalpur",
    tagline: "Heritage and education",
    icon: "noor-mahal",
    accent: "#c4a265",
  },
  {
    city: "Hyderabad",
    tagline: "Sindh outreach",
    icon: "pakka-qila",
    accent: "#3b82f6",
  },
  {
    city: "Lahore",
    tagline: "Punjab operations",
    icon: "minar-e-pakistan",
    accent: "#ef4444",
  },
  {
    city: "Multan",
    tagline: "South Punjab hub",
    icon: "shah-rukn-e-alam",
    accent: "#8b5cf6",
  },
];

export const heroContent = {
  title: "PakSarZameen",
  subtitle: "Building Community Wealth.",
  supportingLine:
    "Community action for education, health, and dignity across Pakistan.",
  exploreCta: "Explore Programs",
  joinCta: "Join the Mission",
  videoSrc:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  mobileFallback: "/images/hero-fallback.svg",
} as const;

export const missionCards: MissionCard[] = [
  {
    title: "Community Empowerment",
    description:
      "Help communities lead their own change.",
    icon: "globe",
  },
  {
    title: "Ethical Enterprise",
    description:
      "Back dignified livelihoods with real social value.",
    icon: "spark",
  },
  {
    title: "Cultural Heritage",
    description:
      "Protect local identity while opening new opportunities.",
    icon: "heritage",
  },
  {
    title: "Grassroots Development",
    description:
      "Build practical solutions shaped by local need.",
    icon: "leaf",
  },
];

export const joinContent = {
  heading: "Join the Mission",
  text:
    "Volunteer, partner, or support work that stays useful on the ground.",
  volunteerCta: "Volunteer With PSZ",
  partnerCta: "Become a Partner",
} as const;

export const storiesContent = [
  {
    id: 1,
    quote:
      "PSZ stays close to the ground and builds support people can use.",
    author: "Volunteer Reflection",
    role: "Community outreach",
  },
  {
    id: 2,
    quote:
      "The mix of compassion and follow-through makes partnership easy.",
    author: "Partner Perspective",
    role: "Institutional collaboration",
  },
  {
    id: 3,
    quote:
      "The work feels practical, local, and deeply human.",
    author: "Supporter Reflection",
    role: "Community advocate",
  },
] as const;

export const HEART_MEMBERS: readonly TeamMember[] = [
  { image: "/images/members/cover.PNG" },
  { image: "/images/members/IMG_6435.PNG" },
  { image: "/images/members/IMG_6427.PNG" },
  { image: "/images/members/IMG_6428.PNG" },
  { image: "/images/members/IMG_6431.PNG" },
  { image: "/images/members/IMG_6432.PNG" },
  { image: "/images/members/IMG_6433.PNG" },
  { image: "/images/members/IMG_6434.PNG" },
  
  { image: "/images/members/IMG_6438.PNG" },
];

export const SCROLL_TEXT_BLOCKS: readonly ScrollTextBlock[] = [
  {
    title: "Room Zia",
    description:
      "Learning support for communities that need safer paths into education.",
  },
  {
    title: "Health Outreach",
    description:
      "Medical support and referral guidance closer to the people who need it.",
  },
  {
    title: "Skills for Tomorrow",
    description:
      "Training that builds confidence, skills, and stronger futures.",
  },
  {
    title: "Cleaner Communities",
    description:
      "Environmental action shaped by local stewardship.",
  },
  {
    title: "Women Enterprise",
    description:
      "Support for women building leadership, skills, and livelihoods.",
  },
  {
    title: "Community Care",
    description:
      "Programs built around practical needs and steady follow-up.",
  },
];

const PSZ_GREEN_GRADIENT =
  "linear-gradient(135deg, #0f7a47 0%, #1a9d5f 60%, #081c10 100%)";

export const PROGRAM_CARDS: readonly ProgramCard[] = [
  {
    name: "Mahkma Shajarkari",
    subtitle: "Plantation Unit",
    desc: "Tree planting and public climate action rooted in local care.",
    tag: "Environment",
    icon: "leaf",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Ehsas ul Haiwanat",
    subtitle: "Animal Welfare Section",
    desc: "Humane animal care through feeding, protection, and awareness.",
    tag: "Welfare",
    icon: "paw",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Room Zia",
    subtitle: "Bureau for Empowering Marginalized Communities",
    desc: "Support pathways built around care, dignity, and opportunity.",
    tag: "Social Care",
    icon: "support",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Dar ul Aloom",
    subtitle: "Agency of Educational Development",
    desc: "Education, mentoring, and practical learning support.",
    tag: "Education",
    icon: "book",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Tibi Imdad",
    subtitle: "Bureau for Improving Health Standards",
    desc: "Medical support, outreach camps, and preventive care.",
    tag: "Healthcare",
    icon: "health",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Wajood-e-Zan",
    subtitle: "Women Empowerment Department",
    desc: "Women's dignity, leadership, and economic participation.",
    tag: "Empowerment",
    icon: "empower",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
];

export const TESTIMONIAL_AVATARS: Readonly<Record<string, string>> = {};
