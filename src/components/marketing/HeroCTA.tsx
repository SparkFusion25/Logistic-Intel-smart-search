export default function HeroCTA() {
  return (
    <div className="p-6 sm:p-10">
      {/* soft scrim directly behind text to guarantee contrast */}
      <div className="inline-block rounded-2xl bg-white/70 backdrop-blur-md px-6 py-5 shadow">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1E39]">
          Global freight intelligence, CRM, and outreach in one platform
        </h1>
        <p className="mt-3 text-slate-700 max-w-xl">
          Search shipments, analyze lanes, calculate tariffs, and launch real campaigns—without leaving Logistic Intel.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/request-demo"
            className="inline-flex items-center rounded-xl px-5 py-3 text-white font-semibold shadow transition
                       bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          >
            Request a demo
          </a>
          <a
            href="/signup"
            className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-[#0F4C81] bg-white shadow hover:bg-slate-50
                       focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          >
            Start free trial
          </a>
        </div>
      </div>
    </div>
  );
}