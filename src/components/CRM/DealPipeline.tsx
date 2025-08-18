"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay, closestCorners, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Target, Mail, Users, TrendingUp } from "lucide-react";
import { DealCard } from "./DealCard";
import { DroppableStage } from "./DroppableStage";
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

      if (response?.data) {
        // Group deals by stage
        const grouped: DealsByStage = {};
        response.data.forEach((deal: Deal) => {
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

    console.log('🔧 Drag End:', { activeId: active.id, overId: over?.id, overData: over?.data?.current });

    if (!over) {
      console.log('🔧 No drop target');
      return;
    }

    const activeStageId = active.data.current?.stageId;
    const overStageId = over.data.current?.stageId || over.id;

    console.log('🔧 Stage IDs:', { activeStageId, overStageId });

    if (activeStageId === overStageId) {
      console.log('🔧 Same stage, no move needed');
      return;
    }

    // Optimistic update first
    const dealToMove = dealsByStage[activeStageId]?.find(d => d.id === active.id);
    if (dealToMove) {
      console.log('🔧 Moving deal:', dealToMove.title);
      const newDealsByStage = { ...dealsByStage };
      // Remove from old stage
      newDealsByStage[activeStageId] = newDealsByStage[activeStageId].filter(d => d.id !== active.id);
      // Add to new stage
      if (!newDealsByStage[overStageId]) newDealsByStage[overStageId] = [];
      newDealsByStage[overStageId] = [...newDealsByStage[overStageId], { ...dealToMove, stage_id: overStageId }];
      setDealsByStage(newDealsByStage);
    }

    try {
      console.log('🔧 Making API call to move deal');
      await makeRequest('/crm-deal-move', {
        method: 'POST',
        body: {
          deal_id: active.id,
          stage_id: overStageId
        }
      });
      console.log('🔧 Deal moved successfully');
    } catch (error) {
      console.error('🔧 Failed to move deal:', error);
      // Revert on error
      loadDeals(selectedPipeline);
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

  const sortedStages = [...currentPipeline.stages]
    .filter(stage => !['Contacted', 'Initial Contact', 'Negotiation'].includes(stage.name))
    .sort((a, b) => a.stage_order - b.stage_order);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Responsive Header */}
      <div className="border-b bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Mobile Header Layout */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            {/* Title and Summary Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <div className="mb-3 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sales Pipeline
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">Track and manage your deals</p>
              </div>
              {/* Summary Cards - Enhanced with Email and Campaign */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:flex sm:items-center sm:space-x-4">
                <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200">
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">Deals</span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">{totalDeals}</div>
                </div>
                <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200">
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">Value</span>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    ${totalValue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3 text-blue-500" />
                    <span className="text-slate-500 font-medium text-xs sm:text-sm">Emails</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">47</div>
                </div>
                <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-purple-500" />
                    <span className="text-slate-500 font-medium text-xs sm:text-sm">Campaigns</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">12</div>
                </div>
              </div>
            </div>
            
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 lg:w-72 pl-10 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={() => {
                  setSelectedStageId(sortedStages[0]?.id || "");
                  setNewDealOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Pipeline Board */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={closestCorners}
        >
          {/* Mobile/Tablet: Vertical Stack | Desktop: Horizontal Scroll */}
          <div className="h-full">
            {/* Mobile/Tablet Layout */}
            <div className="block lg:hidden h-full overflow-y-auto p-4 space-y-6">
              {sortedStages.map((stage, index) => {
                const stageColors = getStageColors(stage.name, index);
                const stageDeals = dealsByStage[stage.id] || [];
                const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);
                
                return (
                    <div key={stage.id} className="w-full">
                      {/* Mobile Stage Header */}
                      <div 
                        className="mb-3 rounded-xl p-3 shadow-md border-l-4"
                      style={{
                        background: `linear-gradient(135deg, ${stageColors.bg}, ${stageColors.bgLight})`,
                        borderLeftColor: stageColors.border
                      }}
                    >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: stageColors.border }}
                          />
                            <h3 className="font-semibold text-slate-800 text-base">{stage.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStageId(stage.id);
                            setNewDealOpen(true);
                          }}
                              className="h-7 w-7 p-0 hover:bg-white/50 rounded-lg"
                            >
                              <Plus className="h-3.5 w-3.5 text-slate-600" />
                        </Button>
                      </div>
                          <div className="flex items-center justify-between text-xs">{/* smaller text */}
                            <div className="bg-white/60 rounded-md px-2 py-1">
                              <span className="text-slate-600 font-medium text-xs">{stageDeals.length} deals</span>
                            </div>
                            <div className="bg-white/60 rounded-md px-2 py-1">
                              <span className="font-semibold text-slate-700 text-xs">
                                ${stageValue.toLocaleString()}
                              </span>
                            </div>
                      </div>
                    </div>

                    {/* Mobile Deals Grid */}
                    <DroppableStage
                      stageId={stage.id}
                      deals={stageDeals}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    />
                  </div>
                );
              })}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block h-full overflow-x-auto p-6">
              <div className="flex gap-6 min-w-fit h-full">
                {sortedStages.map((stage, index) => {
                  const stageColors = getStageColors(stage.name, index);
                  const stageDeals = dealsByStage[stage.id] || [];
                  const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0);
                  
                  return (
                    <div
                      key={stage.id}
                      className="w-72 xl:w-80 flex-shrink-0 flex flex-col h-full"
                    >
                      {/* Desktop Stage Header - More compact */}
                      <div
                        className="mb-3 rounded-xl p-3 shadow-md border-l-4"
                        style={{
                          background: `linear-gradient(135deg, ${stageColors.bg}, ${stageColors.bgLight})`,
                          borderLeftColor: stageColors.border
                        }}
                      >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: stageColors.border }}
                            />
                            <h3 className="font-semibold text-slate-800 text-base">{stage.name}</h3>
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

                      {/* Desktop Deals Container */}
                      <DroppableStage
                        stageId={stage.id}
                        deals={stageDeals}
                      />
                    </div>
                  );
                })}
              </div>
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

  // Helper function to get stage colors - keeping exact same functionality
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