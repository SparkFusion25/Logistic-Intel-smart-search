"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Target } from "lucide-react";
import { DealCard } from "./DealCard";
import { NewDealDialog } from "./NewDealDialog";
import { useAPI } from "@/hooks/useAPI";

interface Stage {
  id: string;
  name: string;
  deals_count: number;
  deals_value: number;
  stage_order: number;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

interface Deal {
  id: string;
  title: string;
  company_name: string | null;
  value_usd: number | null;
  stage_id: string;
  expected_close_date: string | null;
  probability: number | null;
  contact_name: string | null;
  activities_count: number;
  notes_count: number;
}

interface DealsByStage {
  [stageId: string]: Deal[];
}

export function DealPipeline() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>("");
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>("");

  const { makeRequest } = useAPI();

  // Load pipelines on mount
  useEffect(() => {
    loadPipelines();
  }, []);

  // Load deals when pipeline changes
  useEffect(() => {
    if (selectedPipeline) {
      loadDeals(selectedPipeline);
    }
  }, [selectedPipeline, searchQuery]);

  const loadPipelines = async () => {
    try {
      // Always seed pipeline first to ensure default exists
      await makeRequest('/crm-seed-pipeline', { method: 'POST' });
      
      const response = await makeRequest('/crm-pipelines', {
        method: 'GET'
      });

      if (response?.data?.length > 0) {
        // Transform the API response to match our expected format
        const transformedPipelines = response.data.map((pipeline: any) => ({
          ...pipeline,
          stages: pipeline.pipeline_stages || []
        }));
        setPipelines(transformedPipelines);
        // Always use Default pipeline
        const defaultPipeline = transformedPipelines.find((p: Pipeline) => p.name === 'Default') || transformedPipelines[0];
        setSelectedPipeline(defaultPipeline.id);
      }
    } catch (error) {
      console.error('Failed to load pipelines:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeals = async (pipelineId: string) => {
    try {
      const response = await makeRequest('/crm-deals', {
        method: 'GET',
        params: { pipeline_id: pipelineId, search: searchQuery }
      });

      if (response?.deals) {
        // Group deals by stage
        const grouped: DealsByStage = {};
        response.deals.forEach((deal: Deal) => {
          if (!grouped[deal.stage_id]) {
            grouped[deal.stage_id] = [];
          }
          grouped[deal.stage_id].push(deal);
        });
        setDealsByStage(grouped);
      }
    } catch (error) {
      console.error('Failed to load deals:', error);
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    const deal = dealsByStage[event.active.data.current?.stageId]?.find(
      d => d.id === event.active.id
    );
    setDraggedDeal(deal || null);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedDeal(null);

    if (!over || active.id === over.id) return;

    const activeStageId = active.data.current?.stageId;
    const overStageId = over.data.current?.stageId || over.id;

    if (activeStageId === overStageId) return;

    try {
      await makeRequest('/crm-deal-move', {
        method: 'POST',
        body: {
          deal_id: active.id,
          to_stage_id: overStageId
        }
      });

      // Reload deals to reflect the change
      loadDeals(selectedPipeline);
    } catch (error) {
      console.error('Failed to move deal:', error);
    }
  };

  const currentPipeline = useMemo(() => 
    pipelines.find(p => p.id === selectedPipeline),
    [pipelines, selectedPipeline]
  );

  const totalValue = useMemo(() => {
    return Object.values(dealsByStage).flat().reduce((sum, deal) => 
      sum + (deal.value_usd || 0), 0
    );
  }, [dealsByStage]);

  const totalDeals = useMemo(() => {
    return Object.values(dealsByStage).flat().length;
  }, [dealsByStage]);

  // Simplified loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Simplified pipeline not found state
  if (!currentPipeline?.stages?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Setting up your sales pipeline...</p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sortedStages = [...currentPipeline.stages].sort((a, b) => a.stage_order - b.stage_order);

  return (
    <div className="h-full flex flex-col">
      {/* Simplified header without pipeline selection */}
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Sales Pipeline</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{totalDeals} deals</span>
              <span>${totalValue.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-8"
              />
            </div>
            <Button
              onClick={() => {
                setSelectedStageId(sortedStages[0]?.id || "");
                setNewDealOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="h-full overflow-x-auto">
            <div className="flex gap-4 p-4 min-w-fit">
              {sortedStages.map((stage) => (
                <div
                  key={stage.id}
                  className="w-72 flex-shrink-0"
                >
                  {/* Stage Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{stage.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStageId(stage.id);
                          setNewDealOpen(true);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{dealsByStage[stage.id]?.length || 0} deals</span>
                      <span>
                        ${(dealsByStage[stage.id]?.reduce((sum, deal) => 
                          sum + (deal.value_usd || 0), 0) || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Deals */}
                  <SortableContext
                    id={stage.id}
                    items={dealsByStage[stage.id]?.map(d => d.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      className="space-y-3 min-h-32"
                      data-stage-id={stage.id}
                    >
                      {dealsByStage[stage.id]?.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          stageId={stage.id}
                        />
                      )) || null}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          </div>

          <DragOverlay>
            {draggedDeal ? (
              <div className="rotate-6 opacity-90">
                <DealCard deal={draggedDeal} stageId="" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* New Deal Dialog */}
      <NewDealDialog
        open={newDealOpen}
        onOpenChange={setNewDealOpen}
        pipelineId={selectedPipeline}
        preselectedStageId={selectedStageId}
        onSuccess={() => {
          setNewDealOpen(false);
          setSelectedStageId("");
          loadDeals(selectedPipeline);
        }}
      />
    </div>
  );
}