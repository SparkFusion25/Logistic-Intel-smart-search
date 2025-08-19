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
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <circle cx="50" cy="50" r="45" fill="#2B7DE9"/>
              <path 
                d="M25 70 L25 45 L40 45 L40 55 L35 55 L35 70 Z M45 35 L70 25 L75 35 L55 42 L75 65 L70 75 L45 55 L45 35 Z" 
                fill="white"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Intelligence</h1>
            <p className="text-white/60 text-xs">Trade Platform</p>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg mx-auto">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <circle cx="50" cy="50" r="45" fill="#2B7DE9"/>
            <path 
              d="M25 70 L25 45 L40 45 L40 55 L35 55 L35 70 Z M45 35 L70 25 L75 35 L55 42 L75 65 L70 75 L45 55 L45 35 Z" 
              fill="white"
            />
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