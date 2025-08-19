import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { removeBackground, loadImage } from "@/utils/backgroundRemoval"
import { useEffect, useState } from "react"

interface SidebarBrandProps {
  collapsed?: boolean;
  toggleSidebar?: () => void;
}

export function SidebarBrand({ collapsed = false, toggleSidebar }: SidebarBrandProps) {
  const [logoSrc, setLogoSrc] = useState<string>("/lovable-uploads/c7c31567-c6a2-4d98-b45d-7aed7e035657.png");

  useEffect(() => {
    const processLogo = async () => {
      try {
        const response = await fetch("/lovable-uploads/c7c31567-c6a2-4d98-b45d-7aed7e035657.png");
        const blob = await response.blob();
        const imageElement = await loadImage(blob);
        const transparentBlob = await removeBackground(imageElement);
        const transparentUrl = URL.createObjectURL(transparentBlob);
        setLogoSrc(transparentUrl);
      } catch (error) {
        console.error("Error processing logo:", error);
        // Keep original logo as fallback
      }
    };

    processLogo();
  }, []);

  return (
    <div className="flex items-center justify-between p-6">
      {!collapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-24 h-24 flex items-center justify-center rounded-lg">
            <img 
              src={logoSrc}
              alt="Logo"
              className="w-18 h-18 object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">LIT</h1>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="w-24 h-24 flex items-center justify-center mx-auto rounded-lg">
          <img 
            src={logoSrc}
            alt="Logo"
            className="w-18 h-18 object-contain"
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