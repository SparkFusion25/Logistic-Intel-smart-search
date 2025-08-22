import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Users,
  Mail,
  Flag,
  BarChart3,
  Clock,
  Calculator,
  FileText,
  TrendingUp,
  Settings,
  Compass,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { signOut } from '../../lib/supabase';
import PlanBadge from '../PlanBadge';

interface AppSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Search', href: '/dashboard/search', icon: Search },
  { name: 'CRM', href: '/dashboard/crm', icon: Users },
  { name: 'Email', href: '/dashboard/email', icon: Mail },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Flag },
  { name: 'Campaign Analytics', href: '/dashboard/campaigns/analytics', icon: BarChart3 },
  { name: 'Follow-Ups', href: '/dashboard/campaigns/follow-ups', icon: Clock },
  { name: 'Quote Generator', href: '/dashboard/widgets/quote', icon: FileText },
  { name: 'Tariff Calculator', href: '/dashboard/widgets/tariff', icon: Calculator },
  { name: 'Benchmark', href: '/dashboard/widgets/benchmark', icon: TrendingUp },
  { name: 'Admin', href: '/dashboard/admin', icon: Settings }
];

export default function AppSidebar({ sidebarOpen, setSidebarOpen }: AppSidebarProps) {
  const location = useLocation();
  const user = useUser();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-slate-600 hover:text-slate-900"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 
        bg-gradient-to-b from-slate-900 to-slate-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-700">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-indigo-400" />
              <span className="font-semibold text-white text-lg">
                Logistic Intel
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors
                    ${active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Plan badge and user info */}
          <div className="border-t border-slate-700 p-4 space-y-4">
            <PlanBadge />
            
            {/* User info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}