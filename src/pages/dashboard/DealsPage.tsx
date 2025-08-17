"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealCard } from "@/components/CRM/DealCard";
import { NewDealDialog } from "@/components/CRM/NewDealDialog";
import { SalesAssistant } from "@/components/CRM/SalesAssistant";
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
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadPipelines();
  }, []);

  async function loadPipelines() {
    try {
      console.log('Attempting to load pipelines...');
      const { data, error } = await supabase.functions.invoke('crm-pipelines');
      console.log('Response:', { data, error });
      
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
        if (first) loadDeals(first);
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
            method: 'GET',
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

  if (!current && !loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <TopBar />
            <main className="flex-1 p-6">
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-lg font-semibold text-foreground">Deal Pipeline</div>
                {error ? (
                  <div className="text-destructive text-center">
                    <p className="font-medium">Error loading pipeline:</p>
                    <p className="text-sm">{error}</p>
                    <button 
                      onClick={() => { setError(null); setLoading(true); loadPipelines(); }}
                      className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                    >
                      Retry
                    </button>
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
            <div className="flex-1 overflow-auto p-5">
              <div className="mb-4 flex items-center gap-3">
                <h1 className="text-xl font-semibold">Deals {current ? `— ${current.name}` : ""}</h1>
                <div className="ml-auto flex items-center gap-2">
                  <Input 
                    placeholder="Search deals" 
                    value={q} 
                    onChange={(e) => setQ(e.target.value)} 
                    onKeyDown={(e) => { 
                      if (e.key === "Enter" && current) loadDeals(current.id); 
                    }} 
                    className="w-48"
                  />
                  {current && (
                    <NewDealDialog 
                      pipelineId={current.id} 
                      stageId={current.pipeline_stages?.[0]?.id} 
                      onCreated={() => loadDeals(current.id)} 
                    />
                  )}
                </div>
              </div>

              {current ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {current.pipeline_stages.map((stage) => (
                    <div key={stage.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(dealsByStage[stage.id] ?? []).length} deals
                        </div>
                      </div>
                      <div className={cn("rounded-2xl p-2 border bg-background min-h-[320px]")}>
                        {(dealsByStage[stage.id] ?? []).map((deal) => (
                          <DealCard key={deal.id} deal={deal} onMove={onDealMoved} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-6">
                  {error ? (
                    <div className="text-center">
                      <p className="text-destructive mb-2">{error}</p>
                      <Button onClick={() => { setError(null); setLoading(true); loadPipelines(); }}>
                        Retry
                      </Button>
                    </div>
                  ) : (
                    "No pipeline found."
                  )}
                </Card>
              )}
            </div>

            {/* Right rail assistant, like Pipedrive's Sales Assistant */}
            <div className="hidden xl:block w-[360px] border-l bg-muted/30">
              <SalesAssistant />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}