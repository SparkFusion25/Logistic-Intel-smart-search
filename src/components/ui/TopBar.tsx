import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">LOGISTIC INTEL</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <button className="h-8 w-8 p-0 rounded-lg hover:bg-muted flex items-center justify-center">
              <span className="sr-only">Search</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="h-8 w-8 p-0 rounded-lg hover:bg-muted flex items-center justify-center">
              <span className="sr-only">Notifications</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-8a5 5 0 00-10 0v8h5" />
              </svg>
            </button>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}