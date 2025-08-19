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
            <img 
              src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
              alt="Intelligence Logo" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Intelligence</h1>
            <p className="text-white/60 text-xs">Trade Platform</p>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="w-8 h-8 flex items-center justify-center mx-auto bg-white/10 rounded-lg backdrop-blur-sm">
          <img 
            src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
            alt="Intelligence Logo" 
            className="w-6 h-6 object-contain"
          />
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