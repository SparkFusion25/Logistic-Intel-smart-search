import React, { useState } from "react";
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileNav } from "@/components/ui/MobileNav";
import { MobileDrawer, MobileHeader } from "@/components/layout/MobileDrawer";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <AppSidebar />
        
        {/* Mobile Header */}
        <MobileHeader onMenuToggle={() => setIsMobileDrawerOpen(true)} />
        
        {/* Mobile Drawer */}
        <MobileDrawer 
          isOpen={isMobileDrawerOpen} 
          onClose={() => setIsMobileDrawerOpen(false)} 
        />
        
        {/* Main Content */}
        <SidebarInset className="flex-1">
          <main className="flex-1 pt-20 md:pt-4 px-4 sm:px-6 lg:px-8 max-w-[var(--container-max)] mx-auto w-full pb-20 md:pb-4">
            {children}
          </main>
        </SidebarInset>
        
        {/* Bottom Mobile Navigation */}
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};