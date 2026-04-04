export type ImpactStoryLink = {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  eyebrow?: string;
  meta?: string;
  bullets?: string[];
  instagramPermalink?: string;
  image?: {
    src: string;
    alt: string;
  };
};

export type ImpactStoryPageData = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  eyebrow: string;
  title: string;
  intro: string;
  summary: string;
  cta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  quickFacts: Array<{
    label: string;
    value: string;
  }>;
  highlights: Array<{
    value: string;
    label: string;
  }>;
  storyHeading: string;
  storyChapters: Array<{
    title: string;
    body: string;
  }>;
  galleryTitle?: string;
  galleryIntro?: string;
  gallery?: Array<{
    src: string;
    alt: string;
  }>;
  outcomesHeading: string;
  outcomes: string[];
  note?: {
    title: string;
    body: string;
  };
  resourcesHeading?: string;
  resourcesIntro?: string;
  resources?: ImpactStoryLink[];
  mediaHeading?: string;
  mediaIntro?: string;
  media?: Array<{
    title: string;
    description: string;
    permalink: string;
  }>;
  hopeStoriesHeading?: string;
  hopeStoriesIntro?: string;
  hopeStories?: ImpactHopeStory[];
  relatedHeading?: string;
  relatedIntro?: string;
  relatedStories?: ImpactStoryLink[];
  closing: {
    title: string;
    body: string;
  };
  accent: string;
  accentSoft: string;
};

export type ImpactHopeStory = {
  name: string;
  role: string;
  summary: string;
  href: string;
  storyHref?: string;
  storyLabel?: string;
  image?: {
    src: string;
    alt: string;
  };
  gallery?: Array<{
    src: string;
    alt: string;
  }>;
};

export type ImpactCategory = {
  slug: "environmental" | "education" | "animal" | "health";
  title: string;
  href: string;
  summary: string;
  items: ImpactStoryLink[];
};

export const impactCategories: ImpactCategory[] = [
  {
    slug: "environmental",
    title: "Environmental Impact",
    href: "/impact/environmental",
    summary:
      "Community climate action, urban greening, and youth leadership rooted in local realities.",
    items: [
      {
        title: "GWR",
        description:
          "A public tree-planting effort that turned environmental action into a visible symbol of collective capacity.",
        href: "/impact/environmental/gwr",
        ctaLabel: "Read the record story",
      },
      {
        title: "Miawuaki Forest",
        description:
          "Dense planting strategies designed to restore small urban spaces and build long-term stewardship.",
        href: "/impact/environmental/miawuaki-forest",
      },
      {
        title: "South Punjab Green Book Initiative",
        description:
          "Environmental learning that helps young people connect climate ideas to everyday action.",
        href: "/impact/environmental/south-punjab-green-book-initiative",
      },
      {
        title: "LCOY",
        description:
          "Youth climate dialogue in Bahawalpur, connecting local voices to wider policy conversations.",
        href: "/impact/environmental/lcoy",
      },
      {
        title: "COP in My City",
        description:
          "A platform where young advocates translated concern about climate change into public leadership.",
        href: "/impact/environmental/cop-in-my-city",
      },
    ],
  },
  {
    slug: "education",
    title: "Educational Empowerment Impact",
    href: "/impact/education",
    summary:
      "Inclusive learning pathways that expand access, dignity, confidence, and future opportunity.",
    items: [
      {
        title: "Pakistan's Only Transgender School",
        description:
          "Safe learning and public representation for students too often excluded from formal systems.",
        href: "/impact/education/transgender-school",
      },
      {
        title: "Pakistan's First Blind Parliamentary Debating Team",
        description:
          "Accessible debate and public speaking that place blind youth at the center of civic voice.",
        href: "/impact/education/blind-parliamentary-debating-team",
      },
      {
        title: "Career Counselling and University Applications",
        description:
          "Practical guidance that helps students turn ambition into a real higher-education pathway.",
        href: "/impact/education/career-counselling-university-applications",
      },
    ],
  },
  {
    slug: "animal",
    title: "Animal Welfare Impact",
    href: "/impact/animal",
    summary:
      "Humane, practical animal care grounded in feeding access, protection, and informed follow-up.",
    items: [
      {
        title: "Cat Feeding Points",
        description:
          "Neighborhood feeding stations that turn compassion into a dependable daily routine.",
        href: "/impact/animal/cat-feeding-points",
      },
      {
        title: "Stray Dog Collar Project",
        description:
          "A humane identification approach that improves safety, visibility, and care for stray dogs.",
        href: "/impact/animal/stray-dog-collar-project",
      },
    ],
  },
  {
    slug: "health",
    title: "Community Health Impact",
    href: "/impact/health",
    summary:
      "Emergency support, recurring medical outreach, and community coordination when health needs cannot wait.",
    items: [
      {
        title: "24/7 Availability of Blood",
        description:
          "A readiness model built around urgent patient needs, donor coordination, and trust.",
        href: "/impact/health/blood-availability",
      },
      {
        title: "Monthly Free Medical and Blood Camps",
        description:
          "Routine outreach that brings primary care, screening, and blood support closer to underserved communities.",
        href: "/impact/health/free-medical-blood-camps",
      },
    ],
  },
];

