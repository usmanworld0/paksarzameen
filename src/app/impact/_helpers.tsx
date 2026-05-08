import type { Metadata } from "next";
import type { ReactElement } from "react";

import { ImpactStoryPage } from "@/components/impact/ImpactStoryPage";
import { getImpactMetadata, getImpactStory, type ImpactStoryKey } from "@/content/impact";

export function makeImpactStoryRoute(key: ImpactStoryKey): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const story = getImpactStory(key);

  return {
    metadata: getImpactMetadata(key),
    Page: function ImpactRoutePage() {
      return <ImpactStoryPage story={story} />;
    },
  };
}
