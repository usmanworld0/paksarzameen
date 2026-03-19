import type { ImpactStoryPageData } from "./shared";
import { getCategoryCards } from "./shared";

export const healthStories = {
  health: {
    metaTitle: "Community Health Impact | PakSarZameen",
    metaDescription:
      "Explore PakSarZameen health impact stories across blood access, medical camps, and field-based research.",
    breadcrumbs: [
      { label: "Impact", href: "/impact" },
      { label: "Community Health Impact" },
    ],
    eyebrow: "Impact section / Community health",
    title: "Community health stories built around urgency, care, and follow-through",
    intro:
      "In health work, urgency is real. Families rarely have time to wait while systems slowly organize themselves.",
    summary:
      "PakSarZameen's health initiatives respond to immediate need through blood support, recurring camps, and field coordination. The content now tells that work as a story of response, relief, and ongoing learning rather than isolated announcements.",
    cta: {
      label: "Open blood bank",
      href: "/blood-bank",
    },
    secondaryCta: {
      label: "Get involved",
      href: "/get-involved",
    },
    quickFacts: [
      { label: "Main focus", value: "Emergency support and recurring health outreach" },
      { label: "How it helps", value: "Blood access, camps, and community coordination" },
      { label: "What sustains it", value: "Donors, volunteers, and constant follow-up" },
    ],
    highlights: [
      { value: "Urgent", label: "Programs respond when delay can cost too much" },
      { value: "Community-powered", label: "Donors and volunteers make the system work" },
      { value: "Recurring", label: "Health outreach is designed to return, not disappear" },
      { value: "Measured", label: "Research helps future support stay relevant" },
    ],
    storyHeading: "The community health story arc",
    storyChapters: [
      {
        title: "Respond to need without delay",
        body:
          "Whether the need is emergency blood or immediate medical attention, health work begins with readiness. That readiness is built before the crisis arrives.",
      },
      {
        title: "Bring care closer to people",
        body:
          "Medical and blood camps matter because they reduce distance between communities and essential support. For many families, proximity changes what is possible.",
      },
      {
        title: "Learn from every response",
        body:
          "Patterns in demand, shortages, and outreach all help shape stronger planning. The goal is not only to help today, but to be better prepared tomorrow.",
      },
    ],
    outcomesHeading: "What community health impact looks like here",
    outcomes: [
      "Blood support becomes easier to access when donor coordination is treated seriously.",
      "Recurring camps extend basic care into places where services can feel distant or limited.",
      "The story now shows health work as a sequence of preparation, response, and learning.",
    ],
    note: {
      title: "An NGO story grounded in urgency",
      body:
        "Health pages now move more clearly through need, response, and outcome, which helps visitors understand not just what happened but why the timing mattered.",
    },
    mediaHeading: "Field moments from community health work",
    media: [
      {
        title: "Blood donation drive for conflict victims",
        description:
          "A moment that framed blood donation as compassion, peace, and community responsibility.",
        permalink: "https://www.instagram.com/p/DKFn43YyK0g/",
      },
      {
        title: "Recent free medical and blood camp",
        description:
          "A look at recurring outreach designed to bring care closer to underserved communities.",
        permalink: "https://www.instagram.com/reel/DJEWGY8NjQs/",
      },
    ],
    relatedHeading: "Explore community health stories",
    relatedStories: getCategoryCards("health"),
    closing: {
      title: "Health support is strongest when people know they are not facing crisis alone.",
      body:
        "If you want to support emergency readiness, medical outreach, or donor coordination, there is meaningful work to do together.",
    },
    accent: "#a63d40",
    accentSoft: "rgba(166, 61, 64, 0.16)",
  },
  healthBloodAvailability: {
    metaTitle: "24/7 Availability of Blood | Community Health Impact | PakSarZameen",
    metaDescription:
      "Learn how PakSarZameen's blood availability efforts support urgent health needs around the clock.",
    breadcrumbs: [
      { label: "Impact", href: "/impact" },
      { label: "Community Health Impact", href: "/impact/health" },
      { label: "24/7 Availability of Blood" },
    ],
    eyebrow: "Community health story",
    title: "24/7 availability of blood: meeting urgent need before time runs out",
    intro:
      "When a patient needs blood, the hardest part is often not willingness to help but the time it takes to find the right donor, confirm availability, and respond fast enough.",
    summary:
      "PakSarZameen's blood availability work is built around readiness. It depends on a responsive donor network, public trust, and the discipline to treat emergency need as something that must be prepared for before it arrives.",
    cta: {
      label: "Open blood bank",
      href: "/blood-bank",
    },
    secondaryCta: {
      label: "Explore health impact",
      href: "/impact/health",
    },
    quickFacts: [
      { label: "Core mission", value: "Reliable blood access for urgent patient needs" },
      { label: "What it requires", value: "Donor coordination, trust, and fast response" },
      { label: "Why it matters", value: "Delay can deepen crisis for families and patients" },
    ],
    highlights: [
      { value: "Ready", label: "Preparedness matters as much as compassion" },
      { value: "Coordinated", label: "The donor network must move quickly and clearly" },
      { value: "Trust-based", label: "Families need dependable pathways in urgent moments" },
      { value: "Life-linked", label: "This is immediate support with direct consequences" },
    ],
    storyHeading: "Why blood access becomes a story of readiness",
    storyChapters: [
      {
        title: "Acknowledge the urgency honestly",
        body:
          "Families looking for blood are often already carrying fear, time pressure, and uncertainty. The first responsibility is recognizing that urgency for what it is.",
      },
      {
        title: "Build systems before the emergency",
        body:
          "A reliable response depends on preparation: donor relationships, communication, and a system people trust enough to call when they need help most.",
      },
      {
        title: "Keep the support human",
        body:
          "Readiness should not feel mechanical. For an NGO, blood support is also a form of solidarity with families navigating one of the most vulnerable moments they may face.",
      },
    ],
    outcomesHeading: "What stronger blood support can change",
    outcomes: [
      "Patients and families have a clearer route to urgent donor support.",
      "Donor coordination becomes more effective because readiness is treated as ongoing work.",
      "The health section now communicates why blood support is both practical and deeply human.",
    ],
    note: {
      title: "Preparedness is a form of compassion",
      body:
        "This page now tells the blood access story in a way that helps visitors understand that life-saving support depends on systems, not only good intentions.",
    },
    relatedHeading: "Continue with related health stories",
    relatedStories: getCategoryCards("health", ["/impact/health/blood-availability"]),
    closing: {
      title: "A timely donor response can change everything for a family in crisis.",
      body:
        "If you want to strengthen blood readiness, donor mobilization, or emergency community care, we would welcome your support.",
    },
    accent: "#b44a4d",
    accentSoft: "rgba(180, 74, 77, 0.16)",
  },
  healthFreeMedicalBloodCamps: {
    metaTitle: "Monthly Free Medical and Blood Camps | Community Health Impact | PakSarZameen",
    metaDescription:
      "Explore PakSarZameen's recurring medical and blood camps and their community health impact.",
    breadcrumbs: [
      { label: "Impact", href: "/impact" },
      { label: "Community Health Impact", href: "/impact/health" },
      { label: "Monthly Free Medical and Blood Camps" },
    ],
    eyebrow: "Community health story",
    title: "Monthly free medical and blood camps: bringing care closer to where people live",
    intro:
      "Health support becomes more equitable when it travels toward people instead of expecting every patient to overcome distance, cost, and uncertainty alone.",
    summary:
      "PakSarZameen's recurring camps are built around outreach and continuity. A recent camp in Rural Settlement Aka Kachi Basti, Bahawalpur served 150 patients and distributed essential medical supplies, showing how regular presence can build trust and access over time.",
    cta: {
      label: "Explore health impact",
      href: "/impact/health",
    },
    secondaryCta: {
      label: "Open blood bank",
      href: "/blood-bank",
    },
    quickFacts: [
      { label: "Recent field note", value: "150 patients served in Aka Kachi Basti, Bahawalpur" },
      { label: "Support model", value: "Recurring outreach with volunteers and partners" },
      { label: "Key partner", value: "Project Tibi Indad in regular camp coordination" },
    ],
    highlights: [
      { value: "Recurring", label: "Care is designed to return, not appear once" },
      { value: "Accessible", label: "Communities receive support closer to home" },
      { value: "Collaborative", label: "Volunteers and partners sustain the outreach" },
      { value: "Responsive", label: "Blood drives also address seasonal shortages" },
    ],
    storyHeading: "How recurring health outreach changes the story",
    storyChapters: [
      {
        title: "Go where access is thin",
        body:
          "Many communities need more than information about health services; they need those services to show up where barriers are already high. Outreach camps answer that need directly.",
      },
      {
        title: "Build consistency through partnership",
        body:
          "Regular camps are only possible when volunteers, organizers, and partners keep showing up. That shared discipline is part of the intervention itself.",
      },
      {
        title: "Respond to patterns in need",
        body:
          "The same spirit that drives camps also supports blood donation during periods of shortage, including drives conducted to encourage healthy, philanthropic participation and support emergency patients.",
      },
    ],
    outcomesHeading: "What recurring camps help make possible",
    outcomes: [
      "Patients gain access to basic medical care and supplies closer to their communities.",
      "Volunteer-driven outreach creates a stronger local sense that care is possible and repeatable.",
      "The section now frames camps as sustained community health infrastructure rather than one-off events.",
    ],
    note: {
      title: "Field work deserves narrative clarity",
      body:
        "This page now connects the recent camp highlight, the blood drive story, and the partnership model into one coherent account of outreach and continuity.",
    },
    mediaHeading: "Snapshots from community outreach",
    media: [
      {
        title: "Recent medical camp reel",
        description:
          "A quick look at the camp in Aka Kachi Basti and the people who helped make it possible.",
        permalink: "https://www.instagram.com/reel/DJEWGY8NjQs/",
      },
      {
        title: "Blood donation drive post",
        description:
          "A reminder that community blood support also depends on recurring public mobilization.",
        permalink: "https://www.instagram.com/p/ChW3ooxICQU/",
      },
    ],
    relatedHeading: "Continue with related health stories",
    relatedStories: getCategoryCards("health", ["/impact/health/free-medical-blood-camps"]),
    closing: {
      title: "Health outreach changes lives when communities can count on it to return.",
      body:
        "If you want to support camps, supplies, or volunteer-driven health service, we would be glad to work together.",
    },
    accent: "#b4584b",
    accentSoft: "rgba(180, 88, 75, 0.16)",
  },
  healthDataResearch: {
    metaTitle: "Data Assessment and Research | Community Health Impact | PakSarZameen",
    metaDescription:
      "See how PakSarZameen uses health data and assessment to improve blood support and medical outreach.",
    breadcrumbs: [
      { label: "Impact", href: "/impact" },
      { label: "Community Health Impact", href: "/impact/health" },
      { label: "Data Assessment and Research" },
    ],
    eyebrow: "Community health story",
    title: "Data assessment and research: learning from demand so health support can respond better",
    intro:
      "In community health, patterns matter. Demand rises, shortages appear, and needs differ across places and time. Without observation, teams can only react after pressure builds.",
    summary:
      "PakSarZameen's health assessment work helps identify where blood demand is rising, where camps are most needed, and how outreach can become more responsive. It is an essential part of turning care into a system that learns.",
    cta: {
      label: "Explore health impact",
      href: "/impact/health",
    },
    secondaryCta: {
      label: "Contact our team",
      href: "/contact",
    },
    quickFacts: [
      { label: "Purpose", value: "Improve planning around urgent and recurring health needs" },
      { label: "What it tracks", value: "Demand, shortages, outreach patterns, and follow-up" },
      { label: "Why it matters", value: "Better information helps care arrive sooner and smarter" },
    ],
    highlights: [
      { value: "Adaptive", label: "Programs improve through observation and reflection" },
      { value: "Preventive", label: "Patterns can be addressed before they become crises" },
      { value: "Strategic", label: "Limited resources can be used more carefully" },
      { value: "Accountable", label: "Health impact is examined, not simply announced" },
    ],
    storyHeading: "Why research belongs in community health",
    storyChapters: [
      {
        title: "Track pressure points early",
        body:
          "Blood shortages, recurring needs, and outreach gaps all leave signals. Good assessment helps teams notice those signals before they harden into deeper emergency.",
      },
      {
        title: "Plan support where it will matter most",
        body:
          "Once patterns are clearer, camps, donor mobilization, and field support can be organized with more focus and less guesswork.",
      },
      {
        title: "Use data to strengthen trust",
        body:
          "Visitors and partners often want to know whether health work is learning from itself. Research helps answer that question with honesty and discipline.",
      },
    ],
    outcomesHeading: "What this work supports",
    outcomes: [
      "Health interventions can be scheduled and refined more effectively.",
      "Teams gain a clearer sense of where recurring need is most urgent.",
      "The community health section communicates both compassion and operational seriousness.",
    ],
    note: {
      title: "Measurement protects the mission",
      body:
        "When health work is documented and assessed carefully, it becomes easier to improve and easier for the public to trust.",
    },
    relatedHeading: "More community health stories",
    relatedStories: getCategoryCards("health", ["/impact/health/data-assessment-research"]),
    closing: {
      title: "Health care grows stronger when response is guided by what communities are actually experiencing.",
      body:
        "Support for health research, documentation, and follow-up helps every future intervention become more effective.",
    },
    accent: "#9f4b52",
    accentSoft: "rgba(159, 75, 82, 0.16)",
  },
} satisfies Record<string, ImpactStoryPageData>;
