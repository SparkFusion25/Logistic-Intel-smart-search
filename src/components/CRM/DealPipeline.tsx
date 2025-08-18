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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header */}
      <div className="border-b bg-white/70 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sales Pipeline
              </h1>
              <p className="text-slate-600 mt-1">Track and manage your deals through the sales process</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                <span className="text-slate-500 font-medium">Total Deals</span>
                <div className="text-2xl font-bold text-slate-800">{totalDeals}</div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                <span className="text-slate-500 font-medium">Pipeline Value</span>
                <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 pl-10 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <Button
              onClick={() => {
                setSelectedStageId(sortedStages[0]?.id || "");
                setNewDealOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="h-full overflow-x-auto p-6">
            <div className="flex gap-6 min-w-fit h-full">
              {sortedStages.map((stage, index) => {
                const stageColors = getStageColors(stage.name, index);
                const stageDeals = dealsByStage[stage.id] || [];
                const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);
                
                return (
                  <div
                    key={stage.id}
                    className="w-80 flex-shrink-0 flex flex-col h-full"
                  >
                    {/* Stage Header */}
                    <div 
                      className="mb-4 rounded-2xl p-4 shadow-lg border-l-4"
                      style={{
                        background: `linear-gradient(135deg, ${stageColors.bg}, ${stageColors.bgLight})`,
                        borderLeftColor: stageColors.border
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stageColors.border }}
                          />
                          <h3 className="font-semibold text-slate-800 text-lg">{stage.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStageId(stage.id);
                            setNewDealOpen(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-white/50 rounded-lg"
                        >
                          <Plus className="h-4 w-4 text-slate-600" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="bg-white/60 rounded-lg px-3 py-1">
                          <span className="text-slate-600 font-medium">{stageDeals.length} deals</span>
                        </div>
                        <div className="bg-white/60 rounded-lg px-3 py-1">
                          <span className="font-semibold text-slate-700">
                            ${stageValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deals Container */}
                    <SortableContext
                      id={stage.id}
                      items={stageDeals.map(d => d.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        className="space-y-3 flex-1 min-h-32 rounded-xl bg-white/30 backdrop-blur-sm p-3 border border-white/40"
                        data-stage-id={stage.id}
                      >
                        {stageDeals.map((deal) => (
                          <DealCard
                            key={deal.id}
                            deal={deal}
                            stageId={stage.id}
                          />
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <Target className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No deals yet</p>
                            <p className="text-xs">Drag deals here or add new ones</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
          </div>

          <DragOverlay>
            {draggedDeal ? (
              <div className="rotate-6 opacity-90 transform scale-105">
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

  // Helper function to get stage colors
  function getStageColors(stageName: string, index: number) {
    const colorMap: Record<string, any> = {
      'Prospect Identified': { 
        bg: 'rgba(59, 130, 246, 0.1)', 
        bgLight: 'rgba(147, 197, 253, 0.05)',
        border: '#3B82F6',
        text: '#1E40AF'
      },
      'Initial Contact': { 
        bg: 'rgba(20, 184, 166, 0.1)', 
        bgLight: 'rgba(153, 246, 228, 0.05)',
        border: '#14B8A6',
        text: '#0F766E'
      },
      'Contacted': { 
        bg: 'rgba(20, 184, 166, 0.1)', 
        bgLight: 'rgba(153, 246, 228, 0.05)',
        border: '#14B8A6',
        text: '#0F766E'
      },
      'Engaged': { 
        bg: 'rgba(139, 92, 246, 0.1)', 
        bgLight: 'rgba(196, 181, 253, 0.05)',
        border: '#8B5CF6',
        text: '#7C3AED'
      },
      'Qualified Lead': { 
        bg: 'rgba(139, 92, 246, 0.1)', 
        bgLight: 'rgba(196, 181, 253, 0.05)',
        border: '#8B5CF6',
        text: '#7C3AED'
      },
      'Qualified': { 
        bg: 'rgba(139, 92, 246, 0.1)', 
        bgLight: 'rgba(196, 181, 253, 0.05)',
        border: '#8B5CF6',
        text: '#7C3AED'
      },
      'Proposal Sent': { 
        bg: 'rgba(245, 158, 11, 0.1)', 
        bgLight: 'rgba(253, 224, 71, 0.05)',
        border: '#F59E0B',
        text: '#D97706'
      },
      'Negotiation': { 
        bg: 'rgba(236, 72, 153, 0.1)', 
        bgLight: 'rgba(251, 207, 232, 0.05)',
        border: '#EC4899',
        text: '#DB2777'
      },
      'Won': { 
        bg: 'rgba(16, 185, 129, 0.1)', 
        bgLight: 'rgba(167, 243, 208, 0.05)',
        border: '#10B981',
        text: '#059669'
      },
      'Lost': { 
        bg: 'rgba(239, 68, 68, 0.1)', 
        bgLight: 'rgba(254, 202, 202, 0.05)',
        border: '#EF4444',
        text: '#DC2626'
      }
    };

    return colorMap[stageName] || {
      bg: 'rgba(99, 102, 241, 0.1)',
      bgLight: 'rgba(199, 210, 254, 0.05)', 
      border: '#6366F1',
      text: '#4F46E5'
    };
  }
}