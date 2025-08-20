import { HeroSection } from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { ProofSection } from "@/components/landing/ProofSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <HeroSection />
      <FeatureGrid />
      <ProofSection />
      <PricingSection />
    </div>
  );
}