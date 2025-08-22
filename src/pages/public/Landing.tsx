import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <Helmet>
        <title>Logistic Intel - Global Freight Intelligence Platform</title>
        <meta name="description" content="Search global trade in seconds. Unified air & ocean intelligence with outreach-ready CRM." />
      </Helmet>

      <div className="bg-slate-50">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Search global trade in seconds
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              Unified air & ocean intelligence with outreach-ready CRM
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo/request"
                className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-slate-900 transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Turn shipments into meetings
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive tools for modern logistics professionals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Search Intelligence',
                  description: 'Company, HS code, route, mode filters',
                  icon: '🔍'
                },
                {
                  title: 'CRM Enrichment',
                  description: 'Apollo + LinkedIn integration',
                  icon: '👥'
                },
                {
                  title: 'Outreach Engine',
                  description: 'Gmail/Outlook with tracking',
                  icon: '📧'
                },
                {
                  title: 'Smart Widgets',
                  description: 'Tariff, Quote, Benchmark tools',
                  icon: '🧮'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-100">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Sources */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-8">
              Trusted data sources
            </h3>
            <div className="flex justify-center items-center gap-8 opacity-60">
              {['BTS', 'US Census', 'Apollo.io', 'Avalara'].map((source) => (
                <span key={source} className="text-slate-600 font-medium">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your logistics business?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of logistics professionals using Logistic Intel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demo/request"
                className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-indigo-600 bg-white hover:bg-slate-50 transition-colors"
              >
                Request a Demo
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center rounded-xl px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}