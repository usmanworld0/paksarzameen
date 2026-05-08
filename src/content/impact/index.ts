import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import { animalStories } from "./animal";
import { educationStories } from "./education";
import { environmentalStories } from "./environmental";
import { healthStories } from "./health";
import { overviewStories } from "./overview";

export {
  impactCategories,
  impactHopeStories,
  getCategory,
  getCategoryCards,
} from "./shared";

export type {
  ImpactCategory,
  ImpactHopeStory,
  ImpactStoryLink,
  ImpactStoryPageData,
} from "./shared";

export const impactStories = {
  ...overviewStories,
  ...environmentalStories,
  ...educationStories,
  ...animalStories,
  ...healthStories,
};

export type ImpactStoryKey = keyof typeof impactStories;

const impactStoryPaths: Record<ImpactStoryKey, string> = {
  impactHome: "/impact",
  environmental: "/impact/environmental",
  environmentalGwr: "/impact/environmental/gwr",
  environmentalMiawuakiForest: "/impact/environmental/miawuaki-forest",
  environmentalSouthPunjabGreenBook:
    "/impact/environmental/south-punjab-green-book-initiative",
  environmentalLcoy: "/impact/environmental/lcoy",
  environmentalCopInMyCity: "/impact/environmental/cop-in-my-city",
  environmentalDataResearch: "/impact/environmental/data-assessment-research",
  education: "/impact/education",
  educationTransgenderSchool: "/impact/education/transgender-school",
  educationBlindDebating:
    "/impact/education/blind-parliamentary-debating-team",
  educationCareerCounselling:
    "/impact/education/career-counselling-university-applications",
  educationEnrollmentResearch:
    "/impact/education/enrollment-rate-data-assessment",
  animal: "/impact/animal",
  animalCatFeeding: "/impact/animal/cat-feeding-points",
  animalStrayDogCollar: "/impact/animal/stray-dog-collar-project",
  animalDataResearch: "/impact/animal/data-assessment-research",
  health: "/impact/health",
  healthBloodAvailability: "/impact/health/blood-availability",
  healthFreeMedicalBloodCamps: "/impact/health/free-medical-blood-camps",
  healthDataResearch: "/impact/health/data-assessment-research",
};

export function getImpactStory(key: ImpactStoryKey) {
  return impactStories[key];
}

export function getImpactMetadata(key: ImpactStoryKey): Metadata {
  const story = getImpactStory(key);
  const path = impactStoryPaths[key];
  const isListingPage = [
    "impactHome",
    "environmental",
    "education",
    "animal",
    "health",
  ].includes(key);

  return {
    title: story.metaTitle.replace(/\s+\|\s+PakSarZameen$/, ""),
    description: story.metaDescription,
    keywords: Array.from(
      new Set([
        ...siteConfig.seo.keywords,
        story.title,
        story.eyebrow,
        "impact stories pakistan",
        "community development pakistan",
      ])
    ),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: story.metaTitle,
      description: story.metaDescription,
      url: `${siteConfig.siteUrl}${path}`,
      type: isListingPage ? "website" : "article",
      images: [
        {
          url: "/images/hero-fallback.svg",
          width: 1600,
          height: 1000,
          alt: `${story.title} | PakSarZameen`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: story.metaTitle,
      description: story.metaDescription,
      images: ["/images/hero-fallback.svg"],
    },
  };
}
