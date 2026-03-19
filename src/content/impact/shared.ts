export type ImpactStoryLink = {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
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
  relatedHeading?: string;
  relatedStories?: ImpactStoryLink[];
  closing: {
    title: string;
    body: string;
  };
  accent: string;
  accentSoft: string;
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
      {
        title: "Data Assessment and Research",
        description:
          "Field learning that helps environmental programs improve, adapt, and stay accountable.",
        href: "/impact/environmental/data-assessment-research",
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
      {
        title: "Enrollment Rate and Data Assessment",
        description:
          "Evidence-based learning support that helps teams see who is still missing and why.",
        href: "/impact/education/enrollment-rate-data-assessment",
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
      {
        title: "Data Assessment and Research",
        description:
          "Tracking needs on the ground so animal welfare responses go where they matter most.",
        href: "/impact/animal/data-assessment-research",
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
      {
        title: "Data Assessment and Research",
        description:
          "Monitoring patterns in demand, outreach, and follow-up so health support improves over time.",
        href: "/impact/health/data-assessment-research",
      },
    ],
  },
];

export const impactHopeStories = [
  {
    name: "Zain Hashim",
    role: "Pakistan's First Blind Anchor",
    image: "/images/members/Abdullah_Tanseer.png",
    href: "/impact/education/blind-parliamentary-debating-team",
  },
  {
    name: "Sahiba Jehan",
    role: "Pakistan's First Transgender Police Officer",
    image: "/images/members/Laibah_Shafique.png",
    href: "/impact/education/transgender-school",
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
  title: category.title,
  description: category.summary,
  href: category.href,
  ctaLabel: "Open section",
}));
