import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background lg:hidden">
      <div className="container flex h-14 max-w-screen-2xl items-center">
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