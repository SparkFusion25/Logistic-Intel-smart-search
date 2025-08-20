import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function MobileNav() {
  const router = useLocation();
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/search", label: "Search" },
    { href: "/dashboard/crm", label: "CRM" },
    { href: "/dashboard/email", label: "Email" },
    // Add other nav items as needed
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex">
      {navItems.map((item) => {
        const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
        
        return (
          <Link 
            key={item.href}
            to={item.href} 
            className={`flex-1 text-center py-2 text-[11px] ${
              isActive ? 'text-white' : 'text-slate-400'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
