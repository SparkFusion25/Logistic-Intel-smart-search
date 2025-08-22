export default function DataCoverage() {
  const stats = [
    { label: "Countries Covered", value: "180+" },
    { label: "Trade Records", value: "2.5B+" },
    { label: "Companies Tracked", value: "500K+" },
    { label: "Data Sources", value: "15+" }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl p-12 shadow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B1E39]">
            Global Trade Intelligence
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Comprehensive coverage across all major shipping routes and trade lanes
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-[#0F4C81] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}