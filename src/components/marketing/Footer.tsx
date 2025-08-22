import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-4">
        <div>
          <div className="h-7 w-7 rounded bg-gradient-to-r from-[#0B1E39] to-[#0F4C81]" />
          <p className="text-sm text-slate-600 mt-3">Global freight intelligence, CRM, and outreach.</p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Product</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Company</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><a href="/security">Security</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Contact</div>
          <p className="text-sm text-slate-600 mt-2">sales@logisticintel.com</p>
        </div>
      </div>
      <div className="text-xs text-slate-500 text-center py-4 border-t">&copy; {new Date().getFullYear()} Logistic Intel</div>
    </footer>
  );
}