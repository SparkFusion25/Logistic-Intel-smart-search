"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealCard } from "@/components/CRM/DealCard";
import { NewDealDialog } from "@/components/CRM/NewDealDialog";
import { SalesAssistant } from "@/components/CRM/SalesAssistant";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopBar } from "@/components/ui/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Workflow, Plus, Search } from "lucide-react";

type Stage = { id: string; name: string; stage_order: number; };
type Pipeline = { id: string; name: string; pipeline_stages: Stage[]; };
type Deal = { id: string; title: string; company_name: string | null; value_usd: number | null; stage_id: string; };

export default function DealsPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    loadPipelines();
  }, []);

  async function loadPipelines() {
    try {
      setError(null);
      console.log('Loading pipelines...');
      const { data, error } = await supabase.functions.invoke('crm-pipelines');
      console.log('Pipeline response:', { data, error });
      
      if (error) {
        console.error('Supabase function error:', error);
        setError(`Failed to load pipelines: ${error.message}`);
        return;
      }
      
      if (data && data.success) {
        console.log('Successfully loaded pipelines:', data.data);
        setPipelines(data.data);
        const first = data.data?.[0]?.id ?? null;
        setSelected(first);
        if (first) await loadDeals(first);
      } else {
        console.error('Unexpected response format:', data);
        setError(data?.error || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error loading pipelines:', error);
      setError(`Error loading pipelines: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            pipelineId, 
            stageId: st.id, 
            limit: 200,
            q: q || undefined
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

  async function onDragStart(event: DragStartEvent) {
    const dealId = event.active.id as string;
    const deal = Object.values(dealsByStage).flat().find(d => d.id === dealId);
    setDraggedDeal(deal || null);
  }

  async function onDragEnd(event: DragEndEvent) {
    setDraggedDeal(null);
    const dealId = event.active?.id as string;
    const toStageId = event.over?.id as string;
    
    if (!dealId || !toStageId || dealId === toStageId) return;

    try {
      const { data, error } = await supabase.functions.invoke('crm-deal-move', {
        body: { dealId, stage_id: toStageId }
      });
      
      if (error) throw error;
      if (data.success && selected) await loadDeals(selected);
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

  if (!current && !loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Workflow className="h-12 w-12 text-muted-foreground" />
                <div className="text-lg font-semibold text-foreground">Deal Pipeline</div>
                {error ? (
                  <div className="text-destructive text-center">
                    <p className="font-medium">Error loading pipeline:</p>
                    <p className="text-sm">{error}</p>
                    <Button 
                      onClick={() => { setError(null); setLoading(true); loadPipelines(); }}
                      className="mt-2"
                      variant="outline"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No pipeline found.</div>
                )}
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
          <div className="flex h-[calc(100vh-64px)]">
            {/* Main pipeline view */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Deal Pipeline
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {current?.name || "Default Sales Pipeline"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search deals..." 
                        value={q} 
                        onChange={(e) => setQ(e.target.value)} 
                        onKeyDown={(e) => { 
                          if (e.key === "Enter" && current) loadDeals(current.id); 
                        }} 
                        className="pl-10 w-64"
                      />
                    </div>
                    {current && (
                      <NewDealDialog 
                        pipelineId={current.id} 
                        stageId={current.pipeline_stages?.[0]?.id} 
                        onCreated={() => loadDeals(current.id)} 
                      />
                    )}
                  </div>
                </div>

                {/* Pipeline Columns */}
                {current ? (
                  <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-h-[600px]">
                      {current.pipeline_stages
                        .sort((a, b) => a.stage_order - b.stage_order)
                        .map((stage) => {
                          const stageDeals = dealsByStage[stage.id] ?? [];
                          const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);
                          
                          return (
                            <div 
                              key={stage.id} 
                              id={stage.id}
                              className="space-y-3"
                            >
                              {/* Stage Header */}
                              <div className="sticky top-0 bg-background z-10 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-semibold text-sm text-foreground">
                                    {stage.name}
                                  </h3>
                                  <div className="text-xs text-muted-foreground">
                                    {stageDeals.length}
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ${totalValue.toLocaleString()}
                                </div>
                              </div>

                              {/* Stage Column */}
                              <SortableContext items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                                <div 
                                  className={cn(
                                    "min-h-[500px] rounded-lg border-2 border-dashed border-border/50 p-3 space-y-2",
                                    "hover:border-border transition-colors",
                                    stageDeals.length === 0 && "bg-muted/20"
                                  )}
                                >
                                  {stageDeals.map((deal) => (
                                    <DealCard 
                                      key={deal.id} 
                                      deal={deal} 
                                      onMove={async (dealId, toStageId) => {
                                        await onDragEnd({ active: { id: dealId }, over: { id: toStageId } } as DragEndEvent);
                                      }}
                                    />
                                  ))}
                                  {stageDeals.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                      <div className="text-sm">No deals in this stage</div>
                                    </div>
                                  )}
                                </div>
                              </SortableContext>
                            </div>
                          );
                        })}
                    </div>
                    
                    <DragOverlay>
                      {draggedDeal ? (
                        <div className="opacity-80">
                          <DealCard deal={draggedDeal} />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                ) : (
                  <Card className="p-8 text-center">
                    <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Pipeline Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first sales pipeline to start managing deals.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Pipeline
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Right rail - Sales Assistant */}
            <div className="hidden xl:block w-[360px] border-l bg-muted/20">
              <SalesAssistant />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}