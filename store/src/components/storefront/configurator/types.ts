export type PreviewLayer = {
  id: string;
  src: string;
  alt: string;
  opacity?: number;
};

export type PreviewControl = {
  id: string;
  label: string;
  active?: boolean;
};

export type CustomizationStep = {
  id: string;
  label: string;
  completed?: boolean;
};

export type CustomizationItem = {
  id: string;
  title: string;
  thumbnail: string;
  selected?: boolean;
  actionLabel: "Select" | "Remove";
  showInfo?: boolean;
};

export type ProductSpec = {
  label: string;
  value: string;
};
