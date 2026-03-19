import type { ImpactStoryPageData } from "./shared";
import { sectionCards } from "./shared";

export const overviewStories = {
  impactHome: {
    metaTitle: "Impact | PakSarZameen",
    metaDescription:
      "Explore PakSarZameen impact stories across education, health, environmental action, and animal welfare.",
    breadcrumbs: [{ label: "Impact" }],
    eyebrow: "Impact section",
    title: "Stories of care, dignity, and community action",
    intro:
      "Every impact page on this site starts from the same place: a real need voiced by a real community.",
    summary:
      "PakSarZameen works as an NGO partner, not a distant narrator. We listen, mobilize local people and institutions, and keep learning until a response becomes steadier, safer, and more dignified for the people or places involved.",
    cta: {
      label: "Get involved",
      href: "/get-involved",
    },
    secondaryCta: {
      label: "Contact our team",
      href: "/contact",
    },
    quickFacts: [
      { label: "Focus areas", value: "Environment, education, health, and animal welfare" },
      { label: "Method", value: "Community-led action with practical follow-through" },
      { label: "Promise", value: "Stories grounded in service, not spectacle" },
    ],
    highlights: [
      { value: "4 sections", label: "Distinct impact areas with linked stories" },
      { value: "Local-first", label: "Programs shaped by community realities" },
      { value: "Volunteer-powered", label: "People step in before and after events" },
      { value: "Measured", label: "Follow-up helps the work keep improving" },
    ],
    storyHeading: "How PakSarZameen turns concern into action",
    storyChapters: [
      {
        title: "Listen to what is already happening",
        body:
          "We start by paying attention to the everyday barriers people describe: a missing blood donor, a student left out of opportunity, an animal with no reliable care, or a neighborhood with too little green cover.",
      },
      {
        title: "Build the response with the community",
        body:
          "Our model is collaborative by design. Volunteers, local institutions, and community partners make the intervention stronger because they are part of shaping it, not just receiving it.",
      },
      {
        title: "Stay long enough to learn",
        body:
          "For an NGO, one event is never the whole story. We return to outcomes, ask what still feels incomplete, and use that learning to refine the next step.",
      },
    ],
    outcomesHeading: "What these stories point toward",
    outcomes: [
      "Health support becomes more immediate when communities know where to turn before a crisis deepens.",
      "Education becomes more inclusive when students who are usually excluded are coached into public spaces of excellence.",
      "Environmental action lasts longer when youth and local institutions feel genuine ownership of the work.",
      "Animal welfare becomes more humane when care is practical, visible, and sustained by neighbors.",
    ],
    note: {
      title: "A storytelling approach for an NGO site",
      body:
        "These pages are now organized around challenge, response, and outcome so visitors can understand not only what happened, but why the work matters and how they can help sustain it.",
    },
    relatedHeading: "Explore the impact areas",
    relatedStories: sectionCards,
    closing: {
      title: "If a story resonates with you, there is a place for you in it.",
      body:
        "Volunteer time, partnerships, donations, and community referrals all help an impact story continue beyond the moment it is first told.",
    },
    accent: "#295c4b",
    accentSoft: "rgba(41, 92, 75, 0.18)",
  },
} satisfies Record<string, ImpactStoryPageData>;
