import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { SidebarTrigger } from "./sidebar";
import { Search, Bell, Settings } from "lucide-react";

export const TopBar = () => {
  return (
    <header className="h-16 border-b border-border-glass bg-surface/5 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-text-on-dark" />
          
          {/* Logo */}
          <img 
            src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
            alt="LOGISTIC INTEL"
            className="h-10 w-auto"
          />
          
          {/* Live Data Pill */}
          <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
            Live Data
          </Badge>
        </div>

        {/* Center - Quick Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-4 h-4" />
            <Input 
              placeholder="Quick search companies, contacts..."
              className="pl-10 bg-surface/10 border-border-glass text-text-on-dark placeholder:text-muted-text"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <Badge className="bg-brand/20 text-brand border-brand/30 hover:bg-brand/30">
            Pro Plan
          </Badge>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-text-on-dark hover:bg-surface/10"
          >
            <Bell className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-text-on-dark hover:bg-surface/10"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Profile */}
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback className="bg-brand text-white text-sm">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};