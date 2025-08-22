import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-[#F7F8FA]">
      <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-12 text-center text-white shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your logistics business?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of logistics professionals using Logistic Intel to find new opportunities and grow their business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/demo/request" 
            className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-[#0F4C81] bg-white hover:bg-slate-50 transition shadow-lg"
          >
            Request a Demo
          </Link>
          <Link 
            to="/auth/signup" 
            className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-[#0F4C81] transition"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}