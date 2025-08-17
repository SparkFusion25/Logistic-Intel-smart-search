"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Building, User } from "lucide-react";

interface DealDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId: string;
  onMove?: (dealId: string, toStageId: string) => void;
}

export function DealDrawer({ open, onOpenChange, dealId, onMove }: DealDrawerProps) {
  // Mock deal data - in real app this would fetch from API
  const deal = {
    id: dealId,
    title: "Ocean Import Deal",
    company_name: "Global Logistics Corp",
    value_usd: 50000,
    currency: "USD",
    expected_close_date: "2025-01-31",
    status: "open",
    stage: "Proposal Sent",
    contact: {
      name: "John Smith",
      email: "john@globallogistics.com",
      phone: "+1 555-0123"
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{deal.title}</span>
            <Badge variant="outline">{deal.stage}</Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Deal Overview */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">
                  {deal.currency} {deal.value_usd?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Deal Value</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">{deal.company_name}</div>
                <div className="text-sm text-muted-foreground">Company</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium">{deal.expected_close_date}</div>
                <div className="text-sm text-muted-foreground">Expected Close</div>
              </div>
            </div>
            
            {deal.contact && (
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">{deal.contact.name}</div>
                  <div className="text-sm text-muted-foreground">{deal.contact.email}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="default">
              Schedule Follow-up
            </Button>
            <Button className="w-full" variant="outline">
              Send Proposal
            </Button>
            <Button className="w-full" variant="outline">
              Add Note
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}