export type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  slug: string;
  fullContent: string;
};

export const dummyPrograms: Program[] = [
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a1",
    title: "Mahkma Shajarkari",
    description:
      "Community plantation drives and urban greening initiatives for long-term environmental resilience.",
    image: "/images/programs/mahkma-shajarkari.jpg",
    category: "Environment",
    slug: "mahkma-shajarkari",
    fullContent:
      "Mahkma Shajarkari focuses on restoring ecological balance through community tree campaigns, local nursery support, and awareness sessions for sustainable care.",
  },
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a2",
    title: "Ehsas ul Haiwanat",
    description:
      "Animal welfare outreach that promotes compassionate care, rescue support, and public awareness.",
    image: "/images/programs/ehsas-ul-haiwanat.jpg",
    category: "Animal Welfare",
    slug: "ehsas-ul-haiwanat",
    fullContent:
      "Ehsas ul Haiwanat works to improve treatment of animals through local welfare campaigns, rescue partnerships, and community education on humane responsibility.",
  },
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a3",
    title: "Room Zia",
    description:
      "Orphan support services focused on wellbeing, education access, and long-term opportunities.",
    image: "/images/programs/room-zia.jpg",
    category: "Orphan Welfare",
    slug: "room-zia",
    fullContent:
      "Room Zia provides consistent social and educational support for orphaned children, building stable pathways toward confidence, dignity, and meaningful futures.",
  },
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a4",
    title: "Dar ul Aloom",
    description:
      "Educational development efforts that expand access to learning and practical life skills.",
    image: "/images/programs/dar-ul-aloom.jpg",
    category: "Education",
    slug: "dar-ul-aloom",
    fullContent:
      "Dar ul Aloom strengthens literacy and learning outcomes through structured classes, mentoring, and community education programs for underserved groups.",
  },
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a5",
    title: "Tibi Imdad",
    description:
      "Health support programs delivering medical assistance, awareness campaigns, and preventive guidance.",
    image: "/images/programs/tibi-imdad.jpg",
    category: "Health",
    slug: "tibi-imdad",
    fullContent:
      "Tibi Imdad advances public health by connecting families with basic medical aid, preventive education, and healthcare referral pathways in local communities.",
  },
  {
    id: "3d4f95ec-1c8e-4fbf-a5f2-4f91d01000a6",
    title: "Wajood-e-Zan",
    description:
      "Women empowerment initiatives centered on dignity, leadership, education, and economic opportunity.",
    image: "/images/programs/wajood-e-zan.jpg",
    category: "Women Empowerment",
    slug: "wajood-e-zan",
    fullContent:
      "Wajood-e-Zan supports women through skills development, rights awareness, and leadership opportunities that improve household and community outcomes.",
  },
];
