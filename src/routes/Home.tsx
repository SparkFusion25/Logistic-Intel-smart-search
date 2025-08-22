import { SeoHelmet } from "@/components/seo/SeoHelmet";
import HeroSection from "@/components/marketing/HeroSection";
import LogoWall from "@/components/marketing/LogoWall";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import DataCoverage from "@/components/marketing/DataCoverage";
import Testimonials from "@/components/marketing/Testimonials";
import PricingTeaser from "@/components/marketing/PricingTeaser";
import BlogPreview from "@/components/marketing/BlogPreview";
import CTASection from "@/components/marketing/CTASection";

export default function Home(){
  return (
    <>
      <SeoHelmet 
        title="Logistic Intel - Global Freight Intelligence Platform"
        description="Search global trade data, find importers and exporters, and grow your logistics business with AI-powered insights."
        canonical="https://logisticintel.com"
      />
      <main className="bg-gradient-to-b from-[#0A1A33] via-[#F7F8FA] to-[#F7F8FA]">
        <HeroSection />
        <LogoWall />
        <FeatureGrid />
        <DataCoverage />
        <Testimonials />
        <PricingTeaser />
        <BlogPreview />
        <CTASection />
      </main>
    </>
  );
}