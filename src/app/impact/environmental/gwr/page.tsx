import { getImpactMetadata } from "@/content/impact";
import ImpactGwrSection from "@/components/impact/ImpactGwrSection";

export const metadata = getImpactMetadata("environmentalGwr");

export default function Page() {
	return <ImpactGwrSection />;
}
