import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 pt-0 px-4 sm:px-6 lg:px-8 max-w-[var(--container-max)] mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};