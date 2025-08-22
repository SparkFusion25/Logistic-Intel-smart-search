import { Helmet } from 'react-helmet-async';

export default function Tariff() {
  return (
    <>
      <Helmet>
        <title>Tariff Calculator - Logistic Intel</title>
      </Helmet>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tariff Calculator</h1>
          <p className="text-slate-600">Tariff calculation functionality coming soon.</p>
        </div>
      </div>
    </>
  );
}