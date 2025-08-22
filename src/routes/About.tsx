import SeoHelmet from "@/components/seo/SeoHelmet";

export default function About() {
  const team = [
    { name: "Sarah Chen", role: "CEO & Co-founder", bio: "Former VP at Flexport, 15+ years in logistics tech" },
    { name: "Marcus Rodriguez", role: "CTO & Co-founder", bio: "Ex-Google engineer, expert in data infrastructure" },
    { name: "Jennifer Park", role: "Head of Product", bio: "Former product lead at Convoy, UX-focused" }
  ];

  const values = [
    { title: "Data-Driven", desc: "Every decision backed by accurate, real-time trade intelligence" },
    { title: "Customer-First", desc: "Built by logistics professionals, for logistics professionals" },
    { title: "Global Scale", desc: "Comprehensive coverage across all major trade routes" },
    { title: "Innovation", desc: "Continuously advancing the state of freight intelligence" }
  ];

  return (
    <>
      <SeoHelmet
        title="About Us - Logistic Intel"
        description="Learn about Logistic Intel's mission to transform global freight intelligence and help logistics professionals grow their business."
        canonical="https://logisticintel.com/about"
      />
      
      <main className="bg-[#F7F8FA]">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1E39] mb-6">
              Transforming Global Freight Intelligence
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              We're building the future of logistics by making global trade data accessible, 
              actionable, and integrated into your daily workflow.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-12 shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#0B1E39] mb-6">Our Mission</h2>
                <p className="text-lg text-slate-700 mb-6">
                  To democratize global trade intelligence and empower logistics professionals 
                  with the data and tools they need to identify opportunities, build relationships, 
                  and grow their business.
                </p>
                <p className="text-slate-700">
                  Founded in 2019, Logistic Intel emerged from the frustration of trying to 
                  piece together fragmented trade data from multiple sources. We knew there 
                  had to be a better way.
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2.5B+</div>
                  <div className="text-blue-100">Trade records analyzed</div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">180+</div>
                    <div className="text-blue-100 text-sm">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">500K+</div>
                    <div className="text-blue-100 text-sm">Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow text-center">
                <h3 className="text-lg font-semibold text-[#0B1E39] mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39]">Meet Our Team</h2>
            <p className="mt-4 text-lg text-slate-700">
              Logistics veterans and technology experts working together
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 shadow text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#0B1E39] mb-1">{member.name}</h3>
                <div className="text-[#0F4C81] font-medium mb-3">{member.role}</div>
                <p className="text-slate-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-12 text-center shadow">
            <h2 className="text-3xl font-bold text-[#0B1E39] mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-slate-700 mb-8">
              Join thousands of logistics professionals using Logistic Intel
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/request-demo" 
                className="inline-flex items-center rounded-xl px-6 py-3 text-white font-semibold shadow transition
                           bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110"
              >
                Request a Demo
              </a>
              <a 
                href="/signup" 
                className="inline-flex items-center rounded-xl px-6 py-3 font-semibold border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}