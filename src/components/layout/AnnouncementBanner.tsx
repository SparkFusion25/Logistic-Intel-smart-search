import { X } from "lucide-react";
import { useState } from "react";
import Container from "@/components/ui/Container";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 relative">
      <Container>
        <div className="flex items-center justify-center text-center relative">
          <div className="text-sm font-medium">
            <span className="hidden sm:inline">📈 New Report: </span>
            <a href="#" className="underline hover:no-underline font-semibold">
              Global Trade Outlook 2024 - Download Free Report
            </a>
            <span className="hidden sm:inline"> • Industry insights from 500+ logistics professionals</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-0 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </div>
  );
}