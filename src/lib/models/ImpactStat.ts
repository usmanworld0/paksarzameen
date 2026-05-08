export type ImpactStat = {
  id: string;
  label: string;
  value: number;
  icon: string;
};

export const dummyImpactStats: ImpactStat[] = [
  {
    id: "a6f3f868-f0c9-47bc-9e79-24f2cc0000a1",
    label: "Entrepreneurs Supported",
    value: 5200,
    icon: "users",
  },
  {
    id: "a6f3f868-f0c9-47bc-9e79-24f2cc0000a2",
    label: "Regions Served",
    value: 18,
    icon: "map",
  },
  {
    id: "a6f3f868-f0c9-47bc-9e79-24f2cc0000a3",
    label: "Products Sold",
    value: 14250,
    icon: "package",
  },
  {
    id: "a6f3f868-f0c9-47bc-9e79-24f2cc0000a4",
    label: "Beneficiaries Reached",
    value: 34000,
    icon: "heart",
  },
];
