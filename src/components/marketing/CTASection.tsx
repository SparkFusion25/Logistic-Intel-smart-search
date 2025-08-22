export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to transform your logistics business?
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of logistics professionals using Logistic Intel to find new opportunities and grow their business.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/request-demo" 
            className="inline-flex items-center rounded-xl px-6 py-3 bg-white text-[#0F4C81] font-semibold shadow hover:bg-slate-50 transition"
          >
            Request a Demo
          </a>
          <a 
            href="/signup" 
            className="inline-flex items-center rounded-xl px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-[#0F4C81] transition"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}