export const impactHopeStories: ImpactHopeStory[] = [
  {
    name: "Zain Hashim",
    role: "Pakistan's First Blind Anchor",
    summary:
      "Zain's story reflects what accessible debate, public speaking, and media visibility can unlock for blind youth in Pakistan.",
    href: "/impact/education/blind-parliamentary-debating-team",
    storyHref: "https://share.google/xCCnaEMiKVGavQtQ0",
    storyLabel: "Open Zain's story",
  },
  {
    name: "Sahiba Jahan",
    role: "Pakistan's First Transgender Police Officer",
    summary:
      "Sahiba Jahan's journey shows how inclusive education and visible support can help transgender students move toward leadership and public service.",
    href: "/impact/education/transgender-school",
    storyHref: "https://youtu.be/SjjYS3O3IKI?si=GgcEPEEDfI4oeEFD",
    storyLabel: "Watch Sahiba's story",
    image: {
      src: "/images/impact/Stories%20of%20Hope/Sahiba%20Jahan.PNG",
      alt: "Portrait of Sahiba Jahan",
    },
    gallery: [
      {
        src: "/images/impact/Stories%20of%20Hope/Sahiba%20Jahan.PNG",
        alt: "Portrait of Sahiba Jahan",
      },
      {
        src: "/images/impact/Stories%20of%20Hope/Sahiba%20Jahan%20Group%20photo.PNG",
        alt: "Sahiba Jahan with a group in a Stories of Hope field photo",
      },
    ],
  },
];

export function getCategory(slug: ImpactCategory["slug"]) {
  const category = impactCategories.find((item) => item.slug === slug);

  if (!category) {
    throw new Error(`Unknown impact category: ${slug}`);
  }

  return category;
}

export function getCategoryCards(
  slug: ImpactCategory["slug"],
  excludedHrefs: string[] = []
): ImpactStoryLink[] {
  return getCategory(slug).items.filter((item) => !excludedHrefs.includes(item.href));
}

export const sectionCards: ImpactStoryLink[] = impactCategories.map((category) => ({
  environmental: {
    title: category.title,
    description:
      "Follow how tree planting, climate dialogue, and youth leadership come together as long-term environmental care.",
    href: category.href,
    ctaLabel: "Explore environmental stories",
    eyebrow: "Climate and green action",
    meta: "5 stories and initiatives",
    bullets: ["Public tree-planting and restoration", "Youth climate voice and local action"],
    instagramPermalink: "https://www.instagram.com/reel/DB4Y2KzNv6Z/",
  },
  education: {
    title: category.title,
    description:
      "See how inclusive education support helps excluded students move toward visibility, confidence, and opportunity.",
    href: category.href,
    ctaLabel: "Explore education stories",
    eyebrow: "Learning with dignity",
    meta: "3 stories and pathways",
    bullets: ["Transgender and blind student inclusion", "Career guidance and opportunity pathways"],
    instagramPermalink: "https://www.instagram.com/p/DC_LgCcub1D/",
  },
  animal: {
    title: category.title,
    description:
      "Explore humane animal welfare stories shaped by feeding routines, safer visibility, and practical neighborhood care.",
    href: category.href,
    ctaLabel: "Explore animal welfare stories",
    eyebrow: "Humane neighborhood care",
    meta: "2 practical response stories",
    bullets: ["Feeding points and safer identification", "Field coordination for humane follow-up"],
    instagramPermalink: "https://www.instagram.com/reel/CoAUaTloqXC/",
  },
  health: {
    title: category.title,
    description:
      "Move through emergency blood support, recurring medical outreach, and the systems that help communities respond faster.",
    href: category.href,
    ctaLabel: "Explore health stories",
    eyebrow: "Urgent care and outreach",
    meta: "2 health response stories",
    bullets: ["Blood availability and emergency coordination", "Medical camps and community follow-up"],
    instagramPermalink: "https://www.instagram.com/p/DKFn43YyK0g/",
  },
}[category.slug]));
