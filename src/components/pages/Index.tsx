import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import ImportGeniusHeader from "@/components/layout/ImportGeniusHeader";
import InteractiveWorldMap from "@/components/landing/InteractiveWorldMap";
import SearchSection from "@/components/landing/SearchSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { ProofSection } from "@/components/landing/ProofSection";
import Footer from "@/components/landing/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <ImportGeniusHeader />
      <InteractiveWorldMap />
      <SearchSection />
      <FeatureGrid />
      <ProofSection />
      <PricingSection />
      <Footer />
    </div>
  );
}