export type MissionCard = {
  title: string;
  description: string;
  icon: string;
};

export type TeamMember = {
  name: string;
  designation: string;
  quote: string;
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
  icon: string;          // inline SVG path data for the city landmark
  accent: string;        // accent colour for the card
};

/* ─── PSZ Chapters across Pakistan ─── */
export const PSZ_CHAPTERS: readonly Chapter[] = [
  {
    city: "Islamabad",
    tagline: "Policy & Strategy Hub",
    icon: "faisal-mosque",
    accent: "#0f7a47",
  },
  {
    city: "Bahawalpur",
    tagline: "Heritage & Education Centre",
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
    "A mission platform for education, compassion, and sustainable grassroots progress across Pakistan.",
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
} as const;

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

/* ─── Heart of Paksarzameen — Team Members ─── */
export const HEART_MEMBERS: readonly TeamMember[] = [
  {
    name: "Malik Abdullah Amir",
    designation: "Chief Executive Officer",
    quote: "Real change happens when logistics meet compassion on the ground.",
  image: "/images/optimized/members/4.webp",
  },
  {
    name: "Ahmad Malik",
    designation: "Executive Managing Director",
    quote: "Design can inspire people to believe in a better Pakistan.",
    image: "/images/optimized/members/2.webp",
  },
  {
    name: "M. Abdullah Jamal",
    designation: "Executive Managing Director",
    quote: "Healthcare is not a privilege — it is the right of every citizen.",
  image: "/images/optimized/members/6.webp",
    
  },
  {
    name: "Hussain Khan Langah",
    designation: "Executive Managing Director",
    quote: "Paksarzameen is more than a project — it is a mission for the future.",
    image: "/images/optimized/members/1.webp",
    
  },
  {
    name: "Laiba Shafiq",
    designation: "Director",
    quote: "Technology should empower communities and create opportunity.",
    image: "/images/optimized/members/3.webp",
  },
  {
    name: "Hassan Fadul",
    designation: "Director",
    quote: "Every village we reach is a promise kept to the people of Pakistan.",
    image: "/images/optimized/members/5.webp",
  },
  {
    name: "Tuba Fatima",
    designation: "Director",
    quote: "An educated Pakistan is an empowered Pakistan.",
    image: "/images/optimized/members/7.webp",
  },
];

/* ─── Scroll-text blocks alongside the canvas ─── */
export const SCROLL_TEXT_BLOCKS: readonly ScrollTextBlock[] = [
  {
    title: "Room Zia",
    description:
      "Solar-powered learning spaces that bring electricity and education to remote villages. Over 120 schools illuminated.",
  },
  {
    title: "Mobile Health Clinics",
    description:
      "Bringing essential healthcare to doorsteps. 15,000+ consultations in areas with no hospital access.",
  },
  {
    title: "Skills for Tomorrow",
    description:
      "Vocational training programs equipping youth with digital literacy, tailoring, and agricultural skills.",
  },
  {
    title: "Clean Water Initiative",
    description:
      "Installing water filtration plants across Punjab and Sindh. Safe drinking water for 30,000+ people.",
  },
  {
    title: "Women Enterprise Hub",
    description:
      "Micro-financing and mentorship for women entrepreneurs. 3,000 families lifted through sustainable business.",
  },
  {
    title: "Community Kitchens",
    description:
      "Daily nutritious meals for 5,000+ individuals in urban slums and disaster-affected regions.",
  },
];

/* ─── Program department cards ─── */
const PSZ_GREEN_GRADIENT =
  "linear-gradient(135deg, #0f7a47 0%, #1a9d5f 60%, #081c10 100%)";

export const PROGRAM_CARDS: readonly ProgramCard[] = [
  {
    name: "Mahkma Shajarkari",
    subtitle: "Plantation Unit",
    desc: "Promoting environmental responsibility through plantation drives and sustainability initiatives across Pakistan.",
    tag: "Environment",
    icon: "🌿",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Ehsas ul Haiwanat",
    subtitle: "Animal Welfare Section",
    desc: "Advocating compassion toward animals and supporting their welfare, protection, and ethical treatment.",
    tag: "Welfare",
    icon: "🐾",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Room Zia",
    subtitle: "Bureau for Empowering Marginalized Communities",
    desc: "Providing care, support, and opportunities for orphaned, transgender, and specially-abled individuals.",
    tag: "Social Care",
    icon: "💡",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Dar ul Aloom",
    subtitle: "Agency of Educational Development",
    desc: "Advancing access to knowledge and learning through educational programs and community awareness.",
    tag: "Education",
    icon: "📚",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Tibi Imdad",
    subtitle: "Bureau for Improving Health Standards",
    desc: "Working to improve community health through medical support, awareness campaigns, and welfare services.",
    tag: "Healthcare",
    icon: "🏥",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
  {
    name: "Wajood-e-Zan",
    subtitle: "Women Empowerment Department",
    desc: "Promoting the dignity, education, and empowerment of women so they can actively participate in shaping society.",
    tag: "Empowerment",
    icon: "✊",
    bg: PSZ_GREEN_GRADIENT,
    tagColor: "var(--psz-green)",
  },
];

/* ─── Testimonial avatar URLs ─── */
export const TESTIMONIAL_AVATARS: Readonly<Record<string, string>> = {
  "Fatima Bibi":
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
  "Ahmed Khan":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "Dr. Sara Malik":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
};
