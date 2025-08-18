import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DealCard } from "./DealCard";
import { Target } from "lucide-react";

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

interface DroppableStageProps {
  stageId: string;
  deals: Deal[];
  className?: string;
}

export function DroppableStage({ stageId, deals, className }: DroppableStageProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
    data: {
      type: 'stage',
      stageId: stageId,
      accepts: ['deal'], // Explicitly accept deal types
    },
  });

  return (
    <SortableContext
      id={stageId}
      items={deals.map(d => d.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`space-y-3 flex-1 min-h-32 rounded-xl transition-all duration-200 p-3 border-2 ${
          isOver 
            ? 'border-blue-500 bg-blue-50/80 backdrop-blur-sm shadow-lg' 
            : 'border-white/40 bg-white/30 backdrop-blur-sm border-dashed'
        } ${className || ''}`}
        data-stage-id={stageId}
        style={{ 
          minHeight: '200px',
          background: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined 
        }}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            stageId={stageId}
            onDelete={() => {
              // This will trigger a parent component refresh
              window.location.reload();
            }}
          />
        ))}
        {deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Target className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm font-medium">No deals yet</p>
            <p className="text-xs text-center">Drag deals here or add new ones</p>
            {isOver && (
              <div className="mt-2 text-blue-600 text-xs font-medium animate-pulse">
                Drop here to move deal
              </div>
            )}
          </div>
        )}
      </div>
    </SortableContext>
  );
}