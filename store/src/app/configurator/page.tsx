import { ConfiguratorLayout } from "@/components/storefront/configurator/ConfiguratorLayout";

export const dynamic = "force-dynamic";

export default function ConfiguratorPage() {
  return (
    <ConfiguratorLayout
      sectionTitle="01/06: Exterior"
      sceneSrc="/images/commonwealth_header.jpeg"
      layers={[
        {
          id: "base",
          src: "/images/store/products-cover.jpg",
          alt: "Base product layer",
        },
        {
          id: "coachline",
          src: "/images/store/products-cover.jpg",
          alt: "Coachline layer",
          opacity: 0.75,
        },
      ]}
      controls={[
        { id: "front", label: "Front View", active: true },
        { id: "side", label: "Side View" },
        { id: "interior", label: "Interior" },
        { id: "night", label: "Night Scene" },
      ]}
      steps={[
        { id: "exterior", label: "Exterior", completed: true },
        { id: "wheels", label: "Wheels" },
        { id: "interior", label: "Interior" },
        { id: "materials", label: "Materials" },
        { id: "detailing", label: "Detailing" },
        { id: "summary", label: "Summary" },
      ]}
      customizationItems={[
        {
          id: "coachline-colour",
          title: "Coachline Colour",
          thumbnail: "/images/store/artisans-cover.jpg",
          actionLabel: "Remove",
          selected: true,
          showInfo: true,
        },
        {
          id: "single-coachline",
          title: "Single Coachline",
          thumbnail: "/images/store/artisans-cover.jpg",
          actionLabel: "Remove",
          selected: true,
          showInfo: true,
        },
        {
          id: "wheel-finish",
          title: "Wheel Finish",
          thumbnail: "/images/store/products-cover.jpg",
          actionLabel: "Select",
          selected: false,
          showInfo: true,
        },
      ]}
      productName="PHANTOM"
      specs={[
        { label: "WLTP Consumption (Combined)", value: "16.1 l/100km" },
        { label: "WLTP CO2 Emissions (Combined)", value: "366 g/km" },
        { label: "Power", value: "420 kW" },
        { label: "Torque", value: "900 Nm" },
      ]}
    />
  );
}
