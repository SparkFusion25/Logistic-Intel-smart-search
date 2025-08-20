import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarBrandProps {
  collapsed?: boolean;
  toggleSidebar?: () => void;
}

export function SidebarBrand({ collapsed = false, toggleSidebar }: SidebarBrandProps) {
  const logoSrc = "/lovable-uploads/c7c31567-c6a2-4d98-b45d-7aed7e035657.png";

  return (
    <div className="flex items-center justify-between p-6">
      {!collapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg">
            <img 
              src={logoSrc}
              alt="Logo"
              className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-normal"
              style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">LIT</h1>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="w-10 h-10 flex items-center justify-center mx-auto rounded-lg">
          <img 
            src={logoSrc}
            alt="Logo"
            className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-normal"
            style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
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