export type Article = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  fullContent: string;
};

export const dummyArticles: Article[] = [
  {
    id: "7f5c0212-95e0-45ca-a62e-c497ab1200a1",
    title: "Mahkma Shajarkari Completes Seasonal Plantation Drive",
    excerpt:
      "Volunteers and partner schools collaborated to plant native saplings across priority neighborhoods.",
    date: "2026-02-21T00:00:00.000Z",
    category: "Impact",
    image: "/images/news/plantation-drive.jpg",
    slug: "mahkma-shajarkari-seasonal-plantation-drive",
    fullContent:
      "The latest plantation campaign focused on climate resilience and local stewardship, with community teams responsible for post-plantation care and monitoring.",
  },
  {
    id: "7f5c0212-95e0-45ca-a62e-c497ab1200a2",
    title: "Dar ul Aloom Launches Community Learning Pods",
    excerpt:
      "New neighborhood study circles are expanding access to foundational literacy and mentoring support.",
    date: "2026-02-14T00:00:00.000Z",
    category: "News",
    image: "/images/news/learning-pods.jpg",
    slug: "dar-ul-aloom-community-learning-pods",
    fullContent:
      "Dar ul Aloom has introduced structured learning pods that combine guided reading, life skills coaching, and parent engagement to improve retention.",
  },
  {
    id: "7f5c0212-95e0-45ca-a62e-c497ab1200a3",
    title: "Tibi Imdad Hosts Preventive Health Outreach",
    excerpt:
      "Local clinicians and volunteers delivered screenings and practical health awareness sessions.",
    date: "2026-02-08T00:00:00.000Z",
    category: "Update",
    image: "/images/news/health-outreach.jpg",
    slug: "tibi-imdad-preventive-health-outreach",
    fullContent:
      "The outreach included blood pressure checks, nutrition guidance, and referrals for follow-up care, helping families address early health risks.",
  },
  {
    id: "7f5c0212-95e0-45ca-a62e-c497ab1200a4",
    title: "Wajood-e-Zan Expands Skills and Leadership Cohort",
    excerpt:
      "A new cohort started training in enterprise skills, digital literacy, and community leadership.",
    date: "2026-01-29T00:00:00.000Z",
    category: "Impact",
    image: "/images/news/wajood-e-zan-cohort.jpg",
    slug: "wajood-e-zan-skills-leadership-cohort",
    fullContent:
      "Participants are receiving structured support in confidence building, vocational planning, and peer mentorship to strengthen long-term livelihood outcomes.",
  },
];
