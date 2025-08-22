import { Helmet } from 'react-helmet-async';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact - Logistic Intel</title>
      </Helmet>
      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Contact Us</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-slate-600 text-center">Contact form coming soon.</p>
          </div>
        </div>
      </div>
    </>
  );
}