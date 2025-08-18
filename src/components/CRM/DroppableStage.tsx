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
      stageId,
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
            ? 'border-blue-500 bg-blue-50/50 backdrop-blur-sm' 
            : 'border-white/40 bg-white/30 backdrop-blur-sm border-dashed'
        } ${className || ''}`}
        data-stage-id={stageId}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            stageId={stageId}
          />
        ))}
        {deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <Target className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No deals yet</p>
            <p className="text-xs">Drag deals here or add new ones</p>
          </div>
        )}
      </div>
    </SortableContext>
  );
}