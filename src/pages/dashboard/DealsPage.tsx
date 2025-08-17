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
      setLoading(true);
      setError(null);
      
      // Get the Supabase session token and pass it to the Edge Function
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-pipelines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-client-info": "deals-page",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
        },
        cache: "no-store",
      });

      if (!res.ok) {
        // Graceful fallback (UI shouldn't hard crash)
        console.error("crm-pipelines failed", res.status, await res.text());
        setPipelines([]); // don't block the page
        setError("Pipelines failed to load. Please refresh or contact support.");
        return;
      }

      const json = await res.json();
      console.log('Pipeline response:', json);
      
      if (json.success && json.data) {
        if (json.data.length === 0) {
          console.log('No pipelines found, attempting to seed...');
          // Auto-seed if no pipelines exist
          try {
            const seedRes = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-seed-pipeline`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
              },
              cache: "no-store",
            });
            
            console.log('Seed response status:', seedRes.status);
            if (seedRes.ok) {
              const seedJson = await seedRes.json();
              console.log('Seed response:', seedJson);
              
              // Re-fetch pipelines after seeding
              const res2 = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-pipelines`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  "x-client-info": "deals-page",
                  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
                },
                cache: "no-store",
              });
              
              if (res2.ok) {
                const json2 = await res2.json();
                console.log('Re-fetched pipelines:', json2);
                setPipelines(json2.data ?? []);
                if (json2.data?.length > 0) {
                  setSelected(json2.data[0].id);
                  await loadDeals(json2.data[0].id);
                }
              } else {
                console.error('Failed to re-fetch pipelines:', res2.status);
              }
            } else {
              const errorText = await seedRes.text();
              console.error('Seed failed:', seedRes.status, errorText);
              setError(`Failed to create default pipeline: ${errorText}`);
            }
          } catch (seedError) {
            console.error('Seed request failed:', seedError);
            setError('Failed to create default pipeline. Please try refreshing the page.');
          }
        } else {
          setPipelines(json.data);
          if (json.data.length > 0) {
            setSelected(json.data[0].id);
            await loadDeals(json.data[0].id);
          }
        }
      } else {
        throw new Error(json.error || 'Failed to load pipelines');
      }
    } catch (err) {
      console.error('Error loading pipelines:', err);
      setPipelines([]);
      setError("Network error loading pipelines.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDeals(pipelineId: string) {
    try {
      const pipeline = pipelines.find(p => p.id === pipelineId) ?? null;
      if (!pipeline) return;
      
      console.log('Loading deals for pipeline:', pipelineId, 'with stages:', pipeline.pipeline_stages);
      
      const next: Record<string, Deal[]> = {};
      for (const st of pipeline.pipeline_stages) {
        console.log('Loading deals for stage:', st.id);
        const { data, error } = await supabase.functions.invoke('crm-deals', {
          body: {},
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (error) {
          console.error('Error loading deals for stage:', st.id, error);
          next[st.id] = [];
        } else if (data && data.success) {
          // Filter deals by pipeline and stage
          const stageDeals = data.data.filter((deal: Deal) => 
            deal.stage_id === st.id && (!q || deal.title.toLowerCase().includes(q.toLowerCase()))
          );
          next[st.id] = stageDeals;
          console.log('Loaded deals for stage:', st.id, stageDeals);
        } else {
          console.log('No deals found for stage:', st.id);
          next[st.id] = [];
        }
      }
      setDealsByStage(next);
      console.log('Final deals by stage:', next);
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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-deal-move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
        },
        body: JSON.stringify({ deal_id: dealId, stage_id: toStageId }),
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && selected) await loadDeals(selected);
      } else {
        console.error('Failed to move deal:', res.status, await res.text());
      }
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
                    <div className="flex gap-2 justify-center mt-2">
                      <Button 
                        onClick={() => { setError(null); setLoading(true); loadPipelines(); }}
                        variant="outline"
                      >
                        Retry
                      </Button>
                      <Button 
                        onClick={async () => {
                          setLoading(true);
                          setError(null);
                          try {
                            const { data: { session } } = await supabase.auth.getSession();
                            const token = session?.access_token;
                            console.log('Manual seed attempt with token:', !!token);
                            
                            const seedRes = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-seed-pipeline`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
                              },
                            });
                            
                            console.log('Manual seed response status:', seedRes.status);
                            if (seedRes.ok) {
                              const seedJson = await seedRes.json();
                              console.log('Manual seed response:', seedJson);
                              await loadPipelines();
                            } else {
                              const errorText = await seedRes.text();
                              console.error('Manual seed failed:', seedRes.status, errorText);
                              setError(`Seed failed: ${errorText}`);
                            }
                          } catch (err) {
                            console.error('Manual seed error:', err);
                            setError(`Seed error: ${err.message}`);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        variant="default"
                      >
                        Create Pipeline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-muted-foreground">No pipeline found.</div>
                    <Button 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const { data: { session } } = await supabase.auth.getSession();
                          const token = session?.access_token;
                          console.log('Creating pipeline with token:', !!token);
                          
                          const seedRes = await fetch(`https://zupuxlrtixhfnbuhxhum.supabase.co/functions/v1/crm-seed-pipeline`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {}),
                              "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0"
                            },
                          });
                          
                          if (seedRes.ok) {
                            await loadPipelines();
                          } else {
                            const errorText = await seedRes.text();
                            setError(`Failed to create pipeline: ${errorText}`);
                          }
                        } catch (err) {
                          setError(`Error: ${err.message}`);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Default Pipeline
                    </Button>
                  </div>
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
                        open={false}
                        onOpenChange={() => {}}
                        pipelineId={current.id} 
                        preselectedStageId={current.pipeline_stages?.[0]?.id} 
                        onSuccess={() => loadDeals(current.id)} 
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
                                      deal={{...deal, expected_close_date: null, probability: null, contact_name: null, activities_count: 0, notes_count: 0}} 
                                      stageId={stage.id}
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
                          <DealCard deal={{...draggedDeal, expected_close_date: null, probability: null, contact_name: null, activities_count: 0, notes_count: 0}} stageId="" />
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