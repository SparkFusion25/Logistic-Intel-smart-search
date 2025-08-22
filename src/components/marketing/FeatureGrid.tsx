export default function FeatureGrid() {
  const features = [
    {
      title: "Company-first Search",
      description: "Find importers/exporters and drill into shipments instantly.",
      icon: "🔍"
    },
    {
      title: "Live Shipment Trends", 
      description: "Analyze tradelanes, ports, and time windows with filters.",
      icon: "📈"
    },
    {
      title: "One-click CRM",
      description: "Add company cards to your CRM with enriched contacts.",
      icon: "📋"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#0B1E39]">
          Company-first, shipment-backed
        </h2>
        <p className="mt-4 text-lg text-slate-700">
          Search by company and instantly see trade lanes, shipment totals, and trend charts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 text-center shadow">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-3 text-[#0B1E39]">
              {feature.title}
            </h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}