import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Search, Contact, Mail, Flag, LineChart, 
  FileText, Calculator, Activity, ShieldCheck 
} from "lucide-react";

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "CRM", url: "/dashboard/crm", icon: Contact },
  { title: "Email", url: "/dashboard/email", icon: Mail },
  { title: "Campaigns", url: "/dashboard/campaigns", icon: Flag },
  { title: "Analytics", url: "/dashboard/campaigns/analytics", icon: LineChart },
  { title: "Quote", url: "/dashboard/widgets/quote", icon: FileText },
  { title: "Tariff", url: "/dashboard/widgets/tariff", icon: Calculator },
  { title: "Benchmark", url: "/dashboard/benchmark", icon: Activity },
  { title: "Admin", url: "/dashboard/admin", icon: ShieldCheck },
];

const bottomItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help", url: "/dashboard/help", icon: HelpCircle },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-sidebar z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3L4 14h7v7l9-11h-7V3z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">LOGISTIC INTEL</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
                
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-primary font-semibold' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div className="border-t border-sidebar-border my-4" />

            {/* Bottom Items */}
            <div className="space-y-1">
              {bottomItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-primary font-semibold' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">John Doe</div>
                <div className="text-xs text-sidebar-foreground/70 truncate">john@example.com</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Mobile Header Component with Hamburger
interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-30">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="h-10 w-10 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3L4 14h7v7l9-11h-7V3z"/>
              </svg>
            </div>
            <span className="font-bold text-foreground text-lg">LOGISTIC INTEL</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
          
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}