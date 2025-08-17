"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealCard } from "@/components/CRM/DealCard";
import { NewDealDialog } from "@/components/CRM/NewDealDialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";

type Stage = { id: string; name: string; stage_order: number; };
type Pipeline = { id: string; name: string; pipeline_stages: Stage[]; };
type Deal = { id: string; title: string; company_name: string | null; value_usd: number | null; stage_id: string; };

export default function DealsPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipelines();
  }, []);

  async function loadPipelines() {
    try {
      const { data, error } = await supabase.functions.invoke('crm-pipelines');
      if (error) throw error;
      
      if (data.success) {
        setPipelines(data.data);
        const first = data.data?.[0]?.id ?? null;
        setSelected(first);
        if (first) loadDeals(first);
      }
    } catch (error) {
      console.error('Error loading pipelines:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDeals(pipelineId: string) {
    try {
      const pipeline = pipelines.find(p => p.id === pipelineId) ?? null;
      if (!pipeline) return;
      
      const next: Record<string, Deal[]> = {};
      for (const st of pipeline.pipeline_stages) {
        const { data, error } = await supabase.functions.invoke('crm-deals', {
          body: { 
            method: 'GET',
            pipelineId, 
            stageId: st.id, 
            limit: 200 
          }
        });
        
        if (error) throw error;
        next[st.id] = data.success ? data.data : [];
      }
      setDealsByStage(next);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
  }

  async function onDealMoved(dealId: string, toStageId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('crm-deal-move', {
        body: { dealId, stage_id: toStageId }
      });
      
      if (error) throw error;
      if (data.success && selected) loadDeals(selected);
    } catch (error) {
      console.error('Error moving deal:', error);
    }
  }

  const current = useMemo(() => pipelines.find(p => p.id === selected) ?? null, [pipelines, selected]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading pipelines...</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!current) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">No pipeline found.</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Deals — {current.name}</h1>
              <NewDealDialog 
                pipelineId={current.id} 
                stageId={current.pipeline_stages?.[0]?.id} 
                onCreated={() => loadDeals(current.id)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {current.pipeline_stages.map((stage) => (
                <div key={stage.id} className="space-y-2">
                  <div className="font-medium">{stage.name}</div>
                  <div className={cn("rounded-2xl p-2 border bg-background min-h-[280px]")}>
                    {(dealsByStage[stage.id] ?? []).map((deal) => (
                      <DealCard key={deal.id} deal={deal} onMove={onDealMoved} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground px-2">
                    {(dealsByStage[stage.id] ?? []).length} deals
                  </div>
                </div>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}