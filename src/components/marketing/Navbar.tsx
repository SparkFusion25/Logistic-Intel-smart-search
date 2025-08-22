import { NavLink } from "react-router-dom";

const LinkC = ({to, children}:{to:string; children:React.ReactNode}) => (
  <NavLink
    to={to}
    className={({isActive}) =>
      `px-3 py-2 rounded-lg text-sm font-medium ${
        isActive ? "text-[#0F4C81] bg-slate-100" : "text-slate-700 hover:text-[#0F4C81]"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Navbar(){
  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-r from-[#0B1E39] to-[#0F4C81]" />
          <span className="font-semibold text-[#0B1E39]">Logistic&nbsp;Intel</span>
        </NavLink>
        <nav className="hidden md:flex items-center gap-1">
          <LinkC to="/about">About</LinkC>
          <LinkC to="/pricing">Pricing</LinkC>
          <LinkC to="/blog">Blog</LinkC>
        </nav>
        <div className="flex items-center gap-2">
          <a href="/signup" className="hidden sm:inline-block px-3 py-2 text-sm rounded-lg border border-slate-200">Sign up</a>
          <a href="/request-demo" className="inline-block px-3 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-[#0B1E39] to-[#0F4C81]">Request a demo</a>
        </div>
      </div>
    </header>
  );
}