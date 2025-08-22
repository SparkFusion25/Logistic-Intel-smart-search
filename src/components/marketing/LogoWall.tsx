export default function LogoWall() {
  const logos = [
    "BTS", "US Census", "UN Comtrade", "Apollo", "CBP", "PIERS", "ImportGenius"
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">
          Trusted data sources
        </p>
        <div className="mt-6 flex justify-center items-center gap-8 opacity-60">
          {logos.map((logo) => (
            <span key={logo} className="text-sm font-medium text-slate-600">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}