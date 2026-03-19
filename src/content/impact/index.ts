import type { Metadata } from "next";

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

export type { ImpactCategory, ImpactStoryLink, ImpactStoryPageData } from "./shared";

export const impactStories = {
  ...overviewStories,
  ...environmentalStories,
  ...educationStories,
  ...animalStories,
  ...healthStories,
};

export type ImpactStoryKey = keyof typeof impactStories;

export function getImpactStory(key: ImpactStoryKey) {
  return impactStories[key];
}

export function getImpactMetadata(key: ImpactStoryKey): Metadata {
  const story = getImpactStory(key);

  return {
    title: story.metaTitle,
    description: story.metaDescription,
  };
}
