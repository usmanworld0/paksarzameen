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
    tagline: "Policy and Strategy Hub",
    icon: "faisal-mosque",
    accent: "#0f7a47",
  },
  {
    city: "Bahawalpur",
    tagline: "Heritage and Education Centre",
    icon: "noor-mahal",
    accent: "#c4a265",
  },
  {
    city: "Hyderabad",
    tagline: "Sindh Outreach Office",
    icon: "pakka-qila",
    accent: "#3b82f6",
  },
  {
    city: "Lahore",
    tagline: "Punjab Operations Base",
    icon: "minar-e-pakistan",
    accent: "#ef4444",
  },
  {
    city: "Multan",
    tagline: "Southern Punjab Hub",
    icon: "shah-rukn-e-alam",
    accent: "#8b5cf6",
  },
];

export const heroContent = {
  title: "PakSarZameen",
  subtitle: "Building Community Wealth.",
  supportingLine:
    "A community development platform for education, compassion, and grassroots progress across Pakistan.",
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
      "Enable neighborhoods to lead positive change through participation and shared responsibility.",
    icon: "globe",
  },
  {
    title: "Ethical Enterprise",
    description:
      "Promote dignified livelihoods that align economic growth with social wellbeing.",
    icon: "spark",
  },
  {
    title: "Cultural Heritage",
    description:
      "Protect local identity and traditions while building relevant, future-ready opportunities.",
    icon: "heritage",
  },
  {
    title: "Grassroots Development",
    description:
      "Invest in practical, high-impact local solutions shaped by community realities.",
    icon: "leaf",
  },
];

export const joinContent = {
  heading: "Join the Mission",
  text:
    "Partner with PakSarZameen to expand opportunity, strengthen communities, and deliver meaningful social impact across Pakistan.",
  volunteerCta: "Volunteer With PSZ",
  partnerCta: "Become a Partner",
} as const;

export const storiesContent = [
  {
    id: 1,
    quote:
      "PSZ feels close to the ground. The team listens first, then builds support that people can actually use.",
    author: "Volunteer Reflection",
    role: "Community outreach",
  },
  {
    id: 2,
    quote:
      "What stands out is the mix of compassion and follow-through. Partnerships move faster when the mission is clear.",
    author: "Partner Perspective",
    role: "Institutional collaboration",
  },
  {
    id: 3,
    quote:
      "From blood support to education and environmental action, the work feels practical, local, and deeply human.",
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
      "Learning support and community care for underserved groups who need safer pathways into education and opportunity.",
  },
  {
    title: "Health Outreach",
    description:
      "Practical medical support, preventive awareness, and referral guidance delivered closer to the people who need it.",
  },
  {
    title: "Skills for Tomorrow",
    description:
      "Training programs that help young people build confidence, practical skills, and stronger economic futures.",
  },
  {
    title: "Cleaner Communities",
    description:
      "Environmental action shaped by local stewardship, from plantation campaigns to small-scale sustainability efforts.",
  },
  {
    title: "Women Enterprise",
    description:
      "Support for women seeking leadership, skills, and more stable pathways into dignified livelihoods.",
  },
  {
    title: "Community Care",
    description:
      "Programs designed around practical needs, consistent follow-up, and long-term community trust.",
  },
];

const PSZ_GREEN_GRADIENT =
  "linear-gradient(135deg, #0f7a47 0%, #1a9d5f 60%, #081c10 100%)";

export const PROGRAM_CARDS: readonly ProgramCard[] = [
  {
    name: "Mahkma Shajarkari",
    subtitle: "Plantation Unit",
    desc: "Leading tree plantation, urban greening, and climate-awareness efforts that help communities care for their environment.",
    tag: "Environment",
    icon: "leaf",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Ehsas ul Haiwanat",
    subtitle: "Animal Welfare Section",
    desc: "Supporting animal welfare through feeding, protection, humane treatment, and neighborhood-level awareness.",
    tag: "Welfare",
    icon: "paw",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Room Zia",
    subtitle: "Bureau for Empowering Marginalized Communities",
    desc: "Creating support pathways for orphaned, transgender, and specially abled individuals through care, dignity, and opportunity.",
    tag: "Social Care",
    icon: "support",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Dar ul Aloom",
    subtitle: "Agency of Educational Development",
    desc: "Expanding access to education, mentoring, and learning opportunities through practical community-based programs.",
    tag: "Education",
    icon: "book",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Tibi Imdad",
    subtitle: "Bureau for Improving Health Standards",
    desc: "Improving community health through medical support, preventive awareness, outreach camps, and welfare services.",
    tag: "Healthcare",
    icon: "health",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Wajood-e-Zan",
    subtitle: "Women Empowerment Department",
    desc: "Promoting women's dignity, education, leadership, and economic participation so they can shape stronger communities.",
    tag: "Empowerment",
    icon: "empower",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
];

export const TESTIMONIAL_AVATARS: Readonly<Record<string, string>> = {};
