import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarBrandProps {
  collapsed?: boolean;
  toggleSidebar?: () => void;
}

export function SidebarBrand({ collapsed = false, toggleSidebar }: SidebarBrandProps) {
  return (
    <div className="flex items-center justify-between p-6">
      {!collapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="11" fill="white" />
              <path d="M8 16V8h3v3h2V8h3v8h-3v-3h-2v3H8z" fill="currentColor" />
              <path d="M16.5 10l-2 1.5 2 1.5V10z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Intelligence</h1>
            <p className="text-white/60 text-xs">Trade Platform</p>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="w-8 h-8 flex items-center justify-center mx-auto bg-white/10 rounded-lg backdrop-blur-sm">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="11" fill="white" />
            <path d="M8 16V8h3v3h2V8h3v8h-3v-3h-2v3H8z" fill="currentColor" />
            <path d="M16.5 10l-2 1.5 2 1.5V10z" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Toggle Button - Always visible */}
      {toggleSidebar && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200 flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}