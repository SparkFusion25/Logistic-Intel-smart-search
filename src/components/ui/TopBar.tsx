import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card backdrop-blur-md lg:hidden">
      <div className="flex h-12 items-center px-4">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Additional header content can go here */}
          </div>
        </div>
      </div>
    </header>
  )
}