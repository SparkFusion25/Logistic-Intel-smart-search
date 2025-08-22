export default function FeatureGrid() {
  const features = [
    {
      title: "Search Intelligence",
      description: "Company, HS code, route, mode filters with advanced search capabilities.",
      icon: "🔍"
    },
    {
      title: "CRM Enrichment", 
      description: "Apollo + LinkedIn integration with one-click contact import.",
      icon: "👥"
    },
    {
      title: "Outreach Engine",
      description: "Gmail/Outlook integration with tracking and automation.",
      icon: "📧"
    },
    {
      title: "Smart Widgets",
      description: "Tariff Calculator, Quote Generator, Market Benchmark tools.",
      icon: "🧮"
    }
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E39] mb-4">
          Turn shipments into meetings
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Comprehensive tools for modern logistics professionals
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-3 text-[#0B1E39]">
              {feature.title}
            </h3>
            <p className="text-slate-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}