import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileNav } from "@/components/ui/MobileNav";
interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 pt-4 px-4 sm:px-6 lg:px-8 max-w-[var(--container-max)] mx-auto w-full pb-16 md:pb-4">
            {children}
          </main>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};