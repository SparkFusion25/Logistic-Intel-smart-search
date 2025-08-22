import { useEffect, useMemo, useState } from "react";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd, createWebSiteSchema } from "@/components/seo/JsonLd";
import HeroMap from "@/components/marketing/HeroMap";
import HeroCTA from "@/components/marketing/HeroCTA";
import CompanyCard from "@/components/marketing/CompanyCard";

type DemoCompany = {
  id: string;
  name: string;
  role: "Importer" | "Exporter" | "Receiver" | "Shipper";
  lanes: string[];
  hs: string[];
  lastSeen: string;
};

const DEMO_COMPANIES: DemoCompany[] = [
  { id: "1", name: "Nordic Auto Parts A/S", role: "Importer", lanes: ["DE → US", "NL → US"], hs: ["8708", "8407"], lastSeen: "3 days ago" },
  { id: "2", name: "Andean Coffee Co.", role: "Exporter", lanes: ["PE → US"], hs: ["0901"], lastSeen: "6 days ago" },
  { id: "3", name: "Mediterraneo Textiles", role: "Shipper", lanes: ["TR → FR", "TR → US"], hs: ["6006", "6203"], lastSeen: "yesterday" },
  { id: "4", name: "West Coast Electronics", role: "Receiver", lanes: ["CN → US"], hs: ["8542", "8504"], lastSeen: "2 hours ago" },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const companies = useMemo(() => DEMO_COMPANIES, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % companies.length);
    }, 7000);
    return () => clearInterval(id);
  }, [companies.length]);

  return (
    <>
      <SeoHelmet
        title="Logistic Intel - Global Freight Intelligence Platform"
        description="Search global trade data, find importers and exporters, and grow your logistics business with AI-powered insights."
        canonical="https://logisticintel.com"
      />
      <JsonLd data={createWebSiteSchema()} />
      
      <main style={{ background: 'var(--bg-muted)' }}>
        {/* HERO */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: CTA Content */}
            <div className="order-2 lg:order-1">
              <HeroCTA />
            </div>
            
            {/* Right: Glossy Map Card */}
            <div className="order-1 lg:order-2">
              <div className="card-glass p-6">
                <HeroMap activeIndex={activeIndex} />
              </div>
            </div>
          </div>
          
          {/* Company Card - Below hero */}
          <div className="mt-12 lg:mt-16">
            <CompanyCard companies={companies} activeIndex={activeIndex} />
          </div>
        </section>

        {/* Trust Strip */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Trusted data sources
            </p>
            <div className="mt-6 flex justify-center items-center gap-8 opacity-60">
              <span className="text-sm font-medium">BTS</span>
              <span className="text-sm font-medium">US Census</span>
              <span className="text-sm font-medium">UN Comtrade</span>
              <span className="text-sm font-medium">Apollo</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              Company-first, shipment-backed
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-muted)' }}>
              Search by company and instantly see trade lanes, shipment totals, and trend charts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Company-first Search",
                desc: "Find importers/exporters and drill into shipments instantly.",
                icon: "🔍"
              },
              {
                title: "Live Shipment Trends", 
                desc: "Analyze tradelanes, ports, and time windows with filters.",
                icon: "📈"
              },
              {
                title: "One-click CRM",
                desc: "Add company cards to your CRM with enriched contacts.",
                icon: "📋"
              }
            ].map((feature, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Band */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="card-glass p-12 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Ready to try Logistic Intel?
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--text-muted)' }}>
              Join thousands of logistics professionals using our platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/signup"
                className="gradient-cta inline-flex items-center rounded-2xl px-8 py-4 font-semibold shadow-lg transition hover:brightness-110"
              >
                Create Account
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center rounded-2xl px-8 py-4 font-semibold transition"
                style={{ 
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  color: 'var(--brand-700)'
                }}
              >
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}