import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Search, Bell, HelpCircle, User, Settings, LogOut, 
  ChevronDown, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Search Intelligence', href: '/dashboard/search' },
  { name: 'CRM', href: '/dashboard/crm' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Campaigns', href: '/dashboard/campaigns' },
  { name: 'Settings', href: '/dashboard/settings' }
];

export const TopBar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleSidebar } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  const currentPage = navigation.find(item => 
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.name || 'Dashboard';

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPage}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Header Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-6 h-6" />
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                JD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@company.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </Link>
                <Link
                  to="/dashboard/billing"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Billing
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};