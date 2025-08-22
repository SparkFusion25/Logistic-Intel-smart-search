import { Helmet } from 'react-helmet-async';

export default function Register() {
  return (
    <>
      <Helmet>
        <title>Sign Up - Logistic Intel</title>
      </Helmet>
      <div className="bg-slate-50 py-24">
        <div className="mx-auto max-w-md px-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Create Account</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-slate-600 text-center">Registration form coming soon.</p>
          </div>
        </div>
      </div>
    </>
  );
}