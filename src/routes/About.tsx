import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd } from "@/components/seo/JsonLd";

const leadership = [
  {
    name: "Sarah Chen",
    title: "CEO & Co-Founder",
    bio: "15+ years in global logistics, former VP at Maersk Digital",
    image: "/team/sarah-chen.jpg"
  },
  {
    name: "Marcus Rodriguez",
    title: "CTO & Co-Founder", 
    bio: "Former Principal Engineer at Flexport, MIT Computer Science",
    image: "/team/marcus-rodriguez.jpg"
  },
  {
    name: "Dr. Priya Patel",
    title: "Head of Data Science",
    bio: "PhD Economics, former trade analyst at World Bank",
    image: "/team/priya-patel.jpg"
  }
];

const timeline = [
  { year: "2019", event: "Founded by logistics veterans to democratize trade intelligence" },
  { year: "2020", event: "Launched first MVP with 50M+ shipment records" },
  { year: "2021", event: "Series A funding, expanded to 180+ countries" },
  { year: "2022", event: "Added CRM and outreach capabilities" },
  { year: "2023", event: "AI-powered insights and market intelligence" },
  { year: "2024", event: "Serving 1000+ companies worldwide" }
];

const values = [
  {
    title: "Data Transparency",
    description: "We believe trade data should be accessible, accurate, and actionable for businesses of all sizes."
  },
  {
    title: "Customer Success",
    description: "Our platform succeeds when our customers win more business and optimize their supply chains."
  },
  {
    title: "Global Impact", 
    description: "Connecting businesses worldwide to enable more efficient, sustainable international trade."
  },
  {
    title: "Innovation",
    description: "Continuously pushing the boundaries of what's possible with logistics intelligence and AI."
  }
];

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Logistic Intel",
    "description": "Global freight intelligence, CRM, and outreach platform for logistics professionals",
    "url": "https://logisticintel.com",
    "logo": "https://logisticintel.com/logo.png",
    "foundingDate": "2019",
    "founders": [
      {
        "@type": "Person",
        "name": "Sarah Chen",
        "jobTitle": "CEO & Co-Founder"
      },
      {
        "@type": "Person", 
        "name": "Marcus Rodriguez",
        "jobTitle": "CTO & Co-Founder"
      }
    ],
    "numberOfEmployees": "50-100",
    "industry": "Logistics Technology"
  };

  return (
    <>
      <SeoHelmet
        title="About Us - Logistic Intel"
        description="Learn about Logistic Intel's mission to democratize global trade intelligence. Meet our team and discover how we're transforming logistics with AI-powered insights."
        canonical="https://logisticintel.com/about"
      />
      <JsonLd data={structuredData} />
      
      <main className="bg-[#F7F8FA]">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1E39]">
              Democratizing global trade intelligence
            </h1>
            <p className="mt-6 text-xl text-slate-700 max-w-3xl mx-auto">
              We're building the future of logistics intelligence—where every freight forwarder, 
              shipper, and 3PL has access to the data and tools they need to compete globally.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0B1E39] mb-6">Our Mission</h2>
              <p className="text-lg text-slate-700 mb-6">
                Global trade generates trillions in economic value, but critical intelligence 
                has been locked away in expensive, complex systems accessible only to the largest players.
              </p>
              <p className="text-lg text-slate-700 mb-6">
                We're changing that. Logistic Intel makes enterprise-grade trade intelligence 
                accessible to businesses of all sizes, with AI-powered insights that help you 
                find opportunities, win customers, and optimize operations.
              </p>
              <p className="text-lg text-slate-700">
                Every shipment tells a story. We help you read it.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">180+</div>
                  <div className="text-sm text-slate-600">Countries covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">50M+</div>
                  <div className="text-sm text-slate-600">Shipment records</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">1000+</div>
                  <div className="text-sm text-slate-600">Active customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81]">24/7</div>
                  <div className="text-sm text-slate-600">Data updates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39]">Leadership Team</h2>
            <p className="mt-4 text-lg text-slate-700">
              Logistics veterans and technology innovators building the future of trade intelligence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person) => (
              <div key={person.name} className="bg-white rounded-2xl p-6 shadow text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-full"></div>
                <h3 className="text-xl font-semibold text-[#0B1E39] mb-2">{person.name}</h3>
                <p className="text-[#0F4C81] font-medium mb-3">{person.title}</p>
                <p className="text-slate-600 text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39]">Our Journey</h2>
          </div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-full 
                                flex items-center justify-center text-white font-bold text-lg">
                  {item.year}
                </div>
                <div className="bg-white rounded-xl p-6 shadow flex-1">
                  <p className="text-slate-700">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E39]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 shadow">
                <h3 className="text-xl font-semibold text-[#0B1E39] mb-4">{value.title}</h3>
                <p className="text-slate-700">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl mb-8 text-blue-100">
              We're always looking for talented individuals who share our passion for transforming global trade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/careers" className="inline-flex items-center rounded-xl px-6 py-3 bg-white text-[#0F4C81] 
                                           font-semibold shadow hover:bg-slate-50 transition">
                View Open Positions
              </a>
              <a href="/contact" className="inline-flex items-center rounded-xl px-6 py-3 border-2 border-white 
                                           text-white font-semibold hover:bg-white hover:text-[#0F4C81] transition">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}