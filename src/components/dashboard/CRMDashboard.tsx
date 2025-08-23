"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealPipeline } from "@/components/CRM/DealPipeline";
import { WorkingDealsListView } from "@/components/CRM/WorkingDealsListView";
import { Kanban, List } from "lucide-react";

export function CRMDashboard() {
  const [activeView, setActiveView] = useState("list");

  return (
    <div className="h-full">
      <Tabs value={activeView} onValueChange={setActiveView} className="h-full">
        <div className="border-b bg-white">
          <div className="p-4">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                Pipeline View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="pipeline" className="h-full m-0">
          <DealPipeline />
        </TabsContent>

        <TabsContent value="list" className="h-full m-0 p-6">
          <WorkingDealsListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}