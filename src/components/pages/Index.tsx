import ImportGeniusHeader from "@/components/layout/ImportGeniusHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { ProofSection } from "@/components/landing/ProofSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <ImportGeniusHeader />
      <HeroSection />
      <FeatureGrid />
      <ProofSection />
      <PricingSection />
    </div>
  );
}