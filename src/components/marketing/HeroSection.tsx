import { useEffect, useMemo, useState } from "react";
import HeroMap from "./HeroMap";
import HeroCTA from "./HeroCTA";
import CompanyCard from "./CompanyCard";

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

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const companies = useMemo(() => DEMO_COMPANIES, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % companies.length);
    }, 7000);
    return () => clearInterval(id);
  }, [companies.length]);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
      <div className="relative w-full rounded-2xl shadow-sm overflow-hidden">
        {/* Map background with moving icons */}
        <HeroMap activeIndex={activeIndex} />

        {/* CTA overlay and Company Card */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-1 lg:grid-cols-[1fr_420px]">
          <div className="pointer-events-auto flex items-start">
            <HeroCTA />
          </div>
          <div className="pointer-events-auto hidden lg:flex items-start justify-end p-6">
            <CompanyCard companies={companies} activeIndex={activeIndex} />
          </div>
        </div>
      </div>

      {/* On mobile, show the card below */}
      <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        <CompanyCard companies={companies} activeIndex={activeIndex} />
      </div>
    </section>
  );
}