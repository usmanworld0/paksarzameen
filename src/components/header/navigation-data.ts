import { siteConfig } from "@/config/site";

export type NavigationChild = {
  label: string;
  href: string;
  description: string;
};

export type NavigationEntry = {
  label: string;
  href?: string;
  description: string;
  external?: boolean;
  children?: NavigationChild[];
};

export const navigationEntries: NavigationEntry[] = [
  {
    label: "Landing Page",
    description: "Anchor into the homepage story arc.",
    children: [
      {
        label: "What is PSZ? (Problem)",
        href: "/#home-problem",
        description: "Understand the context we are responding to.",
      },
      {
        label: "What We Do (Solution)",
        href: "/#home-solution",
        description: "See the programs and approach in action.",
      },
      {
        label: "Life at PSZ",
        href: "/#home-life-at-psz",
        description: "Meet the people and culture behind the work.",
      },
    ],
  },
  {
    label: "Awards & Honors",
    href: "/impact",
    description: "Explore recognition, milestones, and impact stories.",
  },
  {
    label: "Healthcare",
    href: "/healthcare",
    description: "Access healthcare support and services.",
  },
  {
    label: "Shelter",
    href: "/dog-adoption",
    description: "View the dog adoption and shelter program.",
  },
  {
    label: "Partnerships & Collaborations",
    href: "/get-involved",
    description: "Work with us on programs, campaigns, and community support.",
  },
  {
    label: "News & Features",
    href: "/news",
    description: "Read the latest updates, stories, and field reports.",
  },
  {
    label: "Store",
    href: siteConfig.commonwealthUrl,
    description: "Visit the Paksarzameen Store.",
    external: true,
  },
  {
    label: "Apply",
    href: "/volunteer",
    description: "Join the team or start a volunteer application.",
  },
  {
    label: "FAQ",
    href: "/policies#faq",
    description: "Find answers about the store and support process.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reach the foundation, team, and support channels.",
  },
];
