"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, Target, Users, Calendar } from "lucide-react";
import { DealCard } from "./DealCard";
import { NewDealDialog } from "./NewDealDialog";
import { useAPI } from "@/hooks/useAPI";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  name: string;
  deals_count: number;
  deals_value: number;
  sort_order: number;
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
  const [newPipelineName, setNewPipelineName] = useState("");
  const [isCreatingPipeline, setIsCreatingPipeline] = useState(false);

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
      const response = await makeRequest('/crm-pipelines', {
        method: 'GET'
      });

      if (response?.pipelines?.length > 0) {
        setPipelines(response.pipelines);
        setSelectedPipeline(response.pipelines[0].id);
      } else {
        // Seed initial pipeline if none exist
        await makeRequest('/crm-seed-pipeline', { method: 'POST' });
        // Retry loading
        const retryResponse = await makeRequest('/crm-pipelines', { method: 'GET' });
        if (retryResponse?.pipelines?.length > 0) {
          setPipelines(retryResponse.pipelines);
          setSelectedPipeline(retryResponse.pipelines[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load pipelines:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeals = async (pipelineId: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  const createPipeline = async () => {
    if (!newPipelineName.trim()) return;
    
    try {
      setIsCreatingPipeline(true);
      const response = await makeRequest('/crm-create-pipeline', {
        method: 'POST',
        body: { name: newPipelineName }
      });

      if (response?.success) {
        // Reload pipelines to include the new one
        await loadPipelines();
        setNewPipelineName("");
      } else {
        console.error('Failed to create pipeline:', response?.error);
      }
    } catch (error) {
      console.error('Error creating pipeline:', error);
    } finally {
      setIsCreatingPipeline(false);
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

  if (loading && pipelines.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (!currentPipeline) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Target className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-main mb-2">No Pipeline Found</h3>
          <p className="text-text-muted mb-4">Create your first sales pipeline to get started.</p>
          
          <div className="space-y-3">
            <Input
              placeholder="Enter pipeline name"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createPipeline()}
            />
            <Button 
              onClick={createPipeline}
              disabled={!newPipelineName.trim() || isCreatingPipeline}
              className="w-full"
            >
              {isCreatingPipeline ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Pipeline
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-line bg-surface-primary p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-main">{currentPipeline.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {totalDeals} deals
              </div>
              <div className="flex items-center gap-1">
                <span>$</span>
                {totalValue.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              onClick={() => setNewDealOpen(true)}
              size="sm"
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
            <div className="flex gap-4 p-4 sm:p-6 min-w-fit">
              {currentPipeline.stages
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((stage) => (
                  <div
                    key={stage.id}
                    className="w-72 sm:w-80 flex-shrink-0"
                  >
                    {/* Stage Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-text-main">{stage.name}</h3>
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
                      <div className="flex items-center justify-between text-xs text-text-muted">
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